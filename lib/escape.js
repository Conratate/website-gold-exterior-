// Customer-supplied text goes straight into the HTML emails we send ourselves.
// Escaping it keeps a stray angle bracket from mangling the message — or worse,
// smuggling markup into our inbox.
export function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
