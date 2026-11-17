export type ServicePhotoRecord = {
  id: string;
  alt: string;
  role: "gallery" | "before" | "after";
  sortOrder: number;
};

export type ServiceRecord = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string;
  startingPrice: number;
  heroImage: string | null;
  cardImage: string | null;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  photos: ServicePhotoRecord[];
};

export type SiteSettings = {
  phone: string;
  email: string;
  promoBanner: string;
  businessHours: string;
  address: string;
  yearRoundDiscountPercent: number;
};

export type SnowPricingTier = {
  id: string;
  label: string;
  price: number;
  sortOrder: number;
};

export type SnowAddOn = {
  id: string;
  name: string;
  price: number | null;
  sortOrder: number;
};

export type SnowPricing = {
  tiers: SnowPricingTier[];
  addOns: SnowAddOn[];
  earlyBird: {
    discount: number;
    deadline: string;
    active: boolean;
  };
  commercial: {
    heading: string;
    body: string;
    priceNote: string;
    image: string;
  };
};

export type LawnMowingCadence = "weekly" | "biweekly" | "onetime";
export type LawnQuoteCategory = "cleanup" | "other";

export type LawnMowingPlan = {
  id: string;
  label: string;
  price: number;
  cadence: LawnMowingCadence;
  basisNote: string | null;
  includes: string[];
  sortOrder: number;
};

export type LawnTurfProgram = {
  id: string;
  name: string;
  price: number;
  features: string[];
  sortOrder: number;
};

export type LawnQuoteService = {
  id: string;
  name: string;
  category: LawnQuoteCategory;
  description: string;
  sortOrder: number;
};

export type LawnPricing = {
  plans: LawnMowingPlan[];
  turfPrograms: LawnTurfProgram[];
  quoteServices: LawnQuoteService[];
};
