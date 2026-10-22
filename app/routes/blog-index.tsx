import { getPublishedPosts } from "../lib/blog.server";
import { buildMeta } from "../lib/seo";
import { Link } from "react-router";

async function loader$17({}) {
  return {
    posts: await getPublishedPosts()
  };
}
function meta$2({}) {
  return buildMeta({
    title: "Property Care Guides — Yearwise Services Blog",
    description: "Local tips on lawn care, snow removal, and junk hauling in Thunder Bay from the Yearwise crew.",
    path: "/blog"
  });
}
function BlogIndex({
  loaderData
}) {
  const {
    posts
  } = loaderData;
  return (
    <div className="section-pad">
      <p className="eyebrow">Guides</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Local <span className="text-brand-green">know-how.</span></h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Practical notes for Thunder Bay homeowners — snow, lawns, and what we can haul.</p>
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id}>
            {post.coverImage && <img src={post.coverImage} alt="" width={800} height={520} className="aspect-[4/3] w-full rounded-[2rem] object-cover" />}
            <h2 className="mt-5 text-2xl font-semibold text-brand-navy"><Link to={`/blog/${post.slug}`} className="cursor-pointer hover:text-brand-green">{post.title}</Link></h2>
            {post.excerpt && <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogIndex;
export { loader$17 as loader, meta$2 as meta };
