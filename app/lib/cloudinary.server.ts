import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});
export function getCloudinaryCredentials() {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!apiSecret || !apiKey || !cloudName) return null;
  return {
    apiSecret,
    apiKey,
    cloudName
  };
}
export function signCloudinaryParams(paramsToSign: Record<string, string | number>) {
  const credentials = getCloudinaryCredentials();
  if (!credentials) throw new Error("Cloudinary credentials not configured");
  return {
    signature: cloudinary.utils.api_sign_request(paramsToSign, credentials.apiSecret),
    apiKey: credentials.apiKey,
    cloudName: credentials.cloudName
  };
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function cloudinaryDeliveryUrl(publicId: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return null;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

export async function uploadImageFile(file: File, folder: string) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, WebP, or GIF.");
  }
  if (file.size === 0) throw new Error("That file is empty.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image must be under 8 MB.");
  if (!getCloudinaryCredentials()) throw new Error("Cloudinary is not configured.");

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  const uploaded = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    unique_filename: true,
  });

  return {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  };
}


