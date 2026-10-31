/**
 * One-time copy of hardcoded Cloudinary public IDs from app/lib/media.ts
 * into Service.heroImage / cardImage and ServicePhoto rows.
 *
 * Does not touch AdminUser or run prisma/seed.ts.
 *
 * Usage: npx tsx scripts/backfill-service-photos.ts
 */
import { PrismaClient } from "@prisma/client";
import { comparisons, serviceMedia } from "../app/lib/media";

const db = new PrismaClient();

async function main() {
  const services = await db.service.findMany();
  if (services.length === 0) {
    console.log("No services in the database. Nothing to backfill.");
    return;
  }

  for (const service of services) {
    const media = serviceMedia[service.slug as keyof typeof serviceMedia];
    const pair = comparisons[service.slug as keyof typeof comparisons];
    if (!media || !pair) {
      console.log(`Skip ${service.slug}: no hardcoded media map.`);
      continue;
    }

    await db.service.update({
      where: { id: service.id },
      data: {
        heroImage: media.hero.id,
        cardImage: media.card.id,
      },
    });

    const existing = await db.servicePhoto.count({ where: { serviceId: service.id } });
    if (existing > 0) {
      console.log(`Updated hero/card for ${service.slug}; gallery already has ${existing} photo(s).`);
      continue;
    }

    await db.servicePhoto.createMany({
      data: [
        ...media.gallery.map((shot, index) => ({
          serviceId: service.id,
          role: "gallery" as const,
          publicId: shot.id,
          altText: shot.alt,
          sortOrder: index,
        })),
        {
          serviceId: service.id,
          role: "before" as const,
          publicId: pair.before.id,
          altText: pair.before.alt,
          sortOrder: 0,
        },
        {
          serviceId: service.id,
          role: "after" as const,
          publicId: pair.after.id,
          altText: pair.after.alt,
          sortOrder: 0,
        },
      ],
    });

    console.log(`Backfilled ${service.slug}: hero, card, ${media.gallery.length} gallery, before/after.`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
