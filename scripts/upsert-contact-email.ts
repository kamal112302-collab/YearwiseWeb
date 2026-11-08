import { PrismaClient } from "@prisma/client";
import { privacyPolicyHtml, termsOfServiceHtml } from "../app/lib/policy-content";

const prisma = new PrismaClient();
const email = "info@yearwiseservices.com";

async function main() {
  await prisma.siteSetting.upsert({
    where: { key: "email" },
    update: { value: email },
    create: { key: "email", value: email },
  });
  console.log("siteSetting.email ->", email);

  for (const policy of [
    { slug: "privacy", title: "Privacy Policy", content: privacyPolicyHtml },
    { slug: "terms", title: "Terms of Service", content: termsOfServiceHtml },
  ]) {
    await prisma.policyPage.upsert({
      where: { slug: policy.slug },
      update: policy,
      create: policy,
    });
    console.log("upserted", policy.slug);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
