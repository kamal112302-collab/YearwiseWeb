import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { defaultFaqs, googleReviewsUrl, reviews } from "~/lib/content.data";
import { comparisons, mediaUrl, photos, servicePhoto } from "~/lib/media";
import { BeforeAfter } from "~/components/storefront/BeforeAfter";
import { servicePageCopy } from "~/lib/service-pages";
import { formatCurrency } from "~/lib/utils";
import type { ServiceRecord } from "~/lib/content.types";
import { useHomeMotion } from "./useHomeMotion";

const quoteClass =
  "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-green px-6 text-sm font-semibold text-white hover:bg-brand-green-deep transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2";

const proof = ["Insured crew", "Quote before work", "Cancel anytime", "Thunder Bay only"];

const steps = [
  { title: "Free quote", body: "Call Marcus or Lisa, or send the form. Most quotes take a few minutes." },
  { title: "We book the visit", body: "Most new jobs start within a few days. Snow customers are automatic after 5 cm." },
  { title: "We do the job", body: "Lawn, snow, or junk. One insured crew." },
  { title: "Handshake", body: "Not happy? We make it right. No long-term contract. We earn the next visit." },
];

const homeFaqs = ["faq-1", "faq-4", "faq-5"]
  .map((id) => defaultFaqs.find((faq) => faq.id === id))
  .filter((faq): faq is (typeof defaultFaqs)[number] => Boolean(faq));

