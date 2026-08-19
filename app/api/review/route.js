import { escapeHtml } from "@/lib/escape";
import { createTransport, mailSettings } from "@/lib/mailer";
import { clampRating, MAX_RATING, reviewServiceName } from "@/lib/reviews";
import { formatCode, verifyCode } from "@/lib/reviewCodes";
import { redeemCode, releaseCode, REDEEM } from "@/lib/codeStore";
import { clientKey, createThrottle } from "@/lib/throttle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ─────────────────────────────────────────────────────────────────────────────
// Accepting a review.
//
// The gate is a per-job code, issued by /api/review-code and emailed to one
// named customer. Three things have to hold:
//
//   1. It carries our signature, so we know we issued it (lib/reviewCodes.js).
//   2. It hasn't expired — codes go stale on their own after ~90 days.
//   3. It hasn't been spent, burned on first use (lib/codeStore.js).
//
// Only REVIEW_CODE_SECRET is secret, and it never leaves the server: a code
// can be checked without the browser learning anything about how. With the
// secret unset the form accepts nothing at all — failing closed is the only
// safe way to be misconfigured.
// ─────────────────────────────────────────────────────────────────────────────

const throttle = createThrottle();

const LIMITS = {
  name: 60,
  city: 60,
  headline: 90,
  email: 120,
  body: 1500,
};

const BODY_MIN = 20;

