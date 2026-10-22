import { getServices } from "../lib/content.server";
import { buildMeta } from "../lib/seo";
import { Link } from "react-router";
import { formatCurrency } from "../lib/utils";

async function loader$21({}) {
  return {
    services: await getServices()
  };
}
function meta$6({}) {
  return buildMeta({
    title: "Lawn Care, Snow Removal & Junk Hauling — Yearwise Services",
    description: "Three property services, one Thunder Bay crew. Lawn care from $49, snow removal from $59, junk hauling from $99 per visit.",
    path: "/services"
  });
}
function ServicesIndex({
  loaderData
}) {
  const {
    services
  } = loaderData;
  return (
    <div className="section-pad">
      <p className="eyebrow">Services</p>
      <h1 className="display mt-3 max-w-3xl text-4xl sm:text-5xl">Lawns, snow, <span className="text-brand-green">and the junk.</span></h1>
      <p className="mt-4 max-w-xl text-muted-foreground">Pick one job or bundle all three. Every visit is quoted up front — a real conversation, then a crew that shows up.</p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {services.map((service) => (
          <Link key={service.slug} to={`/services/${service.slug}`} className="group cursor-pointer">
            <img src={service.cardImage ?? "/images/lawn-care.webp"} alt="" width={640} height={420} className="aspect-[4/3] w-full rounded-[1.5rem] object-cover" />
            <h2 className="mt-4 text-2xl font-semibold text-brand-navy">{service.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{service.shortDescription}</p>
            <p className="mt-3 text-sm font-semibold text-brand-green">From {formatCurrency(service.startingPrice)} / visit</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ServicesIndex;
export { loader$21 as loader, meta$6 as meta };
