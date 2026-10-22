import { db } from "../db.server";
import { Link } from "react-router";

async function loader$8({}) {
  const [newInquiries, totalInquiries, services, posts] = await Promise.all([db.inquiry.count({
    where: {
      status: "new"
    }
  }), db.inquiry.count(), db.service.count(), db.blogPost.count({
    where: {
      status: "published"
    }
  })]);
  return {
    newInquiries,
    totalInquiries,
    services,
    posts
  };
}
function AdminDashboard({
  loaderData
}) {
  const stats = [{
    label: "New inquiries",
    value: loaderData.newInquiries,
    href: "/admin/inquiries"
  }, {
    label: "Total inquiries",
    value: loaderData.totalInquiries,
    href: "/admin/inquiries"
  }, {
    label: "Services",
    value: loaderData.services,
    href: "/admin/services"
  }, {
    label: "Published posts",
    value: loaderData.posts,
    href: "/admin/blog"
  }];
  return <div> <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1> <p className="mt-1 text-sm text-muted-foreground">Property care leads and content at a glance.</p> <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(stat => <Link key={stat.label} to={stat.href} className="rounded-2xl border border-border bg-white p-6 shadow-sm cursor-pointer hover:border-brand-green"> <p className="text-3xl font-bold text-brand-green">{stat.value}</p> <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p></Link>)}</div></div>;
}

export default AdminDashboard;
export { loader$8 as loader };
