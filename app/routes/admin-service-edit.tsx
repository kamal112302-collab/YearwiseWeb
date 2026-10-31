import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, Form, Link, useActionData, useNavigation } from "react-router";
import { ImageDropzone } from "../components/admin/ImageDropzone";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { db } from "../db.server";
import { asPublicId, mediaUrl } from "../lib/media";
import { presentService } from "../lib/service-record";
import { requireAdmin } from "../lib/session.server";

function cleanPublicId(value: FormDataEntryValue | null) {
  return asPublicId(String(value ?? "").trim());
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const service = await db.service.findUnique({
    where: { id: params.id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
  if (!service) throw data("Not found", { status: 404 });

  const presented = presentService(service);
  return {
    service: {
      ...presented,
      heroImage: asPublicId(presented.heroImage) ?? "",
      cardImage: asPublicId(presented.cardImage) ?? "",
    },
    gallery: service.photos
      .filter((photo) => photo.role === "gallery")
      .map((photo) => ({
        id: photo.id,
        publicId: photo.publicId,
        altText: photo.altText,
        sortOrder: photo.sortOrder,
        preview: mediaUrl(photo.publicId, 400),
      })),
    before: service.photos.find((photo) => photo.role === "before") ?? null,
    after: service.photos.find((photo) => photo.role === "after") ?? null,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireAdmin(request);
  const existing = await db.service.findUnique({ where: { id: params.id } });
  if (!existing) throw data("Not found", { status: 404 });

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "save-service");

  if (intent === "add-gallery") {
    const publicId = cleanPublicId(formData.get("publicId"));
    if (!publicId) {
      return data({ ok: false, error: "Upload a gallery photo first." }, { status: 400 });
    }
    const maxSort = await db.servicePhoto.aggregate({
      where: { serviceId: existing.id, role: "gallery" },
      _max: { sortOrder: true },
    });
    await db.servicePhoto.create({
      data: {
        serviceId: existing.id,
        role: "gallery",
        publicId,
        altText: String(formData.get("altText") ?? "").trim() || "Service photo",
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });
    return { ok: true as const, error: null };
  }

  if (intent === "update-gallery") {
    const id = String(formData.get("id"));
    await db.servicePhoto.update({
      where: { id },
      data: {
        altText: String(formData.get("altText") ?? "").trim() || "Service photo",
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
      },
    });
    return { ok: true as const, error: null };
  }

  if (intent === "delete-gallery") {
    await db.servicePhoto.delete({ where: { id: String(formData.get("id")) } });
    return { ok: true as const, error: null };
  }

  if (intent === "save-before-after") {
    const beforeId = cleanPublicId(formData.get("beforePublicId"));
    const afterId = cleanPublicId(formData.get("afterPublicId"));
    const beforeAlt = String(formData.get("beforeAlt") ?? "").trim() || "Before";
    const afterAlt = String(formData.get("afterAlt") ?? "").trim() || "After";

    if (beforeId) {
      const existingBefore = await db.servicePhoto.findFirst({
        where: { serviceId: existing.id, role: "before" },
      });
      if (existingBefore) {
        await db.servicePhoto.update({
          where: { id: existingBefore.id },
          data: { publicId: beforeId, altText: beforeAlt },
        });
      } else {
        await db.servicePhoto.create({
          data: {
            serviceId: existing.id,
            role: "before",
            publicId: beforeId,
            altText: beforeAlt,
            sortOrder: 0,
          },
        });
      }
    }

    if (afterId) {
      const existingAfter = await db.servicePhoto.findFirst({
        where: { serviceId: existing.id, role: "after" },
      });
      if (existingAfter) {
        await db.servicePhoto.update({
          where: { id: existingAfter.id },
          data: { publicId: afterId, altText: afterAlt },
        });
      } else {
        await db.servicePhoto.create({
          data: {
            serviceId: existing.id,
            role: "after",
            publicId: afterId,
            altText: afterAlt,
            sortOrder: 0,
          },
        });
      }
    }

    return { ok: true as const, error: null };
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startingPrice = Number(formData.get("startingPrice"));
  const heroImage = cleanPublicId(formData.get("heroImage"));
  const cardImage = cleanPublicId(formData.get("cardImage"));
  const rawHero = String(formData.get("heroImage") ?? "").trim();
  const rawCard = String(formData.get("cardImage") ?? "").trim();

  if (!name) return data({ ok: false, error: "Name is required." }, { status: 400 });
  if (!description) return data({ ok: false, error: "Description is required." }, { status: 400 });
  if (!Number.isFinite(startingPrice) || startingPrice < 0) {
    return data({ ok: false, error: "Enter a starting price of 0 or more." }, { status: 400 });
  }
  if ((rawHero && !heroImage) || (rawCard && !cardImage)) {
    return data({ ok: false, error: "Images must be an uploaded Cloudinary photo." }, { status: 400 });
  }

  await db.service.update({
    where: { id: existing.id },
    data: {
      name,
      shortDescription: String(formData.get("shortDescription") ?? "").trim() || null,
      description,
      startingPrice: startingPrice.toFixed(2),
      heroImage,
      cardImage,
      seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
      seoDescription: String(formData.get("seoDescription") ?? "").trim() || null,
      sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
      isActive: formData.get("isActive") === "on",
    },
  });

  return { ok: true as const, error: null };
}

export default function AdminServiceEdit({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { service, gallery, before, after } = loaderData;
  const result = useActionData<typeof action>();
  const saving = useNavigation().state !== "idle";

  return (
    <div>
      <Link to="/admin/services" className="text-sm font-medium text-brand-navy underline-offset-2 hover:underline">
        Services
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Edit {service.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hero, card, gallery, and before/after photos upload to Cloudinary and show on the public page.
          </p>
        </div>
        <Link to={`/admin/services/${service.id}`} className="text-sm font-medium text-brand-navy underline-offset-2 hover:underline">
          View
        </Link>
      </div>

      {result && "ok" in result && result.ok ? (
        <p className="mt-6 rounded-xl bg-brand-mint px-4 py-3 text-sm text-brand-navy" role="status">
          Saved. The public service page is updated.
        </p>
      ) : null}
      {result && "error" in result && result.error ? (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {result.error}
        </p>
      ) : null}

      <Form method="post" className="mt-8 flex max-w-3xl flex-col gap-5 rounded-2xl border border-border bg-white p-6">
        <input type="hidden" name="intent" value="save-service" />
        <Input label="Name" name="name" defaultValue={service.name} required />
        <Input label="Short description" name="shortDescription" defaultValue={service.shortDescription ?? ""} />
        <Textarea label="Description" name="description" defaultValue={service.description} rows={5} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Starting price (CAD)"
            name="startingPrice"
            type="number"
            min="0"
            step="1"
            defaultValue={String(service.startingPrice)}
            required
          />
          <Input label="Sort order" name="sortOrder" type="number" defaultValue={String(service.sortOrder)} />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <ImageDropzone
            label="Hero image"
            name="heroImage"
            folder="services"
            valueField="publicId"
            defaultPublicId={service.heroImage}
          />
          <ImageDropzone
            label="Card image"
            name="cardImage"
            folder="services"
            valueField="publicId"
            defaultPublicId={service.cardImage}
          />
        </div>
        <Input label="SEO title" name="seoTitle" defaultValue={service.seoTitle ?? ""} />
        <Input label="SEO description" name="seoDescription" defaultValue={service.seoDescription ?? ""} />
        <label className="flex min-h-11 items-center gap-2 text-sm text-brand-navy cursor-pointer">
          <input type="checkbox" name="isActive" defaultChecked={service.isActive} />
          Active on site
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save service"}
          </Button>
          <Link
            to={`/admin/services/${service.id}`}
            className="inline-flex min-h-11 items-center rounded-full border border-brand-navy px-6 text-sm font-medium text-brand-navy hover:bg-brand-navy hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </Form>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-lg font-semibold text-brand-navy">Gallery</h2>
        <p className="mt-1 text-sm text-muted-foreground">Full-width photos on the service page, below the pricing section.</p>

        <div className="mt-4 flex flex-col gap-4">
          {gallery.length === 0 ? (
            <p className="text-sm text-muted-foreground">No gallery photos yet.</p>
          ) : (
            gallery.map((photo) => (
              <div key={photo.id} className="rounded-2xl border border-border bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
                  <img src={photo.preview} alt="" className="h-24 w-full rounded-xl object-cover" />
                  <Form method="post" className="flex flex-col gap-3">
                    <input type="hidden" name="intent" value="update-gallery" />
                    <input type="hidden" name="id" value={photo.id} />
                    <Input label="Alt text" name="altText" defaultValue={photo.altText} />
                    <Input label="Sort order" name="sortOrder" type="number" defaultValue={String(photo.sortOrder)} />
                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" disabled={saving}>
                        Save photo
                      </Button>
                    </div>
                  </Form>
                </div>
                <Form
                  method="post"
                  className="mt-3"
                  onSubmit={(event) => {
                    if (!confirm("Delete this gallery photo?")) event.preventDefault();
                  }}
                >
                  <input type="hidden" name="intent" value="delete-gallery" />
                  <input type="hidden" name="id" value={photo.id} />
                  <Button type="submit" variant="outline" disabled={saving}>
                    Delete photo
                  </Button>
                </Form>
              </div>
            ))
          )}
        </div>

        <Form method="post" className="mt-6 flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-white p-6">
          <input type="hidden" name="intent" value="add-gallery" />
          <h3 className="font-semibold text-brand-navy">Add gallery photo</h3>
          <ImageDropzone label="Photo" name="publicId" folder="services" valueField="publicId" />
          <Input label="Alt text" name="altText" placeholder="Describe the photo" />
          <Button type="submit" disabled={saving}>
            Add to gallery
          </Button>
        </Form>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-lg font-semibold text-brand-navy">Before / after</h2>
        <p className="mt-1 text-sm text-muted-foreground">Drag-reveal comparison on the service page. One before and one after photo.</p>
        <Form method="post" className="mt-4 flex flex-col gap-5 rounded-2xl border border-border bg-white p-6">
          <input type="hidden" name="intent" value="save-before-after" />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <ImageDropzone
                label="Before photo"
                name="beforePublicId"
                folder="services"
                valueField="publicId"
                defaultPublicId={before?.publicId ?? ""}
              />
              <Input label="Before alt text" name="beforeAlt" defaultValue={before?.altText ?? ""} />
            </div>
            <div className="flex flex-col gap-3">
              <ImageDropzone
                label="After photo"
                name="afterPublicId"
                folder="services"
                valueField="publicId"
                defaultPublicId={after?.publicId ?? ""}
              />
              <Input label="After alt text" name="afterAlt" defaultValue={after?.altText ?? ""} />
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            Save before / after
          </Button>
        </Form>
      </section>
    </div>
  );
}
