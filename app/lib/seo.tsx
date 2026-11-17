import { googleRating } from "~/lib/content.data";

const PRODUCTION_APP_URL = "https://www.yearwiseservices.com";

function normalizeAppUrl(url: string) {
  return url.replace(/\/$/, "");
}

function isLocalhostUrl(url: string) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

export function getAppUrl() {
  const configured = typeof process !== "undefined" ? process.env.APP_URL?.trim() : undefined;
  const onVercel = typeof process !== "undefined" && Boolean(process.env.VERCEL);
  const isProd = typeof process !== "undefined" && process.env.NODE_ENV === "production";

  // Never emit localhost URLs in production (breaks Search Console sitemaps).
  if (configured && !(isLocalhostUrl(configured) && (onVercel || isProd))) {
    return normalizeAppUrl(configured);
  }
  if (onVercel || isProd) return PRODUCTION_APP_URL;
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "http://localhost:5173";
}
export function getCanonicalUrl(path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAppUrl()}${cleanPath.split("?")[0]}`;
}
function absoluteUrl(value?: string) {
  if (!value) return `${getAppUrl()}/brand/logo-mark.png`;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return getCanonicalUrl(value);
}
export function buildMeta({
  title,
  description,
  image,
  path = "/",
  imageAlt,
  type = "website",
}: {
  title: string;
  description: string;
  image?: string;
  path?: string;
  imageAlt?: string;
  type?: "website" | "article";
}) {
  const canonical = getCanonicalUrl(path);
  const imageUrl = absoluteUrl(image);
  const ogAlt = imageAlt ?? title;
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    name: "robots",
    content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, {
    property: "og:type",
    content: type
  }, {
    property: "og:url",
    content: canonical
  }, {
    property: "og:image",
    content: imageUrl
  }, {
    property: "og:image:width",
    content: "1200"
  }, {
    property: "og:image:height",
    content: "630"
  }, {
    property: "og:image:alt",
    content: ogAlt
  }, {
    property: "og:site_name",
    content: "Yearwise Services"
  }, {
    property: "og:locale",
    content: "en_CA"
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: title
  }, {
    name: "twitter:description",
    content: description
  }, {
    name: "twitter:image",
    content: imageUrl
  }, {
    name: "twitter:image:alt",
    content: ogAlt
  }, {
    tagName: "link",
    rel: "canonical",
    href: canonical
  }];
}
export function localBusinessJsonLd(settings) {
  const appUrl = getAppUrl();
  const phone = settings.phone.replace(/[^\d+]/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "Yearwise Services",
    url: appUrl,
    logo: `${appUrl}/brand/logo-mark.png`,
    image: `${appUrl}/brand/logo-mark.png`,
    description: "One crew for every season in Thunder Bay — lawn care, snow removal, and junk hauling. Licensed and insured.",
    telephone: phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Thunder Bay",
      addressRegion: "ON",
      addressCountry: "CA"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 48.3809,
      longitude: -89.2477
    },
    areaServed: ["Thunder Bay", "Northwood", "Current River", "Westfort", "Intercity", "McIntyre", "Neebing", "Kakabeka Falls", "Murillo", "Shuniah"],
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "19:00"
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer service",
      areaServed: "CA-ON",
      availableLanguage: ["English"]
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(googleRating.ratingValue),
      reviewCount: String(googleRating.reviewCount),
      bestRating: "5",
      worstRating: "1"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Property services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lawn Care", url: `${appUrl}/services/lawn-care` } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Snow Removal", url: `${appUrl}/services/snow-removal` } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Junk Removal", url: `${appUrl}/services/junk-removal` } }
      ]
    }
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
      description: `Starting at ${service.price} CAD ${service.priceUnit ?? "per visit"}`
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
  const appUrl = getAppUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: getCanonicalUrl(`/blog/${post.slug}`),
    mainEntityOfPage: getCanonicalUrl(`/blog/${post.slug}`),
    author: post.author ? {
      "@type": "Person",
      name: post.author
    } : {
      "@type": "Organization",
      name: "Yearwise Services"
    },
    publisher: {
      "@type": "Organization",
      name: "Yearwise Services",
      logo: {
        "@type": "ImageObject",
        url: `${appUrl}/brand/logo-mark.png`
      }
    },
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
    image: post.coverImage ? absoluteUrl(post.coverImage) : undefined
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


