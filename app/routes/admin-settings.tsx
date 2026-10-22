import { db } from "../db.server";
import { defaultSettings } from "../lib/content.data";
import { Form } from "react-router";
import { Input, Textarea } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

async function getSettingsMap() {
  const rows = await db.siteSetting.findMany();
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return {
    phone: String(map.phone ?? defaultSettings.phone),
    email: String(map.email ?? defaultSettings.email),
    promoBanner: String(map.promoBanner ?? defaultSettings.promoBanner),
    businessHours: String(map.businessHours ?? defaultSettings.businessHours),
    address: String(map.address ?? defaultSettings.address)
  };
}
async function loader$1({}) {
  return {
    settings: await getSettingsMap()
  };
}
async function action$1({
  request
}) {
  const formData = await request.formData();
  for (const key of ["phone", "email", "promoBanner", "businessHours", "address"]) {
    const value = String(formData.get(key) ?? "");
    await db.siteSetting.upsert({
      where: {
        key
      },
      create: {
        key,
        value
      },
      update: {
        value
      }
    });
  }
  return {
    ok: true
  };
}
function AdminSettings({
  loaderData
}) {
  const s = loaderData.settings;
  return <div> <h1 className="text-2xl font-bold text-brand-navy">Settings</h1> <Form method="post" className="mt-8 max-w-lg flex flex-col gap-4"> <Input label="Phone" name="phone" defaultValue={s.phone} required /> <Input label="Email" name="email" type="email" defaultValue={s.email} required /> <Textarea label="Promo banner" name="promoBanner" defaultValue={s.promoBanner} rows={2} /> <Input label="Business hours" name="businessHours" defaultValue={s.businessHours} /> <Input label="Address" name="address" defaultValue={s.address} /> <Button type="submit">Save settings</Button></Form></div>;
}

export default AdminSettings;
export { action$1 as action, loader$1 as loader };
