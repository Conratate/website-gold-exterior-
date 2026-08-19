// ─────────────────────────────────────────────────────────────────────────────
// Burning a review code after it's used.
//
// A code already proves, on its own, that we issued it and that it hasn't
// expired (lib/reviewCodes.js). What it can't prove by itself is that nobody
// has spent it yet — that needs somewhere to write down "this one is gone".
//
// Netlify Blobs is that somewhere. It ships with the site, so there's no
// separate database to sign up for or pay for. The write uses `onlyIfNew`,
// which is a compare-and-set: two submissions racing with the same code, the
// store picks a winner and the loser is told the entry already existed. No
// read-then-write gap for a duplicate to slip through.
//
// If the store is unreachable — a Netlify incident, or the site running
// somewhere else entirely — we do not fail the review. The code was still
// signed, still unexpired, and still issued to one named customer, and every
// review is read by a person before it goes live. We degrade to that and say
// so loudly, rather than throwing away a review someone took the time to write.
// ─────────────────────────────────────────────────────────────────────────────

const STORE_NAME = "review-codes";

export const REDEEM = {
  FRESH: "fresh", // first use — burned, good to go
  SPENT: "spent", // someone already used this code
  UNENFORCED: "unenforced", // store unavailable; single-use not guaranteed
};

async function openStore() {
  // Imported lazily so a host without Netlify Blobs fails here, softly,
  // instead of at module load where it would take the whole route down.
  const { getStore } = await import("@netlify/blobs");
  return getStore(STORE_NAME);
}

export async function redeemCode(code, details = {}) {
  let store;
  try {
    store = await openStore();
  } catch (err) {
    console.warn(
      "Review code store unavailable — codes are signed and expiring but not " +
        "single-use for this request:",
      err && err.message
    );
    return { status: REDEEM.UNENFORCED };
  }
  return redeemIn(store, code, details);
}

// Split out from the store lookup so the burn logic can be exercised directly
// against a stand-in store.
export async function redeemIn(store, code, details = {}) {
  try {
    const { modified } = await store.setJSON(
      code,
      { redeemedAt: new Date().toISOString(), ...details },
      { onlyIfNew: true }
    );

    if (modified) return { status: REDEEM.FRESH };

    // Already present: this code has been spent. Surface when, so the owner
    // can tell a double-submit from a forwarded code.
    let previous = null;
    try {
      previous = await store.get(code, { type: "json" });
    } catch {
      // Knowing it's spent is enough; the details are a nicety.
    }
    return { status: REDEEM.SPENT, previous };
  } catch (err) {
    console.warn(
      "Review code store write failed — falling back to signature-only " +
        "validation:",
      err && err.message
    );
    return { status: REDEEM.UNENFORCED };
  }
}

// Burning happens before we send the review on, so a code can't be spent twice
// while the email is in flight. If that email then fails, the customer would be
// left with a dead code and a lost review — so we hand it back and let them try
// again. Best effort: a failure here is logged, never surfaced.
export async function releaseCode(code) {
  try {
    const store = await openStore();
    await store.delete(code);
    return true;
  } catch (err) {
    console.warn(
      "Could not release review code after a failed send — the customer may " +
        "need a fresh one:",
      err && err.message
    );
    return false;
  }
}

// Has this code been spent? Used to tell a customer up front, before they
// write anything, rather than rejecting them at submit time. A store that's
// unreachable answers "not spent" — the authoritative check is the
// compare-and-set in redeemCode, which runs either way.
export async function peekCode(code) {
  try {
    const store = await openStore();
    return (await store.get(code, { type: "json" })) || null;
  } catch {
    return null;
  }
}
