/**
 * Uploads customer lawn photos to Cloudinary as WebP and registers MediaAsset rows.
 *
 * Usage: npx tsx scripts/upload-lawn-photos.ts
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

const assets = [
  {
    path: "/Users/afafruknuddin/.cursor/projects/Users-afafruknuddin-Documents-GitHub-YearwiseWeb/assets/IMG_0027-16223419-fbcf-404b-9909-e61232a56fe0.jpg",
    publicId: "yearwise/web/lawn-fall-street",
    alt: "Thunder Bay residential street in fall with leaf piles and a Yearwise crew working on the property",
  },
  {
    path: "/Users/afafruknuddin/.cursor/projects/Users-afafruknuddin-Documents-GitHub-YearwiseWeb/assets/IMG_0030-7f2c65c9-9cb6-4cff-ba30-61e32a36c251.jpg",
    publicId: "yearwise/web/lawn-deck-pool",
    alt: "Backyard deck and covered pool with fallen leaves before a Yearwise seasonal cleanup",
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
      update: { altText: asset.alt, tags: ["lawn-care", "cleanup", "webp"] },
      create: {
        cloudinaryPublicId: uploaded.public_id,
        altText: asset.alt,
        tags: ["lawn-care", "cleanup", "webp"],
      },
    });
    console.log(
      JSON.stringify(
        {
          publicId: uploaded.public_id,
          format: uploaded.format,
          bytes: uploaded.bytes,
          url: uploaded.secure_url,
          width: uploaded.width,
          height: uploaded.height,
        },
        null,
        2,
      ),
    );
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
