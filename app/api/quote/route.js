import nodemailer from "nodemailer";
import { formatMoney } from "@/lib/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Give the SMTP handshake room to complete on serverless (Hobby allows up to 60s).
export const maxDuration = 60;

function buildEmail(payload) {
  const { services = [], contact = {}, estimate = {} } = payload || {};

  const serviceRows = services
    .map((svc) => {
      const answerRows = Object.entries(svc.answers || {})
        .map(([k, v]) => {
          const value = Array.isArray(v) ? v.join(", ") : v;
          return `<tr><td style="padding:4px 12px 4px 0;color:#5e6a7a;font-size:13px;">${escapeHtml(
            k
          )}</td><td style="padding:4px 0;color:#11151b;font-size:13px;font-weight:600;">${escapeHtml(
            String(value)
          )}</td></tr>`;
        })
        .join("");
      return `
        <div style="margin:0 0 16px 0;padding:16px;border:1px solid #e6e8eb;border-radius:12px;background:#f7faff;">
          <div style="font-size:14px;font-weight:700;color:#1857d4;text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(
            svc.name
          )}</div>
          <table style="margin-top:8px;border-collapse:collapse;">${answerRows}</table>
        </div>`;
    })
    .join("");

  const totalLine =
    typeof estimate.low === "number" && typeof estimate.high === "number"
      ? `${formatMoney(estimate.low)} – ${formatMoney(estimate.high)}`
      : "—";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef4ff;font-family:Inter,Arial,sans-serif;color:#11151b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef4ff;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dbe3ef;">
            <tr>
              <td style="background:linear-gradient(135deg,#152852 0%,#1857d4 100%);padding:28px 28px;color:#fff;">
                <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#bedffe;">Gold Exterior</div>
                <div style="font-size:24px;font-weight:800;margin-top:6px;">New Quote Request</div>
                <div style="margin-top:10px;display:inline-block;background:#f2c424;color:#11151b;padding:8px 14px;border-radius:999px;font-weight:700;font-size:14px;">
                  Estimate: ${escapeHtml(totalLine)}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.12em;color:#5e6a7a;margin:0 0 12px;">Contact</h2>
                <table style="border-collapse:collapse;width:100%;font-size:14px;">
                  <tr><td style="padding:4px 0;color:#5e6a7a;width:120px;">Name</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(
                    contact.name || "—"
                  )}</td></tr>
                  <tr><td style="padding:4px 0;color:#5e6a7a;">Phone</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(
                    contact.phone || "—"
                  )}</td></tr>
                  <tr><td style="padding:4px 0;color:#5e6a7a;">Email</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(
                    contact.email || "—"
                  )}</td></tr>
                  <tr><td style="padding:4px 0;color:#5e6a7a;">Address</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(
                    contact.address || "—"
                  )}</td></tr>
                  ${
                    contact.notes
                      ? `<tr><td style="padding:4px 0;color:#5e6a7a;vertical-align:top;">Notes</td><td style="padding:4px 0;">${escapeHtml(
                          contact.notes
                        )}</td></tr>`
                      : ""
                  }
                </table>

                <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.12em;color:#5e6a7a;margin:24px 0 12px;">Services</h2>
                ${serviceRows || '<div style="font-size:13px;color:#5e6a7a;">No services selected.</div>'}

                <div style="margin-top:24px;padding:16px;background:#fdfbe9;border:1px solid #f9eb8d;border-radius:12px;">
                  <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:#9b5d10;font-weight:700;">Auto-calculated estimate</div>
                  <div style="margin-top:6px;font-size:22px;font-weight:800;color:#11151b;">${escapeHtml(
                    totalLine
                  )}</div>
                  <div style="margin-top:4px;font-size:12px;color:#6d3c15;">Confirm this with the customer after reviewing the photo and address.</div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#11151b;color:#a8b1bb;padding:18px 28px;font-size:12px;">
                Sent automatically by goldexterior.com · Reply directly to the customer at <a href="mailto:${escapeHtml(
                  contact.email || ""
                )}" style="color:#f2c424;">${escapeHtml(contact.email || "")}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request) {
  try {
    const gmailUser = process.env.GMAIL_USER;
    // App passwords are shown as "abcd efgh ijkl mnop" — strip any spaces the
    // user may have pasted, since SMTP auth fails if they're left in.
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
    const toEmail = process.env.QUOTE_TO_EMAIL || "goldexterior0@gmail.com";

    if (!gmailUser || !gmailPass) {
      return Response.json(
        {
          ok: false,
          error:
            "Email service is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const raw = formData.get("payload");
    if (!raw || typeof raw !== "string") {
      return Response.json({ ok: false, error: "Missing payload." }, { status: 400 });
    }
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return Response.json({ ok: false, error: "Invalid payload." }, { status: 400 });
    }

    const { contact = {}, services = [] } = payload;
    if (!contact.name || !contact.email || !contact.phone || !contact.address) {
      return Response.json(
        { ok: false, error: "Missing required contact fields." },
        { status: 400 }
      );
    }
    if (!Array.isArray(services) || services.length === 0) {
      return Response.json(
        { ok: false, error: "At least one service must be selected." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      // Fail fast with a readable error instead of hanging until the function
      // times out, which would surface as a generic error to the customer.
      connectionTimeout: 20000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    const subject = `New Gold Exterior quote — ${contact.name} (${services
      .map((s) => s.name)
      .join(", ")})`;
    const html = buildEmail(payload);

    const mailOptions = {
      from: `"Gold Exterior Quotes" <${gmailUser}>`,
      to: toEmail,
      replyTo: contact.email,
      subject,
      html,
    };

    // Optional photo attachment. An oversized photo should never cost us the
    // lead — send the quote without it rather than failing the whole request.
    const photo = formData.get("photo");
    if (photo && typeof photo === "object" && "arrayBuffer" in photo) {
      const buf = Buffer.from(await photo.arrayBuffer());
      if (buf.length <= 3 * 1024 * 1024) {
        mailOptions.attachments = [{ filename: photo.name || "job-photo", content: buf }];
      } else {
        console.warn("Photo too large to attach:", buf.length);
      }
    }

    await transporter.sendMail(mailOptions);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Quote API error", err);
    // Surface a short reason so failures are diagnosable from the client.
    const reason = err && err.message ? String(err.message).slice(0, 160) : "unknown";
    return Response.json(
      { ok: false, error: `Failed to send email (${reason})` },
      { status: 500 }
    );
  }
}
