import { getSiteSettings, getServices } from "../lib/content.server";
import { isDatabaseAvailable, db } from "../db.server";
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
  const message = String(formData.get("message") ?? "").trim();
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
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">Get a <span className="text-brand-green">free quote.</span></h1>
          <p className="mt-4 max-w-md text-muted-foreground">Most estimates take under five minutes on the phone. Or send a note and we'll reply within a day.</p>
          <dl className="mt-8 flex flex-col gap-5 text-sm">
            <div><dt className="text-[11px] font-semibold uppercase tracking-[0.16em]">Phone</dt><dd className="mt-1"><a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="cursor-pointer text-lg font-semibold text-brand-green">{settings.phone}</a></dd></div>
            <div><dt className="text-[11px] font-semibold uppercase tracking-[0.16em]">Email</dt><dd className="mt-1"><a href={`mailto:${settings.email}`} className="cursor-pointer font-semibold">{settings.email}</a></dd></div>
            <div><dt className="text-[11px] font-semibold uppercase tracking-[0.16em]">Hours</dt><dd className="mt-1 text-muted-foreground">{settings.businessHours}</dd></div>
          </dl>
        </div>
        <div className="rounded-[2rem] bg-white/70 p-6 sm:p-8">
          {result?.success && <div className="mb-6 rounded-2xl bg-brand-mint px-4 py-3 text-sm" role="status">Thanks — we'll be in touch shortly with your quote.</div>}
          {result?.error && <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{result.error}</div>}
          <Form method="post" className="flex flex-col gap-4">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <Input label="Name" name="name" required autoComplete="name" />
            <Input label="Email" name="email" type="email" required autoComplete="email" />
            <Input label="Phone" name="phone" type="tel" autoComplete="tel" />
            <Select label="Service" name="service" defaultValue=""><option value="">Select a service</option>{services.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}<option value="Year-round bundle">Year-round bundle</option></Select>
            <Input label="Neighbourhood" name="neighbourhood" placeholder="e.g. Current River" />
            <Textarea label="How can we help?" name="message" required rows={5} />
            <Button type="submit" className="w-full uppercase tracking-[0.14em] text-xs">Send request</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
export { action$9 as action, loader$18 as loader, meta$3 as meta };
