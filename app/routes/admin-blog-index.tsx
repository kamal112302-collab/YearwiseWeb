import { db } from "../db.server";
import { LinkButton } from "../components/ui/Button";
import { Link } from "react-router";

async function loader$4({}) {
  return {
    posts: await db.blogPost.findMany({
      orderBy: {
        updatedAt: "desc"
      }
    })
  };
}
function AdminBlogIndex({
  loaderData
}) {
  return <div> <div className="flex flex-wrap items-center justify-between gap-4"> <h1 className="text-2xl font-bold text-brand-navy">Blog</h1> <LinkButton href="/admin/blog/new">New post</LinkButton></div> <ul className="mt-8 flex flex-col gap-3">{loaderData.posts.map(post => <li key={post.id}> <Link to={`/admin/blog/${post.id}`} className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 cursor-pointer hover:border-brand-green"> <span className="font-medium text-brand-navy">{post.title}</span> <span className="text-xs uppercase text-muted-foreground">{post.status}</span></Link></li>)}</ul></div>;
}

export default AdminBlogIndex;
export { loader$4 as loader };
