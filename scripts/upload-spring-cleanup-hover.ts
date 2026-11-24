/**
 * Uploads spring cleanup hover photo to Cloudinary.
 *
 * Usage: node --env-file=.env --import tsx scripts/upload-spring-cleanup-hover.ts
 */
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const db = new PrismaClient();
const path =
  "/Users/afafruknuddin/.cursor/projects/Users-afafruknuddin-Documents-GitHub-YearwiseWeb/assets/WhatsApp_Image_2026-11-22_at_21.33.31-41f76ba8-e1c0-4c75-b639-7bdfdf138ecb.jpg";
const alt =
  "Backyard with debris-filled fire pit and weathered fence before a Yearwise spring cleanup";

async function main() {
  const buffer = readFileSync(path);
  const dataUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;
  const uploaded = await cloudinary.uploader.upload(dataUri, {
    public_id: "services-page/spring-cleanup-hover",
    overwrite: true,
    invalidate: true,
    resource_type: "image",
    format: "webp",
    quality: "auto:good",
  });
  await db.mediaAsset.upsert({
    where: { cloudinaryPublicId: uploaded.public_id },
    update: { altText: alt, tags: ["services-page", "spring-cleanup", "hover", "webp"] },
    create: {
      cloudinaryPublicId: uploaded.public_id,
      altText: alt,
      tags: ["services-page", "spring-cleanup", "hover", "webp"],
    },
  });
  console.log(`${uploaded.public_id}\t${uploaded.secure_url}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
