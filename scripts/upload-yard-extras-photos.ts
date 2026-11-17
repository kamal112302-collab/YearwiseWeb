/**
 * Uploads AI-generated yard-extra photos to Cloudinary as WebP.
 *
 * Usage: npx tsx scripts/upload-yard-extras-photos.ts
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
const assetsDir = "/Users/afafruknuddin/.cursor/projects/Users-afafruknuddin-Documents-GitHub-YearwiseWeb/assets";

const assets = [
  {
    path: `${assetsDir}/lawn-hedge-trimming.jpg`,
    publicId: "yearwise/web/lawn-hedge-trimming",
    alt: "Crew trimming a tall green hedge beside a residential home",
    mime: "image/jpeg",
  },
  {
    path: `${assetsDir}/lawn-gutter-cleanup.jpg`,
    publicId: "yearwise/web/lawn-gutter-cleanup",
    alt: "Worker on a ladder clearing leaves from a residential gutter",
    mime: "image/jpeg",
  },
  {
    path: `${assetsDir}/lawn-fence-staining.jpg`,
    publicId: "yearwise/web/lawn-fence-staining",
    alt: "Wooden backyard fence mid-stain with brush and stain tray",
    mime: "image/jpeg",
  },
  {
    path: `${assetsDir}/lawn-christmas-lighting.jpg`,
    publicId: "yearwise/web/lawn-christmas-lighting",
    alt: "Suburban home with warm Christmas lights on shrubs and porch at dusk",
    mime: "image/jpeg",
  },
  {
    path: `${assetsDir}/lawn-bin-cleaning.jpg`,
    publicId: "yearwise/web/lawn-bin-cleaning",
    alt: "Residential garbage and recycling bins being washed on a driveway",
    mime: "image/jpeg",
  },
];

async function main() {
  for (const asset of assets) {
    const buffer = readFileSync(asset.path);
    const dataUri = `data:${asset.mime};base64,${buffer.toString("base64")}`;
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
      update: { altText: asset.alt, tags: ["lawn-care", "yard-extras", "webp"] },
      create: {
        cloudinaryPublicId: uploaded.public_id,
        altText: asset.alt,
        tags: ["lawn-care", "yard-extras", "webp"],
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
