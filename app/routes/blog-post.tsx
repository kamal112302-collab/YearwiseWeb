import { getPostBySlug, getPublishedPosts, serviceNameFor } from "../lib/blog.server";
import { getSiteSettings } from "../lib/content.server";
import { data, Link } from "react-router";
import { buildMeta, JsonLd, breadcrumbJsonLd, blogPostingJsonLd } from "../lib/seo";
import { Breadcrumbs } from "../components/storefront/Breadcrumbs";
import { LinkButton } from "../components/ui/Button";

async function loader({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) throw data("Not Found", { status: 404 });
  const [posts, settings] = await Promise.all([getPublishedPosts(), getSiteSettings()]);
  return {
    post,
    phone: settings.phone,
    serviceName: serviceNameFor(post.serviceSlug),
    others: posts.filter((item) => item.slug !== post.slug).slice(0, 4)
  };
}

function meta({ loaderData }: { loaderData?: { post: { title: string; seoTitle?: string | null; seoDescription?: string | null; excerpt?: string | null; slug: string; coverImage?: string | null } } }) {
  const post = loaderData?.post;
  if (!post) return [{ title: "Blog — Yearwise Services" }];
  return buildMeta({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? post.title,
    path: `/blog/${post.slug}`,
    image: post.coverImage ?? undefined
  });
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

function BlogPost({ loaderData }: { loaderData: { post: { title: string; slug: string; excerpt: string | null; coverImage: string | null; publishedAt: Date | string | null; author: string | null; bodyRichText: string; serviceSlug: string }; phone: string; serviceName: string; others: { slug: string; title: string }[] } }) {
  const { post, phone, serviceName, others } = loaderData;
  const tel = phone.replace(/[^\d+]/g, "");

  return (
    <article className="section-pad">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} />
      <JsonLd data={blogPostingJsonLd(post)} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", to: "/" }, { name: "Guides", to: "/blog" }, { name: post.title }]} />
        <h1 className="display text-3xl sm:text-4xl">{post.title}</h1>
        {post.publishedAt ? <p className="mt-3 text-sm text-brand-navy/60">{formatDate(post.publishedAt)}{post.author ? ` · ${post.author}` : ""}</p> : null}
        {post.coverImage ? <img src={post.coverImage} alt={post.title} width={1200} height={800} className="mt-8 aspect-[16/9] w-full rounded-xl object-cover" /> : null}
        <div className="prose-yearwise mt-8" dangerouslySetInnerHTML={{ __html: post.bodyRichText }} />
        <div className="mt-10 border-t border-brand-navy/10 pt-6 text-sm text-brand-navy">
          <p>Call <a href={`tel:${tel}`} className="font-semibold text-brand-green-deep hover:underline">{phone}</a>{serviceName ? <> or read <Link to={`/services/${post.serviceSlug}`} className="font-semibold text-brand-green-deep hover:underline">{serviceName}</Link></> : null}.</p>
          {others.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link to={`/blog/${item.slug}`} className="cursor-pointer font-semibold text-brand-navy hover:text-brand-green-deep">{item.title}</Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/contact">Get a quote</LinkButton>
            <LinkButton href="/faq" variant="outline">Read the FAQ</LinkButton>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogPost;
export { loader, meta };
