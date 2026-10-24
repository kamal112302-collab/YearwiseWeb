import { isDatabaseAvailable, tryDb } from "../db.server";
import { getCanonicalUrl } from "../lib/seo";
import { fallbackPosts } from "../lib/blog.server";

const UPDATED = "2026-10-23";

function urlEntry(loc: string, lastmod?: string, priority?: string) {
  return `<url>
  <loc>${loc}</loc>${lastmod ? `\n  <lastmod>${lastmod}</lastmod>` : ""}${priority ? `\n  <priority>${priority}</priority>` : ""}
</url>`;
}

async function loader() {
  const staticPages = ["/", "/about", "/services", "/services/lawn-care", "/services/snow-removal", "/services/junk-removal", "/faq", "/contact", "/blog", "/policies/privacy", "/policies/terms"];
  const guides = new Map(fallbackPosts.map((post) => [post.slug, post.publishedAt.toISOString().split("T")[0]]));
  if (isDatabaseAvailable()) {
    const db = tryDb();
    if (db) try {
      const rows = await db.blogPost.findMany({
        where: { status: "published" },
        select: { slug: true, updatedAt: true }
      });
      for (const row of rows) guides.set(row.slug, row.updatedAt.toISOString().split("T")[0]);
    } catch {}
  }
  const guideUrls = [...guides.entries()].map(([slug, lastmod]) => urlEntry(getCanonicalUrl(`/blog/${slug}`), lastmod, "0.6"));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages.map(path => urlEntry(getCanonicalUrl(path), UPDATED, path === "/" ? "1.0" : "0.8")), ...guideUrls].join("\n")}
</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
}

export { loader };
