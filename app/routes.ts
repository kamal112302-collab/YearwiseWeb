import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/storefront-layout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("services", "routes/services-index.tsx"),
    route("services/:slug", "routes/service-detail.tsx"),
    route("faq", "routes/faq.tsx"),
    route("contact", "routes/contact.tsx"),
    route("blog", "routes/blog-index.tsx"),
    route("blog/:slug", "routes/blog-post.tsx"),
    route("policies/:slug", "routes/policy-page.tsx"),
  ]),
  route("llms.txt", "routes/llms.ts"),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("robots.txt", "routes/robots.ts"),
  // Chrome/Cursor DevTools probes this; stub it so the terminal stays quiet.
  route("json/version", "routes/json-version.ts"),
  route("admin/login", "routes/admin-login.tsx"),
  route("admin/api/cloudinary-sign", "routes/api-admin-cloudinary-sign.ts"),
  route("admin/api/media-upload", "routes/api-admin-media-upload.ts"),
  layout("routes/admin-layout.tsx", [
    route("admin", "routes/admin-dashboard.tsx"),
    route("admin/services", "routes/admin-services.tsx"),
    route("admin/services/:id/edit", "routes/admin-service-edit.tsx"),
    route("admin/services/:id", "routes/admin-service-view.tsx"),
    route("admin/faqs", "routes/admin-faqs.tsx"),
    route("admin/snow-pricing", "routes/admin-snow-pricing.tsx"),
    route("admin/inquiries", "routes/admin-inquiries.tsx"),
    route("admin/blog", "routes/admin-blog-index.tsx"),
    route("admin/blog/new", "routes/admin-blog-new.tsx"),
    route("admin/blog/:id", "routes/admin-blog-edit.tsx"),
    route("admin/media", "routes/admin-media.tsx"),
    route("admin/settings", "routes/admin-settings.tsx"),
    route("admin/logout", "routes/admin-logout.tsx"),
  ]),
] satisfies RouteConfig;
