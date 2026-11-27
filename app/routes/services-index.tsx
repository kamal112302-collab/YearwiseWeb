import { getLawnPricing, getServices, getSiteSettings, getSnowPricing } from "../lib/content.server";
import { buildMeta, JsonLd, servicesCatalogJsonLd } from "../lib/seo";
import { formatCurrency } from "../lib/utils";
import {
  fenceStainComparison,
  lawnFallCleanupClip,
  lawnQuotePhoto,
  lawnSectionMedia,
  mediaSrcSet,
  mediaUrl,
  photos,
  servicePhoto,
  videoUrl,
} from "../lib/media";
import { servicePageCopy } from "../lib/service-pages";
import { ImageBlock } from "../components/storefront/ImageBlock";
import { SectionHeader } from "../components/storefront/SectionHeader";
import { ServiceCard } from "../components/storefront/ServiceCard";
import { ServiceCtaBand } from "../components/storefront/ServiceCtaBand";
import { ServiceGallery } from "../components/storefront/ServiceGallery";
import { TurfProgramCard } from "../components/storefront/TurfProgramCard";
import { LinkButton } from "../components/ui/Button";
import type { LawnPricing, ServiceRecord, SiteSettings, SnowPricing } from "../lib/content.types";

async function loader() {
  const [services, settings, snowPricing, lawnPricing] = await Promise.all([
    getServices(),
    getSiteSettings(),
    getSnowPricing(),
    getLawnPricing(),
  ]);
  return { services, settings, snowPricing, lawnPricing };
}

function meta() {
  return buildMeta({
    title: "Lawn Care, Snow & Junk Removal in Thunder Bay | Yearwise",
    description:
      "Thunder Bay lawn care from $140/mo, snow season packages from $549 + tax, and junk hauling from $99. One insured Yearwise crew — cleanups, turf programs, and yard extras.",
    path: "/services",
    image: mediaUrl(servicePhoto("lawn-care").id, 1200),
    imageAlt: "Yearwise lawn care in Thunder Bay",
  });
}

