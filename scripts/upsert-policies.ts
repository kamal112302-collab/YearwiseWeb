import { PrismaClient } from "@prisma/client";
import { privacyPolicyHtml, termsOfServiceHtml } from "../app/lib/policy-content";

const prisma = new PrismaClient();

const policies = [
  { slug: "privacy", title: "Privacy Policy", content: privacyPolicyHtml },
  { slug: "terms", title: "Terms of Service", content: termsOfServiceHtml },
];

async function main() {
  for (const policy of policies) {
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
