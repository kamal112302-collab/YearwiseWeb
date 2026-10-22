import type { Service } from "@prisma/client";

export function presentService(service: Service) {
  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    shortDescription: service.shortDescription,
    description: service.description,
    startingPrice: service.startingPrice.toString(),
    heroImage: service.heroImage,
    cardImage: service.cardImage,
    sortOrder: service.sortOrder,
    seoTitle: service.seoTitle,
    seoDescription: service.seoDescription,
    isActive: service.isActive,
  };
}
