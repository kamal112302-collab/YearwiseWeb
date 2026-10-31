import { getServiceBySlug, getSiteSettings, getSnowPricing } from "../lib/content.server";
import { data } from "react-router";
import { buildMeta, JsonLd, breadcrumbJsonLd, serviceJsonLd, faqPageJsonLd } from "../lib/seo";
import { formatCurrency } from "../lib/utils";
import { LinkButton } from "../components/ui/Button";
import { Breadcrumbs } from "../components/storefront/Breadcrumbs";
import { mediaUrl } from "../lib/media";
import { BeforeAfter } from "../components/storefront/BeforeAfter";
import { areasSentence, servicePageCopy } from "../lib/service-pages";
import { serviceAreas } from "../lib/content.data";
import type { ServiceRecord, SiteSettings, SnowPricing } from "../lib/content.types";

async function loader({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) throw data("Not Found", { status: 404 });
  const [settings, snowPricing] = await Promise.all([
    getSiteSettings(),
    params.slug === "snow-removal" ? getSnowPricing() : Promise.resolve(null),
  ]);
  return { service, settings, snowPricing };
}

function meta({ loaderData }: { loaderData?: { service: ServiceRecord } }) {
  if (!loaderData?.service) return [{ title: "Service — Yearwise Services" }];
  const service = loaderData.service;
  const imageId = service.heroImage;
  return buildMeta({
    title: service.seoTitle ?? `${service.name} in Thunder Bay — Yearwise Services`,
    description: service.seoDescription ?? service.shortDescription ?? service.description.slice(0, 160),
    path: `/services/${service.slug}`,
    image: imageId ? mediaUrl(imageId, 1200) : undefined,
  });
}

