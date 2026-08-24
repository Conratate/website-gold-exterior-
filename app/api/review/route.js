import nodemailer from "nodemailer";
import { REVIEW_DIMENSIONS, starLabel } from "@/lib/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Stars render as characters so they survive every email client, including
// the ones that strip images.
function starRow(n) {
  const full = Math.round(Number(n) || 0);
  return "★".repeat(full) + "☆".repeat(Math.max(0, 5 - full));
}

function buildEmail(r) {
  const overall = Number(r.overall) || 0;
  const positive = overall >= 4;

  const rows = REVIEW_DIMENSIONS.map((d) => {
    const v = Number(r.ratings?.[d.id]) || 0;
    if (!v) return "";
    return `<tr>
      <td style="padding:6px 16px 6px 0;color:#5e6a7a;font-size:13px;white-space:nowrap;">${escapeHtml(d.label)}</td>
      <td style="padding:6px 12px 6px 0;color:#f2a300;font-size:15px;letter-spacing:2px;">${starRow(v)}</td>
      <td style="padding:6px 0;color:#11151b;font-size:13px;font-weight:600;">${v}/5</td>
    </tr>`;
  }).join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef4ff;font-family:Inter,Arial,sans-serif;color:#11151b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef4ff;padding:32px 16px;">
      <tr><td align="center">
        <table width="100%" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dbe3ef;">
          <tr>
            <td style="background:${positive ? "linear-gradient(135deg,#14532d 0%,#16a34a 100%)" : "linear-gradient(135deg,#7c2d12 0%,#ea580c 100%)"};padding:28px;color:#fff;">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.85;">Gold Exterior</div>
              <div style="font-size:24px;font-weight:800;margin-top:6px;">
                ${positive ? "New review" : "Review needs attention"}
              </div>
              <div style="margin-top:12px;font-size:26px;letter-spacing:3px;color:#ffd94a;">${starRow(overall)}</div>
              <div style="margin-top:4px;font-size:15px;font-weight:700;">
                ${overall.toFixed(1)} / 5 · ${escapeHtml(starLabel(overall))}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;">
              ${
                r.headline
                  ? `<div style="font-size:18px;font-weight:800;margin:0 0 10px;">${escapeHtml(r.headline)}</div>`
                  : ""
              }
              ${
                r.body
                  ? `<div style="font-size:14px;line-height:1.6;color:#31404f;white-space:pre-wrap;border-left:3px solid #dbe3ef;padding-left:14px;margin-bottom:22px;">${escapeHtml(r.body)}</div>`
                  : `<div style="font-size:13px;color:#5e6a7a;margin-bottom:22px;">No written comment left.</div>`
              }

              <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.12em;color:#5e6a7a;margin:0 0 10px;">Scores</h2>
              <table style="border-collapse:collapse;">${rows || '<tr><td style="font-size:13px;color:#5e6a7a;">No categories rated.</td></tr>'}</table>

              <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.12em;color:#5e6a7a;margin:24px 0 10px;">Customer</h2>
              <table style="border-collapse:collapse;width:100%;font-size:14px;">
                <tr><td style="padding:4px 0;color:#5e6a7a;width:110px;">Name</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(r.name || "—")}</td></tr>
                <tr><td style="padding:4px 0;color:#5e6a7a;">Email</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(r.email || "—")}</td></tr>
                <tr><td style="padding:4px 0;color:#5e6a7a;">Service</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(r.serviceName || "—")}</td></tr>
              </table>

              <div style="margin-top:22px;padding:14px 16px;border-radius:12px;background:${r.consent ? "#ecfdf5" : "#fff7ed"};border:1px solid ${r.consent ? "#a7f3d0" : "#fed7aa"};font-size:13px;color:${r.consent ? "#065f46" : "#7c2d12"};">
                ${
                  r.consent
                    ? "<strong>Cleared to publish.</strong> The customer agreed to this appearing on the website with their first name and last initial."
                    : "<strong>Private feedback.</strong> The customer did not agree to publication — do not put this on the website."
                }
              </div>

              ${
                !positive
                  ? `<div style="margin-top:14px;padding:14px 16px;border-radius:12px;background:#fef2f2;border:1px solid #fecaca;font-size:13px;color:#991b1b;">
                       <strong>Worth a call.</strong> Anything under 4 stars is usually recoverable if you reach out quickly.
                     </div>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="background:#11151b;color:#a8b1bb;padding:18px 28px;font-size:12px;">
              Sent automatically by goldexterior.com · Reply directly to
              <a href="mailto:${escapeHtml(r.email || "")}" style="color:#f2c424;">${escapeHtml(r.email || "")}</a>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function POST(request) {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
    // Reviews can be split into their own inbox later without touching quotes.
    const toEmail =
      process.env.REVIEW_TO_EMAIL ||
      process.env.QUOTE_TO_EMAIL ||
      "goldexterior0@gmail.com";

    if (!gmailUser || !gmailPass) {
      return Response.json(
        { ok: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const r = await request.json().catch(() => null);
    if (!r) {
      return Response.json({ ok: false, error: "Invalid submission." }, { status: 400 });
    }

    // Access codes live only on the server; a code shipped in the browser
    // bundle would be readable by anyone viewing source. Several may be valid
    // at once so rotating a code never locks out a customer still holding the
    // previous one. With none configured the form stays open — the real
    // safeguard is that nothing publishes without the owner pasting it in.
    const codes = (process.env.REVIEW_ACCESS_CODES || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (codes.length) {
      const given = String(r.accessCode || "").trim().toLowerCase().replace(/\s+/g, "");
      const ok = codes.some((c) => c.replace(/\s+/g, "") === given);
      if (!ok) {
        return Response.json(
          {
            ok: false,
            code: "BAD_CODE",
            error:
              "That review code doesn't match. Check the code we sent you — or reply to our email and we'll resend it.",
          },
          { status: 403 }
        );
      }
    }
    if (!r.name || !r.email || !r.serviceName) {
      return Response.json(
        { ok: false, error: "Name, email and service are required." },
        { status: 400 }
      );
    }
    const rated = REVIEW_DIMENSIONS.some((d) => Number(r.ratings?.[d.id]) > 0);
    if (!rated) {
      return Response.json(
        { ok: false, error: "Please rate at least one category." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass },
      connectionTimeout: 20000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    const overall = Number(r.overall) || 0;
    await transporter.sendMail({
      from: `"Gold Exterior Reviews" <${gmailUser}>`,
      to: toEmail,
      replyTo: r.email,
      subject: `${overall >= 4 ? "★" : "⚠"} ${overall.toFixed(1)}/5 review — ${r.name} (${r.serviceName})`,
      html: buildEmail(r),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Review API error", err);
    const reason = err && err.message ? String(err.message).slice(0, 160) : "unknown";
    return Response.json(
      { ok: false, error: `Failed to send review (${reason})` },
      { status: 500 }
    );
  }
}