export function HomeExperience({ phone, services, areas }: { phone: string; services: ServiceRecord[]; areas: string[] }) {
  const tel = phone.replace(/[^\d+]/g, "");
  const rootRef = useHomeMotion();
  const bySlug = (slug: string) => services.find((service) => service.slug === slug);
  const lawn = bySlug("lawn-care");
  const snow = bySlug("snow-removal");
  const junk = bySlug("junk-removal");
  const priced = [lawn, snow, junk].filter((service): service is ServiceRecord => Boolean(service));

  return (
    <div ref={rootRef} className="bg-brand-surface">
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-brand-navy">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={mediaUrl(photos.lawnStriped.id, 1600)}
            className="absolute inset-0 h-full w-full object-cover object-center"
            data-hero-photo
          >
            <source src="/Website%20Banner%20(landscape)%20(4).mp4" type="video/mp4" />
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-brand-navy/95 via-brand-navy/55 via-45% to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-navy/80 via-transparent to-black/25" />

        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 sm:pb-28 sm:pt-36 lg:px-8 lg:pb-32 lg:pt-40">
          <div className="max-w-2xl">
            <p data-hero className="text-sm text-white/80">All-season property care in Thunder Bay</p>

            <h1 data-hero className="mt-4 font-display text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Save Your Weekends,
              <br />
              Love Your Yard.
            </h1>

            <p data-hero className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
              Thunder Bay's trusted crew for pristine lawn care, winter snow clearing, and stress-free junk hauling. One insured team, transparent rates, year-round peace of mind.
            </p>

            <div data-hero className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-green px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-green-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Get Free Quote <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a href={`tel:${tel}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10">
                Call {phone}
              </a>
            </div>

            <p data-hero className="mt-8 border-t border-white/15 pt-5 text-sm text-white/80">
              One number for lawn, snow, and junk. Licensed and insured.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:gap-16">
          <div data-reveal className="lg:sticky lg:top-32">
            <h2 className="display text-4xl sm:text-5xl">
              We're Building a Greener, Cleaner, Stronger Thunder Bay.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              From spring cleanups and summer cuts to sub-zero winter snow management and heavy junk removal. One dedicated, insured crew taking pride in every yard and driveway across Thunder Bay.
            </p>
            <div className="mt-4 max-w-md text-sm text-brand-navy/70">{areas.join(" · ")}</div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link to="/services" className={quoteClass}>
                Explore Services <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link to="/about" className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-brand-navy transition-colors hover:text-brand-green-deep">
                Learn More <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {services.map((service) => {
              const card = servicePhoto(service.slug, "card");
              return (
                <Link key={service.slug} to={`/services/${service.slug}`} data-reveal className="mission-card group h-[26rem] cursor-pointer sm:h-[32rem]">
                  <img src={mediaUrl(card.id, 800)} alt={card.alt} width={800} height={1067} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="block text-lg font-semibold group-hover:text-white">{service.name}</span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-snug text-white/80">{service.shortDescription}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="mt-16">
          <BeforeAfter before={comparisons["lawn-care"].before} after={comparisons["lawn-care"].after} />
        </div>
      </section>

      <section className="border-y border-brand-green/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-brand-navy">{proof.join(" · ")}</p>
          <p className="mt-2 text-sm text-brand-navy/80">Fall cleanup is open, and a snow plan can be booked before the first storm.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="display max-w-xl text-3xl sm:text-4xl">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 max-w-xl text-base text-brand-navy/80">
            Google reviews are being added. Call <a href={`tel:${tel}`} className="font-semibold text-brand-green-deep hover:underline">{phone}</a> and ask about a property near you.
          </p>
        ) : (
          <ul className="mt-8 flex max-w-3xl flex-col gap-8">
            {reviews.map((review) => (
              <li key={`${review.name}-${review.service}`}>
                <p className="text-base text-brand-navy">{review.quote}</p>
                <p className="mt-2 text-sm text-brand-navy/70">{review.name}, {review.neighbourhood}. {review.service}.</p>
              </li>
            ))}
          </ul>
        )}
        {googleReviewsUrl ? (
          <a href={googleReviewsUrl} className="mt-4 inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-brand-green-deep hover:underline">Google reviews</a>
        ) : reviews.length > 0 ? (
          <a href={`tel:${tel}`} className="mt-4 inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-brand-green-deep hover:underline">Call {phone}</a>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="display max-w-xl text-3xl sm:text-4xl">The visit, spelled out.</h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          {services.map((service) => {
            const copy = servicePageCopy[service.slug];
            if (!copy) return null;
            return (
              <article key={service.slug}>
                <h3 className="text-xl font-semibold text-brand-navy">{service.name}</h3>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-brand-navy/80">
                  {copy.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link to={`/services/${service.slug}`} className="mt-5 inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-brand-green-deep hover:underline">
                  Service details <ArrowRight className="ml-1 size-4" aria-hidden />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <h2 className="display max-w-xl text-3xl sm:text-4xl">One job, or the whole year.</h2>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">Starting prices. The quote confirms the property. Nothing is billed from this page.</p>
        <div className="mt-8 grid gap-12 border-t border-brand-navy/10 pt-8 lg:grid-cols-2">
          <article>
            <h3 className="text-2xl font-semibold text-brand-navy">As you need it</h3>
            <p className="mt-2 text-sm text-muted-foreground">Book a visit when the lawn, the snow, or the pile needs it.</p>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              {priced.map((service) => (
                <li key={service.slug} className="flex items-center justify-between gap-4 border-b border-brand-navy/10 pb-3">
                  <span className="font-medium text-brand-navy">{service.name}</span>
                  <span className="text-brand-navy">From {formatCurrency(service.startingPrice)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-brand-navy">First lawn cut is $49 <span className="text-muted-foreground">(regular $85)</span>.</p>
            <Link to="/contact" className={`${quoteClass} mt-8`}>
              Get a quote <ArrowRight className="size-4" aria-hidden />
            </Link>
          </article>

          <article>
            <h3 className="text-2xl font-semibold text-brand-navy">One crew, every season</h3>
            <p className="mt-2 text-sm text-brand-navy/80">Lawn, snow, and junk with the same people. Save 20% and get first pick of the schedule.</p>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-brand-navy">
              <li>20% off year-round</li>
              <li>First pick of the schedule</li>
              <li>Cancel anytime. No long-term contract</li>
            </ul>
            <Link to="/contact" className={`${quoteClass} mt-8`}>
              Get a quote <ArrowRight className="size-4" aria-hidden />
            </Link>
          </article>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h2 className="display max-w-xl text-3xl sm:text-4xl">From the call to the handshake.</h2>
          <ol className="mt-8 max-w-2xl divide-y divide-brand-navy/10 border-y border-brand-navy/10">
            {steps.map((step, index) => (
              <li key={step.title} className="py-5">
                <h3 className="text-lg font-semibold text-brand-navy">{index + 1}. {step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="display max-w-xl text-3xl sm:text-4xl">A few answers before you call.</h2>
        <div className="mt-8 divide-y divide-brand-navy/10 border-y border-brand-navy/10">
          {homeFaqs.map((faq) => (
            <details key={faq.id} className="group py-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-brand-ink">
                {faq.question}
                <span className="text-brand-green-deep transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
        <Link to="/faq" className="mt-6 inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-brand-green-deep hover:underline">
          All questions <ArrowRight className="ml-1 size-4" aria-hidden />
        </Link>
      </section>

      <section className="bg-brand-mint">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_auto] lg:px-8 lg:py-24">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">Your property, handled.</h2>
            <p className="mt-3 max-w-lg text-sm text-brand-navy/80">Call Marcus or Lisa. Most quotes take less than five minutes, and we start most new jobs within a few days.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${tel}`} className={quoteClass}>
              Call {phone}
            </a>
            <Link to="/contact" className="inline-flex min-h-12 cursor-pointer items-center rounded-full border border-brand-navy/30 px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-white/60">
              Request online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
