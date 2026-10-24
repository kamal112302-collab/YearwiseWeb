
var APP_URL = process.env.APP_URL ?? "http://localhost:5173";

const privatePaths = `Disallow: /admin
Disallow: /admin/
Disallow: /admin/api/`;

async function loader() {
  const body = `User-agent: *
Allow: /
${privatePaths}

User-agent: GPTBot
Disallow: /

User-agent: OAI-SearchBot
Allow: /
${privatePaths}

User-agent: PerplexityBot
Allow: /
${privatePaths}

Sitemap: ${APP_URL}/sitemap.xml
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400"
    }
  });
}

export { loader };
