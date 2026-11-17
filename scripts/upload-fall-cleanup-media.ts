/**
 * Uploads fall-cleanup still (WebP) + source clip to Cloudinary.
 *
 * Usage: npx tsx scripts/upload-fall-cleanup-media.ts
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
const dir = "/Users/afafruknuddin/Documents/GitHub/YearwiseWeb/tmp-media";

async function main() {
  const frame = readFileSync(`${dir}/lawn-fall-cleanup-frame.jpg`);
  const still = await cloudinary.uploader.upload(`data:image/jpeg;base64,${frame.toString("base64")}`, {
    public_id: "yearwise/web/lawn-fall-cleanup",
    overwrite: true,
    invalidate: true,
    resource_type: "image",
    format: "webp",
    quality: "auto:good",
  });

  const clip = await cloudinary.uploader.upload(`${dir}/lawn-fall-cleanup.mp4`, {
    public_id: "yearwise/web/lawn-fall-cleanup-clip",
    overwrite: true,
    invalidate: true,
    resource_type: "video",
  });

  const alt = "Yearwise fall cleanup crew clearing leaves on a Thunder Bay residential property";
  await db.mediaAsset.upsert({
    where: { cloudinaryPublicId: still.public_id },
    update: { altText: alt, tags: ["lawn-care", "fall-cleanup", "webp"] },
    create: { cloudinaryPublicId: still.public_id, altText: alt, tags: ["lawn-care", "fall-cleanup", "webp"] },
  });

  console.log(`still: ${still.public_id} (${still.format}, ${still.bytes} bytes)`);
  console.log(`video: ${clip.public_id} (${clip.format}, ${clip.bytes} bytes)`);
  console.log(still.secure_url);
  console.log(clip.secure_url);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
