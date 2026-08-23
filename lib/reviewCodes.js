import crypto from "node:crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Per-job review codes.
//
// One shared code has a hole in it: a customer can pass it to a friend who
// never hired us. So every job gets its own code, minted when the work wraps
// and emailed to that customer.
//
// A code carries its own expiry and a signature over both, which means the
// server can validate one without looking anything up — no database needed to
// answer "is this real and is it still good?". Storage is only involved in
// burning a code after use (see lib/codeStore.js), so the feature still works
// if that store is unreachable, just without the single-use guarantee.
//
// Nothing here is a secret except REVIEW_CODE_SECRET, which never leaves the
// server.
// ─────────────────────────────────────────────────────────────────────────────

// Crockford base32: no I, L, O or U, so a code can't be misread as a lookalike
// or accidentally spell something unfortunate.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

// The nonce is what makes each code unique, and it doubles as the key we burn
// on redemption — so two codes colliding would wrongly mark one already used.
// At 45 bits that stops being a thing you ever see: a collision needs millions
// of codes, and this is a business that issues a few hundred a year.
const NONCE_LEN = 9; // 45 bits
const EXP_LEN = 3; // days since EPOCH_DAY, good for ~89 years
const SIG_LEN = 8; // 40 bits — forging one is hopeless against the throttle
export const CODE_LEN = NONCE_LEN + EXP_LEN + SIG_LEN;

// Day zero for the expiry field. Fixed forever: moving it invalidates every
// code already in the wild.
const EPOCH_DAY = Date.UTC(2020, 0, 1) / 86400000;

export const DEFAULT_LIFETIME_DAYS = 90;

function encodeInt(value, length) {
  let out = "";
  let n = value;
  for (let i = 0; i < length; i += 1) {
    out = ALPHABET[n % 32] + out;
    n = Math.floor(n / 32);
  }
  return out;
}

function decodeInt(text) {
  let n = 0;
  for (const ch of text) {
    const i = ALPHABET.indexOf(ch);
    if (i < 0) return NaN;
    n = n * 32 + i;
  }
  return n;
}

function randomChars(length) {
  // 256 is an exact multiple of 32, so a plain modulo is unbiased here.
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % 32];
  return out;
}

function sign(payload, secret) {
  const digest = crypto.createHmac("sha256", secret).update(payload).digest();
  let out = "";
  for (let i = 0; i < SIG_LEN; i += 1) out += ALPHABET[digest[i] % 32];
  return out;
}

function dayNumber(date) {
  return Math.floor(date.getTime() / 86400000) - EPOCH_DAY;
}

// Customers retype these off an email, so be forgiving about everything that
// doesn't change meaning: case, spaces, dashes, and the character pairs
// Crockford deliberately treats as equivalent.
export function normalizeCode(input) {
  return String(input || "")
    .toUpperCase()
    .replace(/[IL]/g, "1")
    .replace(/O/g, "0")
    .replace(/[^0-9A-Z]/g, "");
}

// Displayed in groups of four — easier to read back over the phone and easier
// to spot a missing character.
export function formatCode(code) {
  return (code.match(/.{1,4}/g) || []).join("-");
}

export function mintCode({
  secret,
  lifetimeDays = DEFAULT_LIFETIME_DAYS,
  now = new Date(),
}) {
  if (!secret) throw new Error("mintCode: missing secret");

  const nonce = randomChars(NONCE_LEN);
  const expiresDay = dayNumber(now) + lifetimeDays;
  const exp = encodeInt(expiresDay, EXP_LEN);
  const code = nonce + exp + sign(nonce + exp, secret);

  return {
    code,
    display: formatCode(code),
    nonce,
    // Midnight UTC on the day after it stops being valid.
    expiresAt: new Date((EPOCH_DAY + expiresDay) * 86400000),
  };
}

// Returns { ok: true, nonce, expiresAt } or { ok: false, reason } where reason
// is "malformed" | "invalid" | "expired". Callers should not tell the visitor
// which — a stranger learns nothing from "expired" that they should know.
export function verifyCode({ code, secret, now = new Date() }) {
  if (!secret) return { ok: false, reason: "invalid" };

  const normalized = normalizeCode(code);
  if (normalized.length !== CODE_LEN) return { ok: false, reason: "malformed" };

  const nonce = normalized.slice(0, NONCE_LEN);
  const exp = normalized.slice(NONCE_LEN, NONCE_LEN + EXP_LEN);
  const supplied = normalized.slice(NONCE_LEN + EXP_LEN);

  const expected = sign(nonce + exp, secret);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: "invalid" };
  }

  const expiresDay = decodeInt(exp);
  if (!Number.isFinite(expiresDay)) return { ok: false, reason: "malformed" };
  if (dayNumber(now) > expiresDay) return { ok: false, reason: "expired" };

  return {
    ok: true,
    nonce,
    expiresAt: new Date((EPOCH_DAY + expiresDay) * 86400000),
  };
}
