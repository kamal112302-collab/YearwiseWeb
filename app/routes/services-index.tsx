import { getServices } from "../lib/content.server";
import { buildMeta } from "../lib/seo";
import { Link } from "react-router";
import { formatCurrency } from "../lib/utils";
import { mediaUrl, servicePhoto } from "../lib/media";
import { servicePageCopy } from "../lib/service-pages";
import type { ServiceRecord } from "../lib/content.types";

async function loader() {
  return {
    services: await getServices(),
  };
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

function ServicesIndex({ loaderData }: { loaderData: { services: ServiceRecord[] } }) {
  const { services } = loaderData;
  return (
    <div className="section-pad">
      <h1 className="display max-w-3xl text-4xl sm:text-5xl">Lawn care, snow removal, and junk hauling in Thunder Bay.</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        One insured crew for all three. Pick a single visit or bundle the year and save 20%. Every price on this site is a starting point. The quote confirms the property.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {services.map((service) => {
          const photoId = service.cardImage || service.heroImage || servicePhoto(service.slug, "card").id;
          const copy = servicePageCopy[service.slug];
          const isSnow = service.slug === "snow-removal";
          return (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            >
              <img
                src={mediaUrl(photoId, 960)}
                alt=""
                width={960}
                height={720}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <h2 className="mt-4 text-2xl font-semibold text-brand-navy group-hover:text-brand-green-deep">{service.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{copy?.lead ?? service.shortDescription}</p>
              {copy ? (
                <ul className="mt-3 flex flex-col gap-1 text-sm text-brand-navy/80">
                  {copy.included.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-3 text-sm font-semibold text-brand-green-deep">
                From {formatCurrency(service.startingPrice)}
                {isSnow ? " / season + tax" : " / visit"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ServicesIndex;
export { loader, meta };
