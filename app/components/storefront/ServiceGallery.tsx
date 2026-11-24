import type { ReactNode } from "react";
import { mediaSrcSet, mediaUrl, type Photo } from "../../lib/media";
import { LinkButton } from "../ui/Button";

type GalleryItem = {
  photo: Photo;
  hoverPhoto?: Photo | null;
  featured?: boolean;
};

function GalleryTile({
  photo,
  hoverPhoto,
  featured = false,
}: GalleryItem) {
  const frame = featured
    ? "col-span-2 aspect-[16/10] sm:row-span-2"
    : "aspect-[4/3]";

  let media: ReactNode;
  if (hoverPhoto) {
    media = (
      <>
        <img
          src={mediaUrl(photo.id, 1200)}
          srcSet={mediaSrcSet(photo.id, [480, 800, 1200])}
          sizes={featured ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 50vw"}
          alt={photo.alt}
          width={1200}
          height={900}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out group-hover:opacity-0 group-focus-within:opacity-0 motion-reduce:transition-none"
          loading="lazy"
        />
        <img
          src={mediaUrl(hoverPhoto.id, 1200)}
          srcSet={mediaSrcSet(hoverPhoto.id, [480, 800, 1200])}
          sizes={featured ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 50vw"}
          alt={hoverPhoto.alt}
          width={1200}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
          loading="lazy"
        />
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-brand-navy/80 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white opacity-90">
          Hover for after
        </span>
      </>
    );
  } else {
    media = (
      <img
        src={mediaUrl(photo.id, 960)}
        srcSet={mediaSrcSet(photo.id, [480, 800, 960])}
        sizes="(min-width: 640px) 33vw, 50vw"
        alt={photo.alt}
        width={960}
        height={720}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        loading="lazy"
      />
    );
  }

  return (
    <li className={`group relative overflow-hidden rounded-2xl bg-brand-navy/5 ${frame}`}>
      {media}
    </li>
  );
}

export function ServiceGallery({
  title,
  description,
  items,
  quoteHref = "/contact",
  detailsHref,
}: {
  title: string;
  description: string;
  items: GalleryItem[];
  quoteHref?: string;
  detailsHref?: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="max-w-xl">
          <h3 className="text-lg font-semibold text-brand-navy">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-navy/70">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={quoteHref} variant="primary" size="md">
            Get a Free Quote
          </LinkButton>
          {detailsHref ? (
            <LinkButton href={detailsHref} variant="secondary" size="md">
              View Details
            </LinkButton>
          ) : null}
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {items.map((item) => (
          <GalleryTile
            key={item.photo.id}
            photo={item.photo}
            hoverPhoto={item.hoverPhoto}
            featured={item.featured}
          />
        ))}
      </ul>
    </div>
  );
}
