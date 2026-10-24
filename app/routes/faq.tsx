import { getFaqs, getSiteSettings } from "../lib/content.server";
import { buildMeta, JsonLd, faqPageJsonLd } from "../lib/seo";
import { LinkButton } from "../components/ui/Button";
import type { SiteSettings } from "../lib/content.types";

type Faq = { id: string; question: string; answer: string; sortOrder: number };

const groupOrder = ["Getting started", "Snow", "Junk", "Pricing"] as const;

function groupFor(question: string) {
  if (/snow/i.test(question)) return "Snow";
  if (/haul|junk|paint/i.test(question)) return "Junk";
  if (/contract|cost|price|\$49|bundle/i.test(question)) return "Pricing";
  return "Getting started";
}

async function loader() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSiteSettings()]);
  return { faqs, settings };
}

function meta() {
  return buildMeta({
    title: "FAQ — Yearwise Services Thunder Bay",
    description: "Answers about service areas, contracts, snow removal plans, junk hauling, and how fast Yearwise can start in Thunder Bay.",
    path: "/faq"
  });
}

function FaqPage({ loaderData }: { loaderData: { faqs: Faq[]; settings: SiteSettings } }) {
  const { faqs, settings } = loaderData;
  const grouped = groupOrder.map((title) => ({
    title,
    items: faqs.filter((faq) => groupFor(faq.question) === title)
  })).filter((group) => group.items.length > 0);

  return (
    <div className="section-pad">
      <JsonLd data={faqPageJsonLd(faqs)} />
      <div className="mx-auto max-w-3xl">
        <h1 className="display text-4xl sm:text-5xl">Questions about Thunder Bay property care.</h1>
        <p className="mt-4 text-muted-foreground">Yearwise is one insured crew for lawn care, snow removal, and junk hauling. Still stuck? Call <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="cursor-pointer font-semibold text-brand-green-deep hover:underline">{settings.phone}</a>.</p>
        <div className="mt-12 flex flex-col gap-12">
          {grouped.map((group) => (
            <section key={group.title}>
              <h2 className="text-2xl font-semibold text-brand-navy">{group.title}</h2>
              <div className="mt-4 divide-y divide-brand-green/15 border-y border-brand-green/15">
                {group.items.map((faq) => (
                  <details key={faq.id} className="group py-5">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-brand-ink">
                      {faq.question}
                      <span className="text-brand-green-deep transition-transform group-open:rotate-45" aria-hidden>+</span>
                    </summary>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
        <LinkButton href="/contact" className="mt-10">Request a free quote</LinkButton>
      </div>
    </div>
  );
}

export default FaqPage;
export { loader, meta };
