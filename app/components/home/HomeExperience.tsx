import { ArrowRight, Handshake, Leaf, ShieldCheck, Snowflake, Trash2, Users } from "lucide-react";
import { Link } from "react-router";
import { formatCurrency } from "~/lib/utils";
import type { ServiceRecord } from "~/lib/content.types";
import { useHomeMotion } from "./useHomeMotion";

const quoteClass =
  "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-green px-6 text-sm font-semibold text-white hover:bg-brand-green-deep transition-colors duration-200";

const serviceIcon = {
  "lawn-care": Leaf,
  "snow-removal": Snowflake,
  "junk-removal": Trash2,
} as const;

const missionCardImages: Record<string, string> = {
  "lawn-care": "/images/lawn-care-card.jpg",
  "snow-removal": "/images/snow-removal-card.jpg",
  "junk-removal": "/images/junk-removal-card.jpg",
};

const stats = [
  { value: 520, suffix: "+", label: "Jobs Completed" },
  { value: 120, suffix: "+", label: "Happy Customers" },
  { value: 350, suffix: "+", label: "Properties Served" },
  { value: 100, suffix: "%", label: "Insured & Licensed", highlight: true },
];

const trustLogos = [
  "Thunder Bay Chamber",
  "WSIB Insured",
  "Better Business Bureau",
  "Local First",
  "Lakehead Region",
  "Ontario Licensed",
];

