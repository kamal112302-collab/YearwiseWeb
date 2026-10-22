import type { LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import { useRevalidator } from "react-router";
import { ImageDropzone } from "../components/admin/ImageDropzone";
import { db } from "../db.server";
import { requireAdmin } from "../lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const assets = await db.mediaAsset.findMany({
    orderBy: { uploadedAt: "desc" },
    take: 100,
  });
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  return {
    cloudinaryConfigured: Boolean(cloudName),
    assets: assets.map((asset) => ({
      id: asset.id,
      altText: asset.altText,
      uploadedAt: asset.uploadedAt.toISOString(),
      url: cloudName ? `https://res.cloudinary.com/${cloudName}/image/upload/${asset.cloudinaryPublicId}` : null,
    })),
  };
}

export default function AdminMedia({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const revalidator = useRevalidator();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyUrl(id: string, url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Media</h1>
      <p className="mt-1 text-sm text-muted-foreground">Drop photos here. They are stored on Cloudinary and listed below.</p>
      {!loaderData.cloudinaryConfigured ? (
        <p className="mt-4 rounded-xl bg-brand-mint px-4 py-3 text-sm text-brand-navy">Cloudinary is not configured.</p>
      ) : (
        <div className="mt-8 max-w-3xl">
          <ImageDropzone
            label="Upload images"
            folder="media"
            multiple
            onUploaded={() => revalidator.revalidate()}
          />
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-brand-surface text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Preview</th>
                <th className="px-4 py-3 font-medium">Alt text</th>
                <th className="px-4 py-3 font-medium">Uploaded</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Copy</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loaderData.assets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No uploads yet.
                  </td>
                </tr>
              ) : (
                loaderData.assets.map((asset) => (
                  <tr key={asset.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      {asset.url ? (
                        <img src={asset.url} alt="" className="h-12 w-16 rounded-lg object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Unavailable</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-navy">{asset.altText}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(asset.uploadedAt).toLocaleString("en-CA")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {asset.url ? (
                        <button
                          type="button"
                          className="inline-flex min-h-11 items-center rounded-full border border-brand-navy px-4 text-sm font-medium text-brand-navy hover:bg-brand-navy hover:text-white cursor-pointer"
                          onClick={() => {
                            void copyUrl(asset.id, asset.url!);
                          }}
                        >
                          {copiedId === asset.id ? "Copied" : "Copy URL"}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
