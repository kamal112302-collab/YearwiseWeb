import { photos, servicePhoto } from "./media";
import type { SnowPricing } from "./content.types";

export var defaultSettings = {
  phone: "(807) 358-2540",
  email: "hello@yearwiseservices.com",
  promoBanner: "NEW CUSTOMER SPECIAL: First lawn cut just $49 (reg. $85) · NOW BOOKING SUMMER 2026 · Year-round bundles save 20%",
  businessHours: "Mon–Sun, 7am–7pm (seasonal)",
  address: "Thunder Bay, ON"
};
export var defaultServices = [{
  id: "seed-lawn",
  slug: "lawn-care",
  name: "Lawn Care",
  shortDescription: "A thick, green, neighbour-jealous lawn without you lifting a finger.",
  description: "Weekly cuts to seasonal treatments. We keep your lawn sharp from the first thaw through fall cleanup — mowing, edging, and treatments handled by one insured crew you already trust for snow and junk.",
  startingPrice: 49,
  heroImage: servicePhoto("lawn-care", "hero").id,
  cardImage: servicePhoto("lawn-care", "card").id,
  sortOrder: 0,
  seoTitle: "Lawn Care Thunder Bay | Yearwise Services",
  seoDescription: "Professional lawn care in Thunder Bay starting at $49 per visit. Weekly mowing, edging, and seasonal treatments from one year-round crew."
}, {
  id: "seed-snow",
  slug: "snow-removal",
  name: "Snow Removal",
  shortDescription: "Season driveway clearing after every 5 cm of snow. No calling after each storm.",
  description: "Once you are on the snow plan, we come out after every snowfall of 5 cm or more. Driveway cleared and de-iced for the season, priced by driveway size.",
  startingPrice: 549,
  heroImage: servicePhoto("snow-removal", "hero").id,
  cardImage: servicePhoto("snow-removal", "card").id,
  sortOrder: 1,
  seoTitle: "Snow Removal Thunder Bay | Yearwise Services",
  seoDescription: "Season snow removal in Thunder Bay after 5 cm+ snowfall. Driveway clearing by driveway size from $549 + tax."
}, {
  id: "seed-junk",
  slug: "junk-removal",
  name: "Junk Removal",
  shortDescription: "You point, we load, we haul, we dump. That simple.",
  description: "Old furniture, appliances, yard waste, construction debris, electronics, mattresses, hot tubs, sheds — if you can point at it, we can haul it. We recycle and donate whenever possible.",
  startingPrice: 99,
  heroImage: servicePhoto("junk-removal", "hero").id,
  cardImage: servicePhoto("junk-removal", "card").id,
  sortOrder: 2,
  seoTitle: "Junk Removal Thunder Bay | Yearwise Services",
  seoDescription: "Same-day junk hauling in Thunder Bay from $99. Furniture, appliances, yard waste, and more — insured crew, fair quotes."
}];

export const defaultSnowPricing: SnowPricing = {
  tiers: [
    { id: "tier-1", label: "1-car driveway", price: 549, sortOrder: 0 },
    { id: "tier-2", label: "2-car driveway", price: 699, sortOrder: 1 },
    { id: "tier-3", label: "3–4 car driveway", price: 899, sortOrder: 2 },
  ],
  addOns: [
    { id: "addon-1", name: "Sidewalk, front entrance, and deck shovelling", price: null, sortOrder: 0 },
    { id: "addon-2", name: "Staircase shovelling", price: null, sortOrder: 1 },
    { id: "addon-3", name: "Salting / ice-melter", price: null, sortOrder: 2 },
  ],
  earlyBird: {
    discount: 100,
    deadline: "",
    active: false,
  },
  commercial: {
    heading: "Commercial Snow Removal & Salting",
    body: "Lots, loading docks, and walkways cleared for businesses across Thunder Bay. Sand mix salting available. Call for a commercial quote.",
    priceNote: "Commercial pricing is quoted per property.",
    image: photos.snowPlow.id,
  },
};
export var defaultFaqs = [{
  id: "faq-1",
  question: "What areas in Thunder Bay do you serve?",
  answer: "We serve all of Thunder Bay and surrounding communities including Northwood, Current River, Westfort, Intercity, McIntyre, Neebing, Kakabeka Falls, and Murillo. Not sure if you're in our service area? Give us a call — we'll let you know right away.",
  sortOrder: 0
}, {
  id: "faq-2",
  question: "Do I have to sign a long-term contract?",
  answer: "No. You can cancel anytime. We earn your business every visit, not with fine print. That said, our year-round customers get priority scheduling and save 20%, so most people stick around.",
  sortOrder: 1
}, {
  id: "faq-3",
  question: "How fast can you start?",
  answer: "Most new customers get their first service within 3–5 days of calling. During peak seasons, spots fill fast, so we recommend booking early. Emergency snow removal and junk hauling can often be done same-day or next-day.",
  sortOrder: 2
}, {
  id: "faq-4",
  question: "How does snow removal work — do I have to call every time?",
  answer: "Nope. Once you're on our snow removal plan, we automatically come out after every significant snowfall (5cm+). You wake up, your driveway is cleared and de-iced. That's it.",
  sortOrder: 3
}, {
  id: "faq-5",
  question: "What can you haul away with junk removal?",
  answer: "Almost anything — old furniture, appliances, yard waste, construction debris, electronics, mattresses, hot tubs, sheds. If you can point at it, we can haul it. The only exceptions are hazardous materials like paint, chemicals, and asbestos. We recycle and donate whenever possible.",
  sortOrder: 4
}, {
  id: "faq-6",
  question: "What does the first lawn cut cost?",
  answer: "The first lawn cut for a new customer is $49. The regular visit price is $85. After that, lawn care starts at $49 per visit, and the quote confirms the property.",
  sortOrder: 5
}];
export var serviceAreas = ["Northwood", "Current River", "Westfort", "Intercity", "McIntyre", "Neebing", "Kakabeka Falls", "Murillo", "Thunder Bay"];

export type Review = {
  name: string;
  neighbourhood: string;
  service: string;
  quote: string;
};

export const reviews: Review[] = [];
export const googleReviewsUrl = "";


