import { SITE_URL } from "@/lib/site";

const PAGES = ["", "/services", "/quote", "/about", "/charity", "/giveaway", "/review"];

export default function sitemap() {
  return PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/services" || path === "/quote" ? 0.8 : 0.5,
  }));
}
