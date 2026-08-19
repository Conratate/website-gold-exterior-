import { escapeHtml } from "@/lib/escape";
import { createTransport, mailSettings } from "@/lib/mailer";
import { clampRating, MAX_RATING, reviewServiceName } from "@/lib/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ─────────────────────────────────────────────────────────────────────────────
// The review code is what separates a customer from a stranger. It is checked
// here, on the server, and never sent to the browser — the page has no idea
// what the right answer is, so no amount of poking at the form reveals it.
//
// Set REVIEW_CODE in the hosting environment to rotate it. The fallback exists
// so the form works on a fresh deploy; change it the moment you have a real
// customer to hand it to.
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_REVIEW_CODE = "GOLD-SHINE-2026";

// Customers get the code verbally or on an invoice, so "gold shine 2026",
// "GoldShine2026" and "GOLD-SHINE-2026" all have to be the same answer.
function normalizeCode(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

// Best-effort throttle. Serverless instances are short-lived and there can be
// several at once, so this won't stop a determined attacker — it stops the
// realistic case of someone typing guesses into the form. The code's own length
// does the rest.
const MAX_FAILURES = 6;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;
const failures = new Map();

function recordFailure(key) {
  const now = Date.now();
  const recent = (failures.get(key) || []).filter((t) => now - t < FAILURE_WINDOW_MS);
  recent.push(now);
  failures.set(key, recent);

  // The map lives as long as the instance does; drop stale keys so a long-lived
  // one can't grow without bound.
  if (failures.size > 500) {
    for (const [k, times] of failures) {
      if (times.every((t) => now - t >= FAILURE_WINDOW_MS)) failures.delete(k);
    }
  }
}

function isThrottled(key) {
  const now = Date.now();
  const recent = (failures.get(key) || []).filter((t) => now - t < FAILURE_WINDOW_MS);
  if (recent.length === 0) failures.delete(key);
  else failures.set(key, recent);
  return recent.length >= MAX_FAILURES;
}

function clientKey(request) {
  const fwd = request.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}

const LIMITS = {
  name: 60,
  city: 60,
  headline: 90,
  email: 120,
  jobMonth: 40,
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
                  This is <strong>not live on the site</strong>. Check the name and
                  the job month against your records first — the review code says
                  they had it, not that they're the right person.
                </div>

                <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.12em;color:#5e6a7a;margin:24px 0 12px;">Who submitted it</h2>
                <table style="border-collapse:collapse;width:100%;">
                  ${row("Name", review.name)}
                  ${row("City", review.city)}
                  ${row("Email", submitter.email)}
                  ${row("Service", review.service)}
                  ${row("Job month", submitter.jobMonthLabel)}
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
    const key = clientKey(request);
    if (isThrottled(key)) {
      return fail(
        "Too many incorrect codes. Wait a few minutes and try again, or email us and we'll sort it out.",
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

    // The code is checked before anything else so a stranger learns nothing
    // about which other fields we want.
    const expected = normalizeCode(process.env.REVIEW_CODE || FALLBACK_REVIEW_CODE);
    const supplied = normalizeCode(payload.code);
    if (!supplied) return fail("Enter the review code we gave you.", "code");
    if (supplied !== expected) {
      recordFailure(key);
      return fail(
        "That code isn't right. It's on your invoice — or just ask us for it.",
        "code",
        403
      );
    }

    const name = trimmed(payload.name, LIMITS.name);
    const city = trimmed(payload.city, LIMITS.city);
    const email = trimmed(payload.email, LIMITS.email);
    const headline = trimmed(payload.headline, LIMITS.headline);
    const body = trimmed(payload.body, LIMITS.body);
    const jobMonth = trimmed(payload.jobMonth, LIMITS.jobMonth);
    const service = reviewServiceName(payload.serviceId);
    const rating = clampRating(payload.rating);

    if (!name) return fail("Tell us what name to credit.", "name");
    if (!city) return fail("Which city was the job in?", "city");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return fail("Enter a valid email so we can confirm it's you.", "email");
    }
    if (!service) return fail("Pick the service we did for you.", "serviceId");
    if (!jobMonth) return fail("Roughly when did we do the work?", "jobMonth");
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

    // A YYYY-MM from the picker becomes the published date; anything else falls
    // back to today so the snippet is always pasteable as-is.
    const isoMonth = /^\d{4}-\d{2}$/.test(jobMonth) ? jobMonth : null;
    const date = isoMonth
      ? `${isoMonth}-01`
      : new Date().toISOString().slice(0, 10);

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

    const html = buildEmail({
      review,
      submitter: {
        email,
        jobMonthLabel: isoMonth
          ? new Date(Number(isoMonth.slice(0, 4)), Number(isoMonth.slice(5, 7)) - 1, 1)
              .toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : jobMonth,
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
    await transporter.sendMail(mailOptions);

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
