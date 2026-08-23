import { REVIEWS } from "./reviews";
import { listPublished } from "./reviewStore";

// Every page that shows a rating needs the same answer to "what is published
// right now?" — whatever the staff page has published, plus anything committed
// to lib/reviews.js, falling back to just the file if the store can't be
// reached. One place, so the home page and the reviews page can never disagree.
export async function publishedReviews() {
  const stored = await listPublished();
  return [...(stored || []), ...REVIEWS];
}
