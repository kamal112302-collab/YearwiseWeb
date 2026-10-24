import { tryDb } from "../db.server";
import { data } from "react-router";
import { buildMeta } from "../lib/seo";

var fallbackPolicies = {
  privacy: {
    title: "Privacy Policy",
    content: "<p>Yearwise Services collects contact information you submit through our quote form to respond to service requests. We do not sell your data. Call (807) 358-2540 with privacy questions.</p>"
  },
  terms: {
    title: "Terms of Service",
    content: "<p>Services are provided according to quoted scope and schedule. Pricing is per visit unless a written bundle agreement specifies otherwise. Cancel anytime — no long-term contract required.</p>"
  }
};
async function loader$15({
  params
}) {
  const slug = params.slug;
  const client = tryDb();
  if (client) try {
    const page = await client.policyPage.findUnique({
      where: {
        slug
      }
    });
    if (page) return {
      page
    };
  } catch {}
  const fallback = fallbackPolicies[slug];
  if (!fallback) throw data("Not Found", {
    status: 404
  });
  return {
    page: {
      slug,
      title: fallback.title,
      content: fallback.content
    }
  };
}
function meta({
  loaderData
}) {
  const title = loaderData?.page?.title ?? "Policy";
  return buildMeta({
    title: `${title} — Yearwise Services`,
    description: `${title} for Yearwise Services property care in Thunder Bay.`,
    path: `/policies/${loaderData?.page?.slug ?? "privacy"}`
  });
}
function PolicyPage({
  loaderData
}) {
  const {
    page
  } = loaderData;
  return (
    <div className="section-pad">
      <div className="mx-auto max-w-3xl">
        <h1 className="display text-4xl">{page.title}</h1>
        <div className="prose-yearwise mt-8" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  );
}

export default PolicyPage;
export { loader$15 as loader, meta };
