import { serviceAreas } from "./content.data";

export type ServiceFaq = { question: string; answer: string };

export type ServicePageCopy = {
  h1: string;
  lead: string;
  who: string;
  included: string[];
  excluded: string[];
  pricing: string;
  booking: string;
  steps: { title: string; body: string }[];
  faqs: ServiceFaq[];
};

export const servicePageCopy: Record<string, ServicePageCopy> = {
  "lawn-care": {
    h1: "Lawn care in Thunder Bay",
    lead: "Yearwise provides lawn care in Thunder Bay — weekly or bi-weekly mowing, turf programs, and seasonal cleanups with one insured crew. Plans from $140/month; one-time cuts from $50+.",
    who: "Homeowners across Thunder Bay who want a clear mowing plan and turf program without juggling different contractors.",
    included: [
      "Lawn mowing, trimming, blower cleanup, and mulched clippings",
      "Weekly or bi-weekly monthly plans (based on 2,500 sq. ft.)",
      "Turf programs with aeration, fertilization, and overseeding options",
      "Spring and fall cleanups quoted per property",
    ],
    excluded: [
      "Work that was not named in the quote",
      "A visit you did not book",
    ],
    pricing:
      "How much does lawn care cost in Thunder Bay? At Yearwise, weekly mowing is $199/month and bi-weekly is $140/month, based on 2,500 sq. ft. One-time cuts start at $50+. Turf care programs are $180, $300, or $600. Larger lawns and extras are quoted separately.",
    booking:
      "Most new Thunder Bay customers get a first lawn visit within 3–5 days. Year-round customers save {discount} and get priority scheduling. You can cancel anytime.",
    steps: [
      {
        title: "You call, or you send the form",
        body: "We size the lawn and pick a weekly, bi-weekly, or one-time plan. The quote names the property before anything is billed.",
      },
      {
        title: "Choose mowing and turf",
        body: "Monthly mowing starts at $140 bi-weekly or $199 weekly (2,500 sq. ft.). Add a turf program from $180 if you want aeration and fertilizer handled too.",
      },
      {
        title: "We mow, trim, and clean up",
        body: "Each visit covers mowing, trimming, blower cleanup, and mulched clippings. Turf visits follow the program you booked.",
      },
      {
        title: "We come back on your cadence",
        body: "Weekly or bi-weekly stays on the route. Year-round customers save {discount} and get first pick of the schedule. Cancel anytime.",
      },
    ],
    faqs: [
      {
        question: "How much does lawn care cost in Thunder Bay?",
        answer:
          "Yearwise lawn care in Thunder Bay starts at $140/month for bi-weekly mowing and $199/month for weekly mowing, based on 2,500 sq. ft. One-time cuts start at $50+. Turf programs run $180, $300, or $600. Larger lawns are quoted to fit.",
      },
      {
        question: "Who does lawn care in Thunder Bay?",
        answer:
          "Yearwise Services is a local Thunder Bay crew for lawn care, snow removal, and junk hauling. We mow, trim, and clean up on a weekly or bi-weekly plan, and we offer turf programs and seasonal cleanups with the same insured team.",
      },
      {
        question: "What areas of Thunder Bay do you mow?",
        answer:
          "We provide lawn care across Thunder Bay and nearby communities including Northwood, Current River, Westfort, Intercity, McIntyre, Neebing, Kakabeka Falls, Murillo, and Shuniah.",
      },
      {
        question: "What is included in a turf care program?",
        answer:
          "Programs start at $180 with core aeration plus spring and fall fertilization. Higher programs add overseeding, summer fertilizer, dethatching, and a second aeration.",
      },
      {
        question: "Do I have to sign a long-term contract?",
        answer:
          "No. You can cancel anytime. Year-round customers get priority scheduling and save {discount}.",
      },
    ],
  },
  "snow-removal": {
    h1: "Snow removal in Thunder Bay",
    lead: "Yearwise provides snow removal in Thunder Bay — once you are on the plan, we clear your driveway after every snowfall of 5 cm or more. Season packages start at $549 + tax, sized to your driveway.",
    who: "Thunder Bay households that do not want to call a plow operator at 6 a.m. after every storm.",
    included: [
      "Automatic visits after 5 cm or more of snow",
      "Driveway clearing for the season",
      "Entrance paths named in the quote",
      "De-icing on the surfaces in your quote",
    ],
    excluded: [
      "Surfaces that were not named in the quote",
      "Add-ons that were not quoted (sidewalk, staircase, salting)",
    ],
    pricing:
      "Thunder Bay snow removal season packages are priced by driveway size, starting at $549 + tax. The quote confirms the driveway before anything is billed. Sidewalk, staircase, and salting add-ons are priced separately.",
    booking:
      "Plan customers are already on the Thunder Bay snow route. Emergency snow removal for someone not on a plan can often be same-day or next-day. Call (807) 358-2540.",
    steps: [
      {
        title: "Book before the first storm",
        body: "If you want the driveway cleared without calling, get on the snow plan before the first 5 cm. Call (807) 358-2540.",
      },
      {
        title: "We come after 5 cm",
        body: "Once you are on the plan, the crew comes after every snowfall of 5 cm or more. You do not text or call after each storm.",
      },
      {
        title: "Only what the quote names",
        body: "The driveway and the entrance paths in the quote are cleared. De-icing is only on the surfaces written in that quote.",
      },
      {
        title: "Priced for the season",
        body: "Packages start at $549 + tax for a 1-car driveway. The quote confirms the property. Someone who is not on a plan can ask about a one-off snow visit.",
      },
    ],
    faqs: [
      {
        question: "Who does snow removal in Thunder Bay?",
        answer:
          "Yearwise Services provides snow removal in Thunder Bay with an automatic season plan: after 5 cm or more of snow, we clear the driveway and named entrance paths. Packages start at $549 + tax by driveway size.",
      },
      {
        question: "Do I have to call every time it snows?",
        answer:
          "No. Once you are on the snow plan, we come out after every significant snowfall of 5 cm or more. You wake up to a cleared driveway.",
      },
      {
        question: "How is the season package priced?",
        answer:
          "By driveway size. A 1-car driveway starts at $549 + tax for the season. Larger driveways are higher. Add-ons such as sidewalks, staircases, and salting are quoted separately.",
      },
      {
        question: "How fast can you start?",
        answer:
          "Most new customers get a first service within 3–5 days. Emergency snow removal can often be same-day or next-day.",
      },
    ],
  },
  "junk-removal": {
    h1: "Junk removal in Thunder Bay",
    lead: "You point, we load, we haul, we dump. Furniture, appliances, yard waste, and the bulky things in the way. From $99 a visit.",
    who: "Anyone with a pile that should not stay in the yard, the garage, or the basement.",
    included: [
      "Old furniture and mattresses",
      "Appliances and electronics",
      "Yard waste and construction debris",
      "Hot tubs, sheds, and other bulky outdoor items",
    ],
    excluded: [
      "Paint, chemicals, and asbestos",
      "Anything you did not point out for the quote",
    ],
    pricing: "Junk removal starts at $99 per visit. The quote is based on the pile, not a guess from this page. We recycle and donate whenever possible.",
    booking: "Junk hauling can often be same-day or next-day. Most other new jobs start within 3–5 days. Send a photo of the pile with your quote request.",
    steps: [
      { title: "Send a photo of the pile", body: "The quote is based on what you point at. A photo makes the number faster. Nothing on this page is a final bill." },
      { title: "We load and haul", body: "You point. We load, haul, and dispose. We recycle and donate whenever we can." },
      { title: "What comes with us", body: "Furniture, mattresses, appliances, electronics, yard waste, construction debris, hot tubs, sheds, and other bulky outdoor items." },
      { title: "What stays", body: "We do not haul paint, chemicals, or asbestos. If you are not sure, ask before the visit is booked. Hauling starts at $99 and can often be same-day or next-day." },
    ],
    faqs: [
      {
        question: "What can you haul away?",
        answer: "Almost anything you can point at: furniture, appliances, yard waste, construction debris, electronics, mattresses, hot tubs, and sheds. We do not take hazardous materials such as paint, chemicals, or asbestos.",
      },
      {
        question: "How fast can you start?",
        answer: "Junk hauling can often be same-day or next-day. Most new customers otherwise get a first service within 3–5 days.",
      },
    ],
  },
};

export function areasSentence() {
  const names = serviceAreas.filter((area) => area !== "Thunder Bay");
  return `We serve Thunder Bay, including ${names.slice(0, -1).join(", ")}, and ${names.at(-1)}.`;
}

/** Replace `{discount}` placeholders with a label like `10%`. */
export function withDiscountCopy<T>(value: T, discount: string): T {
  if (typeof value === "string") {
    return value.replaceAll("{discount}", discount) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => withDiscountCopy(item, discount)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, withDiscountCopy(entry, discount)]),
    ) as T;
  }
  return value;
}
