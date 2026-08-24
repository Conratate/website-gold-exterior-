import nodemailer from "nodemailer";
import {
  MAX_STARS,
  RATING_CATEGORIES,
  STAR_LABELS,
  averageRating,
  isValidRating,
  starString,
} from "@/lib/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Same SMTP allowance as the quote route — the handshake is the slow part.
export const maxDuration = 60;

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function ratingRow(label, value) {
  return `
    <tr>
      <td style="padding:8px 16px 8px 0;color:#4a5462;font-size:14px;white-space:nowrap;">${escapeHtml(
        label
      )}</td>
      <td style="padding:8px 12px 8px 0;color:#f2c424;font-size:18px;letter-spacing:2px;font-family:Arial,sans-serif;">${starString(
        value
      )}</td>
      <td style="padding:8px 0;color:#4a5462;font-size:13px;">${escapeHtml(
        STAR_LABELS[value] || "—"
      )}</td>
    </tr>`;
}

function buildEmail({ contact, service, overall, ratings, body, consent }) {
  const detailRows = RATING_CATEGORIES.filter((c) => isValidRating(ratings[c.id]))
    .map((c) => ratingRow(c.label, ratings[c.id]))
    .join("");

  const detailAverage = averageRating(ratings);
  // A weak spot is the whole point of collecting categories — call it out so
  // the owner sees it without reading the table.
  const lowest = RATING_CATEGORIES.filter((c) => isValidRating(ratings[c.id]))
    .sort((a, b) => ratings[a.id] - ratings[b.id])[0];
  const flag =
    overall <= 3 || (lowest && ratings[lowest.id] <= 3)
      ? `<div style="margin:0 0 20px;padding:14px 16px;background:#fdecec;border:1px solid #f5b5b5;border-radius:12px;color:#8a1c1c;font-size:14px;">
           <strong>Follow up on this one.</strong> ${
             overall <= 3
               ? `Overall came in at ${overall}/${MAX_STARS}.`
               : `${escapeHtml(lowest.label)} came in at ${ratings[lowest.id]}/${MAX_STARS}.`
           }
         </div>`
      : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef3fb;font-family:Inter,Arial,sans-serif;color:#11151b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef3fb;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #d6e1f4;">
            <tr>
              <td style="background:linear-gradient(135deg,#0c1a3a 0%,#1c3f87 100%);padding:28px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#a9beea;">Gold Exterior</div>
                <div style="font-size:24px;font-weight:800;margin-top:6px;">New Customer Review</div>
                <div style="margin-top:12px;font-size:26px;color:#f2c424;letter-spacing:3px;font-family:Arial,sans-serif;">${starString(
                  overall
                )}</div>
                <div style="margin-top:4px;font-size:14px;color:#d6e1f4;">${overall}/${MAX_STARS} overall — ${escapeHtml(
    STAR_LABELS[overall] || ""
  )}${detailAverage !== null ? ` · ${detailAverage}/${MAX_STARS} across the details` : ""}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                ${flag}
                <table style="border-collapse:collapse;width:100%;font-size:14px;">
                  <tr><td style="padding:4px 0;color:#5e6a7a;width:110px;">Name</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(
                    contact.name
                  )}</td></tr>
                  <tr><td style="padding:4px 0;color:#5e6a7a;">Service</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(
                    service.name
                  )}</td></tr>
                  ${
                    contact.city
                      ? `<tr><td style="padding:4px 0;color:#5e6a7a;">Town</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(
                          contact.city
                        )}</td></tr>`
                      : ""
                  }
                  <tr><td style="padding:4px 0;color:#5e6a7a;">Email</td><td style="padding:4px 0;font-weight:600;">${
                    contact.email
                      ? `<a href="mailto:${escapeHtml(contact.email)}" style="color:#1c3f87;">${escapeHtml(
                          contact.email
                        )}</a>`
                      : "not provided"
                  }</td></tr>
                </table>

                <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.12em;color:#5e6a7a;margin:24px 0 8px;">The details</h2>
                ${
                  detailRows
                    ? `<table style="border-collapse:collapse;width:100%;">${detailRows}</table>`
                    : '<div style="font-size:13px;color:#5e6a7a;">No category ratings given.</div>'
                }

                <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.12em;color:#5e6a7a;margin:24px 0 8px;">In their words</h2>
                <div style="padding:16px;border-left:4px solid #f2c424;background:#fdfbe9;border-radius:0 12px 12px 0;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(
                  body
                )}</div>

                <div style="margin-top:20px;padding:12px 16px;border:1px solid ${
                  consent ? "#cdd2d8" : "#f5b5b5"
                };border-radius:12px;font-size:13px;color:${consent ? "#4a5462" : "#8a1c1c"};">
                  ${
                    consent
                      ? "✔ Customer agreed this review may be published with their first name and town."
                      : "✕ Customer did NOT agree to publication — keep this internal."
                  }
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#11151b;color:#a8b1bb;padding:18px 28px;font-size:12px;">
                Sent automatically by goldexterior.com${
                  contact.email
                    ? ` · Reply directly to thank ${escapeHtml(contact.name)}`
                    : ""
                }
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request) {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
    const toEmail =
      process.env.REVIEW_TO_EMAIL ||
      process.env.QUOTE_TO_EMAIL ||
      "goldexterior0@gmail.com";

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

    let payload;
    try {
      payload = await request.json();
    } catch {
      return Response.json({ ok: false, error: "Invalid payload." }, { status: 400 });
    }

    const contact = payload?.contact || {};
    const service = payload?.service || {};
    const name = String(contact.name || "").trim().slice(0, 120);
    const email = String(contact.email || "").trim().slice(0, 160);
    const city = String(contact.city || "").trim().slice(0, 120);
    const body = String(payload?.body || "").trim().slice(0, 2000);
    const overall = Number(payload?.overall);

    if (!name) {
      return Response.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
    }
    if (!service.name) {
      return Response.json(
        { ok: false, error: "Please pick the service we did for you." },
        { status: 400 }
      );
    }
    if (!isValidRating(overall)) {
      return Response.json(
        { ok: false, error: "Please give an overall star rating." },
        { status: 400 }
      );
    }
    if (body.length < 10) {
      return Response.json(
        { ok: false, error: "Please write a sentence or two about how it went." },
        { status: 400 }
      );
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { ok: false, error: "That email address doesn't look right." },
        { status: 400 }
      );
    }

    // Keep only known categories with a whole 1–5 rating; anything else the
    // client sent is dropped rather than rendered into the email.
    const ratings = {};
    for (const c of RATING_CATEGORIES) {
      const v = Number(payload?.ratings?.[c.id]);
      if (isValidRating(v)) ratings[c.id] = v;
    }

    const clean = {
      contact: { name, email, city },
      service: { id: String(service.id || ""), name: String(service.name).slice(0, 80) },
      overall,
      ratings,
      body,
      consent: Boolean(payload?.consent),
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass },
      connectionTimeout: 20000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    // Stars in the subject line so the owner can triage from the inbox list.
    const subject = `${starString(overall)} ${overall}/${MAX_STARS} review — ${name} (${clean.service.name})`;

    const mailOptions = {
      from: `"Gold Exterior Reviews" <${gmailUser}>`,
      to: toEmail,
      subject,
      html: buildEmail(clean),
    };
    if (email) mailOptions.replyTo = email;

    await transporter.sendMail(mailOptions);

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
