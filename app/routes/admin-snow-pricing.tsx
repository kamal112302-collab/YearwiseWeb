import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useNavigation } from "react-router";
import { ImageDropzone } from "../components/admin/ImageDropzone";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { db } from "../db.server";
import { defaultSnowPricing } from "../lib/content.data";
import { asPublicId } from "../lib/media";
import { requireAdmin } from "../lib/session.server";
import { formatCurrency } from "../lib/utils";

const SETTING_KEYS = [
  "snowEarlyBirdDiscount",
  "snowEarlyBirdDeadline",
  "snowCommercialHeading",
  "snowCommercialBody",
  "snowCommercialPriceNote",
  "snowCommercialImage",
] as const;

async function upsertSetting(key: string, value: string) {
  await db.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const [tiers, addOns, settings] = await Promise.all([
    db.snowPricingTier.findMany({ orderBy: { sortOrder: "asc" } }),
    db.snowAddOn.findMany({ orderBy: { sortOrder: "asc" } }),
    db.siteSetting.findMany({ where: { key: { in: [...SETTING_KEYS] } } }),
  ]);
  const map = Object.fromEntries(settings.map((row) => [row.key, row.value]));

  return {
    tiers: tiers.map((tier) => ({
      id: tier.id,
      label: tier.label,
      price: Number(tier.price),
      sortOrder: tier.sortOrder,
      isActive: tier.isActive,
    })),
    addOns: addOns.map((addOn) => ({
      id: addOn.id,
      name: addOn.name,
      price: addOn.price == null ? "" : String(Number(addOn.price)),
      sortOrder: addOn.sortOrder,
      isActive: addOn.isActive,
    })),
    settings: {
      snowEarlyBirdDiscount: String(map.snowEarlyBirdDiscount ?? defaultSnowPricing.earlyBird.discount),
      snowEarlyBirdDeadline: String(map.snowEarlyBirdDeadline ?? ""),
      snowCommercialHeading: String(map.snowCommercialHeading ?? defaultSnowPricing.commercial.heading),
      snowCommercialBody: String(map.snowCommercialBody ?? defaultSnowPricing.commercial.body),
      snowCommercialPriceNote: String(map.snowCommercialPriceNote ?? defaultSnowPricing.commercial.priceNote),
      snowCommercialImage: asPublicId(String(map.snowCommercialImage ?? "")) ?? defaultSnowPricing.commercial.image,
    },
  };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "create-tier") {
    await db.snowPricingTier.create({
      data: {
        label: String(formData.get("label") ?? "").trim(),
        price: Number(formData.get("price") ?? 0).toFixed(2),
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
      },
    });
    return { ok: true };
  }

  if (intent === "update-tier") {
    const id = String(formData.get("id"));
    await db.snowPricingTier.update({
      where: { id },
      data: {
        label: String(formData.get("label") ?? "").trim(),
        price: Number(formData.get("price") ?? 0).toFixed(2),
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
        isActive: formData.get("isActive") === "on",
      },
    });
    return { ok: true };
  }

  if (intent === "delete-tier") {
    await db.snowPricingTier.delete({ where: { id: String(formData.get("id")) } });
    return { ok: true };
  }

  if (intent === "create-addon") {
    const rawPrice = String(formData.get("price") ?? "").trim();
    await db.snowAddOn.create({
      data: {
        name: String(formData.get("name") ?? "").trim(),
        price: rawPrice === "" ? null : Number(rawPrice).toFixed(2),
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
      },
    });
    return { ok: true };
  }

  if (intent === "update-addon") {
    const id = String(formData.get("id"));
    const rawPrice = String(formData.get("price") ?? "").trim();
    await db.snowAddOn.update({
      where: { id },
      data: {
        name: String(formData.get("name") ?? "").trim(),
        price: rawPrice === "" ? null : Number(rawPrice).toFixed(2),
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
        isActive: formData.get("isActive") === "on",
      },
    });
    return { ok: true };
  }

  if (intent === "delete-addon") {
    await db.snowAddOn.delete({ where: { id: String(formData.get("id")) } });
    return { ok: true };
  }

  if (intent === "save-settings") {
    for (const key of SETTING_KEYS) {
      let value = String(formData.get(key) ?? "").trim();
      if (key === "snowCommercialImage") {
        value = asPublicId(value) ?? "";
      }
      await upsertSetting(key, value);
    }
    return { ok: true };
  }

  return { ok: false };
}

