import { getServiceBySlug, getSiteSettings } from "../lib/content.server";
import { data } from "react-router";
import { buildMeta, JsonLd, breadcrumbJsonLd, serviceJsonLd } from "../lib/seo";
import { formatCurrency } from "../lib/utils";
import { LinkButton } from "../components/ui/Button";

async function loader$20({
  params
}) {
  const service = await getServiceBySlug(params.slug);
  if (!service) throw data("Not Found", {
    status: 404
  });
  return {
    service,
    settings: await getSiteSettings()
  };
}
function meta$5({
  loaderData
}) {
  if (!loaderData?.service) return [{
    title: "Service — Yearwise Services"
  }];
  const s = loaderData.service;
  return buildMeta({
    title: s.seoTitle ?? `${s.name} — Yearwise Services`,
    description: s.seoDescription ?? s.shortDescription ?? s.description.slice(0, 160),
    path: `/services/${s.slug}`,
    image: s.heroImage ?? void 0
  });
}
function ServiceDetail({
  loaderData
}) {
  const {
    service,
    settings
  } = loaderData;
  const tel = settings.phone.replace(/[^\d+]/g, "");
  return (
    <div className="section-pad">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.name, path: `/services/${service.slug}` }])} />
      <JsonLd data={serviceJsonLd({ name: service.name, description: service.description, slug: service.slug, price: service.startingPrice })} />
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Service</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">{service.name}</h1>
          <p className="mt-4 max-w-md text-muted-foreground">{service.shortDescription}</p>
          <p className="mt-6 text-sm uppercase tracking-[0.14em]">Starting at <span className="text-3xl font-extrabold normal-case tracking-normal text-brand-green">{formatCurrency(service.startingPrice)}</span> / visit</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={`tel:${tel}`} className="uppercase tracking-[0.14em] text-xs">Call {settings.phone}</LinkButton>
            <LinkButton href="/contact" variant="outline" className="uppercase tracking-[0.14em] text-xs">Free quote</LinkButton>
          </div>
          <div className="prose-yearwise mt-8 max-w-xl">
            <p>{service.description}</p>
            <p>We quote up front, show up on schedule, and leave the property clean. Bundle the other seasons for 20% off year-round care.</p>
          </div>
        </div>
        <img src={service.heroImage ?? "/images/lawn-care.webp"} alt="" width={900} height={700} className="aspect-[4/3] w-full rounded-[1.75rem] object-cover" />
      </div>
    </div>
  );
}

export default ServiceDetail;
export { loader$20 as loader, meta$5 as meta };
