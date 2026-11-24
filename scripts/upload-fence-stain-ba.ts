/**
 * Uploads fence/deck staining before & after photos to Cloudinary as WebP.
 *
 * Usage: npx tsx scripts/upload-fence-stain-ba.ts
 */
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const db = new PrismaClient();
const root = resolve(import.meta.dirname, "..");

const assets = [
  {
    path: resolve(root, "tmp-fence-before.jpg"),
    publicId: "yearwise/web/fence-stain-before",
    alt: "Wooden deck and outdoor structure before Yearwise staining and painting",
  },
  {
    path: resolve(root, "tmp-fence-after.jpg"),
    publicId: "yearwise/web/fence-stain-after",
    alt: "Wooden deck freshly stained reddish-brown with black gazebo after Yearwise staining and painting",
  },
];

async function main() {
  for (const asset of assets) {
    const buffer = readFileSync(asset.path);
    const dataUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    const uploaded = await cloudinary.uploader.upload(dataUri, {
      public_id: asset.publicId,
      overwrite: true,
      invalidate: true,
      resource_type: "image",
      format: "webp",
      quality: "auto:good",
    });
    await db.mediaAsset.upsert({
      where: { cloudinaryPublicId: uploaded.public_id },
      update: { altText: asset.alt, tags: ["lawn-care", "fence-staining", "before-after", "webp"] },
      create: {
        cloudinaryPublicId: uploaded.public_id,
        altText: asset.alt,
        tags: ["lawn-care", "fence-staining", "before-after", "webp"],
      },
    });
    console.log(`${uploaded.public_id} → ${uploaded.format} (${uploaded.bytes} bytes)`);
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
