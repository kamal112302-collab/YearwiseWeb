import { getSiteSettings, getServices } from "../lib/content.server";
import { isDatabaseAvailable, db } from "../db.server";
import { Breadcrumbs } from "../components/storefront/Breadcrumbs";
import { buildMeta, JsonLd, breadcrumbJsonLd } from "../lib/seo";
import { sendInquiryNotificationEmail } from "../lib/email.server";
import { useActionData, Form } from "react-router";
import { Input, Select, Textarea } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

async function loader$18({}) {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);
  return {
    settings,
    services,
    dbAvailable: isDatabaseAvailable()
  };
}
function meta$3({}) {
  return buildMeta({
    title: "Contact & Free Quote — Yearwise Services",
    description: "Request a free lawn care, snow removal, or junk hauling quote in Thunder Bay. Call (807) 358-2540 or send a message — real people, no pressure.",
    path: "/contact"
  });
}
async function action$9({
  request
}) {
  const formData = await request.formData();
  if (formData.get("website")) return {
    success: true
  };
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const neighbourhood = String(formData.get("neighbourhood") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const note = String(formData.get("message") ?? "").trim();
  const message = address ? `Address: ${address}\n${note}` : note;
  if (!name || !email || !message) return {
    error: "Please fill in name, email, and message."
  };
  if (!isDatabaseAvailable()) return {
    error: "Quotes are temporarily unavailable. Please call us directly."
  };
  await db.inquiry.create({
    data: {
      name,
      email,
      phone: phone || null,
      service: service || null,
      neighbourhood: neighbourhood || null,
      message
    }
  });
  await sendInquiryNotificationEmail({
    to: process.env.CONTACT_EMAIL ?? (await getSiteSettings()).email,
    name,
    email,
    phone,
    service,
    neighbourhood,
    message
  });
  return {
    success: true
  };
}
function Contact({
  loaderData
}) {
  const {
    settings,
    services
  } = loaderData;
  const result = useActionData();
  return (
    <div className="section-pad">
      <Breadcrumbs items={[{ name: "Home", to: "/" }, { name: "Contact" }]} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <h1 className="display max-w-3xl text-4xl sm:text-5xl">Get a free quote in Thunder Bay.</h1>
      <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="mt-6 inline-flex cursor-pointer font-display text-4xl font-extrabold text-brand-green-deep hover:underline">{settings.phone}</a>
      <p className="mt-3 text-base text-muted-foreground">{settings.businessHours}</p>
      <p className="mt-1 text-base"><a href={`mailto:${settings.email}`} className="cursor-pointer font-semibold text-brand-green-deep hover:underline">{settings.email}</a></p>
      <p className="mt-1 max-w-xl text-base text-muted-foreground">{settings.address}. Ask if your neighbourhood is on the route.</p>
      <div className="mt-12 max-w-3xl">
        {result?.success && <div className="mb-6 border border-brand-navy/10 px-4 py-3 text-sm" role="status">Thanks — we'll be in touch shortly with your quote.</div>}
        {result?.error && <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{result.error}</div>}
        <Form method="post" className="flex flex-col gap-4">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" name="name" required autoComplete="name" />
            <Input label="Phone" name="phone" type="tel" autoComplete="tel" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Email" name="email" type="email" required autoComplete="email" />
            <Select label="Service" name="service" defaultValue=""><option value="">Select a service</option>{services.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}<option value="Year-round bundle">Year-round bundle</option></Select>
          </div>
          <Input label="Street address" name="address" autoComplete="street-address" />
          <Input label="Neighbourhood" name="neighbourhood" placeholder="e.g. Current River" />
          <Textarea label="How can we help?" name="message" required rows={5} placeholder="What needs doing. If it is junk, describe the pile." />
          <Button type="submit">Send request</Button>
        </Form>
        <ul className="mt-6 flex flex-col gap-2 text-sm text-brand-navy/80">
          <li>Most phone quotes take a few minutes.</li>
          <li>A written note gets a reply within a day.</li>
          <li>A junk quote is faster with a photo sent by text.</li>
        </ul>
      </div>
    </div>
  );
}

export default Contact;
export { action$9 as action, loader$18 as loader, meta$3 as meta };
