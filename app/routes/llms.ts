

var APP_URL$1 = process.env.APP_URL ?? "https://yearwiseservices.com";
async function loader$14({}) {
  const body = `# Yearwise Services

> One insured crew for lawn care, snow removal, and junk hauling in Thunder Bay, Ontario — 365 days a year.

## Contact
- Phone: (807) 358-2540
- Quote form: ${APP_URL$1}/contact
- Service area: Thunder Bay and Northwood, Current River, Westfort, Intercity, McIntyre, Neebing, Kakabeka Falls, Murillo

## Services (starting prices, CAD per visit)
- Lawn care: from $49 — ${APP_URL$1}/services/lawn-care
- Snow removal: from $59, automatic after 5cm+ — ${APP_URL$1}/services/snow-removal
- Junk removal: from $99 — ${APP_URL$1}/services/junk-removal
- Year-round bundle: save 20%, priority scheduling

## Policies
- No long-term contract required; cancel anytime
- Licensed and insured; handshake guarantee on every visit
- First lawn cut promo: $49 (reg. $85) for new customers (see site banner)

## Key pages
- Home: ${APP_URL$1}/
- FAQ: ${APP_URL$1}/faq
- About: ${APP_URL$1}/about
- Blog: ${APP_URL$1}/blog
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400"
    }
  });
}

export { loader$14 as loader };
