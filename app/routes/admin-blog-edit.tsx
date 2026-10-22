import { db } from "../db.server";
import { data, Form } from "react-router";
import { slugify } from "../lib/utils";
import { Input, Textarea, Select } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

async function loader$3({
  params
}) {
  const post = await db.blogPost.findUnique({
    where: {
      id: params.id
    }
  });
  if (!post) throw data("Not Found", {
    status: 404
  });
  return {
    post
  };
}
async function action$2({
  request,
  params
}) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const status = formData.get("status") === "published" ? "published" : "draft";
  const existing = await db.blogPost.findUnique({
    where: {
      id: params.id
    }
  });
  await db.blogPost.update({
    where: {
      id: params.id
    },
    data: {
      title,
      slug: slugify(String(formData.get("slug") ?? title)),
      excerpt: String(formData.get("excerpt") ?? "") || null,
      bodyRichText: String(formData.get("bodyRichText") ?? ""),
      coverImage: String(formData.get("coverImage") ?? "") || null,
      author: String(formData.get("author") ?? "") || null,
      status,
      publishedAt: status === "published" ? existing?.publishedAt ?? new Date() : null,
      seoTitle: String(formData.get("seoTitle") ?? "") || null,
      seoDescription: String(formData.get("seoDescription") ?? "") || null
    }
  });
  return {
    ok: true
  };
}
function AdminBlogEdit({
  loaderData
}) {
  const {
    post
  } = loaderData;
  return <div> <h1 className="text-2xl font-bold text-brand-navy">Edit post</h1> <Form method="post" className="mt-8 max-w-2xl flex flex-col gap-4"> <Input label="Title" name="title" defaultValue={post.title} required /> <Input label="Slug" name="slug" defaultValue={post.slug} /> <Input label="Excerpt" name="excerpt" defaultValue={post.excerpt ?? ""} /> <Textarea label="Body (HTML)" name="bodyRichText" rows={12} defaultValue={post.bodyRichText} /> <Input label="Cover image" name="coverImage" defaultValue={post.coverImage ?? ""} /> <Input label="Author" name="author" defaultValue={post.author ?? ""} /> <Select label="Status" name="status" defaultValue={post.status}> <option value="draft">Draft</option> <option value="published">Published</option></Select> <Input label="SEO title" name="seoTitle" defaultValue={post.seoTitle ?? ""} /> <Input label="SEO description" name="seoDescription" defaultValue={post.seoDescription ?? ""} /> <Button type="submit">Save post</Button></Form></div>;
}

export default AdminBlogEdit;
export { action$2 as action, loader$3 as loader };