function trimmed(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function fail(error, field, status = 400) {
  return Response.json({ ok: false, error, field }, { status });
}

// ── Publishing helpers ───────────────────────────────────────────────────────
// The owner publishes a review by pasting a snippet into lib/reviews.js, so the
// email hands them exactly that snippet rather than a wall of fields to retype.

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

function reviewSnippet(review) {
  const q = (v) => JSON.stringify(v);
  // The headline is optional, so it's only in the snippet when the customer
  // wrote one — otherwise the published card would carry an empty heading.
  const headline = review.headline ? `\n    headline: ${q(review.headline)},` : "";
  return `  {
    id: ${q(review.id)},
    name: ${q(review.name)},
    city: ${q(review.city)},
    service: ${q(review.service)},
    rating: ${review.rating},
    date: ${q(review.date)},${headline}
    body: ${q(review.body)},
  },`;
}

function starRow(rating) {
  return "★".repeat(rating) + "☆".repeat(MAX_RATING - rating);
}

function buildEmail({ review, submitter, snippet }) {
  const row = (label, value) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#5e6a7a;font-size:14px;white-space:nowrap;">${escapeHtml(
      label
    )}</td><td style="padding:4px 0;font-size:14px;font-weight:600;color:#11151b;">${escapeHtml(
      value
    )}</td></tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef4ff;font-family:Inter,Arial,sans-serif;color:#11151b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef4ff;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dbe3ef;">
            <tr>
              <td style="background:linear-gradient(135deg,#152852 0%,#1857d4 100%);padding:28px;color:#fff;">
                <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#bedffe;">Gold Exterior</div>
                <div style="font-size:24px;font-weight:800;margin-top:6px;">New Review — Awaiting Your Approval</div>
                <div style="margin-top:10px;display:inline-block;background:#f2c424;color:#11151b;padding:8px 14px;border-radius:999px;font-weight:700;font-size:16px;letter-spacing:0.08em;">
                  ${starRow(review.rating)} &nbsp;${review.rating}/${MAX_RATING}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <div style="padding:14px 16px;background:#fdfbe9;border:1px solid #f9eb8d;border-radius:12px;font-size:13px;color:#6d3c15;">
                  This is <strong>not live on the site</strong>. Search your inbox
                  for the code below to see which job it was issued against, and
                  who you sent it to.
                </div>
                ${
                  submitter.enforced
                    ? ""
                    : `<div style="margin-top:10px;padding:14px 16px;background:#fdecec;border:1px solid #f5b5b5;border-radius:12px;font-size:13px;color:#8a1c1c;">
                  <strong>Single-use couldn't be confirmed.</strong> The code was
                  ours and unexpired, but the store that marks codes as spent was
                  unreachable, so we can't rule out that this one was used before.
                  Worth a closer look before publishing.
                </div>`
                }

                <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.12em;color:#5e6a7a;margin:24px 0 12px;">Who submitted it</h2>
                <table style="border-collapse:collapse;width:100%;">
                  ${row("Name", review.name)}
                  ${row("City", review.city)}
                  ${row("Email", submitter.email)}
                  ${row("Service", review.service)}
                  ${row("Code used", submitter.code)}
                  ${row("Photo", submitter.hasPhoto ? "Attached" : "None")}
                </table>

                <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.12em;color:#5e6a7a;margin:24px 0 12px;">The review</h2>
                ${
                  review.headline
                    ? `<div style="font-size:17px;font-weight:700;margin:0 0 8px;">${escapeHtml(
                        review.headline
                      )}</div>`
                    : ""
                }
                <div style="padding:16px;border:1px solid #e6e8eb;border-radius:12px;background:#f7faff;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(
                  review.body
                )}</div>

                <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.12em;color:#5e6a7a;margin:24px 0 12px;">To publish it</h2>
                <div style="font-size:13px;color:#4a5462;line-height:1.6;">
                  Paste this into the <code>REVIEWS</code> array at the top of
                  <code>lib/reviews.js</code>, then deploy. Newest goes first.
                </div>
                <pre style="margin:12px 0 0;padding:16px;background:#11151b;color:#e6e8eb;border-radius:12px;font-size:12px;line-height:1.55;overflow-x:auto;white-space:pre;">${escapeHtml(
                  snippet
                )}</pre>
              </td>
            </tr>
            <tr>
              <td style="background:#11151b;color:#a8b1bb;padding:18px 28px;font-size:12px;">
                Sent automatically by goldexterior.com · Reply directly to the reviewer at
                <a href="mailto:${escapeHtml(submitter.email)}" style="color:#f2c424;">${escapeHtml(
                  submitter.email
                )}</a>
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
    const secret = process.env.REVIEW_CODE_SECRET;
    if (!secret) {
      console.error(
        "REVIEW_CODE_SECRET is not set — the review form is refusing every " +
          "submission. Set it in your hosting environment and redeploy."
      );
      return fail(
        "Reviews aren't switched on yet — sorry about that. Please try again in a day or two; your words are worth having.",
        "",
        503
      );
    }

    const key = clientKey(request);
    if (throttle.isThrottled(key)) {
      return fail(
        "Too many incorrect codes. Wait a few minutes and try again, or reply to the email your code came in and we'll sort it out.",
        "code",
        429
      );
    }

    const formData = await request.formData();
    const raw = formData.get("payload");
    if (!raw || typeof raw !== "string") return fail("Missing payload.");

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return fail("Invalid payload.");
    }

    // The code is checked before any other field so a stranger learns nothing
    // about what else we want.
    if (!String(payload.code || "").trim()) {
      return fail("Enter the code from your email.", "code");
    }

    const check = verifyCode({ code: payload.code, secret });
    if (!check.ok) {
      throttle.record(key);
      // Deliberately one message for malformed, forged and expired alike: a
      // stranger shouldn't be able to tell "not a real code" from "real but
      // too old", and a real customer's next step is the same either way.
      return fail(
        "That code isn't valid — it may have expired. Reply to the email it came in and we'll send you a fresh one.",
        "code",
        403
      );
    }

    const name = trimmed(payload.name, LIMITS.name);
    const city = trimmed(payload.city, LIMITS.city);
    const email = trimmed(payload.email, LIMITS.email);
    const headline = trimmed(payload.headline, LIMITS.headline);
    const body = trimmed(payload.body, LIMITS.body);
    const service = reviewServiceName(payload.serviceId);
    const rating = clampRating(payload.rating);

    if (!name) return fail("Tell us what name to credit.", "name");
    if (!city) return fail("Which city was the job in?", "city");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return fail("Enter a valid email so we can confirm it's you.", "email");
    }
    if (!service) return fail("Pick the service we did for you.", "serviceId");
    if (!Number(payload.rating)) return fail("Pick a star rating.", "rating");
    if (body.length < BODY_MIN) {
      return fail(
        `Reviews need at least ${BODY_MIN} characters so they're useful to other customers.`,
        "body"
      );
    }
    if (payload.consent !== true) {
      return fail(
        "We need your OK to publish the review before we can accept it.",
        "consent"
      );
    }

    const { user: gmailUser, pass: gmailPass, to: toEmail, configured } =
      mailSettings();
    if (!configured) {
      return Response.json(
        {
          ok: false,
          error:
            "Review submissions aren't configured yet. Set GMAIL_USER and GMAIL_APP_PASSWORD.",
        },
        { status: 500 }
      );
    }

    // Reviews are dated when they're written, the way every review site does
    // it. The code already pins which job this was — the issuing email in your
    // inbox has the customer and the work.
    const date = new Date().toISOString().slice(0, 10);

    const review = {
      id: `${slugify(name) || "review"}-${date.slice(0, 7)}-${Math.random()
        .toString(36)
        .slice(2, 6)}`,
      name,
      city,
      service,
      rating,
      date,
      headline,
      body,
    };

    // Optional photo. It's there to help confirm the job was real, not to be
    // published — a review card is text only. An oversized one is dropped
    // rather than failing a review the customer took the trouble to write.
    const photo = formData.get("photo");
    let attachment = null;
    if (photo && typeof photo === "object" && "arrayBuffer" in photo) {
      const buf = Buffer.from(await photo.arrayBuffer());
      if (buf.length <= 3 * 1024 * 1024) {
        attachment = { filename: photo.name || "review-photo", content: buf };
      } else {
        console.warn("Review photo too large to attach:", buf.length);
      }
    }

    // Burn the code before sending, not after: a compare-and-set is the only
    // thing that closes the window on two people submitting the same forwarded
    // code at once.
    const redemption = await redeemCode(check.nonce, {
      name,
      city,
      email,
      service,
      rating,
    });

    if (redemption.status === REDEEM.SPENT) {
      const when = redemption.previous?.redeemedAt;
      console.warn(
        `Review code reuse attempt${when ? ` (first used ${when})` : ""} by ${email}`
      );
      return fail(
        "This code has already been used. Each one works once — if you've got a second job with us, reply to your last email and we'll send a fresh code.",
        "code",
        409
      );
    }

    const html = buildEmail({
      review,
      submitter: {
        email,
        code: formatCode(check.nonce),
        enforced: redemption.status === REDEEM.FRESH,
        hasPhoto: Boolean(attachment),
      },
      snippet: reviewSnippet(review),
    });

    const mailOptions = {
      from: `"Gold Exterior Reviews" <${gmailUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `New ${rating}★ review from ${name} (${city}) — needs approval`,
      html,
      ...(attachment ? { attachments: [attachment] } : {}),
    };

    const transporter = createTransport({ user: gmailUser, pass: gmailPass });
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      // The code is spent but the review never reached us. Give it back so the
      // customer's next attempt works.
      if (redemption.status === REDEEM.FRESH) await releaseCode(check.nonce);
      throw err;
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Review API error", err);
    const reason = err && err.message ? String(err.message).slice(0, 160) : "unknown";
    return Response.json(
      { ok: false, error: `Failed to send your review (${reason})` },
      { status: 500 }
    );
  }
}