function ServiceDetail({
  loaderData,
}: {
  loaderData: { service: ServiceRecord; settings: SiteSettings; snowPricing: SnowPricing | null };
}) {
  const { service, settings, snowPricing } = loaderData;
  const tel = settings.phone.replace(/[^\d+]/g, "");
  const copy = servicePageCopy[service.slug];
  const heroId = service.heroImage;
  const heroAlt = service.name;
  const before = service.photos.find((photo) => photo.role === "before");
  const after = service.photos.find((photo) => photo.role === "after");
  const gallery = service.photos.filter((photo) => photo.role === "gallery");
  const used = new Set([heroId, before?.id, after?.id].filter(Boolean));
  const galleryShots = gallery.filter((shot) => {
    if (used.has(shot.id)) return false;
    used.add(shot.id);
    return true;
  });
  const neighbourhoods = serviceAreas.filter((area) => area !== "Thunder Bay");
  const isSnow = service.slug === "snow-removal" && snowPricing;
  const headlinePrice = isSnow && snowPricing.tiers[0] ? snowPricing.tiers[0].price : service.startingPrice;
  const priceUnit = isSnow ? "/ season" : "/ visit";

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          description: copy?.lead ?? service.description,
          slug: service.slug,
          price: headlinePrice,
          priceUnit: isSnow ? "per season + tax" : "per visit",
        })}
      />
      {copy ? <JsonLd data={faqPageJsonLd(copy.faqs)} /> : null}

      <section className="relative flex min-h-[calc(100dvh-7rem)] items-end bg-brand-navy">
        {heroId ? (
          <img
            src={mediaUrl(heroId, 2000)}
            alt={heroAlt}
            width={2000}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/92 via-brand-navy/55 to-brand-navy/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ name: "Home", to: "/" }, { name: "Services", to: "/services" }, { name: service.name }]}
            className="text-white/80"
          />
          <h1 className="max-w-4xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {copy?.h1 ?? service.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{copy?.lead ?? service.shortDescription}</p>
          <p className="mt-6 text-lg text-white">
            Starting at <span className="text-4xl font-extrabold">{formatCurrency(headlinePrice)}</span> {priceUnit}
            {isSnow ? <span className="ml-2 text-base text-white/75">+ tax</span> : null}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={`tel:${tel}`}>Call {settings.phone}</LinkButton>
            <LinkButton href="/contact" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-navy">
              Free quote
            </LinkButton>
          </div>
        </div>
      </section>

      {before && after ? (
        <div className="bg-white pt-16 lg:pt-24">
          <BeforeAfter before={{ id: before.id, alt: before.alt }} after={{ id: after.id, alt: after.alt }} tall />
        </div>
      ) : null}

      {copy ? (
        <>
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <h2 className="display max-w-3xl text-3xl sm:text-5xl">{copy.who}</h2>
            <ol className="mt-12 max-w-3xl divide-y divide-brand-navy/10 border-y border-brand-navy/10">
              {copy.steps.map((step, index) => (
                <li key={step.title} className="py-8">
                  <h3 className="text-2xl font-semibold text-brand-navy">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-brand-navy/80">{step.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12 grid max-w-3xl gap-10">
              <div>
                <h2 className="text-2xl font-semibold text-brand-navy">Included</h2>
                <ul className="mt-4 flex flex-col gap-3 text-lg text-brand-navy/80">
                  {copy.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-brand-navy">Not included</h2>
                <ul className="mt-4 flex flex-col gap-3 text-lg text-brand-navy/80">
                  {copy.excluded.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-lg leading-relaxed text-brand-navy/80">{copy.pricing}</p>
              <p className="text-lg leading-relaxed text-brand-navy/80">{copy.booking}</p>
            </div>

            {isSnow ? (
              <div className="mt-16 max-w-3xl">
                <h2 className="text-3xl font-semibold text-brand-navy sm:text-4xl">Season pricing</h2>
                <p className="mt-3 text-base text-brand-navy/80">
                  Prices are for the season, before tax. The quote confirms the driveway size before anything is billed.
                </p>
                <ul className="mt-8 divide-y divide-brand-navy/10 border-y border-brand-navy/10">
                  {snowPricing.tiers.map((tier) => (
                    <li key={tier.id} className="flex items-baseline justify-between gap-4 py-5">
                      <span className="text-lg font-medium text-brand-navy">{tier.label}</span>
                      <span className="text-lg text-brand-navy">
                        {formatCurrency(tier.price)}
                        <span className="text-sm text-brand-navy/70"> + tax</span>
                      </span>
                    </li>
                  ))}
                </ul>
                {snowPricing.earlyBird.active ? (
                  <p className="mt-6 text-base font-medium text-brand-navy">
                    Book before {snowPricing.earlyBird.deadline}: save {formatCurrency(snowPricing.earlyBird.discount)} on the season package.
                  </p>
                ) : null}
                <h3 className="mt-12 text-2xl font-semibold text-brand-navy">Add-ons</h3>
                <ul className="mt-4 divide-y divide-brand-navy/10 border-y border-brand-navy/10">
                  {snowPricing.addOns.map((addOn) => (
                    <li key={addOn.id} className="flex items-baseline justify-between gap-4 py-4">
                      <span className="text-base text-brand-navy">{addOn.name}</span>
                      <span className="text-base text-brand-navy/80">
                        {addOn.price == null ? "Ask for pricing" : formatCurrency(addOn.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          {galleryShots.map((shot) => (
            <img
              key={shot.id}
              src={mediaUrl(shot.id, 2000)}
              alt={shot.alt}
              width={2000}
              height={1200}
              className="h-[70vh] min-h-[24rem] w-full object-cover"
              loading="lazy"
            />
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
                    <span className="text-brand-green-deep transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="section-pad">
          <div className="prose-yearwise max-w-3xl">
            <p>{service.description}</p>
          </div>
        </div>
      )}

      {isSnow ? (
        <section className="border-t border-brand-navy/10 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
                {snowPricing.commercial.heading}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-brand-navy/80">{snowPricing.commercial.body}</p>
              <p className="mt-4 text-base text-brand-navy">{snowPricing.commercial.priceNote}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href={`tel:${tel}`}>Call {settings.phone}</LinkButton>
                <LinkButton href="/contact" variant="outline">
                  Request a commercial quote
                </LinkButton>
              </div>
            </div>
            {snowPricing.commercial.image ? (
              <img
                src={mediaUrl(snowPricing.commercial.image, 1200)}
                alt=""
                width={1200}
                height={900}
                className="h-[22rem] w-full rounded-xl object-cover sm:h-[28rem]"
                loading="lazy"
              />
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="bg-brand-mint">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-24">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              Get a quote for this visit.
            </h2>
            <p className="mt-3 max-w-xl text-lg text-brand-navy/80">Call {settings.phone}. Most quotes take a few minutes.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={`tel:${tel}`}>Call {settings.phone}</LinkButton>
            <LinkButton href="/contact" variant="outline">
              Request online
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceDetail;
export { loader, meta };
