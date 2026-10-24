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
    lead: "Weekly mowing and edging from the first thaw through fall cleanup. One insured crew, starting at $49 a visit.",
    who: "Homeowners who want the lawn handled without finding a new contractor every spring.",
    included: [
      "Mowing",
      "Edging",
      "Seasonal treatments from the first thaw through fall cleanup",
    ],
    excluded: [
      "Work that was not named in the quote",
      "A visit you did not book",
    ],
    pricing: "The starting price is $49 per visit. A new customer's first lawn cut is $49 (regular $85). The quote confirms the property before anything is billed.",
    booking: "Most new customers get a first visit within 3–5 days. Year-round customers save 20% and get priority scheduling. You can cancel anytime.",
    steps: [
      { title: "You call, or you send the form", body: "Marcus or Lisa take the quote. It names the property before anything is billed. Most quotes take a few minutes." },
      { title: "The first cut is $49", body: "That first cut for a new customer is $49. The regular price is $85. After that, lawn visits start at $49." },
      { title: "We mow and edge", body: "The visit is mowing, edging, and the seasonal treatments named in the quote. The season runs from the first thaw through fall cleanup." },
      { title: "We come back if you want us", body: "Most new jobs start within 3–5 days. Year-round customers save 20% and get first pick of the schedule. You can cancel anytime." },
    ],
    faqs: [
      {
        question: "What does the first lawn cut cost?",
        answer: "The first lawn cut for a new customer is $49. The regular visit price is $85. After that, lawn care starts at $49 per visit, and the quote confirms the property.",
      },
      {
        question: "Do I have to sign a long-term contract?",
        answer: "No. You can cancel anytime. Year-round customers get priority scheduling and save 20%.",
      },
    ],
  },
  "snow-removal": {
    h1: "Snow removal in Thunder Bay",
    lead: "Once you are on the plan, we come out after every snowfall of 5 cm or more. The driveway is cleared and de-iced. From $59 a visit.",
    who: "Households that do not want to call a plow operator at 6 a.m. after every storm.",
    included: [
      "Automatic visits after 5 cm or more of snow",
      "Driveway clearing",
      "Entrance paths",
      "De-icing on the surfaces in your quote",
    ],
    excluded: [
      "Surfaces that were not named in the quote",
    ],
    pricing: "Snow removal starts at $59 per visit. The quote names the driveway and any paths included. Nothing is billed from the website price alone.",
    booking: "Plan customers are already on the route. Emergency snow removal for someone not on a plan can often be same-day or next-day. Call (807) 358-2540.",
    steps: [
      { title: "Book before the first storm", body: "If you want the driveway cleared without calling, get on the plan before the first 5 cm. Call (807) 358-2540." },
      { title: "We come after 5 cm", body: "Once you are on the plan, the crew comes after every snowfall of 5 cm or more. You do not text or call after each storm." },
      { title: "Only what the quote names", body: "The driveway and the entrance paths in the quote are cleared. De-icing is only on the surfaces written in that quote." },
      { title: "Starts at $59", body: "The quote confirms the property. Someone who is not on a plan can ask about a one-off visit. Same-day is not guaranteed." },
    ],
    faqs: [
      {
        question: "Do I have to call every time it snows?",
        answer: "No. Once you are on the snow plan, we come out after every significant snowfall of 5 cm or more. You wake up to a cleared, de-iced driveway.",
      },
      {
        question: "How fast can you start?",
        answer: "Most new customers get a first service within 3–5 days. Emergency snow removal can often be same-day or next-day.",
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
