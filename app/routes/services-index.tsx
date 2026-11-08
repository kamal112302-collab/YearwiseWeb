import { ArrowRight, BadgeCheck, CalendarOff, ClipboardCheck, MapPin } from "lucide-react";
import { Link } from "react-router";
import { getServices, getSiteSettings, getSnowPricing } from "../lib/content.server";
import { discountLabel, serviceAreas } from "../lib/content.data";
import { buildMeta } from "../lib/seo";
import { formatCurrency } from "../lib/utils";
import { mediaUrl, photos, servicePhoto } from "../lib/media";
import { servicePageCopy } from "../lib/service-pages";
import { ServiceCtaBand } from "../components/storefront/ServiceCtaBand";
import type { ServiceRecord, SiteSettings, SnowPricing } from "../lib/content.types";

async function loader() {
  const [services, settings, snowPricing] = await Promise.all([
    getServices(),
    getSiteSettings(),
    getSnowPricing(),
  ]);
  return { services, settings, snowPricing };
}

function meta() {
  return buildMeta({
    title: "Lawn Care, Snow Removal & Junk Hauling — Yearwise Services",
    description:
      "Three property services, one Thunder Bay crew. Lawn care from $49 a visit, snow season packages from $549 + tax, junk hauling from $99.",
    path: "/services",
    image: mediaUrl(servicePhoto("lawn-care").id, 1200),
  });
}

const bookingSteps = [
  { title: "Call or send the form", body: "Marcus or Lisa take the quote. Most take a few minutes." },
  { title: "The quote names the property", body: "Nothing is billed from this page. You know the number before work starts." },
  { title: "We book the visit", body: "Most new jobs start within a few days. Snow plan customers are automatic after 5 cm." },
] as const;

function ServicesIndex({
  loaderData,
}: {
  loaderData: { services: ServiceRecord[]; settings: SiteSettings; snowPricing: SnowPricing };
}) {
  const { services, settings, snowPricing } = loaderData;
  const discount = discountLabel(settings.yearRoundDiscountPercent);
  const tel = settings.phone.replace(/[^\d+]/g, "");
  const neighbourhoods = serviceAreas.filter((area) => area !== "Thunder Bay");
  const snowFrom = snowPricing.tiers[0]?.price;
  const proof = [
    { icon: BadgeCheck, label: "Insured crew" },
    { icon: ClipboardCheck, label: "Quote before work" },
    { icon: CalendarOff, label: "Cancel anytime" },
    { icon: MapPin, label: `Thunder Bay + ${neighbourhoods.length} area towns` },
  ] as const;

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <img
          src={mediaUrl(photos.lawnStriped.id, 2000)}
          alt=""
          width={2000}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/88 to-brand-navy/50" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8 lg:pb-20 lg:pt-32">
          <p className="text-sm font-semibold tracking-wide text-brand-mint">Yearwise Services · Thunder Bay</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Lawn, snow, and junk — one crew.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Pick a single visit or bundle the year and save {discount}. The quote confirms the property.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-brand-green px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-green-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Get a free quote <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href={`tel:${tel}`}
              className="inline-flex min-h-12 cursor-pointer items-center rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              Call {settings.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-navy/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-3 sm:px-6 lg:px-8">
          {proof.map(({ icon: Icon, label }) => (
            <p key={label} className="flex items-center gap-2 text-sm font-medium text-brand-navy">
              <Icon className="size-4 shrink-0 text-brand-green-deep" aria-hidden />
              {label}
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="services-list-heading" className="bg-brand-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h2 id="services-list-heading" className="display max-w-2xl text-3xl sm:text-4xl">
            Choose the visit you need.
          </h2>
          <p className="mt-3 max-w-xl text-base text-brand-navy/75">
            Three services. Same insured people. Same phone number all year.
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {services.map((service) => {
              const photoId = service.cardImage || service.heroImage || servicePhoto(service.slug, "card").id;
              const copy = servicePageCopy[service.slug];
              const isSnow = service.slug === "snow-removal";
              const fromPrice = isSnow && snowFrom != null ? snowFrom : service.startingPrice;
              return (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="group relative flex min-h-[28rem] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 sm:min-h-[32rem]"
                >
                  <img
                    src={mediaUrl(photoId, 960)}
                    alt={`${service.name} in Thunder Bay`}
                    width={960}
                    height={1200}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/55 to-brand-navy/10" />
                  <span className="relative z-10 flex flex-col gap-3 p-6 text-white sm:p-7">
                    <span className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{service.name}</span>
                    <span className="line-clamp-3 text-sm leading-relaxed text-white/80">
                      {copy?.lead ?? service.shortDescription}
                    </span>
                    {copy ? (
                      <span className="flex flex-col gap-1 text-sm text-white/75">
                        {copy.included.slice(0, 3).map((item) => (
                          <span key={item}>· {item}</span>
                        ))}
                      </span>
                    ) : null}
                    <span className="mt-2 flex items-center justify-between gap-3 border-t border-white/20 pt-4 transition-colors duration-200">
                      <span className="text-sm font-semibold text-brand-mint">
                        From {formatCurrency(fromPrice)}
                        {isSnow ? " / season + tax" : " / visit"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-white">
                        Details{" "}
                        <ArrowRight
                          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                          aria-hidden
                        />
                      </span>
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="booking-heading" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h2 id="booking-heading" className="display max-w-2xl text-3xl sm:text-4xl">
            How booking works
          </h2>
          <ol className="mt-10 max-w-2xl">
            {bookingSteps.map((step, index) => (
              <li key={step.title} className="relative border-l border-brand-navy/15 pb-8 pl-8 last:pb-0">
                <span className="absolute -left-3.5 top-0 flex size-7 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-brand-navy">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-brand-navy/75">{step.body}</p>
              </li>
            ))}
          </ol>
          <Link
            to="/contact"
            className="mt-8 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-brand-green px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-green-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
          >
            Get a free quote <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section aria-labelledby="why-heading" className="bg-brand-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <h2 id="why-heading" className="display max-w-xl text-3xl sm:text-4xl">
              Why one crew.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-navy/80 sm:text-lg">
              Same people in July and January. One number for lawn, snow, and junk — not three contractors who never talk.
            </p>
          </div>
          <ul className="flex flex-col gap-4 text-base text-brand-navy">
            <li className="border-b border-brand-navy/10 pb-4">First pick of the schedule as a year-round customer</li>
            <li className="border-b border-brand-navy/10 pb-4">Save {discount} when you bundle the year</li>
            <li className="pb-1">Cancel anytime. No long-term contract</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="areas-heading" className="border-y border-brand-navy/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 id="areas-heading" className="display text-3xl sm:text-4xl">
            Where we work
          </h2>
          <p className="mt-3 max-w-2xl text-base text-brand-navy/75">
            Thunder Bay and surrounding towns. Not sure if your street is on the route?
          </p>
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
          <a
            href={`tel:${tel}`}
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-brand-green-deep hover:underline"
          >
            Call {settings.phone} — we&apos;ll tell you right away
          </a>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_auto] lg:items-center lg:px-8 lg:py-20">
          <div>
            <h2 className="display max-w-xl text-3xl sm:text-4xl">One crew, every season.</h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-navy/80">
              Bundle lawn, snow, and junk. Save {discount}, get first pick of the schedule, and cancel anytime.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex min-h-12 w-fit cursor-pointer items-center gap-2 rounded-full bg-brand-green px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-green-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
          >
            Ask about a year-round plan <ArrowRight className="size-4" aria-hidden />
          </Link>
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
