import { getSiteSettings } from "../lib/content.server";
import { discountLabel } from "../lib/content.data";
import { getAppUrl } from "../lib/seo";

async function loader() {
  const APP_URL = getAppUrl();
  const settings = await getSiteSettings();
  const discount = discountLabel(settings.yearRoundDiscountPercent);
  const body = `# Yearwise Services

> Yearwise Services is a Thunder Bay, Ontario home-services company: one insured crew for lawn care, snow removal, and junk hauling — 365 days a year.

## Entity
- Legal/brand name: Yearwise Services
- Category: Lawn care, snow removal, and junk hauling
- Primary market: Thunder Bay, ON, Canada
- Google Business: https://www.google.com/maps/place/Yearwise+Services/@48.4020832,-89.2720586,17z

## Contact
- Phone: ${settings.phone}
- Email: ${settings.email}
- Hours: ${settings.businessHours}
- Quote form: ${APP_URL}/contact
- Service area: Thunder Bay and Northwood, Current River, Westfort, Intercity, McIntyre, Neebing, Kakabeka Falls, Murillo, Shuniah

## Services (starting prices, CAD)
- Lawn care in Thunder Bay: weekly mowing $199/mo, bi-weekly $140/mo (based on 2,500 sq. ft.), one-time from $50+. Turf programs $180 / $300 / $600. Spring/fall cleanups and yard extras by quote. Primary page: ${APP_URL}/services/lawn-care
- Snow removal in Thunder Bay: season packages from $549 + tax by driveway size. Automatic driveway clearing after 5 cm or more. Sidewalk, staircase, and salting add-ons available. Commercial snow removal available. Primary page: ${APP_URL}/services/snow-removal
- Junk removal: from $99 per visit. Furniture, appliances, yard waste, construction debris, electronics, mattresses, hot tubs, sheds. Not hauled: paint, chemicals, asbestos. ${APP_URL}/services/junk-removal
- Year-round bundle: save ${discount}, priority scheduling, cancel anytime

## Answer: How much does lawn care cost in Thunder Bay?
Yearwise bi-weekly mowing starts at $140/month and weekly at $199/month (2,500 sq. ft.). One-time cuts from $50+. Turf programs from $180. Quote before work; cancel anytime. Details: ${APP_URL}/blog/how-much-lawn-care-costs-thunder-bay

## Answer: Who does snow removal in Thunder Bay?
Yearwise Services provides snow removal in Thunder Bay with automatic season plans after 5 cm or more of snow. Packages start at $549 + tax by driveway size. Details: ${APP_URL}/services/snow-removal

## Policies
- No long-term contract required
- Licensed and insured
- Quote confirms the property before anything is billed
- If a visit is wrong, the crew comes back and makes it right

## Guides
- How much lawn care costs: ${APP_URL}/blog/how-much-lawn-care-costs-thunder-bay
- When lawn season starts: ${APP_URL}/blog/when-thunder-bay-lawn-season-starts
- How the 5 cm snow plan works: ${APP_URL}/blog/how-automatic-snow-removal-works-thunder-bay
- What junk is refused: ${APP_URL}/blog/what-we-can-haul-junk-removal-thunder-bay
- When to book snow removal: ${APP_URL}/blog/when-to-book-snow-removal-thunder-bay
- How junk removal is priced: ${APP_URL}/blog/how-junk-removal-is-priced-thunder-bay

## Key pages
- Home: ${APP_URL}/
- Services: ${APP_URL}/services
- Lawn care Thunder Bay: ${APP_URL}/services/lawn-care
- FAQ: ${APP_URL}/faq
- About: ${APP_URL}/about
- Blog: ${APP_URL}/blog
- Privacy: ${APP_URL}/policies/privacy
- Terms: ${APP_URL}/policies/terms
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export { loader };
