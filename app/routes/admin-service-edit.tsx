import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, Form, Link, useActionData, useNavigation } from "react-router";
import { ImageDropzone } from "../components/admin/ImageDropzone";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { db } from "../db.server";
import { presentService } from "../lib/service-record";
import { requireAdmin } from "../lib/session.server";

function cleanUrl(value: FormDataEntryValue | null) {
  const url = String(value ?? "").trim();
  if (!url) return null;
  if (url.startsWith("/") || url.startsWith("https://")) return url;
  return null;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const service = await db.service.findUnique({ where: { id: params.id } });
  if (!service) throw data("Not found", { status: 404 });
  return { service: presentService(service) };
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireAdmin(request);
  const existing = await db.service.findUnique({ where: { id: params.id } });
  if (!existing) throw data("Not found", { status: 404 });

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startingPrice = Number(formData.get("startingPrice"));
  const heroImage = cleanUrl(formData.get("heroImage"));
  const cardImage = cleanUrl(formData.get("cardImage"));
  const rawHero = String(formData.get("heroImage") ?? "").trim();
  const rawCard = String(formData.get("cardImage") ?? "").trim();

  if (!name) return data({ ok: false, error: "Name is required." }, { status: 400 });
  if (!description) return data({ ok: false, error: "Description is required." }, { status: 400 });
  if (!Number.isFinite(startingPrice) || startingPrice < 0) {
    return data({ ok: false, error: "Enter a starting price of 0 or more." }, { status: 400 });
  }
  if ((rawHero && !heroImage) || (rawCard && !cardImage)) {
    return data({ ok: false, error: "Images must be an uploaded file or a site path." }, { status: 400 });
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
  const { service } = loaderData;
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
          <p className="mt-1 text-sm text-muted-foreground">Drop a photo onto the hero or card, then save.</p>
        </div>
        <Link to={`/admin/services/${service.id}`} className="text-sm font-medium text-brand-navy underline-offset-2 hover:underline">
          View
        </Link>
      </div>

      <Form method="post" className="mt-8 flex max-w-3xl flex-col gap-5 rounded-2xl border border-border bg-white p-6">
        {result && "ok" in result && result.ok ? (
          <p className="rounded-xl bg-brand-mint px-4 py-3 text-sm text-brand-navy" role="status">
            Saved. The public service page is updated.
          </p>
        ) : null}
        {result && "error" in result && result.error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {result.error}
          </p>
        ) : null}

        <Input label="Name" name="name" defaultValue={service.name} required />
        <Input label="Short description" name="shortDescription" defaultValue={service.shortDescription ?? ""} />
        <Textarea label="Description" name="description" defaultValue={service.description} rows={5} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Starting price (CAD)" name="startingPrice" type="number" min="0" step="1" defaultValue={String(service.startingPrice)} required />
          <Input label="Sort order" name="sortOrder" type="number" defaultValue={String(service.sortOrder)} />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <ImageDropzone label="Hero image" name="heroImage" folder="services" defaultUrl={service.heroImage ?? ""} />
          <ImageDropzone label="Card image" name="cardImage" folder="services" defaultUrl={service.cardImage ?? ""} />
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
    </div>
  );
}
