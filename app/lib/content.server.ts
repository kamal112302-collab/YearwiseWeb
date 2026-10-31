import { tryDb } from "../db.server";
import { defaultSettings, defaultServices, defaultFaqs, defaultSnowPricing } from "./content.data";
import { asPublicId, comparisons, serviceMedia, servicePhoto } from "./media";
import type { ServicePhotoRecord, ServiceRecord, SnowPricing } from "./content.types";

function fallbackPhotos(slug: string): ServicePhotoRecord[] {
  const media = serviceMedia[slug as keyof typeof serviceMedia];
  const pair = comparisons[slug as keyof typeof comparisons];
  if (!media || !pair) return [];
  return [
    ...media.gallery.map((shot, index) => ({
      id: shot.id,
      alt: shot.alt,
      role: "gallery" as const,
      sortOrder: index,
    })),
    { id: pair.before.id, alt: pair.before.alt, role: "before" as const, sortOrder: 0 },
    { id: pair.after.id, alt: pair.after.alt, role: "after" as const, sortOrder: 0 },
  ];
}

function withFallbackImages(service: Omit<ServiceRecord, "photos"> & { photos?: ServicePhotoRecord[] }): ServiceRecord {
  const hero = asPublicId(service.heroImage) ?? servicePhoto(service.slug, "hero").id;
  const card = asPublicId(service.cardImage) ?? servicePhoto(service.slug, "card").id;
  const photos = service.photos?.length ? service.photos : fallbackPhotos(service.slug);
  return {
    ...service,
    heroImage: hero,
    cardImage: card,
    photos,
  };
}

export async function getSiteSettings() {
  const client = tryDb();
  if (!client) return defaultSettings;
  try {
    const rows = await client.siteSetting.findMany({
      where: {
        key: {
          in: ["phone", "email", "promoBanner", "businessHours", "address"],
        },
      },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      phone: String(map.phone ?? defaultSettings.phone),
      email: String(map.email ?? defaultSettings.email),
      promoBanner: String(map.promoBanner ?? defaultSettings.promoBanner),
      businessHours: String(map.businessHours ?? defaultSettings.businessHours),
      address: String(map.address ?? defaultSettings.address),
    };
  } catch {
    return defaultSettings;
  }
}

export async function getServices() {
  const client = tryDb();
  if (!client) return defaultServices.map((service) => withFallbackImages(service));
  try {
    const rows = await client.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        photos: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (rows.length === 0) return defaultServices.map((service) => withFallbackImages(service));
    return rows.map((s) =>
      withFallbackImages({
        id: s.id,
        slug: s.slug,
        name: s.name,
        shortDescription: s.shortDescription,
        description: s.description,
        startingPrice: Number(s.startingPrice),
        heroImage: s.heroImage,
        cardImage: s.cardImage ?? s.heroImage,
        sortOrder: s.sortOrder,
        seoTitle: s.seoTitle,
        seoDescription: s.seoDescription,
        photos: s.photos.map((photo) => ({
          id: photo.publicId,
          alt: photo.altText,
          role: photo.role,
          sortOrder: photo.sortOrder,
        })),
      }),
    );
  } catch {
    return defaultServices.map((service) => withFallbackImages(service));
  }
}

export async function getServiceBySlug(slug: string) {
  return (await getServices()).find((s) => s.slug === slug) ?? null;
}

export async function getFaqs() {
  const client = tryDb();
  if (!client) return defaultFaqs;
  try {
    const rows = await client.faq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return defaultFaqs;
    const mapped: { id: string; question: string; answer: string; sortOrder: number }[] = rows.map(
      (f: { id: string; question: string; answer: string; sortOrder: number }) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        sortOrder: f.sortOrder,
      }),
    );
    const questions = new Set(mapped.map((faq) => faq.question));
    return [...mapped, ...defaultFaqs.filter((faq) => !questions.has(faq.question))].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  } catch {
    return defaultFaqs;
  }
}

const SNOW_SETTING_KEYS = [
  "snowEarlyBirdDiscount",
  "snowEarlyBirdDeadline",
  "snowCommercialHeading",
  "snowCommercialBody",
  "snowCommercialPriceNote",
  "snowCommercialImage",
] as const;

export async function getSnowPricing(): Promise<SnowPricing> {
  const client = tryDb();
  if (!client) return defaultSnowPricing;
  try {
    const [tiers, addOns, settings] = await Promise.all([
      client.snowPricingTier.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      client.snowAddOn.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      client.siteSetting.findMany({
        where: { key: { in: [...SNOW_SETTING_KEYS] } },
      }),
    ]);
    const map = Object.fromEntries(settings.map((row) => [row.key, row.value]));
    const discount = Number(map.snowEarlyBirdDiscount ?? defaultSnowPricing.earlyBird.discount);
    const deadline = String(map.snowEarlyBirdDeadline ?? defaultSnowPricing.earlyBird.deadline);
    const deadlineDate = deadline ? new Date(deadline) : null;
    const active = Boolean(deadlineDate && !Number.isNaN(deadlineDate.getTime()) && deadlineDate.getTime() >= Date.now());

    return {
      tiers:
        tiers.length > 0
          ? tiers.map((tier) => ({
              id: tier.id,
              label: tier.label,
              price: Number(tier.price),
              sortOrder: tier.sortOrder,
            }))
          : defaultSnowPricing.tiers,
      addOns:
        addOns.length > 0
          ? addOns.map((addOn) => ({
              id: addOn.id,
              name: addOn.name,
              price: addOn.price == null ? null : Number(addOn.price),
              sortOrder: addOn.sortOrder,
            }))
          : defaultSnowPricing.addOns,
      earlyBird: {
        discount: Number.isFinite(discount) ? discount : defaultSnowPricing.earlyBird.discount,
        deadline,
        active,
      },
      commercial: {
        heading: String(map.snowCommercialHeading ?? defaultSnowPricing.commercial.heading),
        body: String(map.snowCommercialBody ?? defaultSnowPricing.commercial.body),
        priceNote: String(map.snowCommercialPriceNote ?? defaultSnowPricing.commercial.priceNote),
        image: asPublicId(String(map.snowCommercialImage ?? "")) ?? defaultSnowPricing.commercial.image,
      },
    };
  } catch {
    return defaultSnowPricing;
  }
}

