// ─────────────────────────────────────────────────────────────────────────────
// Where submitted reviews live between arriving and going public.
//
// A review used to be emailed and nothing more, which meant publishing one
// required editing a file and deploying — not something you can do from a
// truck. So submissions are kept here instead, and the staff page publishes
// them with a button.
//
// This is the same Netlify Blobs store mechanism that burns used codes: it
// ships with the site, so there's no database to sign up for.
//
// Nothing here is a substitute for the email. The email still goes out, and it
// is still the thing that tells you a review arrived.
// ─────────────────────────────────────────────────────────────────────────────

const STORE_NAME = "customer-reviews";

export const STATUS = {
  PENDING: "pending",
  PUBLISHED: "published",
};

async function openStore() {
  // Imported lazily so a host without Netlify Blobs fails softly here rather
  // than at module load, where it would take the whole page down.
  const { getStore } = await import("@netlify/blobs");
  return getStore(STORE_NAME);
}

// Newest first, everywhere. Reviews are read in the order they arrived.
function byNewest(a, b) {
  return String(b.submittedAt || "").localeCompare(String(a.submittedAt || ""));
}

export async function saveSubmission(review) {
  try {
    const store = await openStore();
    await store.setJSON(review.id, {
      ...review,
      status: STATUS.PENDING,
      submittedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    // A storage failure must never cost us the review — the email has already
    // gone out and carries everything needed to publish it by hand.
    console.warn(
      "Couldn't save the review for one-tap publishing; it's still in your " +
        "inbox with a paste-ready snippet:",
      err && err.message
    );
    return false;
  }
}

export async function listReviews() {
  try {
    const store = await openStore();
    const { blobs } = await store.list();
    const records = await Promise.all(
      blobs.map(async (b) => {
        try {
          return await store.get(b.key, { type: "json" });
        } catch {
          return null;
        }
      })
    );
    return records.filter(Boolean).sort(byNewest);
  } catch (err) {
    console.warn("Couldn't read stored reviews:", err && err.message);
    return null; // null means "couldn't ask", which is not the same as "none"
  }
}

export async function listPublished() {
  const all = await listReviews();
  if (!all) return null;
  return all.filter((r) => r.status === STATUS.PUBLISHED);
}

export async function publishReview(id) {
  const store = await openStore();
  const record = await store.get(id, { type: "json" });
  if (!record) return null;
  const updated = {
    ...record,
    status: STATUS.PUBLISHED,
    publishedAt: new Date().toISOString(),
  };
  await store.setJSON(id, updated);
  return updated;
}

// Unpublishing puts a review back in the pending list rather than destroying
// it — a misclick shouldn't lose a customer's words.
export async function unpublishReview(id) {
  const store = await openStore();
  const record = await store.get(id, { type: "json" });
  if (!record) return null;
  const updated = { ...record, status: STATUS.PENDING };
  delete updated.publishedAt;
  await store.setJSON(id, updated);
  return updated;
}

export async function deleteReview(id) {
  const store = await openStore();
  await store.delete(id);
  return true;
}