function ServicesIndex({
  loaderData,
}: {
  loaderData: {
    services: ServiceRecord[];
    settings: SiteSettings;
    snowPricing: SnowPricing;
    lawnPricing: LawnPricing;
  };
}) {
  const { services, settings, snowPricing, lawnPricing } = loaderData;
  const tel = settings.phone.replace(/[^\d+]/g, "");
  const snowFrom = snowPricing.tiers[0]?.price;
  const cleanups = lawnPricing.quoteServices.filter((item) => item.category === "cleanup");
  const fenceStaining = lawnPricing.quoteServices.find((item) => item.name === "Fence staining / painting");
  const yardExtras = lawnPricing.quoteServices.filter(
    (item) => item.category === "other" && item.name !== "Fence staining / painting",
  );
  const turfFrom = lawnPricing.turfPrograms[0]?.price;

  return (
    <div className="bg-brand-surface">
      <JsonLd data={servicesCatalogJsonLd()} />
      <section aria-labelledby="services-heading" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(231,243,220,0.9),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(2,173,65,0.07),transparent_45%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-14">
          <SectionHeader
            id="services-heading"
            as="h1"
            eyebrow="Thunder Bay"
            title="Services"
            description="Lawn care, snow removal, and junk hauling — plus cleanups, turf programs, and yard extras."
            actions={
              <>
                <LinkButton href="/contact" variant="primary" size="lg">
                  Get a Free Quote
                </LinkButton>
                <LinkButton href={`tel:${tel}`} variant="secondary" size="lg">
                  Call Now
                </LinkButton>
              </>
            }
          />

          <ul className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {services.map((service, index) => {
              const photo = servicePhoto(service.slug, "card");
              // Prefer catalog card art for lawn (services-page redesign); others keep CMS overrides.
              const photoId =
                service.slug === "lawn-care"
                  ? photo.id
                  : service.cardImage || service.heroImage || photo.id;
              const copy = servicePageCopy[service.slug];
              const isSnow = service.slug === "snow-removal";
              const isLawn = service.slug === "lawn-care";
              const fromPrice = isSnow && snowFrom != null ? snowFrom : isLawn ? 140 : service.startingPrice;

              return (
                <li key={service.slug}>
                  <ServiceCard
                    name={service.name}
                    slug={service.slug}
                    description={copy?.lead ?? service.shortDescription}
                    included={copy?.included}
                    fromPrice={fromPrice}
                    priceSuffix={isSnow ? " / season + tax" : isLawn ? " / mo" : " / visit"}
                    photoId={photoId}
                    photoAlt={photo.alt || `${service.name} in Thunder Bay`}
                    priority={index === 0}
                  />
                </li>
              );
            })}
          </ul>

          <p className="mt-8 text-sm text-brand-navy/60">
            Insured crew · Quote before work · Cancel anytime
          </p>
        </div>
      </section>

      <section aria-labelledby="also-heading" className="border-t border-brand-navy/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeader
            id="also-heading"
            as="h2"
            title="Also available"
            description="Cleanups, turf programs, and yard extras — quoted per property."
            actions={
              <>
                <LinkButton href="/contact" variant="primary" size="md">
                  Get a Free Quote
                </LinkButton>
                <LinkButton href={`tel:${tel}`} variant="secondary" size="md">
                  Call Now
                </LinkButton>
              </>
            }
          />

          {cleanups.length > 0 ? (
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-brand-navy">Spring &amp; fall cleanups</h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {cleanups.map((item) => {
                  const shot = lawnQuotePhoto(item.name);
                  const useFallClip = item.name === "Fall cleanup";
                  const isSpring = item.name === "Spring cleanup";
                  return (
                    <li key={item.id}>
                      <ImageBlock
                        title={item.name}
                        description={item.description}
                        photo={useFallClip ? null : shot}
                        hoverPhoto={isSpring ? photos.springCleanupHover : null}
                        video={
                          useFallClip
                            ? {
                                id: lawnFallCleanupClip.id,
                                poster: lawnFallCleanupClip.poster,
                                src: videoUrl(lawnFallCleanupClip.id, 960),
                              }
                            : null
                        }
                        primaryHref="/contact"
                        primaryLabel="Get a Free Quote"
                        primaryVariant="secondary"
                        secondaryHref="/services/lawn-care"
                        secondaryLabel="View Details"
                        secondaryVariant="link"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {fenceStaining ? (
            <div className="mt-12">
              <ServiceGallery
                title={fenceStaining.name}
                description={fenceStaining.description}
                quoteHref="/contact"
                detailsHref="/services/lawn-care"
                items={[
                  {
                    photo: fenceStainComparison.before,
                    hoverPhoto: fenceStainComparison.after,
                    featured: true,
                  },
                  { photo: photos.fenceStainDetail },
                  { photo: photos.fenceStainDeck },
                ]}
              />
            </div>
          ) : null}

          {yardExtras.length > 0 ? (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-brand-navy">Yard extras</h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {yardExtras.map((item) => {
                  const shot = lawnQuotePhoto(item.name);
                  const hoverPhoto =
                    item.name === "Gutter cleanup" ? photos.gutterCleanupHover : null;
                  return (
                    <li key={item.id}>
                      <ImageBlock
                        title={item.name}
                        description={item.description}
                        photo={shot}
                        hoverPhoto={hoverPhoto}
                        aspectClass="aspect-[4/3]"
                        primaryHref="/contact"
                        primaryLabel="Get a Free Quote"
                        primaryVariant="secondary"
                        secondaryHref={`tel:${tel}`}
                        secondaryLabel="Call Now"
                        secondaryVariant="link"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {lawnPricing.turfPrograms.length > 0 ? (
            <div className="mt-12 border-t border-brand-navy/10 pt-12">
              <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                <div>
                  <h3 className="display text-3xl sm:text-4xl">Turf care programs</h3>
                  <p className="mt-3 max-w-xl text-base text-brand-navy/75">
                    Aeration, fertilizer, and overseeding stacked for the season. Pick the program that
                    matches the lawn — from {formatCurrency(turfFrom ?? 180)}.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <LinkButton href="/contact" variant="primary" size="md">
                      Get a Free Quote
                    </LinkButton>
                    <LinkButton href="/services/lawn-care" variant="secondary" size="md">
                      View Lawn Care
                    </LinkButton>
                  </div>
                </div>
                <figure className="overflow-hidden rounded-2xl">
                  <img
                    src={mediaUrl(lawnSectionMedia.turf.id, 1200)}
                    srcSet={mediaSrcSet(lawnSectionMedia.turf.id, [640, 960, 1200])}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    alt={lawnSectionMedia.turf.alt}
                    width={1200}
                    height={900}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </figure>
              </div>

              <ul className="mt-10 grid gap-4 lg:grid-cols-3">
                {lawnPricing.turfPrograms.map((program, index) => {
                  const featured = index === 1 || lawnPricing.turfPrograms.length === 1;
                  return (
                    <li key={program.id}>
                      <TurfProgramCard
                        name={program.name}
                        price={program.price}
                        features={program.features}
                        featured={featured}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {snowPricing.addOns.length > 0 ? (
            <div className="mt-12 border-t border-brand-navy/10 pt-12">
              <SectionHeader
                as="h3"
                title="Snow add-ons"
                description="Quoted with the driveway — sidewalks, stairs, and salting."
                actions={
                  <>
                    <LinkButton href="/contact" variant="primary" size="md">
                      Get a Free Quote
                    </LinkButton>
                    <LinkButton href="/services/snow-removal" variant="secondary" size="md">
                      View Snow Removal
                    </LinkButton>
                  </>
                }
              />
              <ul className="mt-6 divide-y divide-brand-navy/10 border-y border-brand-navy/10">
                {snowPricing.addOns.map((addon) => (
                  <li
                    key={addon.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-brand-navy">{addon.name}</p>
                      <p className="mt-0.5 text-sm text-brand-navy/60">
                        {addon.price != null ? formatCurrency(addon.price) : "Ask for pricing"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <LinkButton href="/contact" variant="secondary" size="sm">
                        Get a Free Quote
                      </LinkButton>
                      <LinkButton href={`tel:${tel}`} variant="link" size="sm">
                        Call Now
                      </LinkButton>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <ServiceCtaBand
        phone={settings.phone}
        tel={tel}
        title="Ready for a quote?"
        body={`Call ${settings.phone}. Most quotes take a few minutes.`}
      />
    </div>
  );
}

export default ServicesIndex;
export { loader, meta };
