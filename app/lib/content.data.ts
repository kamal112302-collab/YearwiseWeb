import { photos, servicePhoto } from "./media";
import type { LawnPricing, SnowPricing } from "./content.types";

export var defaultSettings = {
  phone: "(807) 358-2540",
  email: "info@yearwiseservices.com",
  promoBanner: "LAWN PLANS FROM $140/MO · One-time cuts from $50+ · NOW BOOKING SUMMER 2026 · Year-round bundles save 10%",
  businessHours: "Mon–Sun, 7am–7pm (seasonal)",
  address: "Thunder Bay, ON",
  yearRoundDiscountPercent: 10,
};

export function parseDiscountPercent(value: unknown): number {
  const raw = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(raw)) return defaultSettings.yearRoundDiscountPercent;
  return Math.min(100, Math.max(0, Math.round(raw)));
}

/** Safe for client and server — formats e.g. 10 → "10%". */
export function discountLabel(percent: number): string {
  return `${parseDiscountPercent(percent)}%`;
}
export var defaultServices = [{
  id: "seed-lawn",
  slug: "lawn-care",
  name: "Lawn Care",
  shortDescription: "Weekly or bi-weekly mowing, turf programs, and seasonal cleanups — one insured Thunder Bay crew.",
  description: "Mowing plans from $140/month (based on 2,500 sq. ft.), one-time cuts from $50+, and turf care programs with aeration, fertilization, and overseeding. Spring and fall cleanups and yard extras quoted per property.",
  startingPrice: 50,
  heroImage: servicePhoto("lawn-care", "hero").id,
  cardImage: servicePhoto("lawn-care", "card").id,
  sortOrder: 0,
  seoTitle: "Lawn Care Thunder Bay — From $140/mo | Yearwise",
  seoDescription:
    "Yearwise lawn care in Thunder Bay: bi-weekly from $140/mo, weekly $199/mo (2,500 sq. ft.), one-time cuts from $50+. Insured local crew. Free quote.",
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
  seoTitle: "Snow Removal Thunder Bay — From $549/season | Yearwise",
  seoDescription:
    "Yearwise snow removal in Thunder Bay: automatic driveway clearing after 5 cm+ snow. Season packages from $549 + tax. Free quote.",
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

const mowingIncludes = [
  "Lawn mowing",
  "Trimming",
  "Blower cleanup",
  "Mulched clippings",
];

export const defaultLawnPricing: LawnPricing = {
  plans: [
    {
      id: "lawn-plan-weekly",
      label: "Weekly",
      price: 199,
      cadence: "weekly",
      basisNote: "Based on 2,500 sq. ft.",
      includes: mowingIncludes,
      sortOrder: 0,
    },
    {
      id: "lawn-plan-biweekly",
      label: "Bi-weekly",
      price: 140,
      cadence: "biweekly",
      basisNote: "Based on 2,500 sq. ft.",
      includes: mowingIncludes,
      sortOrder: 1,
    },
    {
      id: "lawn-plan-onetime",
      label: "One-time",
      price: 50,
      cadence: "onetime",
      basisNote: "Call or text for a quote · from $50+",
      includes: mowingIncludes,
      sortOrder: 2,
    },
  ],
  turfPrograms: [
    {
      id: "turf-1",
      name: "Program 1",
      price: 180,
      features: ["Core aeration", "Spring fertilization", "Fall fertilization"],
      sortOrder: 0,
    },
    {
      id: "turf-2",
      name: "Program 2",
      price: 300,
      features: [
        "Core aeration",
        "Spring fertilization",
        "Spring overseeding",
        "Summer fertilization",
        "Fall fertilization",
      ],
      sortOrder: 1,
    },
    {
      id: "turf-3",
      name: "Program 3",
      price: 600,
      features: [
        "Spring dethatching",
        "Spring aeration",
        "Spring fertilization",
        "Spring overseeding",
        "Summer fertilization",
        "Fall aeration",
        "Fall fertilization",
      ],
      sortOrder: 2,
    },
  ],
  quoteServices: [
    {
      id: "lawn-quote-spring",
      name: "Spring cleanup",
      category: "cleanup",
      description: "Raking, flower bed clean-ups, pruning, and debris removal to open the season.",
      sortOrder: 0,
    },
    {
      id: "lawn-quote-fall",
      name: "Fall cleanup",
      category: "cleanup",
      description: "Leaf cleanups, raking, debris removal, and yard waste haul-away.",
      sortOrder: 1,
    },
    {
      id: "lawn-quote-hedges",
      name: "Hedge & bush trimming",
      category: "other",
      description: "Shape and trim hedges and shrubs. Quote varies by property.",
      sortOrder: 2,
    },
    {
      id: "lawn-quote-gutters",
      name: "Gutter cleanup",
      category: "other",
      description: "Clear gutters and downspouts. Quote per property.",
      sortOrder: 3,
    },
    {
      id: "lawn-quote-fence",
      name: "Fence staining / painting",
      category: "other",
      description: "Stain or paint fences, decks, and outdoor wood. Materials and scope quoted per job.",
      sortOrder: 4,
    },
    {
      id: "lawn-quote-lights",
      name: "Christmas lighting",
      category: "other",
      description: "Install and take-down of outdoor Christmas lights. Quote on request.",
      sortOrder: 5,
    },
    {
      id: "lawn-quote-bins",
      name: "Garbage bin cleaning",
      category: "other",
      description: "Wash and sanitize outdoor garbage bins. Quote on request.",
      sortOrder: 6,
    },
  ],
};
export var defaultFaqs = [{
  id: "faq-1",
  question: "What areas in Thunder Bay do you serve?",
  answer: "We serve all of Thunder Bay and surrounding communities including Northwood, Current River, Westfort, Intercity, McIntyre, Neebing, Kakabeka Falls, Murillo, and Shuniah. Not sure if you're in our service area? Give us a call — we'll let you know right away.",
  sortOrder: 0
}, {
  id: "faq-2",
  question: "Do I have to sign a long-term contract?",
  answer: "No. You can cancel anytime. We earn your business every visit, not with fine print. That said, our year-round customers get priority scheduling and save 10%, so most people stick around.",
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
  question: "How is lawn mowing priced?",
  answer: "Weekly mowing is $199/month and bi-weekly is $140/month, based on 2,500 sq. ft. One-time cuts start at $50+. Larger lawns are quoted to fit. Turf care programs run from $180 to $600.",
  sortOrder: 5
}];
export var serviceAreas = ["Northwood", "Current River", "Westfort", "Intercity", "McIntyre", "Neebing", "Kakabeka Falls", "Murillo", "Shuniah", "Thunder Bay"];

export type Review = {
  name: string;
  neighbourhood: string;
  service: string;
  quote: string;
  when: string;
};

export const reviews: Review[] = [
  {
    name: "Jay Brahmbhatt",
    neighbourhood: "Thunder Bay",
    service: "Lawn mowing & snow removal",
    when: "6 days ago",
    quote:
      "Really great service. I have been contacting Yearwise Services for lawn moving and snow removal. They have reasonable prices and do great job.",
  },
  {
    name: "Gurazambir Sandhu",
    neighbourhood: "Thunder Bay",
    service: "Property services",
    when: "3 weeks ago",
    quote:
      "Best overall experience and most reliable services in town. Very professional staff.",
  },
  {
    name: "Hassanali Mohamedali",
    neighbourhood: "Thunder Bay",
    service: "Lawn care",
    when: "a month ago",
    quote: "Very professional and does a great job. Highly recommend.",
  },
  {
    name: "Dennis Austin",
    neighbourhood: "Thunder Bay",
    service: "Property services",
    when: "a month ago",
    quote:
      "Very personable and respectful workers. I would recommend them to anyone.",
  },
  {
    name: "Steve JACKO",
    neighbourhood: "Thunder Bay",
    service: "Property services",
    when: "a month ago",
    quote: "Excellent work! Highly recommended!",
  },
];

export const googleReviewsUrl =
  "https://www.google.com/maps/place/Yearwise+Services/@48.4020832,-89.2720586,17z/data=!4m6!3m5!1s0xae9d7b9a89482a95:0xfe3a04639f4b3dcd!8m2!3d48.4020832!4d-89.2720586!16s%2Fg%2F11zb7j7hc5";

export const googleRating = {
  ratingValue: 4.6,
  reviewCount: 12,
};


