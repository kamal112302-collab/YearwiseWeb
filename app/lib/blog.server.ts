import { tryDb } from "../db.server";

export var fallbackPosts = [{
  id: "post-snow",
  slug: "how-automatic-snow-removal-works-thunder-bay",
  title: "How automatic snow removal works in Thunder Bay",
  excerpt: "Once you're on a Yearwise snow plan, you don't call after every storm — here's what happens after 5 cm falls.",
  coverImage: "/images/snow-removal.webp",
  publishedAt: new Date("2026-01-15"),
  author: "Yearwise Services",
  bodyRichText: `<p>Thunder Bay winters are unpredictable. That's why our snow removal plan is automatic: when snowfall reaches 5 cm or more, our crew is dispatched to your driveway — cleared and de-iced before you need to leave for work.</p><p>You don't text, call, or wonder if anyone's coming. You're already on the route because you're a Yearwise customer.</p><h2>What's included</h2><p>Driveway clearing, entrance paths, and de-icing on treated surfaces. Emergency visits can often be arranged same-day or next-day for non-plan customers — call <strong>(807) 358-2540</strong>.</p>`,
  seoTitle: "Automatic Snow Removal Thunder Bay | Yearwise",
  seoDescription: "Learn how Yearwise automatic snow removal works after 5cm snowfall — no calling every storm."
}, {
  id: "post-junk",
  slug: "what-we-can-haul-junk-removal-thunder-bay",
  title: "What we can haul with junk removal in Thunder Bay",
  excerpt: "Furniture, appliances, yard waste, hot tubs, sheds — if you can point at it, we can usually haul it.",
  coverImage: "/images/junk-removal.webp",
  publishedAt: new Date("2026-02-01"),
  author: "Yearwise Services",
  bodyRichText: `<p>Junk removal should be simple: you point, we load, haul, and dispose responsibly.</p><h2>Common items</h2><ul><li>Old furniture and mattresses</li><li>Appliances and electronics</li><li>Yard waste and construction debris</li><li>Hot tubs, sheds, and bulky outdoor items</li></ul><p>We recycle and donate whenever possible. Hazardous materials (paint, chemicals, asbestos) require specialized disposal — ask us if you're unsure.</p>`,
  seoTitle: "Junk Removal Items Thunder Bay | Yearwise",
  seoDescription: "Yearwise junk hauling in Thunder Bay — furniture, appliances, yard waste, and more from $99."
}];
export async function getPublishedPosts() {
  const client = tryDb();
  if (!client) return fallbackPosts.map(({
    bodyRichText: _b,
    seoTitle: _s,
    seoDescription: _d,
    ...rest
  }) => rest);
  try {
    const rows = await client.blogPost.findMany({
      where: {
        status: "published"
      },
      orderBy: {
        publishedAt: "desc"
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        author: true
      }
    });
    if (rows.length === 0) return fallbackPosts.map(({
      bodyRichText: _b,
      seoTitle: _s,
      seoDescription: _d,
      ...rest
    }) => rest);
    return rows;
  } catch {
    return fallbackPosts.map(({
      bodyRichText: _b,
      seoTitle: _s,
      seoDescription: _d,
      ...rest
    }) => rest);
  }
}
export async function getPostBySlug(slug) {
  const client = tryDb();
  if (!client) return fallbackPosts.find(p => p.slug === slug) ?? null;
  try {
    const row = await client.blogPost.findFirst({
      where: {
        slug,
        status: "published"
      }
    });
    if (!row) return fallbackPosts.find(p => p.slug === slug) ?? null;
    return row;
  } catch {
    return fallbackPosts.find(p => p.slug === slug) ?? null;
  }
}


