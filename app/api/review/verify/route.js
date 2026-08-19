import { verifyCode } from "@/lib/reviewCodes";
import { peekCode } from "@/lib/codeStore";
import { clientKey, createThrottle } from "@/lib/throttle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// Checks a code without spending it, so the customer finds out their code is
// good *before* writing a review rather than after. Nothing here is trusted:
// /api/review verifies again and burns the code at submit time, so a forged
// "yes" from this endpoint buys nothing.
// ─────────────────────────────────────────────────────────────────────────────

const throttle = createThrottle();

export async function POST(request) {
  try {
    const secret = process.env.REVIEW_CODE_SECRET;
    if (!secret) {
      return Response.json(
        {
          ok: false,
          error:
            "Reviews aren't switched on yet — sorry about that. Please try again in a day or two.",
        },
        { status: 503 }
      );
    }

    const key = clientKey(request);
    if (throttle.isThrottled(key)) {
      return Response.json(
        {
          ok: false,
          error:
            "Too many tries. Wait a few minutes, or reply to the email your code came in.",
        },
        { status: 429 }
      );
    }

    const { code } = (await request.json().catch(() => ({}))) || {};
    if (!String(code || "").trim()) {
      return Response.json(
        { ok: false, error: "Enter the code from your email." },
        { status: 400 }
      );
    }

    const check = verifyCode({ code, secret });
    if (!check.ok) {
      throttle.record(key);
      return Response.json(
        {
          ok: false,
          error:
            "That code isn't valid — it may have expired. Reply to the email it came in and we'll send a fresh one.",
        },
        { status: 403 }
      );
    }

    // Already spent? Say so now rather than letting them write a review we'd
    // only reject at the end.
    const spent = await peekCode(check.nonce);
    if (spent) {
      return Response.json(
        {
          ok: false,
          error:
            "This code has already been used. Each one works once — reply to your last email and we'll send a fresh one.",
        },
        { status: 409 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Review code verify error", err);
    return Response.json(
      { ok: false, error: "Couldn't check that code. Please try again." },
      { status: 500 }
    );
  }
}
