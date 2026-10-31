import { tryDb } from "../db.server";
import { mediaUrl, photos } from "./media";

const lawnCover = mediaUrl(photos.lawnStriped.id, 1600);
const snowCover = mediaUrl(photos.snowNight.id, 1600);
const snowBookCover = mediaUrl(photos.snowStorm.id, 1600);
const junkCover = mediaUrl(photos.junkBackyard.id, 1600);
const junkPriceCover = mediaUrl(photos.junkYard.id, 1600);

const guideBySlug = {
  "when-thunder-bay-lawn-season-starts": { season: "Lawn", serviceSlug: "lawn-care" },
  "how-automatic-snow-removal-works-thunder-bay": { season: "Snow", serviceSlug: "snow-removal" },
  "when-to-book-snow-removal-thunder-bay": { season: "Snow", serviceSlug: "snow-removal" },
  "what-we-can-haul-junk-removal-thunder-bay": { season: "Junk", serviceSlug: "junk-removal" },
  "how-junk-removal-is-priced-thunder-bay": { season: "Junk", serviceSlug: "junk-removal" }
} as const;

export function guideMeta(slug: string) {
  return guideBySlug[slug as keyof typeof guideBySlug] ?? { season: "Guides", serviceSlug: "" };
}

const serviceNames: Record<string, string> = {
  "lawn-care": "Lawn care",
  "snow-removal": "Snow removal",
  "junk-removal": "Junk removal"
};

export function serviceNameFor(slug: string) {
  return serviceNames[slug] ?? "";
}

export var fallbackPosts = [{
  id: "post-snow-book",
  slug: "when-to-book-snow-removal-thunder-bay",
  title: "When to book snow removal in Thunder Bay",
  excerpt: "Book the snow plan before the first 5 cm if you want the driveway cleared without calling.",
  coverImage: snowBookCover,
  publishedAt: new Date("2026-10-18"),
  author: "Yearwise Services",
  bodyRichText: `<p>Book a snow plan before the first storm if you want the driveway cleared without calling. Yearwise season packages in Thunder Bay start at $549 + tax for a 1-car driveway. Once you are on the plan, the crew comes after 5 cm or more of snow.</p><h2>What the quote names</h2><p>The quote names the driveway size and the entrance paths. De-icing is only on the surfaces written in that quote. Surfaces that were not named are not part of the visit.</p><h2>When to call</h2><p>Call <a href="tel:8073582540">(807) 358-2540</a> before the first 5 cm if you want to be on the route. People who are not on a plan can ask about a one-off visit. Same-day is not guaranteed.</p><p>Year-round customers — lawn, snow, and junk — save 20% and get first pick of the schedule. There is no long-term contract.</p>`,
  seoTitle: "When to Book Snow Removal in Thunder Bay | Yearwise",
  seoDescription: "Book Yearwise snow removal before the first 5 cm. Season packages from $549 + tax by driveway size."
}, {
  id: "post-junk-price",
  slug: "how-junk-removal-is-priced-thunder-bay",
  title: "How junk removal is priced in Thunder Bay",
  excerpt: "Hauling starts at $99. A photo of the pile is the fastest way to get a quote.",
  coverImage: junkPriceCover,
  publishedAt: new Date("2026-10-12"),
  author: "Yearwise Services",
  bodyRichText: `<p>A junk haul in Thunder Bay starts at $99. The quote is based on the pile, so a photo of it is the fastest way to get a number. Nothing is billed from this website.</p><h2>What we take</h2><ul><li>Old furniture and mattresses</li><li>Appliances and electronics</li><li>Yard waste and construction debris</li><li>Hot tubs, sheds, and other bulky outdoor items</li></ul><h2>What we do not take</h2><p>We do not haul paint, chemicals, or asbestos. If you are not sure, ask before the visit is booked.</p><p>Call <a href="tel:8073582540">(807) 358-2540</a> or send the photo with the quote form. Hauling can often be same-day or next-day.</p>`,
  seoTitle: "How Junk Removal Is Priced in Thunder Bay | Yearwise",
  seoDescription: "Yearwise junk hauling starts at $99. Send a photo of the pile. Furniture and yard waste are in. Paint, chemicals, and asbestos are not."
}, {
  id: "post-lawn",
  slug: "when-thunder-bay-lawn-season-starts",
  title: "When lawn season starts in Thunder Bay",
  excerpt: "There is no single calendar date. We book from the first thaw through fall cleanup, and summer 2026 spots are open now.",
  coverImage: lawnCover,
  publishedAt: new Date("2026-03-20"),
  author: "Yearwise Services",
  bodyRichText: `<p>Thunder Bay does not thaw on a fixed day. Yearwise lawn care runs from the first thaw through fall cleanup: mowing, edging, and seasonal treatments with the same crew.</p><p>Summer 2026 booking is open. A new customer's first lawn cut is $49 (regular $85). After that, visits start at $49, and the quote confirms the property before anything is billed.</p><h2>How soon can you start</h2><p>Most new customers get a first service within 3–5 days of calling. Peak weeks fill up, so booking early is the reliable way to get on the route. Call <a href="tel:8073582540">(807) 358-2540</a> or send the quote form.</p><p>Year-round customers — lawn, snow, and junk with the same crew — save 20% and get priority scheduling. No long-term contract.</p>`,
  seoTitle: "When Lawn Season Starts in Thunder Bay | Yearwise",
  seoDescription: "Thunder Bay lawn care runs from the first thaw through fall cleanup. First cut $49. Summer 2026 booking is open."
}, {
  id: "post-snow",
  slug: "how-automatic-snow-removal-works-thunder-bay",
  title: "How automatic snow removal works in Thunder Bay",
  excerpt: "Once you're on a Yearwise snow plan, you don't call after every storm — here's what happens after 5 cm falls.",
  coverImage: snowCover,
  publishedAt: new Date("2026-01-15"),
  author: "Yearwise Services",
  bodyRichText: `<p>Thunder Bay winters are unpredictable. That's why our snow removal plan is automatic: when snowfall reaches 5 cm or more, our crew is dispatched to your driveway — cleared and de-iced before you need to leave for work.</p><p>You don't text, call, or wonder if anyone's coming. You're already on the route because you're a Yearwise customer.</p><h2>What's included</h2><p>Driveway clearing, entrance paths, and de-icing on treated surfaces named in the quote. Emergency visits can often be arranged same-day or next-day for people who are not on a plan — call <a href="tel:8073582540">(807) 358-2540</a>.</p>`,
  seoTitle: "Automatic Snow Removal Thunder Bay | Yearwise",
  seoDescription: "Learn how Yearwise automatic snow removal works after 5cm snowfall — no calling every storm."
}, {
  id: "post-junk",
  slug: "what-we-can-haul-junk-removal-thunder-bay",
  title: "What we can haul with junk removal in Thunder Bay",
  excerpt: "Furniture, appliances, yard waste, hot tubs, sheds — if you can point at it, we can usually haul it. Paint and chemicals are the exception.",
  coverImage: junkCover,
  publishedAt: new Date("2026-02-01"),
  author: "Yearwise Services",
  bodyRichText: `<p>Junk removal should be simple: you point, we load, haul, and dispose responsibly.</p><h2>Common items</h2><ul><li>Old furniture and mattresses</li><li>Appliances and electronics</li><li>Yard waste and construction debris</li><li>Hot tubs, sheds, and bulky outdoor items</li></ul><p>We recycle and donate whenever possible. We do not haul hazardous materials such as paint, chemicals, or asbestos. If you are unsure, ask before we book the visit.</p><p>Hauling starts at $99 a visit and can often be same-day or next-day. A photo of the pile makes the quote faster. Call <a href="tel:8073582540">(807) 358-2540</a>.</p>`,
  seoTitle: "Junk Removal Items Thunder Bay | Yearwise",
  seoDescription: "Yearwise junk hauling in Thunder Bay — furniture, appliances, yard waste, and more from $99. Paint and chemicals are not hauled."
}];

