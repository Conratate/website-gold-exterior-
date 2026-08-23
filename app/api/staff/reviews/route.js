import {
  STATUS,
  deleteReview,
  listReviews,
  publishReview,
  unpublishReview,
} from "@/lib/reviewStore";
import { clientKey, createThrottle } from "@/lib/throttle";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// The moderation desk behind /staff. Every action needs OWNER_CODE — the same
// password that guards code issuing, because both are "only the owner does
// this" and a second password would be a second thing to lose.
// ─────────────────────────────────────────────────────────────────────────────

const throttle = createThrottle();

// Every page that shows a rating caches for a minute. Publishing shouldn't
// mean waiting out that minute wondering whether it worked, so the pages that
// read reviews are refreshed the moment one moves.
function refreshPublicPages() {
  for (const path of ["/reviews", "/", "/about"]) {
    try {
      revalidatePath(path);
    } catch (err) {
      // Worst case the page catches up on its own schedule.
      console.warn("Couldn't refresh", path, err && err.message);
    }
  }
}

function deny(error, status = 403) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request) {
  try {
    const ownerCode = process.env.OWNER_CODE;
    if (!ownerCode) {
      console.error("OWNER_CODE is not set — the staff page can do nothing.");
      return deny("Staff tools aren't configured yet. Set OWNER_CODE.", 503);
    }

    const key = clientKey(request);
    if (throttle.isThrottled(key)) {
      return deny("Too many attempts. Wait a few minutes.", 429);
    }

    const body = (await request.json().catch(() => null)) || {};
    if (String(body.ownerCode || "") !== ownerCode) {
      throttle.record(key);
      return deny("That's not the owner password.");
    }

    switch (body.action) {
      case "list": {
        const reviews = await listReviews();
        if (reviews === null) {
          return Response.json(
            {
              ok: false,
              error:
                "Couldn't reach the review storage. Your reviews are safe — they're in your inbox. Try again shortly.",
            },
            { status: 503 }
          );
        }
        return Response.json({
          ok: true,
          pending: reviews.filter((r) => r.status === STATUS.PENDING),
          published: reviews.filter((r) => r.status === STATUS.PUBLISHED),
        });
      }

      case "publish": {
        const updated = await publishReview(String(body.id || ""));
        if (!updated) return deny("That review is no longer there.", 404);
        refreshPublicPages();
        return Response.json({ ok: true });
      }

      case "unpublish": {
        const updated = await unpublishReview(String(body.id || ""));
        if (!updated) return deny("That review is no longer there.", 404);
        refreshPublicPages();
        return Response.json({ ok: true });
      }

      case "delete": {
        await deleteReview(String(body.id || ""));
        refreshPublicPages();
        return Response.json({ ok: true });
      }

      default:
        return Response.json(
          { ok: false, error: "Unknown action." },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Staff reviews API error", err);
    const reason = err && err.message ? String(err.message).slice(0, 160) : "unknown";
    return Response.json(
      { ok: false, error: `Something went wrong (${reason})` },
      { status: 500 }
    );
  }
}
