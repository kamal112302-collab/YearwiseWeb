import { getSiteSettings, getServices, getSnowPricing } from "../lib/content.server";
import { buildMeta, JsonLd, localBusinessJsonLd } from "../lib/seo";
import { Fragment } from "react";
import { HomeExperience } from "../components/home/HomeExperience";
import { serviceAreas } from "../lib/content.data";
import { mediaUrl, photos } from "../lib/media";

async function loader$23({}) {
  const [settings, services, snowPricing] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getSnowPricing(),
  ]);
  return {
    settings,
    services,
    snowPricing,
  };
}
function meta$8({
  loaderData
}) {
  loaderData?.settings;
  return buildMeta({
    title: "Lawn Care & Property Services in Thunder Bay | Yearwise",
    description:
      "Yearwise lawn care, snow removal, and junk hauling in Thunder Bay. Plans from $140/mo. One insured crew, one number, free quote. Licensed and insured.",
    path: "/",
    image: mediaUrl(photos.lawnStriped.id, 1200),
    imageAlt: "Yearwise Services lawn care crew striping a Thunder Bay lawn",
  });
}
function Home({
  loaderData
}) {
  const {
    settings,
    services,
    snowPricing
  } = loaderData;
  return (
    <Fragment>
      <JsonLd data={localBusinessJsonLd(settings)} />
      <HomeExperience
        phone={settings.phone}
        services={services}
        areas={serviceAreas}
        snowPricing={snowPricing}
        yearRoundDiscountPercent={settings.yearRoundDiscountPercent}
      />
    </Fragment>
  );
}

export default Home;
export { loader$23 as loader, meta$8 as meta };
