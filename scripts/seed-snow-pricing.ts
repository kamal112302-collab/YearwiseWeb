/**
 * Seeds snow pricing tiers/add-ons and updates the snow service starting price.
 * Safe to re-run: skips creating rows when any already exist.
 *
 * Usage: npx tsx scripts/seed-snow-pricing.ts
 */
import { PrismaClient } from "@prisma/client";
import { defaultSnowPricing } from "../app/lib/content.data";

const db = new PrismaClient();

async function main() {
  const existingTiers = await db.snowPricingTier.count();
  if (existingTiers === 0) {
    await db.snowPricingTier.createMany({
      data: defaultSnowPricing.tiers.map((tier) => ({
        label: tier.label,
        price: tier.price.toFixed(2),
        sortOrder: tier.sortOrder,
      })),
    });
    console.log("Seeded snow pricing tiers.");
  } else {
    console.log(`Snow tiers already present (${existingTiers}).`);
  }

  const existingAddOns = await db.snowAddOn.count();
  if (existingAddOns === 0) {
    await db.snowAddOn.createMany({
      data: defaultSnowPricing.addOns.map((addOn) => ({
        name: addOn.name,
        price: addOn.price == null ? null : addOn.price.toFixed(2),
        sortOrder: addOn.sortOrder,
      })),
    });
    console.log("Seeded snow add-ons.");
  } else {
    console.log(`Snow add-ons already present (${existingAddOns}).`);
  }

  await db.service.updateMany({
    where: { slug: "snow-removal" },
    data: {
      startingPrice: "549.00",
      shortDescription: "Season driveway clearing after every 5 cm of snow. No calling after each storm.",
      description:
        "Once you are on the snow plan, we come out after every snowfall of 5 cm or more. Driveway cleared and de-iced for the season, priced by driveway size.",
      seoDescription:
        "Season snow removal in Thunder Bay after 5 cm+ snowfall. Driveway clearing by driveway size from $549 + tax.",
    },
  });

  await db.siteSetting.upsert({
    where: { key: "snowEarlyBirdDiscount" },
    update: { value: String(defaultSnowPricing.earlyBird.discount) },
    create: { key: "snowEarlyBirdDiscount", value: String(defaultSnowPricing.earlyBird.discount) },
  });
  await db.siteSetting.upsert({
    where: { key: "snowCommercialHeading" },
    update: { value: defaultSnowPricing.commercial.heading },
    create: { key: "snowCommercialHeading", value: defaultSnowPricing.commercial.heading },
  });
  await db.siteSetting.upsert({
    where: { key: "snowCommercialBody" },
    update: { value: defaultSnowPricing.commercial.body },
    create: { key: "snowCommercialBody", value: defaultSnowPricing.commercial.body },
  });
  await db.siteSetting.upsert({
    where: { key: "snowCommercialPriceNote" },
    update: { value: defaultSnowPricing.commercial.priceNote },
    create: { key: "snowCommercialPriceNote", value: defaultSnowPricing.commercial.priceNote },
  });
  await db.siteSetting.upsert({
    where: { key: "snowCommercialImage" },
    update: { value: defaultSnowPricing.commercial.image },
    create: { key: "snowCommercialImage", value: defaultSnowPricing.commercial.image },
  });

  console.log("Updated snow service and commercial settings.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
