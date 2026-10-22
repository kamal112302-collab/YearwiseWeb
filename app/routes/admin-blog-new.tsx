import { slugify } from "../lib/utils";
import { db } from "../db.server";
import { redirect, Form } from "react-router";
import { Input, Textarea, Select } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

async function action$3({
  request
}) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? title));
  const post = await db.blogPost.create({
    data: {
      title,
      slug,
      excerpt: String(formData.get("excerpt") ?? "") || null,
      bodyRichText: String(formData.get("bodyRichText") ?? ""),
      coverImage: String(formData.get("coverImage") ?? "") || null,
      author: String(formData.get("author") ?? "Yearwise Services") || null,
      status: formData.get("status") === "published" ? "published" : "draft",
      publishedAt: formData.get("status") === "published" ? new Date() : null,
      seoTitle: String(formData.get("seoTitle") ?? "") || null,
      seoDescription: String(formData.get("seoDescription") ?? "") || null
    }
  });
  return redirect(`/admin/blog/${post.id}`);
}
function AdminBlogNew() {
  return <div> <h1 className="text-2xl font-bold text-brand-navy">New blog post</h1> <Form method="post" className="mt-8 max-w-2xl flex flex-col gap-4"> <Input label="Title" name="title" required /> <Input label="Slug (optional)" name="slug" /> <Input label="Excerpt" name="excerpt" /> <Textarea label="Body (HTML)" name="bodyRichText" rows={12} required /> <Input label="Cover image path" name="coverImage" /> <Input label="Author" name="author" defaultValue="Yearwise Services" /> <Select label="Status" name="status" defaultValue="draft"> <option value="draft">Draft</option> <option value="published">Published</option></Select> <Input label="SEO title" name="seoTitle" /> <Input label="SEO description" name="seoDescription" /> <Button type="submit">Create post</Button></Form></div>;
}

export default AdminBlogNew;
export { action$3 as action };
