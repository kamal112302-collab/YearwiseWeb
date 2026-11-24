import { mediaSrcSet, mediaUrl } from "../../lib/media";
import { formatCurrency } from "../../lib/utils";
import { LinkButton } from "../ui/Button";

export function ServiceCard({
  name,
  slug,
  description,
  included,
  fromPrice,
  priceSuffix,
  photoId,
  photoAlt,
  priority = false,
}: {
  name: string;
  slug: string;
  description: string;
  included?: string[];
  fromPrice: number;
  priceSuffix: string;
  photoId: string;
  photoAlt: string;
  priority?: boolean;
}) {
  return (
    <article className="group relative flex min-h-[28rem] flex-col justify-end overflow-hidden rounded-[1.35rem] sm:min-h-[32rem]">
      <img
        src={mediaUrl(photoId, 960)}
        srcSet={mediaSrcSet(photoId, [640, 960, 1200])}
        sizes="(min-width: 1024px) 33vw, 100vw"
        alt={photoAlt}
        width={960}
        height={1200}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/65 to-brand-navy/20" />
      <div className="relative z-10 flex flex-col gap-3 p-6 text-white sm:p-7">
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{name}</h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-white/85">{description}</p>
        {included && included.length > 0 ? (
          <ul className="flex flex-col gap-1 text-sm text-white/75">
            {included.slice(0, 3).map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        ) : null}
        <p className="mt-1 text-sm font-semibold text-brand-mint">
          From {formatCurrency(fromPrice)}
          {priceSuffix}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 border-t border-white/20 pt-4">
          <LinkButton href="/contact" variant="onDark" size="md">
            Get a Free Quote
          </LinkButton>
          <LinkButton href={`/services/${slug}`} variant="onDarkSecondary" size="md">
            View Details
          </LinkButton>
        </div>
      </div>
    </article>
  );
}
