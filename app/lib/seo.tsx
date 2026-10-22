

export function getAppUrl() {
  if (typeof process !== "undefined" && process.env.APP_URL) return process.env.APP_URL;
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "http://localhost:5173";
}
export function getCanonicalUrl(path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAppUrl()}${cleanPath.split("?")[0]}`;
}
export function buildMeta({
  title,
  description,
  image,
  path = "/"
}) {
  const canonical = getCanonicalUrl(path);
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:url",
    content: canonical
  }, ...(image ? [{
    property: "og:image",
    content: image
  }] : []), {
    tagName: "link",
    rel: "canonical",
    href: canonical
  }];
}
export function localBusinessJsonLd(settings) {
  const appUrl = getAppUrl();
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "Yearwise Services",
    url: appUrl,
    logo: `${appUrl}/brand/logo-mark.svg`,
    description: "One crew for every season in Thunder Bay — lawn care, snow removal, and junk hauling. Licensed and insured.",
    telephone: settings.phone.replace(/[^\d+]/g, ""),
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Thunder Bay",
      addressRegion: "ON",
      addressCountry: "CA"
    },
    areaServed: ["Thunder Bay", "Northwood", "Current River", "Westfort", "Intercity", "McIntyre", "Neebing", "Kakabeka Falls", "Murillo"],
    priceRange: "$$",
    openingHours: "Mo-Su 07:00-19:00"
  };
}
export function serviceJsonLd(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: getCanonicalUrl(`/services/${service.slug}`),
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "Yearwise Services"
    },
    areaServed: {
      "@type": "City",
      name: "Thunder Bay"
    },
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "CAD",
      description: `Starting at ${service.price} CAD per visit`
    }
  };
}
export function faqPageJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}
export function blogPostingJsonLd(post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: getCanonicalUrl(`/blog/${post.slug}`),
    author: post.author ? {
      "@type": "Person",
      name: post.author
    } : {
      "@type": "Organization",
      name: "Yearwise Services"
    },
    datePublished: post.publishedAt?.toISOString(),
    image: post.coverImage
  };
}
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path)
    }))
  };
}
export function JsonLd({
  data
}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(data)
  }} />;
}


