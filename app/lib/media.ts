const CLOUD_NAME = "wxim5gfa";

export type Photo = {
  id: string;
  alt: string;
};

export function mediaUrl(id: string, width = 1600) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${id}`;
}

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

export const photos = {
  lawnStriped: photo("lawn-striped", "A mower leaving even stripes on a green residential lawn beside a row of arborvitae"),
  lawnEdging: photo("lawn-edging", "Overhead view of a crew member edging a lawn along a gravel border"),
  lawnGolden: photo("lawn-golden", "A walk-behind mower cutting grass in warm evening light"),
  lawnClose: photo("lawn-close", "Close view of a lawn mower on a freshly cut green lawn"),
  lawnAeration: photo("lawn-aeration", "A crew member running an aerator across a residential lawn"),
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
    card: photos.lawnStriped,
    gallery: [photos.lawnEdging, photos.lawnGolden, photos.lawnAeration],
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
  "lawn-care": { before: photos.lawnClose, after: photos.lawnStriped },
  "snow-removal": { before: photos.snowStorm, after: photos.snowAction },
  "junk-removal": { before: photos.junkBackyard, after: photos.junkLoading },
} as const;

export function serviceComparison(slug: string) {
  return comparisons[slug as keyof typeof comparisons] ?? comparisons["lawn-care"];
}
