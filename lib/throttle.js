// Best-effort per-address throttling for the endpoints that check a secret.
//
// Serverless instances are short-lived and there can be several at once, so
// this won't stop a determined attacker — it stops the realistic case of
// someone typing guesses at a form. The secrets' own length does the rest.
//
// Each caller gets its own bucket: failing to guess a review code shouldn't
// lock anyone out of a different endpoint.

const DEFAULT_MAX_FAILURES = 6;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const MAX_TRACKED_KEYS = 500;

export function createThrottle({
  maxFailures = DEFAULT_MAX_FAILURES,
  windowMs = DEFAULT_WINDOW_MS,
} = {}) {
  const failures = new Map();

  const recent = (key, now) =>
    (failures.get(key) || []).filter((t) => now - t < windowMs);

  return {
    record(key) {
      const now = Date.now();
      const times = recent(key, now);
      times.push(now);
      failures.set(key, times);

      // The map lives as long as the instance does; drop stale keys so a
      // long-lived one can't grow without bound.
      if (failures.size > MAX_TRACKED_KEYS) {
        for (const [k, ts] of failures) {
          if (ts.every((t) => now - t >= windowMs)) failures.delete(k);
        }
      }
    },

    isThrottled(key) {
      const now = Date.now();
      const times = recent(key, now);
      if (times.length === 0) failures.delete(key);
      else failures.set(key, times);
      return times.length >= maxFailures;
    },
  };
}

export function clientKey(request) {
  const fwd = request.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}
