import { getSiteSettings, getServices } from "../lib/content.server";
import { buildMeta, getCanonicalUrl, JsonLd, localBusinessJsonLd } from "../lib/seo";
import { Fragment } from "react";
import { HomeExperience } from "../components/home/HomeExperience";
import { serviceAreas } from "../lib/content.data";

async function loader$23({}) {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);
  return {
    settings,
    services
  };
}
function meta$8({
  loaderData
}) {
  loaderData?.settings;
  return buildMeta({
    title: "Yearwise Services — One Crew for Every Season | Thunder Bay",
    description: "Lawn care, snow removal, and junk hauling in Thunder Bay. One company, one number, 365 days a year. Licensed and insured. Call for a free quote.",
    path: "/",
    image: getCanonicalUrl("/images/hero-aerial.webp")
  });
}
function Home({
  loaderData
}) {
  const {
    settings,
    services
  } = loaderData;
  return <Fragment> <JsonLd data={localBusinessJsonLd(settings)} /> <HomeExperience phone={settings.phone} services={services} areas={serviceAreas} /></Fragment>;
}

export default Home;
export { loader$23 as loader, meta$8 as meta };
