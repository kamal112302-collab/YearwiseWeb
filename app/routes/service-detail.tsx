import { ArrowRight, Check, X } from "lucide-react";
import { getServiceBySlug, getServices, getSiteSettings, getSnowPricing } from "../lib/content.server";
import { data, Link } from "react-router";
import { buildMeta, JsonLd, breadcrumbJsonLd, serviceJsonLd, faqPageJsonLd } from "../lib/seo";
import { formatCurrency } from "../lib/utils";
import { LinkButton } from "../components/ui/Button";
import { Breadcrumbs } from "../components/storefront/Breadcrumbs";
import { ServiceCtaBand } from "../components/storefront/ServiceCtaBand";
import { StickyQuoteBar } from "../components/storefront/StickyQuoteBar";
import { mediaUrl, servicePhoto } from "../lib/media";
import { BeforeAfter } from "../components/storefront/BeforeAfter";
import { areasSentence, servicePageCopy, withDiscountCopy } from "../lib/service-pages";
import { discountLabel, serviceAreas } from "../lib/content.data";
import type { ServiceRecord, SiteSettings, SnowPricing } from "../lib/content.types";

async function loader({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) throw data("Not Found", { status: 404 });
  const [settings, snowPricing, allServices] = await Promise.all([
    getSiteSettings(),
    params.slug === "snow-removal" ? getSnowPricing() : Promise.resolve(null),
    getServices(),
  ]);
  const related = allServices.filter((item) => item.slug !== service.slug);
  return { service, settings, snowPricing, related };
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
  loaderData: {
    service: ServiceRecord;
    settings: SiteSettings;
    snowPricing: SnowPricing | null;
    related: ServiceRecord[];
  };
}) {
  const { service, settings, snowPricing, related } = loaderData;
  const tel = settings.phone.replace(/[^\d+]/g, "");
  const discount = discountLabel(settings.yearRoundDiscountPercent);
  const copy = servicePageCopy[service.slug]
    ? withDiscountCopy(servicePageCopy[service.slug], discount)
    : undefined;
  const heroId = service.heroImage;
  const before = service.photos.find((photo) => photo.role === "before");
  const after = service.photos.find((photo) => photo.role === "after");
  const gallery = service.photos.filter((photo) => photo.role === "gallery");
  const used = new Set([heroId, before?.id, after?.id].filter(Boolean));
  const galleryShots = gallery
    .filter((shot) => {
      if (used.has(shot.id)) return false;
      used.add(shot.id);
      return true;
    })
    .slice(0, 6);
  const neighbourhoods = serviceAreas.filter((area) => area !== "Thunder Bay");
  const isSnow = service.slug === "snow-removal" && snowPricing;
  const headlinePrice = isSnow && snowPricing.tiers[0] ? snowPricing.tiers[0].price : service.startingPrice;
  const priceUnit = isSnow ? "/ season" : "/ visit";

  return (
    <div className="pb-24 md:pb-0">
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

      <section
        data-service-hero
        className="relative flex items-end overflow-hidden bg-brand-navy sm:min-h-[78vh]"
      >
        {heroId ? (
          <img
            src={mediaUrl(heroId, 2000)}
            alt=""
            width={2000}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-brand-navy/15" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pb-20 lg:pt-36">
          <Breadcrumbs
            items={[{ name: "Home", to: "/" }, { name: "Services", to: "/services" }, { name: service.name }]}
            className="text-white/75"
          />
          <p className="mt-4 text-sm font-semibold tracking-wide text-brand-mint">Yearwise · Thunder Bay</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {copy?.h1 ?? service.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {copy?.lead ?? service.shortDescription}
          </p>
          <p className="mt-6 font-display text-white">
            <span className="text-sm font-medium text-white/70">Starting at</span>{" "}
            <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">{formatCurrency(headlinePrice)}</span>{" "}
            <span className="text-base text-white/80">
              {priceUnit}
              {isSnow ? " + tax" : ""}
            </span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href={`tel:${tel}`}>Call {settings.phone}</LinkButton>
            <LinkButton href="/contact" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-navy">
              Free quote
            </LinkButton>
          </div>
        </div>
      </section>

      {copy ? (
        <section aria-labelledby="promise-heading" className="border-b border-brand-navy/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
            <p className="text-sm font-semibold text-brand-green-deep">Who this visit is for</p>
            <h2 id="promise-heading" className="display mt-3 max-w-3xl text-2xl sm:text-3xl lg:text-4xl">
              {copy.who}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-navy/75 sm:text-lg">
              Transparent quote. Insured crew. Cancel anytime.
            </p>
          </div>
        </section>
      ) : null}

      {before && after ? (
        <section aria-labelledby="results-heading" className="bg-brand-surface">
          <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
            <h2 id="results-heading" className="display max-w-2xl text-3xl sm:text-4xl">
              See the difference.
            </h2>
            <p className="mt-3 max-w-xl text-base text-brand-navy/75">Drag the slider. Real Thunder Bay property.</p>
          </div>
          <div className="mt-10">
            <BeforeAfter before={{ id: before.id, alt: before.alt }} after={{ id: after.id, alt: after.alt }} tall />
          </div>
        </section>
      ) : null}

      {copy ? (
        <>
          <section aria-labelledby="visit-heading" className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
              <p className="text-sm font-semibold text-brand-green-deep">How a visit works</p>
              <h2 id="visit-heading" className="display mt-3 max-w-3xl text-3xl sm:text-4xl">
                What happens on the day
              </h2>
              <ol className="mt-10 max-w-3xl">
                {copy.steps.map((step, index) => (
                  <li key={step.title} className="relative flex gap-5 border-l border-brand-navy/15 pb-8 pl-8 last:pb-0">
                    <span className="absolute -left-3.5 top-0 flex size-7 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-brand-navy sm:text-2xl">{step.title}</h3>
                      <p className="mt-2 text-base leading-relaxed text-brand-navy/75">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section aria-labelledby="scope-heading" className="bg-brand-surface">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
              <h2 id="scope-heading" className="display max-w-2xl text-3xl sm:text-4xl">
                What&apos;s on the visit — and what isn&apos;t.
              </h2>
              <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <h3 className="text-lg font-semibold text-brand-navy">Included</h3>
                  <ul className="mt-5 flex flex-col gap-3">
                    {copy.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base text-brand-navy/85">
                        <Check className="mt-0.5 size-5 shrink-0 text-brand-green-deep" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-navy">Not included</h3>
                  <ul className="mt-5 flex flex-col gap-3">
                    {copy.excluded.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base text-brand-navy/85">
                        <X className="mt-0.5 size-5 shrink-0 text-brand-navy/40" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-8 text-sm text-brand-navy/65">The quote names what&apos;s on the visit.</p>
              <div className="mt-8 max-w-3xl border-t border-brand-navy/10 pt-8">
                <p className="text-base leading-relaxed text-brand-navy/80 sm:text-lg">{copy.pricing}</p>
                <p className="mt-4 text-base leading-relaxed text-brand-navy/80 sm:text-lg">{copy.booking}</p>
              </div>
            </div>
          </section>

          {isSnow ? (
            <section aria-labelledby="snow-pricing-heading" className="bg-brand-navy text-white">
              <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                <h2 id="snow-pricing-heading" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Season pricing
                </h2>
                <p className="mt-3 max-w-xl text-base text-white/75">
                  Prices are for the season, before tax. The quote confirms the driveway size.
                </p>
                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {snowPricing.tiers.map((tier, index) => {
                    const featured = index === 1 || snowPricing.tiers.length === 1;
                    return (
                      <article
                        key={tier.id}
                        className={
                          featured
                            ? "rounded-2xl bg-brand-mint px-5 py-6 text-brand-navy"
                            : "rounded-2xl border border-white/15 bg-white/5 px-5 py-6"
                        }
                      >
                        <p className={`text-xs font-semibold tracking-wide ${featured ? "text-brand-green-deep" : "text-white/55"}`}>
                          {featured ? "Most driveways" : "Season package"}
                        </p>
                        <h3 className={`mt-3 text-lg font-semibold ${featured ? "text-brand-navy" : "text-white"}`}>{tier.label}</h3>
                        <p
                          className={`mt-6 font-display text-4xl font-extrabold tracking-tight ${featured ? "text-brand-navy" : "text-white"}`}
                        >
                          {formatCurrency(tier.price)}
                          <span className={`ml-2 text-sm font-medium ${featured ? "text-brand-navy/70" : "text-white/65"}`}>+ tax</span>
                        </p>
                      </article>
                    );
                  })}
                </div>
                {snowPricing.earlyBird.active ? (
                  <p className="mt-6 rounded-xl bg-brand-green-deep px-5 py-4 text-sm font-semibold text-white">
                    Book before {snowPricing.earlyBird.deadline}: save {formatCurrency(snowPricing.earlyBird.discount)} on the season
                    package.
                  </p>
                ) : null}
                <h3 className="mt-14 text-xl font-semibold text-white">Add-ons</h3>
                <ul className="mt-4 max-w-2xl divide-y divide-white/15 border-y border-white/15">
                  {snowPricing.addOns.map((addOn) => (
                    <li key={addOn.id} className="flex items-baseline justify-between gap-4 py-4">
                      <span className="text-base text-white/90">{addOn.name}</span>
                      <span className="shrink-0 text-sm text-white/70">
                        {addOn.price == null ? "Ask for pricing" : formatCurrency(addOn.price)}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-10 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-brand-green px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-green-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Book a snow plan <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </section>
          ) : null}

          {galleryShots.length > 0 ? (
            <section aria-labelledby="gallery-heading" className="bg-white">
              <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                <h2 id="gallery-heading" className="display text-3xl sm:text-4xl">
                  From the route.
                </h2>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryShots.map((shot) => (
                    <figure key={shot.id} className="overflow-hidden rounded-2xl">
                      <img
                        src={mediaUrl(shot.id, 1200)}
                        alt={shot.alt}
                        width={1200}
                        height={900}
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {related.length > 0 ? (
            <section aria-labelledby="related-heading" className="bg-brand-surface">
              <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                <h2 id="related-heading" className="display text-3xl sm:text-4xl">
                  Other Yearwise services
                </h2>
                <p className="mt-3 max-w-xl text-base text-brand-navy/75">Same crew. Same phone number.</p>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {related.map((item) => {
                    const photoId = item.cardImage || item.heroImage || servicePhoto(item.slug, "card").id;
                    const relatedIsSnow = item.slug === "snow-removal";
                    return (
                      <Link
                        key={item.slug}
                        to={`/services/${item.slug}`}
                        className="group flex cursor-pointer gap-4 overflow-hidden rounded-2xl bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
                      >
                        <img
                          src={mediaUrl(photoId, 480)}
                          alt={`${item.name} in Thunder Bay`}
                          width={480}
                          height={360}
                          className="h-28 w-28 shrink-0 object-cover sm:h-32 sm:w-36"
                          loading="lazy"
                        />
                        <span className="flex flex-1 flex-col justify-center py-3 pr-4">
                          <span className="font-display text-lg font-extrabold tracking-tight text-brand-navy sm:text-xl">
                            {item.name}
                          </span>
                          <span className="mt-1 text-sm font-semibold text-brand-green-deep">
                            From {formatCurrency(item.startingPrice)}
                            {relatedIsSnow ? " / season + tax" : " / visit"}
                          </span>
                          <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
                            Details{" "}
                            <ArrowRight
                              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                              aria-hidden
                            />
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}

          <section aria-labelledby="areas-heading" className="border-y border-brand-navy/10 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
              <h2 id="areas-heading" className="display text-3xl sm:text-4xl">
                Where we work
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-navy/75 sm:text-lg">{areasSentence()}</p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {neighbourhoods.map((area) => (
                  <li
                    key={area}
                    className="rounded-full border border-brand-navy/15 bg-brand-surface px-4 py-2 text-sm font-medium text-brand-navy"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="faq-heading" className="bg-brand-surface">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
              <h2 id="faq-heading" className="display text-3xl sm:text-4xl">
                Questions
              </h2>
              <div className="mt-8 max-w-3xl divide-y divide-brand-navy/10 border-y border-brand-navy/10">
                {copy.faqs.map((faq) => (
                  <details key={faq.question} className="group py-5">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-brand-ink sm:text-xl">
                      <h3 className="text-left text-lg font-semibold sm:text-xl">{faq.question}</h3>
                      <span className="shrink-0 text-brand-green-deep transition-transform duration-200 group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">{faq.answer}</p>
                  </details>
                ))}
              </div>
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
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
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
                alt="Commercial snow clearing equipment"
                width={1200}
                height={900}
                className="h-[22rem] w-full rounded-2xl object-cover sm:h-[28rem]"
                loading="lazy"
              />
            ) : null}
          </div>
        </section>
      ) : null}

      <ServiceCtaBand phone={settings.phone} tel={tel} />
      <StickyQuoteBar phone={settings.phone} tel={tel} />
    </div>
  );
}

export default ServiceDetail;
export { loader, meta };
