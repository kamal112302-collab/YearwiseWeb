import { getServiceBySlug, getSiteSettings } from "../lib/content.server";
import { data } from "react-router";
import { buildMeta, JsonLd, breadcrumbJsonLd, serviceJsonLd, faqPageJsonLd } from "../lib/seo";
import { formatCurrency } from "../lib/utils";
import { LinkButton } from "../components/ui/Button";
import { Breadcrumbs } from "../components/storefront/Breadcrumbs";
import { mediaUrl, serviceComparison, serviceMedia, servicePhoto } from "../lib/media";
import { BeforeAfter } from "../components/storefront/BeforeAfter";
import { areasSentence, servicePageCopy } from "../lib/service-pages";
import { serviceAreas } from "../lib/content.data";
import type { ServiceRecord, SiteSettings } from "../lib/content.types";

async function loader({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) throw data("Not Found", { status: 404 });
  return {
    service,
    settings: await getSiteSettings()
  };
}

function meta({ loaderData }: { loaderData?: { service: ServiceRecord } }) {
  if (!loaderData?.service) return [{ title: "Service — Yearwise Services" }];
  const service = loaderData.service;
  const photo = servicePhoto(service.slug, "hero");
  return buildMeta({
    title: service.seoTitle ?? `${service.name} in Thunder Bay — Yearwise Services`,
    description: service.seoDescription ?? service.shortDescription ?? service.description.slice(0, 160),
    path: `/services/${service.slug}`,
    image: mediaUrl(photo.id, 1200)
  });
}

function ServiceDetail({ loaderData }: { loaderData: { service: ServiceRecord; settings: SiteSettings } }) {
  const { service, settings } = loaderData;
  const tel = settings.phone.replace(/[^\d+]/g, "");
  const copy = servicePageCopy[service.slug];
  const photo = servicePhoto(service.slug, "hero");
  const comparison = serviceComparison(service.slug);
  const media = serviceMedia[service.slug as keyof typeof serviceMedia];
  const used = new Set([photo.id, comparison.before.id, comparison.after.id]);
  const gallery = media
    ? [media.card, ...media.gallery].filter((shot) => {
        if (used.has(shot.id)) return false;
        used.add(shot.id);
        return true;
      })
    : [];
  const neighbourhoods = serviceAreas.filter((area) => area !== "Thunder Bay");

  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.name, path: `/services/${service.slug}` }])} />
      <JsonLd data={serviceJsonLd({ name: service.name, description: copy?.lead ?? service.description, slug: service.slug, price: service.startingPrice })} />
      {copy ? <JsonLd data={faqPageJsonLd(copy.faqs)} /> : null}

      <section className="relative flex min-h-[calc(100dvh-7rem)] items-end bg-brand-navy">
        <img src={mediaUrl(photo.id, 2000)} alt={photo.alt} width={2000} height={1200} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/92 via-brand-navy/55 to-brand-navy/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Home", to: "/" }, { name: "Services", to: "/services" }, { name: service.name }]} className="text-white/80" />
          <h1 className="max-w-4xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">{copy?.h1 ?? service.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{copy?.lead ?? service.shortDescription}</p>
          <p className="mt-6 text-lg text-white">Starting at <span className="text-4xl font-extrabold">{formatCurrency(service.startingPrice)}</span> / visit</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={`tel:${tel}`}>Call {settings.phone}</LinkButton>
            <LinkButton href="/contact" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-navy">Free quote</LinkButton>
          </div>
        </div>
      </section>

      <div className="bg-white pt-16 lg:pt-24">
        <BeforeAfter before={comparison.before} after={comparison.after} tall />
      </div>

      {copy ? (
        <>
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <h2 className="display max-w-3xl text-3xl sm:text-5xl">{copy.who}</h2>
            <ol className="mt-12 max-w-3xl divide-y divide-brand-navy/10 border-y border-brand-navy/10">
              {copy.steps.map((step, index) => (
                <li key={step.title} className="py-8">
                  <h3 className="text-2xl font-semibold text-brand-navy">{index + 1}. {step.title}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-brand-navy/80">{step.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12 grid max-w-3xl gap-10">
              <div>
                <h2 className="text-2xl font-semibold text-brand-navy">Included</h2>
                <ul className="mt-4 flex flex-col gap-3 text-lg text-brand-navy/80">
                  {copy.included.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-brand-navy">Not included</h2>
                <ul className="mt-4 flex flex-col gap-3 text-lg text-brand-navy/80">
                  {copy.excluded.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <p className="text-lg leading-relaxed text-brand-navy/80">{copy.pricing}</p>
              <p className="text-lg leading-relaxed text-brand-navy/80">{copy.booking}</p>
            </div>
          </section>

          {gallery.map((shot) => (
            <img key={shot.id} src={mediaUrl(shot.id, 2000)} alt={shot.alt} width={2000} height={1200} className="h-[70vh] min-h-[24rem] w-full object-cover" loading="lazy" />
          ))}

          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <h2 className="text-3xl font-semibold text-brand-navy sm:text-4xl">Neighbourhoods</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">{areasSentence()}</p>
            <p className="mt-4 text-lg text-brand-navy">{neighbourhoods.join(" · ")}</p>
            <h2 className="mt-16 text-3xl font-semibold text-brand-navy">Questions</h2>
            <div className="mt-4 max-w-3xl divide-y divide-brand-navy/10 border-y border-brand-navy/10">
              {copy.faqs.map((faq) => (
                <details key={faq.question} className="group py-6">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-xl font-semibold text-brand-ink">
                    {faq.question}
                    <span className="text-brand-green-deep transition-transform group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="section-pad"><div className="prose-yearwise max-w-3xl"><p>{service.description}</p></div></div>
      )}

      <section className="bg-brand-mint">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-24">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">Get a quote for this visit.</h2>
            <p className="mt-3 max-w-xl text-lg text-brand-navy/80">Call {settings.phone}. Most quotes take a few minutes.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={`tel:${tel}`}>Call {settings.phone}</LinkButton>
            <LinkButton href="/contact" variant="outline">Request online</LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceDetail;
export { loader, meta };
