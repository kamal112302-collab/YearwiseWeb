export type ServiceRecord = {
  id: string; slug: string; name: string; shortDescription: string | null; description: string;
  startingPrice: number; heroImage: string | null; cardImage: string | null; sortOrder: number;
  seoTitle: string | null; seoDescription: string | null;
};
export type SiteSettings = { phone: string; email: string; promoBanner: string; businessHours: string; address: string };
