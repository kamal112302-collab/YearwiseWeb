import { getSiteSettings, getServices, getSnowPricing } from "../lib/content.server";
import { isDatabaseAvailable, db } from "../db.server";
import { Breadcrumbs } from "../components/storefront/Breadcrumbs";
import { QuoteForm } from "../components/storefront/QuoteForm";
import { buildMeta, JsonLd, breadcrumbJsonLd } from "../lib/seo";
import { sendInquiryNotificationEmail } from "../lib/email.server";
import { buildInquiryDetails, formatInquiryDetails } from "../lib/inquiry-details";
import { getTurnstileSiteKey, verifyTurnstile } from "../lib/turnstile.server";
import { useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";

async function loader() {
  const [settings, services, snowPricing] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getSnowPricing(),
  ]);
  return {
    settings,
    services,
    snowPricing,
    turnstileSiteKey: getTurnstileSiteKey(),
    dbAvailable: isDatabaseAvailable(),
  };
}

function meta() {
  return buildMeta({
    title: "Contact & Free Quote — Yearwise Services",
    description:
      "Request a free lawn care, snow removal, or junk hauling quote in Thunder Bay. Call (807) 358-2540 or send a message — real people, no pressure.",
    path: "/contact",
  });
}

async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  if (formData.get("website")) return { success: true };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const neighbourhood = String(formData.get("neighbourhood") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const note = String(formData.get("message") ?? "").trim();
  const details = buildInquiryDetails(formData, service);
  const detailsLine = formatInquiryDetails(details);

  const messageParts = [
    address ? `Address: ${address}` : "",
    detailsLine ? `Details: ${detailsLine}` : "",
    note,
  ].filter(Boolean);
  const message =
    messageParts.join("\n") ||
    (service ? `${service} quote request.` : "Quote request.");

  if (!name || !email) {
    return { error: "Please fill in name and email." };
  }

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  const captcha = await verifyTurnstile(turnstileToken, request.headers.get("CF-Connecting-IP"));
  if (!captcha.ok) {
    return { error: captcha.error };
  }

  if (!isDatabaseAvailable()) {
    return { error: "Quotes are temporarily unavailable. Please call us directly." };
  }

  await db.inquiry.create({
    data: {
      name,
      email,
      phone: phone || null,
      service: service || null,
      neighbourhood: neighbourhood || null,
      message,
      details: details ?? undefined,
    },
  });

  await sendInquiryNotificationEmail({
    to: process.env.CONTACT_EMAIL ?? (await getSiteSettings()).email,
    name,
    email,
    phone,
    service,
    neighbourhood,
    message,
    detailsLine,
  });

  return { success: true };
}

function Contact({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { settings, services, snowPricing, turnstileSiteKey } = loaderData;
  const result = useActionData<typeof action>();
  const tel = settings.phone.replace(/[^\d+]/g, "");

  return (
    <div>
      <div className="section-pad">
        <Breadcrumbs items={[{ name: "Home", to: "/" }, { name: "Contact" }]} />
        <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <h1 className="display text-4xl sm:text-5xl">Get a free quote in Thunder Bay.</h1>
            <a
              href={`tel:${tel}`}
              className="mt-6 inline-flex min-h-12 cursor-pointer items-center font-display text-4xl font-extrabold text-brand-green-deep hover:underline sm:text-5xl"
            >
              {settings.phone}
            </a>
            <p className="mt-4 text-base text-brand-navy">{settings.businessHours}</p>
            <p className="mt-1 text-base">
              <a href={`mailto:${settings.email}`} className="cursor-pointer font-semibold text-brand-green-deep hover:underline">
                {settings.email}
              </a>
            </p>
            <h2 className="mt-12 text-xl font-semibold text-brand-navy">What happens next</h2>
            <ul className="mt-4 flex flex-col gap-3 text-base text-brand-navy/80">
              <li>Most phone quotes take a few minutes.</li>
              <li>Pick a service on the form so we know driveway size, lawn frequency, or junk type before we call back.</li>
              <li>A written note gets a reply within a day.</li>
              <li>A junk quote is faster with a photo sent by text.</li>
            </ul>
          </div>
          <div className="bg-brand-surface px-5 py-6 sm:px-8 sm:py-8">
            <QuoteForm
              services={services}
              snowPricing={snowPricing}
              turnstileSiteKey={turnstileSiteKey}
              result={result}
            />
          </div>
        </div>
      </div>
      <section aria-labelledby="service-map">
        <div className="mx-auto max-w-7xl px-4 pb-5 sm:px-6 lg:px-8">
          <h2 id="service-map" className="text-3xl font-semibold text-brand-navy">
            Where we work
          </h2>
          <p className="mt-3 max-w-2xl text-base text-brand-navy/80">
            {settings.address}. There is no shop to visit. Call if you are not sure your street is on the route.
          </p>
        </div>
        <iframe
          title="Map of Thunder Bay, Ontario"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-89.55%2C48.28%2C-89.00%2C48.52&layer=mapnik"
          width={1200}
          height={560}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[28rem] w-full border-0 sm:h-[36rem]"
        />
        <p className="mx-auto max-w-7xl px-4 py-4 text-sm sm:px-6 lg:px-8">
          <a
            href="https://www.openstreetmap.org/#map=12/48.381/-89.247"
            className="cursor-pointer font-semibold text-brand-green-deep hover:underline"
          >
            Open the map
          </a>
        </p>
      </section>
    </div>
  );
}

export default Contact;
export { action, loader, meta };
