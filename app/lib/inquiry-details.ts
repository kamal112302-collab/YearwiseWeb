export type InquiryDetails = {
  snowTier?: string;
  snowPlan?: string;
  snowAddOns?: string[];
  lawnPropertySize?: string;
  lawnFrequency?: string;
  junkItems?: string[];
  junkSize?: string;
};

export function formatInquiryDetails(details: InquiryDetails | null | undefined): string {
  if (!details || typeof details !== "object") return "";
  const parts: string[] = [];
  if (details.snowTier) parts.push(`Driveway: ${details.snowTier}`);
  if (details.snowPlan) parts.push(`Plan: ${details.snowPlan}`);
  if (details.snowAddOns?.length) parts.push(`Add-ons: ${details.snowAddOns.join(", ")}`);
  if (details.lawnPropertySize) parts.push(`Property: ${details.lawnPropertySize}`);
  if (details.lawnFrequency) parts.push(`Frequency: ${details.lawnFrequency}`);
  if (details.junkItems?.length) parts.push(`Items: ${details.junkItems.join(", ")}`);
  if (details.junkSize) parts.push(`Job size: ${details.junkSize}`);
  return parts.join(" · ");
}

export function buildInquiryDetails(formData: FormData, service: string): InquiryDetails | null {
  const details: InquiryDetails = {};
  const normalized = service.toLowerCase();

  if (normalized.includes("snow")) {
    const snowTier = String(formData.get("snowTier") ?? "").trim();
    const snowPlan = String(formData.get("snowPlan") ?? "").trim();
    const snowAddOns = formData
      .getAll("snowAddOns")
      .map((value) => String(value).trim())
      .filter(Boolean);
    if (snowTier && snowTier !== "not-sure") details.snowTier = snowTier;
    if (snowPlan) details.snowPlan = snowPlan === "season" ? "Season package" : snowPlan === "one-off" ? "One-off visit" : snowPlan;
    if (snowAddOns.length) details.snowAddOns = snowAddOns;
  } else if (normalized.includes("lawn")) {
    const lawnPropertySize = String(formData.get("lawnPropertySize") ?? "").trim();
    const lawnFrequency = String(formData.get("lawnFrequency") ?? "").trim();
    if (lawnPropertySize && lawnPropertySize !== "not-sure") details.lawnPropertySize = lawnPropertySize;
    if (lawnFrequency && lawnFrequency !== "not-sure") details.lawnFrequency = lawnFrequency;
  } else if (normalized.includes("junk")) {
    const junkItems = formData
      .getAll("junkItems")
      .map((value) => String(value).trim())
      .filter(Boolean);
    const junkSize = String(formData.get("junkSize") ?? "").trim();
    if (junkItems.length) details.junkItems = junkItems;
    if (junkSize && junkSize !== "not-sure") details.junkSize = junkSize;
  }

  return Object.keys(details).length > 0 ? details : null;
}
