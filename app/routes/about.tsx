import { getSiteSettings } from "../lib/content.server";
import { buildMeta } from "../lib/seo";
import { LinkButton } from "../components/ui/Button";
import { mediaUrl, photos } from "../lib/media";
import { areasSentence } from "../lib/service-pages";
import { serviceAreas } from "../lib/content.data";

async function loader() {
  return {
    settings: await getSiteSettings()
  };
}

function meta() {
  return buildMeta({
    title: "About Yearwise Services — Thunder Bay Property Care",
    description: "Yearwise Services is one insured crew for lawn care, snow removal, and junk hauling across Thunder Bay — built so homeowners stop juggling contractors.",
    path: "/about",
    image: mediaUrl(photos.lawnGolden.id, 1200)
  });
}

function About({ loaderData }: { loaderData: { settings: { phone: string } } }) {
  const { settings } = loaderData;
  const neighbourhoods = serviceAreas.filter((area) => area !== "Thunder Bay");
  return (
    <div className="section-pad">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="display text-4xl sm:text-5xl">One company. One number.</h1>
          <div className="prose-yearwise mt-6 max-w-xl">
            <p>Yearwise Services is one insured crew for lawn care, snow removal, and junk hauling in Thunder Bay. The same phone number works in July and in January.</p>
            <p>Yearwise Services exists because Thunder Bay homeowners were tired of the same cycle: a lawn guy who disappears in October, a plow operator who's impossible to reach at 6 a.m., and no one reliable when junk needs to go.</p>
            <p>We keep your property handled from the first thaw to the last snowfall — mowing, clearing, hauling — with the same insured crew and the same phone number: <strong className="text-brand-ink">{settings.phone}</strong>.</p>
            <p>No long-term contracts required. Year-round customers get priority scheduling and save 20% on bundled services. If you're not happy, we come back and make it right — free.</p>
          </div>
          <LinkButton href="/contact" className="mt-8">Get a free quote</LinkButton>
        </div>
        <img src={mediaUrl(photos.lawnGolden.id, 1200)} alt={photos.lawnGolden.alt} width={1200} height={900} className="aspect-[4/3] w-full rounded-xl object-cover" />
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          { title: "Same crew", body: "Lawn, snow, and junk are the same people, not three contractors who don't talk to each other." },
          { title: "Same number", body: `Call ${settings.phone}. Marcus or Lisa answer quote requests. Most quotes take a few minutes.` },
          { title: "We come back", body: "If the visit is wrong, we make it right. No long-term contract. We earn the next one." },
        ].map((item) => (
          <article key={item.title}>
            <h2 className="text-xl font-semibold text-brand-navy">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="display text-3xl sm:text-4xl">Thunder Bay, and the neighbourhoods around it.</h2>
        <p className="mt-4 text-muted-foreground">{areasSentence()} Not sure you are in range? Call and we will say yes or no on the spot.</p>
        <p className="mt-4 text-sm text-brand-navy">{neighbourhoods.join(" · ")}</p>
      </section>
    </div>
  );
}

export default About;
export { loader, meta };