export function HomeExperience({ phone, services, areas }: { phone: string; services: ServiceRecord[]; areas: string[] }) {
  const tel = phone.replace(/[^\d+]/g, "");
  const rootRef = useHomeMotion();
  const bySlug = (slug: string) => services.find((service) => service.slug === slug);
  const lawn = bySlug("lawn-care");
  const snow = bySlug("snow-removal");
  const junk = bySlug("junk-removal");

  return (
    <div ref={rootRef} className="bg-brand-surface">
      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO (FULL VIDEO BANNER)
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center bg-brand-navy overflow-hidden">
        {/* Full background video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/hero-aerial.webp"
            className="absolute inset-0 h-full w-full object-cover object-center"
            data-hero-photo
          >
            <source src="/Website%20Banner%20(landscape)%20(4).mp4" type="video/mp4" />
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Directional scrim: dark on the left for text contrast, fading to transparent on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/55 via-45% to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-black/25 z-10" />

        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
          <div className="max-w-2xl">
            {/* Eyebrow badge */}
            <div data-hero className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-brand-navy/70 backdrop-blur-md px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-mint shadow-sm">
              <Leaf className="size-3 text-brand-green" aria-hidden /> All-Season Property Care · Thunder Bay
            </div>

            {/* Headline — refined, reduced size */}
            <h1 data-hero className="mt-5 font-display text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem] drop-shadow-sm">
              Save Your <span className="text-brand-green">Weekends</span>,
              <br />
              Love Your Yard.
            </h1>

            {/* Subtitle — reduced size */}
            <p data-hero className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-white/80 drop-shadow-sm">
              Thunder Bay's trusted crew for pristine lawn care, winter snow clearing, and stress-free junk hauling. One insured team, transparent rates, year-round peace of mind.
            </p>

            {/* CTA action bar */}
            <div data-hero className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-green px-6 text-sm font-semibold text-white shadow-lg shadow-brand-green/30 hover:bg-brand-green-deep transition-all duration-200 hover:scale-[1.02]"
              >
                Get Free Quote <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href={`tel:${tel}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-5 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-200"
              >
                Call {phone}
              </a>
            </div>

            {/* Social proof & trust */}
            <div data-hero className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-white/15 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-green/90 ring-2 ring-white/30 text-xs font-bold text-white">
                    M
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-mint ring-2 ring-white/30 text-xs font-bold text-brand-navy">
                    L
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-navy ring-2 ring-white/30 text-xs font-bold text-white">
                    K
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/80">
                  Trusted by <strong className="text-white font-semibold">500+</strong> Thunder Bay homeowners
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-mint font-medium sm:border-l sm:border-white/20 sm:pl-6">
                <ShieldCheck className="size-4 text-brand-green" aria-hidden />
                <span>100% Licensed & WSIB Insured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — STATS COUNTER BAR
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 -mt-10 relative z-30 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              data-reveal
              className={`rounded-2xl border px-5 py-5 text-center shadow-sm ${
                stat.highlight
                  ? "stat-highlight"
                  : "border-brand-green/10 bg-white"
              }`}
            >
              <p
                data-counter
                data-target={stat.value}
                data-suffix={stat.suffix}
                className={`text-3xl font-display font-extrabold ${
                  stat.highlight ? "text-white" : "text-brand-navy"
                }`}
              >
                {stat.value}{stat.suffix}
              </p>
              <p className={`mt-1 text-xs ${
                stat.highlight ? "text-white/80" : "text-muted-foreground"
              }`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — MISSION / SERVICES
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:gap-16">
          {/* Left — Mission text */}
          <div data-reveal className="lg:sticky lg:top-32">
            <p className="eyebrow">
              <Leaf className="size-3.5" aria-hidden /> Our Mission
            </p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">
              We're Building
              <br />
              a <span className="text-brand-green">Greener</span>,
              <br />
              Cleaner, Stronger
              <br />
              Thunder Bay.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              From spring cleanups and summer cuts to sub-zero winter snow management and heavy junk removal. One dedicated, insured crew taking pride in every yard and driveway across Thunder Bay.
            </p>
            <div className="mt-4 max-w-md text-sm text-brand-navy/70">{areas.join(" · ")}</div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link to="/services" className={quoteClass}>
                Explore Services <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                to="/about"
                className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-brand-navy hover:text-brand-green transition-colors"
              >
                Learn More <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>

          {/* Right — 3 service image cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIcon[service.slug as keyof typeof serviceIcon] ?? Leaf;
              const cardImg = missionCardImages[service.slug] || service.cardImage || "/images/lawn-care.webp";
              return (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  data-reveal
                  className="mission-card group h-[26rem] cursor-pointer sm:h-[32rem]"
                >
                  <img
                    src={cardImg}
                    alt=""
                    width={480}
                    height={720}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />

                  {/* Icon badge */}
                  <span className="absolute top-5 left-5 inline-flex size-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-brand-green shadow-md">
                    <Icon className="size-5" aria-hidden />
                  </span>

                  {/* Card content at bottom */}
                  <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="block text-lg font-semibold">{service.name}</span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-snug text-white/80">
                      {service.shortDescription}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — TRUST / PARTNER LOGO BAR
          ═══════════════════════════════════════════ */}
      <section className="border-y border-brand-green/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground whitespace-nowrap">
              Trusted By
            </p>
            <div data-reveal className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-10">
              {trustLogos.map((logo) => (
                <span
                  key={logo}
                  className="trust-logo flex items-center gap-1.5 text-sm font-medium text-brand-navy/60 whitespace-nowrap"
                >
                  <span className="text-brand-green/40">✕</span>
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — PACKAGES
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div data-reveal>
          <p className="eyebrow">Packages</p>
          <h2 className="display mt-2 max-w-xl text-3xl sm:text-4xl">
            One job, <span className="text-brand-green">or the whole year.</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">Starting prices. The quote confirms the property. Nothing is billed from this page.</p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <article data-reveal className="flex flex-col rounded-[1.75rem] border border-brand-green/15 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-brand-navy">As you need it</h3>
            <p className="mt-2 text-sm text-muted-foreground">Book a visit when the lawn, the snow, or the pile needs it.</p>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              {[lawn, snow, junk].filter((service): service is ServiceRecord => Boolean(service)).map((service) => (
                <li key={service.slug} className="flex items-center justify-between gap-4 border-b border-brand-green/10 pb-3">
                  <span className="font-medium text-brand-navy">{service.name}</span>
                  <span className="text-brand-navy">From {formatCurrency(service.startingPrice)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-brand-navy">First lawn cut is $49 <span className="text-muted-foreground">(regular $85)</span>.</p>
            <Link to="/contact" className={`${quoteClass} mt-8 self-start`}>
              Get a quote <ArrowRight className="size-4" aria-hidden />
            </Link>
          </article>

          <article data-reveal className="flex flex-col rounded-[1.75rem] border-2 border-brand-green bg-brand-mint p-6 sm:p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">All year</p>
            <h3 className="mt-2 text-2xl font-semibold text-brand-navy">One crew, every season</h3>
            <p className="mt-2 text-sm text-brand-navy/80">Lawn, snow, and junk with the same people. Save 20% and get first pick of the schedule.</p>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-brand-navy">
              <li>20% off year-round</li>
              <li>First pick of the schedule</li>
              <li>Cancel anytime. No long-term contract</li>
            </ul>
            <Link to="/contact" className={`${quoteClass} mt-8 self-start`}>
              Get a quote <ArrowRight className="size-4" aria-hidden />
            </Link>
          </article>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6 — HOW WE WORK
          ═══════════════════════════════════════════ */}
      <section className="bg-brand-mint">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div data-reveal className="max-w-xl">
            <p className="eyebrow">How we work</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">
              From the call <span className="text-brand-green">to the handshake.</span>
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <article data-reveal className="flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-sm lg:col-start-1 lg:row-span-2 lg:row-start-1">
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">01</p>
                <h3 className="mt-2 text-xl font-semibold text-brand-navy">Free quote</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Call Marcus or Lisa, or send the form. Most quotes take a few minutes.
                </p>
              </div>
              <img src="/images/lawn-care.webp" alt="A green residential lawn" width={800} height={600} className="mt-auto aspect-[4/3] w-full object-cover lg:aspect-auto lg:min-h-56 lg:flex-1" />
            </article>
            <article data-reveal className="rounded-[1.5rem] bg-white p-6 shadow-sm lg:col-start-2 lg:row-start-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">02</p>
              <h3 className="mt-2 text-xl font-semibold text-brand-navy">We book the visit</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Most new jobs start within a few days. Snow customers are automatic after 5 cm.
              </p>
            </article>
            <article data-reveal className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm lg:col-start-3 lg:row-start-1">
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">03</p>
                <h3 className="mt-2 text-xl font-semibold text-brand-navy">We do the job</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Lawn, snow, or junk. One insured crew.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 px-6 pb-6">
                <img src="/images/snow-removal.webp" alt="Snowy trees after a winter storm" width={320} height={200} className="h-28 w-full rounded-xl object-cover" />
                <img src="/images/junk-removal.webp" alt="A row of sorting bins" width={320} height={200} className="h-28 w-full rounded-xl object-cover" />
              </div>
            </article>
            <article data-reveal className="rounded-[1.5rem] bg-brand-green p-6 text-white shadow-sm lg:col-span-2 lg:col-start-2 lg:row-start-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">04</p>
              <h3 className="mt-2 text-2xl font-semibold">Handshake</h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/90">
                Not happy? We make it right. No long-term contract. We earn the next visit.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7 — FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div data-reveal className="grid items-center gap-8 rounded-[1.75rem] bg-brand-green px-6 py-10 text-white sm:px-10 lg:grid-cols-[1.2fr_auto] shadow-lg">
          <div>
            <p className="text-sm font-medium text-white/80">Free quote</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Your property, handled.</h2>
            <p className="mt-3 max-w-lg text-sm text-white/85">Call Marcus or Lisa. Most quotes take less than five minutes, and we start most new jobs within a few days.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${tel}`} className="inline-flex min-h-12 cursor-pointer items-center rounded-full bg-white px-6 text-sm font-semibold text-brand-green hover:bg-white/90 transition-colors">
              Call {phone}
            </a>
            <Link to="/contact" className="inline-flex min-h-12 cursor-pointer items-center rounded-full border border-white/70 px-6 text-sm font-semibold hover:bg-white/10 transition-colors">
              Request online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
