import { useEffect, useId, useRef, useState } from "react";
import { Form, useNavigation } from "react-router";
import { Button } from "../ui/Button";
import { Input, Select, Textarea } from "../ui/Input";
import type { ServiceRecord, SnowPricing } from "../../lib/content.types";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const JUNK_ITEMS = ["Furniture", "Appliances", "Yard waste", "Construction debris", "Electronics", "Other"] as const;

type QuoteFormProps = {
  services: ServiceRecord[];
  snowPricing: SnowPricing;
  turnstileSiteKey: string;
  result?: { success?: boolean; error?: string } | null;
  defaultService?: string;
};

export function QuoteForm({ services, snowPricing, turnstileSiteKey, result, defaultService = "" }: QuoteFormProps) {
  const [service, setService] = useState(defaultService);
  const [turnstileToken, setTurnstileToken] = useState("");
  const sending = useNavigation().state === "submitting";
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const turnstileFieldId = useId();

  const isSnow = /snow/i.test(service);
  const isLawn = /lawn/i.test(service);
  const isJunk = /junk/i.test(service);
  const captchaRequired = Boolean(turnstileSiteKey);

  useEffect(() => {
    if (!turnstileSiteKey || !widgetRef.current) return;

    let cancelled = false;

    function renderWidget() {
      if (cancelled || !widgetRef.current || !window.turnstile) return;
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile="1"]');
    if (existing && window.turnstile) {
      renderWidget();
    } else if (existing) {
      existing.addEventListener("load", renderWidget);
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = "1";
      script.addEventListener("load", renderWidget);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [turnstileSiteKey]);

  useEffect(() => {
    if (result?.success && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      setTurnstileToken("");
    }
  }, [result?.success]);

  return (
    <Form method="post" className="flex flex-col gap-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="cf-turnstile-response" id={turnstileFieldId} value={turnstileToken} readOnly />

      {result?.success ? (
        <div className="border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy" role="status">
          Thanks — we'll be in touch shortly with your quote.
        </div>
      ) : null}
      {result?.error ? (
        <div className="bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {result.error}
        </div>
      ) : null}

      <fieldset className="flex flex-col gap-4">
        <legend className="text-lg font-semibold text-brand-navy">Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" name="name" required autoComplete="name" />
          <Input label="Phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Street address" name="address" autoComplete="street-address" />
          <Input label="Neighbourhood" name="neighbourhood" placeholder="e.g. Current River" />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-brand-navy/10 pt-8">
        <legend className="text-lg font-semibold text-brand-navy">Service details</legend>
        <Select
          label="Service"
          name="service"
          value={service}
          onChange={(event) => setService(event.target.value)}
        >
          <option value="">Select a service</option>
          {services.map((item) => (
            <option key={item.slug} value={item.name}>
              {item.name}
            </option>
          ))}
          <option value="Year-round bundle">Year-round bundle</option>
        </Select>

        {isSnow ? (
          <div className="flex flex-col gap-4 rounded-xl bg-white/70 p-4 sm:p-5">
            <p className="text-sm text-brand-navy/70">Optional — helps us quote the right driveway plan.</p>
            <Select label="Driveway size" name="snowTier" defaultValue="not-sure">
              <option value="not-sure">Not sure</option>
              {snowPricing.tiers.map((tier) => (
                <option key={tier.id} value={tier.label}>
                  {tier.label} — from {tier.price.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })} + tax
                </option>
              ))}
            </Select>
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-brand-navy">Plan type</legend>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-brand-navy">
                  <input type="radio" name="snowPlan" value="season" className="size-4 accent-brand-green" />
                  Season package
                </label>
                <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-brand-navy">
                  <input type="radio" name="snowPlan" value="one-off" className="size-4 accent-brand-green" />
                  One-off visit
                </label>
              </div>
            </fieldset>
            {snowPricing.addOns.length > 0 ? (
              <fieldset>
                <legend className="mb-2 block text-sm font-medium text-brand-navy">Add-ons</legend>
                <div className="flex flex-col gap-2">
                  {snowPricing.addOns.map((addOn) => (
                    <label key={addOn.id} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-brand-navy">
                      <input type="checkbox" name="snowAddOns" value={addOn.name} className="size-4 accent-brand-green" />
                      {addOn.name}
                      {addOn.price != null ? (
                        <span className="text-brand-navy/60">
                          ({addOn.price.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })})
                        </span>
                      ) : null}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>
        ) : null}

        {isLawn ? (
          <div className="flex flex-col gap-4 rounded-xl bg-white/70 p-4 sm:p-5">
            <p className="text-sm text-brand-navy/70">Optional — helps us size the first visit.</p>
            <Select label="Property size" name="lawnPropertySize" defaultValue="not-sure">
              <option value="not-sure">Not sure</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </Select>
            <Select label="Visit frequency" name="lawnFrequency" defaultValue="not-sure">
              <option value="not-sure">Not sure</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="One-time cleanup">One-time cleanup</option>
            </Select>
          </div>
        ) : null}

        {isJunk ? (
          <div className="flex flex-col gap-4 rounded-xl bg-white/70 p-4 sm:p-5">
            <p className="text-sm text-brand-navy/70">Optional — a photo by text still helps most. Tick what you can.</p>
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-brand-navy">What needs hauling</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {JUNK_ITEMS.map((item) => (
                  <label key={item} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-brand-navy">
                    <input type="checkbox" name="junkItems" value={item} className="size-4 accent-brand-green" />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>
            <Select label="Approximate job size" name="junkSize" defaultValue="not-sure">
              <option value="not-sure">Not sure</option>
              <option value="A few items">A few items</option>
              <option value="A truckload">A truckload</option>
              <option value="Multiple truckloads">Multiple truckloads</option>
            </Select>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-brand-navy/10 pt-8">
        <legend className="text-lg font-semibold text-brand-navy">Anything else</legend>
        <Textarea
          label="Notes (optional)"
          name="message"
          rows={4}
          placeholder="Timing, access notes, or anything else we should know."
        />
      </fieldset>

      {captchaRequired ? (
        <div className="border-t border-brand-navy/10 pt-6">
          <p className="mb-3 text-sm font-medium text-brand-navy">Verify you are human</p>
          <div ref={widgetRef} />
        </div>
      ) : null}

      <Button type="submit" disabled={sending || (captchaRequired && !turnstileToken)}>
        {sending ? "Sending…" : "Send request"}
      </Button>
    </Form>
  );
}
