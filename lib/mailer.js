import nodemailer from "nodemailer";

// Both the quote form and the review form send mail through the same Gmail
// account, so the credentials and the SMTP tuning live in one place.

export function mailSettings() {
  const user = process.env.GMAIL_USER;
  // App passwords are shown as "abcd efgh ijkl mnop" — strip any spaces the
  // user may have pasted, since SMTP auth fails if they're left in.
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  const to = process.env.QUOTE_TO_EMAIL || "goldexterior0@gmail.com";
  return { user, pass, to, configured: Boolean(user && pass) };
}

export function createTransport({ user, pass }) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    // Fail fast with a readable error instead of hanging until the function
    // times out, which would surface as a generic error to the customer.
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}
