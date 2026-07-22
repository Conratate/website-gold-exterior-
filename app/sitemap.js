const BASE = "https://goldexterior.com";

export default function sitemap() {
  const lastModified = new Date();
  return ["", "/services", "/about", "/quote"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
