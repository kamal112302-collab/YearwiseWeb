/**
 * Uploads extra fence staining gallery photos to Cloudinary.
 *
 * Usage: node --env-file=.env --import tsx scripts/upload-fence-stain-gallery.ts
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
const assetsDir =
  "/Users/afafruknuddin/.cursor/projects/Users-afafruknuddin-Documents-GitHub-YearwiseWeb/assets";

const assets = [
  {
    filename: "WhatsApp_Image_2026-11-22_at_22.02.37-e7c243bf-d1d9-4362-a1d6-24dcdf4d4429.jpg",
    publicId: "services-page/fence-stain-detail",
    alt: "Freshly stained reddish-brown wooden fence, porch, and pergola gate between two homes after Yearwise staining",
  },
  {
    filename: "WhatsApp_Image_2026-11-22_at_22.02.37__1_-ebe381df-3779-4f10-9617-24e8f2872653.jpg",
    publicId: "services-page/fence-stain-deck",
    alt: "Freshly stained reddish-brown wooden deck with black gazebo after Yearwise staining and painting",
  },
] as const;

async function main() {
  for (const asset of assets) {
    const buffer = readFileSync(`${assetsDir}/${asset.filename}`);
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
      update: {
        altText: asset.alt,
        tags: ["services-page", "fence-staining", "gallery", "webp"],
      },
      create: {
        cloudinaryPublicId: uploaded.public_id,
        altText: asset.alt,
        tags: ["services-page", "fence-staining", "gallery", "webp"],
      },
    });
    console.log(`${asset.filename}\t${uploaded.public_id}\t${uploaded.secure_url}`);
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
