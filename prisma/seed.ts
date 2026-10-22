import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { defaultFaqs, defaultServices, defaultSettings } from "../app/lib/content.data";
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

  const policies = [
    {
      slug: "privacy",
      title: "Privacy Policy",
      content: "<p>Yearwise Services collects contact information you submit through our quote form to respond to service requests. We do not sell your data. Call (807) 358-2540 with privacy questions.</p>",
    },
    {
      slug: "terms",
      title: "Terms of Service",
      content: "<p>Services are provided according to quoted scope and schedule. Pricing is per visit unless a written bundle agreement specifies otherwise. Cancel anytime — no long-term contract required.</p>",
    },
  ];
  for (const policy of policies) {
    await prisma.policyPage.upsert({
      where: { slug: policy.slug },
      update: policy,
      create: policy,
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
