import { getFaqs, getSiteSettings } from "../lib/content.server";
import { buildMeta, JsonLd, faqPageJsonLd } from "../lib/seo";
import { LinkButton } from "../components/ui/Button";

async function loader$19({}) {
  const [faqs, settings] = await Promise.all([getFaqs(), getSiteSettings()]);
  return {
    faqs,
    settings
  };
}
function meta$4({}) {
  return buildMeta({
    title: "FAQ — Yearwise Services Thunder Bay",
    description: "Answers about service areas, contracts, snow removal plans, junk hauling, and how fast Yearwise can start in Thunder Bay.",
    path: "/faq"
  });
}
function FaqPage({
  loaderData
}) {
  const {
    faqs,
    settings
  } = loaderData;
  return (
    <div className="section-pad">
      <JsonLd data={faqPageJsonLd(faqs)} />
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">FAQ</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">Questions, <span className="text-brand-green">answered.</span></h1>
        <p className="mt-4 text-muted-foreground">Still stuck? Call <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="cursor-pointer font-semibold text-brand-green">{settings.phone}</a>.</p>
        <div className="mt-10 divide-y divide-brand-green/15 border-y border-brand-green/15">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-brand-ink">{faq.question}<span className="text-brand-green transition-transform group-open:rotate-45">+</span></summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
        <LinkButton href="/contact" className="mt-10 uppercase tracking-[0.14em] text-xs">Request a free quote</LinkButton>
      </div>
    </div>
  );
}

export default FaqPage;
export { loader$19 as loader, meta$4 as meta };
