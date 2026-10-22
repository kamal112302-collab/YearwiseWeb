import { tryDb } from "../db.server";
import { defaultSettings, defaultServices, defaultFaqs } from "./content.data";

export async function getSiteSettings() {
  const client = tryDb();
  if (!client) return defaultSettings;
  try {
    const rows = await client.siteSetting.findMany({
      where: {
        key: {
          in: ["phone", "email", "promoBanner", "businessHours", "address"]
        }
      }
    });
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
    return {
      phone: String(map.phone ?? defaultSettings.phone),
      email: String(map.email ?? defaultSettings.email),
      promoBanner: String(map.promoBanner ?? defaultSettings.promoBanner),
      businessHours: String(map.businessHours ?? defaultSettings.businessHours),
      address: String(map.address ?? defaultSettings.address)
    };
  } catch {
    return defaultSettings;
  }
}
export async function getServices() {
  const client = tryDb();
  if (!client) return defaultServices;
  try {
    const rows = await client.service.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: "asc"
      }
    });
    if (rows.length === 0) return defaultServices;
    return rows.map(s => ({
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
      seoDescription: s.seoDescription
    }));
  } catch {
    return defaultServices;
  }
}
export async function getServiceBySlug(slug) {
  return (await getServices()).find(s => s.slug === slug) ?? null;
}
export async function getFaqs() {
  const client = tryDb();
  if (!client) return defaultFaqs;
  try {
    const rows = await client.faq.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: "asc"
      }
    });
    if (rows.length === 0) return defaultFaqs;
    return rows.map(f => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      sortOrder: f.sortOrder
    }));
  } catch {
    return defaultFaqs;
  }
}


