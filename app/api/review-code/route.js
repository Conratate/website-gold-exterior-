import { escapeHtml } from "@/lib/escape";
import { createTransport, mailSettings } from "@/lib/mailer";
import { BUSINESS } from "@/lib/location";
import { DEFAULT_LIFETIME_DAYS, mintCode } from "@/lib/reviewCodes";
import { clientKey, createThrottle } from "@/lib/throttle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ─────────────────────────────────────────────────────────────────────────────
// Issuing a review code. Owner-only: this is the thing that decides who counts
// as a customer, so it's gated on OWNER_CODE — a password only you ever see,
// never handed to anyone. Both it and REVIEW_CODE_SECRET must be set or the
// endpoint refuses outright.
//
// The customer's code is emailed to them and copied to you, which means your
// mailbox is the record of who got which code. No separate ledger to keep.
// ─────────────────────────────────────────────────────────────────────────────

const throttle = createThrottle();

const LIMITS = { name: 60, email: 120, job: 120 };
const MIN_LIFETIME = 7;
const MAX_LIFETIME = 365;

const trimmed = (v, max) => String(v ?? "").trim().slice(0, max);

function fail(error, field, status = 400) {
  return Response.json({ ok: false, error, field }, { status });
}

function customerEmail({ name, code, link, job, expiresAt }) {
  const expires = expiresAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef4ff;font-family:Inter,Arial,sans-serif;color:#11151b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef4ff;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dbe3ef;">
            <tr>
              <td style="background:linear-gradient(135deg,#152852 0%,#1857d4 100%);padding:28px;color:#fff;">
                <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#bedffe;">Gold Exterior</div>
                <div style="font-size:24px;font-weight:800;margin-top:6px;">Thanks for your business, ${escapeHtml(
                  name
                )}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;font-size:15px;line-height:1.65;">
                  We finished up${job ? ` your ${escapeHtml(job)}` : ""} and wanted to say
                  thank you. If we did right by you, a few sentences on our site
                  would mean a lot — and if we didn't, we'd rather hear that too.
                </p>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.65;">
                  This code is yours alone. It works once, and only for you.
                </p>

                <div style="padding:20px;background:#fdfbe9;border:1px solid #f9eb8d;border-radius:14px;text-align:center;">
                  <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.16em;color:#9b5d10;font-weight:700;">Your review code</div>
                  <div style="margin-top:8px;font-family:'SFMono-Regular',Consolas,monospace;font-size:22px;font-weight:700;letter-spacing:0.06em;color:#11151b;">${escapeHtml(
                    code
                  )}</div>
                </div>

                <div style="text-align:center;margin:26px 0 8px;">
                  <a href="${escapeHtml(link)}" style="display:inline-block;background:#f2c424;color:#11151b;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:999px;">Write your review</a>
                </div>
                <p style="margin:14px 0 0;font-size:12px;color:#5e6a7a;text-align:center;line-height:1.6;">
                  The button fills the code in for you. It expires ${escapeHtml(
                    expires
                  )}.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#11151b;color:#a8b1bb;padding:18px 28px;font-size:12px;">
                Gold Exterior · ${escapeHtml(BUSINESS.base)}, ${escapeHtml(
                  BUSINESS.region
                )} · Serving ${escapeHtml(BUSINESS.serviceArea)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function ownerCopy({ name, email, job, code, expiresAt }) {
  const row = (label, value) =>
    `<tr><td style="padding:5px 14px 5px 0;color:#5e6a7a;font-size:14px;white-space:nowrap;">${escapeHtml(
      label
    )}</td><td style="padding:5px 0;font-size:14px;font-weight:600;">${escapeHtml(
      value
    )}</td></tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f7faff;font-family:Inter,Arial,sans-serif;color:#11151b;">
    <table width="100%" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #dbe3ef;border-radius:14px;">
      <tr>
        <td style="padding:22px;">
          <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#5e6a7a;font-weight:700;">Review code issued</div>
          <div style="margin:10px 0 16px;font-family:'SFMono-Regular',Consolas,monospace;font-size:20px;font-weight:700;letter-spacing:0.06em;">${escapeHtml(
            code
          )}</div>
          <table style="border-collapse:collapse;width:100%;">
            ${row("Customer", name)}
            ${row("Sent to", email)}
            ${row("Job", job || "—")}
            ${row("Expires", expiresAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))}
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#5e6a7a;line-height:1.6;">
            Keep this email — it's your record of which code went to whom. When
            the review lands, it'll name this code so you can match the two.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request) {
  try {
    const ownerCode = process.env.OWNER_CODE;
    const secret = process.env.REVIEW_CODE_SECRET;

    if (!ownerCode || !secret) {
      console.error(
        "Cannot issue review codes: OWNER_CODE and REVIEW_CODE_SECRET must " +
          "both be set in the hosting environment."
      );
      return fail(
        "Code issuing isn't configured yet. Set OWNER_CODE and REVIEW_CODE_SECRET.",
        "",
        503
      );
    }

    const key = clientKey(request);
    if (throttle.isThrottled(key)) {
      return fail("Too many attempts. Wait a few minutes.", "ownerCode", 429);
    }

    const payload = await request.json().catch(() => null);
    if (!payload) return fail("Invalid request.");

    // Constant-time-ish: compare full strings, and never say which part was
    // wrong.
    if (String(payload.ownerCode || "") !== ownerCode) {
      throttle.record(key);
      return fail("That's not the owner password.", "ownerCode", 403);
    }

    const name = trimmed(payload.customerName, LIMITS.name);
    const email = trimmed(payload.customerEmail, LIMITS.email);
    const job = trimmed(payload.jobLabel, LIMITS.job);

    if (!name) return fail("Who is this code for?", "customerName");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return fail("Enter the customer's email.", "customerEmail");
    }

    const requested = Number(payload.lifetimeDays) || DEFAULT_LIFETIME_DAYS;
    const lifetimeDays = Math.min(MAX_LIFETIME, Math.max(MIN_LIFETIME, requested));

    const { user, pass, to, configured } = mailSettings();
    if (!configured) {
      return fail(
        "Email isn't configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.",
        "",
        503
      );
    }

    const { display, expiresAt } = mintCode({ secret, lifetimeDays });

    // The link carries the code so the customer never retypes it; the form
    // reads it off the query string and fills the field in.
    const origin = new URL(request.url).origin;
    const link = `${origin}/reviews?code=${encodeURIComponent(display)}#leave-a-review`;

    const transporter = createTransport({ user, pass });

    await transporter.sendMail({
      from: `"Gold Exterior" <${user}>`,
      to: email,
      replyTo: to,
      subject: `Thanks from Gold Exterior — your review code`,
      html: customerEmail({ name, code: display, link, job, expiresAt }),
    });

    // Sent second and separately: if the copy to ourselves fails, the customer
    // already has their code and the request shouldn't report a failure.
    try {
      await transporter.sendMail({
        from: `"Gold Exterior Codes" <${user}>`,
        to,
        subject: `Code issued to ${name} — ${display}`,
        html: ownerCopy({ name, email, job, code: display, expiresAt }),
      });
    } catch (err) {
      console.warn("Owner copy of the issued code failed to send:", err && err.message);
    }

    return Response.json({
      ok: true,
      code: display,
      link,
      expiresAt: expiresAt.toISOString(),
      sentTo: email,
    });
  } catch (err) {
    console.error("Review code API error", err);
    const reason = err && err.message ? String(err.message).slice(0, 160) : "unknown";
    return Response.json(
      { ok: false, error: `Couldn't issue the code (${reason})` },
      { status: 500 }
    );
  }
}