function publicPost(post: (typeof fallbackPosts)[number]) {
  const { bodyRichText: _body, seoTitle: _seoTitle, seoDescription: _seoDescription, ...rest } = post;
  return { ...rest, ...guideMeta(post.slug) };
}

function byDateDesc<T extends { publishedAt: Date | string | null }>(posts: T[]) {
  return [...posts].sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
}

export async function getPublishedPosts() {
  const client = tryDb();
  if (!client) return byDateDesc(fallbackPosts.map(publicPost));
  try {
    const rows = await client.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
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
    if (rows.length === 0) return byDateDesc(fallbackPosts.map(publicPost));
    const slugs = new Set(rows.map((row: { slug: string }) => row.slug));
    const extras = fallbackPosts.filter(post => !slugs.has(post.slug)).map(publicPost);
    const published = rows.map((row: { slug: string }) => ({ ...row, ...guideMeta(row.slug) }));
    return byDateDesc([...published, ...extras]);
  } catch {
    return byDateDesc(fallbackPosts.map(publicPost));
  }
}

export async function getPostBySlug(slug: string) {
  const client = tryDb();
  const attach = <T extends { slug: string }>(post: T) => ({ ...post, ...guideMeta(post.slug) });
  if (!client) {
    const post = fallbackPosts.find(p => p.slug === slug);
    return post ? attach(post) : null;
  }
  try {
    const row = await client.blogPost.findFirst({
      where: {
        slug,
        status: "published"
      }
    });
    if (!row) {
      const post = fallbackPosts.find(p => p.slug === slug);
      return post ? attach(post) : null;
    }
    return attach(row);
  } catch {
    const post = fallbackPosts.find(p => p.slug === slug);
    return post ? attach(post) : null;
  }
}
