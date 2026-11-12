import { getSiteSettings } from "../lib/content.server";
import { discountLabel } from "../lib/content.data";
import { getAppUrl } from "../lib/seo";

async function loader() {
  const APP_URL = getAppUrl();
  const settings = await getSiteSettings();
  const discount = discountLabel(settings.yearRoundDiscountPercent);
  const body = `# Yearwise Services

> One insured crew for lawn care, snow removal, and junk hauling in Thunder Bay, Ontario — 365 days a year.

## Contact
- Phone: ${settings.phone}
- Email: ${settings.email}
- Hours: ${settings.businessHours}
- Quote form: ${APP_URL}/contact
- Service area: Thunder Bay and Northwood, Current River, Westfort, Intercity, McIntyre, Neebing, Kakabeka Falls, Murillo, Shuniah

## Services (starting prices, CAD)
- Lawn care: from $49 per visit — mowing, edging, and seasonal treatments from the first thaw through fall cleanup. First cut for a new customer is $49 (regular $85). ${APP_URL}/services/lawn-care
- Snow removal: season packages from $549 + tax by driveway size. Automatic after 5 cm or more. Commercial snow removal and salting available. ${APP_URL}/services/snow-removal
- Junk removal: from $99 per visit. Furniture, appliances, yard waste, construction debris, electronics, mattresses, hot tubs, sheds. Not hauled: paint, chemicals, asbestos. ${APP_URL}/services/junk-removal
- Year-round bundle: save ${discount}, priority scheduling, cancel anytime

## Policies
- No long-term contract required
- Licensed and insured
- Quote confirms the property before anything is billed
- If a visit is wrong, the crew comes back and makes it right

## Guides
- When lawn season starts: ${APP_URL}/blog/when-thunder-bay-lawn-season-starts
- How the 5 cm snow plan works: ${APP_URL}/blog/how-automatic-snow-removal-works-thunder-bay
- What junk is refused: ${APP_URL}/blog/what-we-can-haul-junk-removal-thunder-bay
- When to book snow removal: ${APP_URL}/blog/when-to-book-snow-removal-thunder-bay
- How junk removal is priced: ${APP_URL}/blog/how-junk-removal-is-priced-thunder-bay

## Key pages
- Home: ${APP_URL}/
- Services: ${APP_URL}/services
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
