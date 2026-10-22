import { getPostBySlug } from "../lib/blog.server";
import { data } from "react-router";
import { buildMeta, JsonLd, breadcrumbJsonLd, blogPostingJsonLd } from "../lib/seo";

async function loader$16({
  params
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) throw data("Not Found", {
    status: 404
  });
  return {
    post
  };
}
function meta$1({
  loaderData
}) {
  const post = loaderData?.post;
  if (!post) return [{
    title: "Blog — Yearwise Services"
  }];
  return buildMeta({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? post.title,
    path: `/blog/${post.slug}`,
    image: post.coverImage ?? void 0
  });
}
function BlogPost({
  loaderData
}) {
  const {
    post
  } = loaderData;
  return (
    <article className="section-pad">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} />
      <JsonLd data={blogPostingJsonLd(post)} />
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Guide</p>
        <h1 className="display mt-3 text-3xl sm:text-4xl">{post.title}</h1>
        {post.publishedAt && <p className="mt-3 text-sm text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}{post.author ? ` · ${post.author}` : null}</p>}
        {post.coverImage && <img src={post.coverImage} alt="" width={1200} height={700} className="mt-8 aspect-[16/9] w-full rounded-[2rem] object-cover" />}
        <div className="prose-yearwise mt-8 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: post.bodyRichText }} />
      </div>
    </article>
  );
}

export default BlogPost;
export { loader$16 as loader, meta$1 as meta };
