const CLOUD_NAME = "wxim5gfa";

export type Photo = {
  id: string;
  alt: string;
};

export function mediaUrl(id: string, width = 1600) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${id}`;
}

/** Responsive srcset for Cloudinary images (f_auto, q_auto). */
export function mediaSrcSet(id: string, widths: number[] = [480, 800, 1200, 1600]) {
  return widths.map((width) => `${mediaUrl(id, width)} ${width}w`).join(", ");
}

/** Cloudinary video delivery URL. Pass a public ID like yearwise/web/hero-banner. */
export function videoUrl(id: string, width = 1600) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto:eco,w_${width}/${id}.mp4`;
}

export const heroVideo = {
  id: "yearwise/web/hero-banner",
  poster: "yearwise/web/lawn-striped",
} as const;

/** Normalize a stored Cloudinary public ID or delivery URL into a public ID. */
export function asPublicId(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!trimmed.startsWith("http")) return trimmed.replace(/^\/+/, "");
  try {
    const afterUpload = new URL(trimmed).pathname.split("/upload/")[1];
    if (!afterUpload) return trimmed;
    const segments = afterUpload.split("/").filter(Boolean);
    while (segments.length > 1 && (segments[0].includes(",") || /^v\d+$/.test(segments[0]))) {
      segments.shift();
    }
    return segments.join("/").replace(/\.[a-z0-9]+$/i, "");
  } catch {
    return trimmed;
  }
}

function photo(id: string, alt: string): Photo {
  return { id: `yearwise/web/${id}`, alt };
}

function servicesPagePhoto(id: string, alt: string): Photo {
  return { id: `services-page/${id}`, alt };
}

export const photos = {
  lawnStriped: photo("lawn-striped", "A mower leaving even stripes on a green residential lawn beside a row of arborvitae"),
  lawnEdging: photo("lawn-edging", "Overhead view of a crew member edging a lawn along a gravel border"),
  lawnGolden: photo("lawn-golden", "A walk-behind mower cutting grass in warm evening light"),
  lawnClose: photo("lawn-close", "Close view of a lawn mower on a freshly cut green lawn"),
  lawnAeration: photo("lawn-aeration", "A crew member running an aerator across a residential lawn"),
  cleanupBefore: photo(
    "cleanup-before",
    "A Thunder Bay side path buried under cedar needles and debris before cleanup",
  ),
  cleanupAfter: photo(
    "cleanup-after",
    "The same path cleared and washed, with clean pavers after Yearwise cleanup",
  ),
  lawnFallStreet: photo(
    "lawn-fall-street",
    "Thunder Bay residential street in fall with leaf piles and a Yearwise crew working on the property",
  ),
  lawnFallCleanup: servicesPagePhoto(
    "fall-cleanup",
    "Thunder Bay residential street with autumn leaves covering lawns and driveways before fall cleanup",
  ),
  lawnDeckPool: servicesPagePhoto(
    "spring-cleanup",
    "Backyard with leaf-covered lawn, weathered fence, and debris before a Yearwise spring cleanup",
  ),
  springCleanupHover: servicesPagePhoto(
    "spring-cleanup-hover",
    "Backyard with debris-filled fire pit and weathered fence before a Yearwise spring cleanup",
  ),
  lawnHedgeTrimming: photo(
    "lawn-hedge-trimming",
    "Crew trimming a tall green hedge beside a residential home",
  ),
  lawnGutterCleanup: servicesPagePhoto(
    "gutter-cleanup",
    "Residential metal gutter packed with dry brown leaves next to a blue metal roof",
  ),
  gutterCleanupHover: servicesPagePhoto(
    "gutter-cleanup-hover",
    "Clean residential gutter on a blue metal roof after Yearwise gutter cleanup",
  ),
  lawnFenceStaining: servicesPagePhoto(
    "fence-stain-after",
    "Freshly stained reddish-brown wooden picket fence after Yearwise fence staining",
  ),
  fenceStainBefore: servicesPagePhoto(
    "fence-stain-before",
    "Weathered grey wooden privacy fence in a Thunder Bay backyard before cleaning and staining",
  ),
  fenceStainAfter: servicesPagePhoto(
    "fence-stain-after",
    "Freshly stained reddish-brown wooden picket fence after Yearwise fence staining",
  ),
  lawnCareCard: servicesPagePhoto(
    "lawn-care-card",
    "Spacious residential backyard in autumn with fallen leaves on a green lawn",
  ),
  turfCare: servicesPagePhoto(
    "turf-care",
    "Well-kept residential front lawn and stone driveway after professional turf care",
  ),
  fenceStainDetail: servicesPagePhoto(
    "fence-stain-detail",
    "Freshly stained reddish-brown wooden fence, porch, and pergola gate between two homes after Yearwise staining",
  ),
  fenceStainDeck: servicesPagePhoto(
    "fence-stain-deck",
    "Freshly stained reddish-brown wooden deck with black gazebo after Yearwise staining and painting",
  ),
  lawnChristmasLighting: photo(
    "lawn-christmas-lighting",
    "Suburban home with warm Christmas lights on shrubs and porch at dusk",
  ),
  lawnBinCleaning: photo(
    "lawn-bin-cleaning",
    "Residential garbage and recycling bins being washed on a driveway",
  ),
  snowNight: photo("snow-night", "A plow truck with headlights on, clearing snow at dusk with pines behind it"),
  snowAction: photo("snow-action", "A plow truck pushing a bank of snow at sunrise"),
  snowStorm: photo("snow-storm", "A snowplow driving through heavy snowfall with its warning lights on"),
  snowPlow: photo("snow-plow", "A truck with a yellow plow blade clearing a snow-covered street"),
  junkBackyard: photo("junk-backyard", "A backyard pile of lumber, furniture, and debris waiting to be hauled"),
  junkYard: photo("junk-yard", "A residential yard filled with furniture, bags, and scrap before junk removal"),
  junkLoading: photo("junk-loading", "A crew member loading a wrapped piece of furniture into a van"),
};

