import type { ActionFunctionArgs } from "react-router";
import { db } from "../db.server";
import { uploadImageFile } from "../lib/cloudinary.server";
import { requireAdmin } from "../lib/session.server";

const FOLDERS: Record<string, string> = {
  media: "yearwise/media",
  services: "yearwise/services",
};

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  const folderKey = String(formData.get("folder") ?? "media");
  const folder = FOLDERS[folderKey] ?? FOLDERS.media;
  const alt = String(formData.get("alt") ?? "").trim() || file.name.replace(/\.[^.]+$/, "") || "Uploaded image";

  try {
    const uploaded = await uploadImageFile(file, folder);
    await db.mediaAsset.upsert({
      where: { cloudinaryPublicId: uploaded.publicId },
      update: { altText: alt },
      create: {
        cloudinaryPublicId: uploaded.publicId,
        altText: alt,
        tags: [],
      },
    });
    return Response.json({ url: uploaded.url, publicId: uploaded.publicId, alt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
