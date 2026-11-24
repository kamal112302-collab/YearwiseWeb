/**
 * Uploads Services page photos to Cloudinary under services-page/.
 *
 * Usage: node --env-file=.env --import tsx scripts/upload-services-page-media.ts
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
    filename: "WhatsApp_Image_2026-11-22_at_22.02.36-7c953237-90fc-4d6e-a4b6-5dd61623ec19.jpg",
    publicId: "services-page/fence-stain-after",
    alt: "Freshly stained reddish-brown wooden picket fence after Yearwise fence staining",
    tags: ["services-page", "fence-staining", "after", "webp"],
  },
  {
    filename: "WhatsApp_Image_2026-11-22_at_21.33.31-a1ed765a-fdef-4ffa-bd54-37f5baac997c.jpg",
    publicId: "services-page/fence-stain-before",
    alt: "Weathered grey wooden privacy fence in a Thunder Bay backyard before cleaning and staining",
    tags: ["services-page", "fence-staining", "before", "webp"],
  },
  {
    filename: "WhatsApp_Image_2026-11-22_at_21.33.31__1_-7e00a7ca-ed1a-443c-ad95-8080039480da.jpg",
    publicId: "services-page/gutter-cleanup",
    alt: "Residential metal gutter packed with dry brown leaves next to a blue metal roof",
    tags: ["services-page", "gutter-cleanup", "webp"],
  },
  {
    filename: "WhatsApp_Image_2026-11-22_at_21.33.30-ee44b5a2-5f19-41ae-b451-e99dd8c3e100.jpg",
    publicId: "services-page/spring-cleanup",
    alt: "Backyard with leaf-covered lawn, weathered fence, and debris before a Yearwise spring cleanup",
    tags: ["services-page", "spring-cleanup", "webp"],
  },
  {
    filename: "WhatsApp_Image_2026-11-22_at_21.33.31__5_-6db249f0-2809-46f1-a7ab-0055515a6e55.jpg",
    publicId: "services-page/fall-cleanup",
    alt: "Thunder Bay residential street with autumn leaves covering lawns and driveways before fall cleanup",
    tags: ["services-page", "fall-cleanup", "webp"],
  },
  {
    filename: "WhatsApp_Image_2026-11-22_at_21.33.31__6_-95d73733-5bf1-41e6-9690-ff59a39841cd.jpg",
    publicId: "services-page/turf-care",
    alt: "Well-kept residential front lawn and stone driveway after professional turf care",
    tags: ["services-page", "turf-care", "webp"],
  },
  {
    filename: "WhatsApp_Image_2026-11-22_at_21.33.31__3_-29c64d60-34be-4fdd-923b-174ed181d758.jpg",
    publicId: "services-page/lawn-care-card",
    alt: "Spacious residential backyard in autumn with fallen leaves on a green lawn",
    tags: ["services-page", "lawn-care", "webp"],
  },
  {
    filename: "WhatsApp_Image_2026-11-22_at_22.02.37-bbadfdb6-b99b-467a-b826-1ede5bd06763.jpg",
    publicId: "services-page/fence-stain-detail",
    alt: "Stained wooden decks and fence gate between two homes after Yearwise staining",
    tags: ["services-page", "fence-staining", "detail", "webp"],
  },
] as const;

async function main() {
  console.log("original_filename\tpublic_id\tsecure_url");
  for (const asset of assets) {
    const path = `${assetsDir}/${asset.filename}`;
    const buffer = readFileSync(path);
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
      update: { altText: asset.alt, tags: [...asset.tags] },
      create: {
        cloudinaryPublicId: uploaded.public_id,
        altText: asset.alt,
        tags: [...asset.tags],
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
