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
