import { getPublishedPosts } from "../lib/blog.server";
import { buildMeta } from "../lib/seo";
import { Link } from "react-router";
import { Breadcrumbs } from "../components/storefront/Breadcrumbs";

type PostCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | string | null;
  season: string;
};

const seasons = ["Lawn", "Snow", "Junk", "Guides"];

function formatDate(value: Date | string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

async function loader() {
  return {
    posts: await getPublishedPosts()
  };
}

function meta() {
  return buildMeta({
    title: "Property Care Guides — Yearwise Services Blog",
    description: "Local tips on lawn care, snow removal, and junk hauling in Thunder Bay from the Yearwise crew.",
    path: "/blog"
  });
}

function BlogIndex({ loaderData }: { loaderData: { posts: PostCard[] } }) {
  const { posts } = loaderData;
  const [lead, ...rest] = posts;

  return (
    <div className="section-pad">
      <Breadcrumbs items={[{ name: "Home", to: "/" }, { name: "Guides" }]} />
      <h1 className="display text-4xl sm:text-5xl">Thunder Bay lawn, snow, and junk guides.</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Short answers from the same crew that does the work. No calendar myths, no items we will not haul.</p>
      {posts.length === 0 || !lead ? (
        <p className="mt-12 max-w-lg text-muted-foreground">Guides are on the way. Call (807) 358-2540 if you need an answer today, or read the <Link to="/faq" className="cursor-pointer font-semibold text-brand-green-deep hover:underline">FAQ</Link>.</p>
      ) : (
        <>
          <Link to={`/blog/${lead.slug}`} className="group mt-12 grid cursor-pointer items-center gap-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green lg:grid-cols-2">
            {lead.coverImage ? <img src={lead.coverImage} alt={lead.title} width={1200} height={800} className="aspect-[4/3] w-full rounded-xl object-cover" /> : null}
            <div>
              <p className="text-sm text-brand-navy/60">{formatDate(lead.publishedAt)}</p>
              <h2 className="mt-2 text-3xl font-semibold text-brand-navy group-hover:text-brand-green-deep">{lead.title}</h2>
              {lead.excerpt ? <p className="mt-3 text-muted-foreground">{lead.excerpt}</p> : null}
            </div>
          </Link>
          <div className="mt-16 flex flex-col gap-12">
            {seasons.map((season) => {
              const items = rest.filter((post) => post.season === season);
              if (items.length === 0) return null;
              return (
                <section key={season}>
                  <h2 className="text-lg font-semibold text-brand-navy">{season}</h2>
                  <ul className="mt-2 divide-y divide-brand-navy/10 border-b border-brand-navy/10">
                    {items.map((post) => (
                      <li key={post.id}>
                        <Link to={`/blog/${post.slug}`} className="group grid cursor-pointer grid-cols-[5.5rem_1fr] items-center gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green sm:grid-cols-[7rem_1fr]">
                          {post.coverImage ? <img src={post.coverImage} alt="" width={280} height={210} className="aspect-[4/3] w-full rounded-xl object-cover" /> : <span />}
                          <span>
                            <span className="block font-semibold text-brand-navy group-hover:text-brand-green-deep">{post.title}</span>
                            {post.excerpt ? <span className="mt-1 line-clamp-1 block text-sm text-muted-foreground">{post.excerpt}</span> : null}
                            <span className="mt-1 block text-sm text-brand-navy/60">{formatDate(post.publishedAt)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default BlogIndex;
export { loader, meta };
