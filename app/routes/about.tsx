import { getSiteSettings } from "../lib/content.server";
import { buildMeta } from "../lib/seo";
import { LinkButton } from "../components/ui/Button";

async function loader$22({}) {
  return {
    settings: await getSiteSettings()
  };
}
function meta$7({}) {
  return buildMeta({
    title: "About Yearwise Services — Thunder Bay Property Care",
    description: "Yearwise Services is one insured crew for lawn care, snow removal, and junk hauling across Thunder Bay — built so homeowners stop juggling contractors.",
    path: "/about"
  });
}
function About({
  loaderData
}) {
  const {
    settings
  } = loaderData;
  return (
    <div className="section-pad">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">About us</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">One company. <span className="text-brand-green">One number.</span></h1>
          <div className="prose-yearwise mt-6 max-w-xl">
            <p>Yearwise Services exists because Thunder Bay homeowners were tired of the same cycle: a lawn guy who disappears in October, a plow operator who's impossible to reach at 6 a.m., and no one reliable when junk needs to go.</p>
            <p>We keep your property handled from the first thaw to the last snowfall — mowing, clearing, hauling — with the same insured crew and the same phone number: <strong className="text-brand-ink">{settings.phone}</strong>.</p>
            <p>No long-term contracts required. Year-round customers get priority scheduling and save 20% on bundled services. If you're not happy, we come back and make it right — free.</p>
          </div>
          <LinkButton href="/contact" className="mt-8 uppercase tracking-[0.14em] text-xs">Get a free quote</LinkButton>
        </div>
        <img src="/images/lawn-care.webp" alt="Close view of a freshly cut lawn" width={900} height={700} className="aspect-[4/3] w-full rounded-[1.75rem] object-cover" />
      </div>
    </div>
  );
}

export default About;
export { loader$22 as loader, meta$7 as meta };
