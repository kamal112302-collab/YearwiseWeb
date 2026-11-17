/**
 * Seeds lawn mowing plans, turf programs, and quote services.
 * Safe to re-run: skips creating rows when any already exist for that table.
 * Always updates the lawn-care service copy and promo/FAQ defaults.
 *
 * Usage: npx tsx scripts/seed-lawn-pricing.ts
 */
import { PrismaClient } from "@prisma/client";
import { defaultFaqs, defaultLawnPricing, defaultServices, defaultSettings } from "../app/lib/content.data";

const db = new PrismaClient();

async function main() {
  const existingPlans = await db.lawnMowingPlan.count();
  if (existingPlans === 0) {
    await db.lawnMowingPlan.createMany({
      data: defaultLawnPricing.plans.map((plan) => ({
        label: plan.label,
        price: plan.price.toFixed(2),
        cadence: plan.cadence,
        basisNote: plan.basisNote,
        includes: plan.includes,
        sortOrder: plan.sortOrder,
      })),
    });
    console.log("Seeded lawn mowing plans.");
  } else {
    console.log(`Lawn mowing plans already present (${existingPlans}).`);
  }

  const existingTurf = await db.lawnTurfProgram.count();
  if (existingTurf === 0) {
    await db.lawnTurfProgram.createMany({
      data: defaultLawnPricing.turfPrograms.map((program) => ({
        name: program.name,
        price: program.price.toFixed(2),
        features: program.features,
        sortOrder: program.sortOrder,
      })),
    });
    console.log("Seeded lawn turf programs.");
  } else {
    console.log(`Lawn turf programs already present (${existingTurf}).`);
  }

  const existingQuotes = await db.lawnQuoteService.count();
  if (existingQuotes === 0) {
    await db.lawnQuoteService.createMany({
      data: defaultLawnPricing.quoteServices.map((service) => ({
        name: service.name,
        category: service.category,
        description: service.description,
        sortOrder: service.sortOrder,
      })),
    });
    console.log("Seeded lawn quote services.");
  } else {
    console.log(`Lawn quote services already present (${existingQuotes}).`);
  }

  const lawn = defaultServices.find((service) => service.slug === "lawn-care");
  if (lawn) {
    const { id: _id, ...data } = lawn;
    await db.service.updateMany({
      where: { slug: "lawn-care" },
      data: {
        startingPrice: data.startingPrice.toFixed(2),
        shortDescription: data.shortDescription,
        description: data.description,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      },
    });
  }

  await db.siteSetting.upsert({
    where: { key: "promoBanner" },
    update: { value: defaultSettings.promoBanner },
    create: { key: "promoBanner", value: defaultSettings.promoBanner },
  });

  const lawnFaq = defaultFaqs.find((faq) => faq.id === "faq-6");
  if (lawnFaq) {
    const outdated = await db.faq.findFirst({
      where: { question: "What does the first lawn cut cost?" },
    });
    if (outdated) {
      await db.faq.update({
        where: { id: outdated.id },
        data: {
          question: lawnFaq.question,
          answer: lawnFaq.answer,
          sortOrder: lawnFaq.sortOrder,
          isActive: true,
        },
      });
    } else {
      const existing = await db.faq.findFirst({ where: { question: lawnFaq.question } });
      if (!existing) {
        await db.faq.create({
          data: {
            question: lawnFaq.question,
            answer: lawnFaq.answer,
            sortOrder: lawnFaq.sortOrder,
          },
        });
      } else {
        await db.faq.update({
          where: { id: existing.id },
          data: { answer: lawnFaq.answer, sortOrder: lawnFaq.sortOrder, isActive: true },
        });
      }
    }
  }

  console.log("Updated lawn service, promo banner, and lawn FAQ.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
