import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { defaultFaqs, defaultLawnPricing, defaultServices, defaultSettings } from "../app/lib/content.data";
import { fallbackPosts } from "../app/lib/blog.server";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@yearwiseservices.com" },
    update: { passwordHash, role: "superadmin" },
    create: { email: "admin@yearwiseservices.com", passwordHash, role: "superadmin" },
  });

  for (const service of defaultServices) {
    const { id: _id, ...data } = service;
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: data,
      create: data,
    });
  }

  for (const faq of defaultFaqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faq.create({
        data: { question: faq.question, answer: faq.answer, sortOrder: faq.sortOrder },
      });
    }
  }

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  for (const post of fallbackPosts) {
    const { id: _id, ...data } = post;
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { ...data, status: "published" },
      create: { ...data, status: "published" },
    });
  }

  const { privacyPolicyHtml, termsOfServiceHtml } = await import("../app/lib/policy-content");
  const policies = [
    {
      slug: "privacy",
      title: "Privacy Policy",
      content: privacyPolicyHtml,
    },
    {
      slug: "terms",
      title: "Terms of Service",
      content: termsOfServiceHtml,
    },
  ];
  for (const policy of policies) {
    await prisma.policyPage.upsert({
      where: { slug: policy.slug },
      update: policy,
      create: policy,
    });
  }

  if ((await prisma.lawnMowingPlan.count()) === 0) {
    await prisma.lawnMowingPlan.createMany({
      data: defaultLawnPricing.plans.map((plan) => ({
        label: plan.label,
        price: plan.price.toFixed(2),
        cadence: plan.cadence,
        basisNote: plan.basisNote,
        includes: plan.includes,
        sortOrder: plan.sortOrder,
      })),
    });
  }
  if ((await prisma.lawnTurfProgram.count()) === 0) {
    await prisma.lawnTurfProgram.createMany({
      data: defaultLawnPricing.turfPrograms.map((program) => ({
        name: program.name,
        price: program.price.toFixed(2),
        features: program.features,
        sortOrder: program.sortOrder,
      })),
    });
  }
  if ((await prisma.lawnQuoteService.count()) === 0) {
    await prisma.lawnQuoteService.createMany({
      data: defaultLawnPricing.quoteServices.map((service) => ({
        name: service.name,
        category: service.category,
        description: service.description,
        sortOrder: service.sortOrder,
      })),
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
