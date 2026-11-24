import type { ReactNode } from "react";
import { mediaSrcSet, mediaUrl, type Photo } from "../../lib/media";
import { LinkButton, type ButtonVariant } from "../ui/Button";

export function ImageBlock({
  title,
  description,
  photo,
  hoverPhoto,
  video,
  aspectClass = "aspect-[16/10]",
  primaryHref = "/contact",
  primaryLabel = "Get a Free Quote",
  primaryVariant = "primary",
  secondaryHref,
  secondaryLabel,
  secondaryVariant = "secondary",
}: {
  title: string;
  description: string;
  photo?: Photo | null;
  /** Shown on card hover / focus-within (desktop). */
  hoverPhoto?: Photo | null;
  video?: { id: string; poster: Photo; src: string } | null;
  aspectClass?: string;
  primaryHref?: string;
  primaryLabel?: string;
  primaryVariant?: ButtonVariant;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryVariant?: ButtonVariant;
}) {
  let media: ReactNode = null;
  if (video) {
    media = (
      <video
        className={`${aspectClass} w-full object-cover`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={mediaUrl(video.poster.id, 960)}
        aria-label={video.poster.alt}
      >
        <source src={video.src} type="video/mp4" />
      </video>
    );
  } else if (photo && hoverPhoto) {
    media = (
      <div className={`relative ${aspectClass} w-full overflow-hidden`}>
        <img
          src={mediaUrl(photo.id, 960)}
          srcSet={mediaSrcSet(photo.id, [480, 800, 960])}
          sizes="(min-width: 640px) 50vw, 100vw"
          alt={photo.alt}
          width={960}
          height={720}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out group-hover:opacity-0 group-focus-within:opacity-0 motion-reduce:transition-none"
          loading="lazy"
        />
        <img
          src={mediaUrl(hoverPhoto.id, 960)}
          srcSet={mediaSrcSet(hoverPhoto.id, [480, 800, 960])}
          sizes="(min-width: 640px) 50vw, 100vw"
          alt={hoverPhoto.alt}
          width={960}
          height={720}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
          loading="lazy"
        />
      </div>
    );
  } else if (photo) {
    media = (
      <img
        src={mediaUrl(photo.id, 960)}
        srcSet={mediaSrcSet(photo.id, [480, 800, 960])}
        sizes="(min-width: 640px) 50vw, 100vw"
        alt={photo.alt}
        width={960}
        height={720}
        className={`${aspectClass} w-full object-cover`}
        loading="lazy"
      />
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-brand-surface">
      {media}
      <div className="flex flex-1 flex-col p-5">
        <h4 className="font-semibold text-brand-navy">{title}</h4>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-navy/70">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <LinkButton href={primaryHref} variant={primaryVariant} size="md">
            {primaryLabel}
          </LinkButton>
          {secondaryHref && secondaryLabel ? (
            <LinkButton href={secondaryHref} variant={secondaryVariant} size="md">
              {secondaryLabel}
            </LinkButton>
          ) : null}
        </div>
      </div>
    </article>
  );
}
