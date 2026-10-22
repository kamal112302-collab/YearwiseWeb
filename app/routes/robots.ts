

var APP_URL = process.env.APP_URL ?? "http://localhost:5173";
async function loader$12({}) {
  const body = `User-agent: *
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

Disallow: /admin
Disallow: /admin/
Disallow: /api/

Sitemap: ${APP_URL}/sitemap.xml
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400"
    }
  });
}

export { loader$12 as loader };
