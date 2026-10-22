import { isDatabaseAvailable, tryDb } from "../db.server";
import { getCanonicalUrl } from "../lib/seo";

function urlEntry(loc, lastmod, priority) {
  return `<url>
  <loc>${loc}</loc>${lastmod ? `\n  <lastmod>${lastmod}</lastmod>` : ""}${priority ? `\n  <priority>${priority}</priority>` : ""}
</url>`;
}
async function loader$13({}) {
  const staticPages = ["/", "/about", "/services", "/services/lawn-care", "/services/snow-removal", "/services/junk-removal", "/faq", "/contact", "/blog", "/policies/privacy", "/policies/terms"];
  let blogUrls = [];
  if (isDatabaseAvailable()) {
    const db = tryDb();
    if (db) try {
      blogUrls = (await db.blogPost.findMany({
        where: {
          status: "published"
        },
        select: {
          slug: true,
          updatedAt: true
        }
      })).map(p => urlEntry(getCanonicalUrl(`/blog/${p.slug}`), p.updatedAt.toISOString().split("T")[0], "0.6"));
    } catch {}
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages.map(path => urlEntry(getCanonicalUrl(path), void 0, path === "/" ? "1.0" : "0.8")), ...blogUrls].join("\n")}
</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
}

export { loader$13 as loader };
