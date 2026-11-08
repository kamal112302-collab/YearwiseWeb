import { db } from "../db.server";
import { defaultSettings } from "../lib/content.data";
import { Form, useActionData } from "react-router";
import { Input, Textarea } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

function parseDiscountPercent(value: unknown): number {
  const raw = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(raw)) return defaultSettings.yearRoundDiscountPercent;
  return Math.min(100, Math.max(0, Math.round(raw)));
}

async function getSettingsMap() {
  const rows = await db.siteSetting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    phone: String(map.phone ?? defaultSettings.phone),
    email: String(map.email ?? defaultSettings.email),
    promoBanner: String(map.promoBanner ?? defaultSettings.promoBanner),
    businessHours: String(map.businessHours ?? defaultSettings.businessHours),
    address: String(map.address ?? defaultSettings.address),
    yearRoundDiscountPercent: parseDiscountPercent(
      map.yearRoundDiscountPercent ?? defaultSettings.yearRoundDiscountPercent,
    ),
  };
}

async function loader() {
  return {
    settings: await getSettingsMap(),
  };
}

async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  for (const key of ["phone", "email", "promoBanner", "businessHours", "address"] as const) {
    const value = String(formData.get(key) ?? "");
    await db.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  const yearRoundDiscountPercent = parseDiscountPercent(formData.get("yearRoundDiscountPercent"));
  await db.siteSetting.upsert({
    where: { key: "yearRoundDiscountPercent" },
    create: { key: "yearRoundDiscountPercent", value: yearRoundDiscountPercent },
    update: { value: yearRoundDiscountPercent },
  });

  return { ok: true };
}

function AdminSettings({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  const s = loaderData.settings;
  const result = useActionData<typeof action>();
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Settings</h1>
      {result?.ok ? (
        <p className="mt-4 text-sm text-brand-green-deep" role="status">
          Settings saved.
        </p>
      ) : null}
      <Form method="post" className="mt-8 flex max-w-lg flex-col gap-4">
        <Input label="Phone" name="phone" defaultValue={s.phone} required />
        <Input label="Email" name="email" type="email" defaultValue={s.email} required />
        <Textarea label="Promo banner" name="promoBanner" defaultValue={s.promoBanner} rows={2} />
        <Input label="Business hours" name="businessHours" defaultValue={s.businessHours} />
        <Input label="Address" name="address" defaultValue={s.address} />
        <div>
          <Input
            label="Year-round discount (%)"
            name="yearRoundDiscountPercent"
            type="number"
            min={0}
            max={100}
            step={1}
            defaultValue={s.yearRoundDiscountPercent}
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Used for year-round bundle copy across the site. Update the promo banner text separately if it mentions the percent.
          </p>
        </div>
        <Button type="submit">Save settings</Button>
      </Form>
    </div>
  );
}

export default AdminSettings;
export { action, loader };