export const serviceMedia = {
  "lawn-care": {
    hero: photos.lawnStriped,
    card: photos.lawnCareCard,
    gallery: [
      photos.lawnEdging,
      photos.lawnGolden,
      photos.lawnAeration,
      photos.lawnClose,
      photos.lawnFallCleanup,
      photos.lawnFallStreet,
      photos.lawnDeckPool,
      photos.cleanupAfter,
      photos.cleanupBefore,
    ],
  },
  "snow-removal": {
    hero: photos.snowNight,
    card: photos.snowAction,
    gallery: [photos.snowStorm, photos.snowPlow],
  },
  "junk-removal": {
    hero: photos.junkBackyard,
    card: photos.junkYard,
    gallery: [photos.junkLoading],
  },
} as const;

export function servicePhoto(slug: string, kind: "hero" | "card" = "hero") {
  const media = serviceMedia[slug as keyof typeof serviceMedia];
  return media ? media[kind] : photos.lawnStriped;
}

export const comparisons = {
  "lawn-care": { before: photos.cleanupBefore, after: photos.cleanupAfter },
  "snow-removal": { before: photos.snowStorm, after: photos.snowAction },
  "junk-removal": { before: photos.junkBackyard, after: photos.junkLoading },
} as const;

export function serviceComparison(slug: string) {
  return comparisons[slug as keyof typeof comparisons] ?? comparisons["lawn-care"];
}

/** Supporting shots for lawn-care page sections (mowing, turf). */
export const lawnSectionMedia = {
  mowing: photos.lawnClose,
  turf: photos.turfCare,
} as const;

const lawnQuotePhotoByName: Record<string, Photo> = {
  "Spring cleanup": photos.lawnDeckPool,
  "Fall cleanup": photos.lawnFallCleanup,
  "Hedge & bush trimming": photos.lawnHedgeTrimming,
  "Gutter cleanup": photos.lawnGutterCleanup,
  "Fence staining / painting": photos.lawnFenceStaining,
  "Christmas lighting": photos.lawnChristmasLighting,
  "Garbage bin cleaning": photos.lawnBinCleaning,
};

export function lawnQuotePhoto(name: string): Photo | null {
  return lawnQuotePhotoByName[name] ?? null;
}

/** Before/after pair for fence staining & painting. */
export const fenceStainComparison = {
  before: photos.fenceStainBefore,
  after: photos.fenceStainAfter,
} as const;

export function lawnQuoteComparison(name: string): { before: Photo; after: Photo } | null {
  if (name === "Fence staining / painting") return fenceStainComparison;
  return null;
}

/** Short clip used on the Fall cleanup card (muted autoplay). */
export const lawnFallCleanupClip = {
  id: "yearwise/web/lawn-fall-cleanup-clip",
  poster: photos.lawnFallCleanup,
} as const;