export default function AdminSnowPricing({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const saving = useNavigation().state !== "idle";
  const { tiers, addOns, settings } = loaderData;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Snow Pricing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Season packages, add-ons, early-bird discount, and commercial copy. Changes show on the snow removal page and home page.
        </p>
      </div>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-brand-navy">Season packages</h2>
        <Form method="post" className="flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-white p-6">
          <input type="hidden" name="intent" value="create-tier" />
          <h3 className="font-semibold text-brand-navy">Add package</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Label" name="label" placeholder="1-car driveway" required />
            <Input label="Season price (CAD, before tax)" name="price" type="number" min="0" step="1" required />
            <Input label="Sort order" name="sortOrder" type="number" defaultValue="99" />
          </div>
          <Button type="submit" disabled={saving}>
            Add package
          </Button>
        </Form>

        <div className="flex flex-col gap-4">
          {tiers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No packages yet. Add the driveway sizes above.</p>
          ) : (
            tiers.map((tier) => (
              <div key={tier.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-6">
                <Form method="post" className="flex flex-col gap-4">
                  <input type="hidden" name="intent" value="update-tier" />
                  <input type="hidden" name="id" value={tier.id} />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input label="Label" name="label" defaultValue={tier.label} required />
                    <Input label="Season price" name="price" type="number" min="0" step="1" defaultValue={String(tier.price)} required />
                    <Input label="Sort order" name="sortOrder" type="number" defaultValue={String(tier.sortOrder)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex min-h-11 items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" name="isActive" defaultChecked={tier.isActive} />
                      Active on site
                    </label>
                    <Button type="submit" disabled={saving}>
                      Save
                    </Button>
                    <span className="text-sm text-muted-foreground">{formatCurrency(tier.price)} / season</span>
                  </div>
                </Form>
                <Form
                  method="post"
                  onSubmit={(event) => {
                    if (!confirm(`Delete ${tier.label}?`)) event.preventDefault();
                  }}
                >
                  <input type="hidden" name="intent" value="delete-tier" />
                  <input type="hidden" name="id" value={tier.id} />
                  <Button type="submit" variant="outline" disabled={saving}>
                    Delete package
                  </Button>
                </Form>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-brand-navy">Add-ons</h2>
        <Form method="post" className="flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-white p-6">
          <input type="hidden" name="intent" value="create-addon" />
          <h3 className="font-semibold text-brand-navy">Add add-on</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Name" name="name" placeholder="Staircase shovelling" required />
            <Input label="Price (blank = Ask for pricing)" name="price" type="number" min="0" step="1" />
            <Input label="Sort order" name="sortOrder" type="number" defaultValue="99" />
          </div>
          <Button type="submit" disabled={saving}>
            Add add-on
          </Button>
        </Form>

        <div className="flex flex-col gap-4">
          {addOns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No add-ons yet.</p>
          ) : (
            addOns.map((addOn) => (
              <div key={addOn.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-6">
                <Form method="post" className="flex flex-col gap-4">
                  <input type="hidden" name="intent" value="update-addon" />
                  <input type="hidden" name="id" value={addOn.id} />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input label="Name" name="name" defaultValue={addOn.name} required />
                    <Input label="Price (blank = Ask for pricing)" name="price" type="number" min="0" step="1" defaultValue={addOn.price} />
                    <Input label="Sort order" name="sortOrder" type="number" defaultValue={String(addOn.sortOrder)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex min-h-11 items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" name="isActive" defaultChecked={addOn.isActive} />
                      Active on site
                    </label>
                    <Button type="submit" disabled={saving}>
                      Save
                    </Button>
                  </div>
                </Form>
                <Form
                  method="post"
                  onSubmit={(event) => {
                    if (!confirm(`Delete ${addOn.name}?`)) event.preventDefault();
                  }}
                >
                  <input type="hidden" name="intent" value="delete-addon" />
                  <input type="hidden" name="id" value={addOn.id} />
                  <Button type="submit" variant="outline" disabled={saving}>
                    Delete add-on
                  </Button>
                </Form>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-navy">Early-bird & commercial</h2>
        <Form method="post" className="mt-4 flex max-w-3xl flex-col gap-5 rounded-2xl border border-border bg-white p-6">
          <input type="hidden" name="intent" value="save-settings" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Early-bird discount (CAD)"
              name="snowEarlyBirdDiscount"
              type="number"
              min="0"
              step="1"
              defaultValue={settings.snowEarlyBirdDiscount}
            />
            <Input
              label="Early-bird deadline (YYYY-MM-DD)"
              name="snowEarlyBirdDeadline"
              type="date"
              defaultValue={settings.snowEarlyBirdDeadline}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Leave the deadline blank to hide the early-bird line on the site. Set a future date to show it.
          </p>
          <Input label="Commercial heading" name="snowCommercialHeading" defaultValue={settings.snowCommercialHeading} />
          <Textarea label="Commercial body" name="snowCommercialBody" rows={4} defaultValue={settings.snowCommercialBody} />
          <Input label="Commercial price note" name="snowCommercialPriceNote" defaultValue={settings.snowCommercialPriceNote} />
          <ImageDropzone
            label="Commercial photo"
            name="snowCommercialImage"
            folder="services"
            valueField="publicId"
            defaultPublicId={settings.snowCommercialImage}
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save early-bird & commercial"}
          </Button>
        </Form>
      </section>
    </div>
  );
}
