import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Review } from "~/lib/content.data";

const QUOTE_PREVIEW = 110;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function StarRow({
  value,
  label,
  size = "md",
}: {
  value: number;
  label: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]";
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index + 1 <= Math.round(value);
        return (
          <Star
            key={index}
            className={`${dim} ${filled ? "fill-[#F4B400] text-[#F4B400]" : "fill-transparent text-brand-navy/20"}`}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

function GoogleMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function ReviewCard({
  review,
  active,
  onSelect,
}: {
  review: Review;
  active: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const long = review.quote.length > QUOTE_PREVIEW;
  const text =
    !long || expanded
      ? review.quote
      : `${review.quote.slice(0, QUOTE_PREVIEW).trimEnd()}…`;

  return (
    <article
      className={`google-review-card flex h-full min-h-[15.5rem] flex-col rounded-[1.35rem] border bg-white p-5 shadow-[0_8px_24px_rgba(31,44,76,0.06)] transition-[border-color,box-shadow,transform] duration-200 sm:p-6 ${
        active
          ? "border-brand-green/45 shadow-[0_12px_28px_rgba(31,44,76,0.1)]"
          : "border-transparent hover:border-brand-navy/10"
      }`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
      aria-current={active ? "true" : undefined}
    >
      <StarRow value={5} label="5 out of 5 stars" size="sm" />
      <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-brand-navy/80">
        {text}
        {long ? (
          <>
            {" "}
            <button
              type="button"
              className="cursor-pointer font-semibold text-brand-green-deep hover:underline"
              onClick={(event) => {
                event.stopPropagation();
                setExpanded((value) => !value);
              }}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          </>
        ) : null}
      </p>
      <footer className="mt-5 flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-mint text-xs font-bold tracking-wide text-brand-navy"
          aria-hidden
        >
          {initials(review.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-navy">{review.name}</p>
          <p className="truncate text-xs text-brand-navy/50">{review.when}</p>
        </div>
      </footer>
    </article>
  );
}

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1024) setCount(3);
      else if (width >= 640) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const visible = useVisibleCount();
  const maxIndex = Math.max(0, reviews.length - visible);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    setActiveCard((current) => {
      if (current >= index && current < index + visible) return current;
      return Math.min(index + visible - 1, reviews.length - 1);
    });
  }, [index, visible, reviews.length]);

  const goTo = useEffectEvent((next: number) => {
    setIndex(Math.max(0, Math.min(next, maxIndex)));
  });

  useEffect(() => {
    if (paused || reviews.length <= visible || reduceMotion.current) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 5500);
    return () => window.clearInterval(id);
  }, [paused, reviews.length, visible, maxIndex]);

  const pageCount = maxIndex + 1;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer Google reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goTo(index - 1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goTo(index + 1);
        }
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 48) return;
        goTo(delta < 0 ? index + 1 : index - 1);
      }}
    >
      <div className="overflow-hidden px-1 pb-1 pt-1">
        <ul
          className="google-review-track flex gap-4"
          style={{
            transform: `translateX(calc(-${index} * ((100% + 1rem) / ${visible})))`,
          }}
        >
          {reviews.map((review, cardIndex) => (
            <li
              key={`${review.name}-${review.when}`}
              className="google-review-slide min-w-0"
              style={{ flex: `0 0 calc((100% - ${(visible - 1) * 1}rem) / ${visible})` }}
            >
              <ReviewCard
                review={review}
                active={cardIndex === activeCard}
                onSelect={() => setActiveCard(cardIndex)}
              />
            </li>
          ))}
        </ul>
      </div>

      {maxIndex > 0 ? (
        <>
          <button
            type="button"
            aria-label="Previous reviews"
            disabled={index === 0}
            className="absolute left-0 top-[42%] z-10 inline-flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-brand-navy/10 bg-white/95 text-brand-navy shadow-[0_6px_18px_rgba(31,44,76,0.12)] transition-colors duration-200 hover:text-brand-green-deep disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            disabled={index === maxIndex}
            className="absolute right-0 top-[42%] z-10 inline-flex h-11 w-11 translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-brand-navy/10 bg-white/95 text-brand-navy shadow-[0_6px_18px_rgba(31,44,76,0.12)] transition-colors duration-200 hover:text-brand-green-deep disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            onClick={() => goTo(index + 1)}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </>
      ) : null}

      {pageCount > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Review pages">
          {Array.from({ length: pageCount }, (_, page) => {
            const active = page === index;
            return (
              <button
                key={`page-${page}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show reviews page ${page + 1} of ${pageCount}`}
                className={`h-2.5 cursor-pointer rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 ${
                  active ? "w-2.5 bg-brand-green" : "w-2.5 bg-brand-navy/20 hover:bg-brand-navy/35"
                }`}
                onClick={() => goTo(page)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function GoogleReviews({
  reviews,
  ratingValue,
  reviewCount,
  googleReviewsUrl,
  phone,
  tel,
}: {
  reviews: Review[];
  ratingValue: number;
  reviewCount: number;
  googleReviewsUrl: string;
  phone: string;
  tel: string;
}) {
  if (reviews.length === 0) {
    return (
      <section aria-labelledby="reviews-heading" className="bg-[#eef1f6] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[1.75rem] bg-white p-8 shadow-[0_18px_50px_rgba(31,44,76,0.08)]">
            <h2 id="reviews-heading" className="text-xl font-bold text-brand-navy">
              Google Reviews
            </h2>
            <p className="mt-3 text-brand-navy/70">
              Reviews are being added. Call{" "}
              <a href={`tel:${tel}`} className="font-semibold text-brand-green-deep hover:underline">
                {phone}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="reviews-heading" className="bg-[#eef1f6] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          data-reveal
          className="rounded-[1.75rem] bg-white px-5 py-6 shadow-[0_18px_50px_rgba(31,44,76,0.08)] sm:px-8 sm:py-8 lg:px-10 lg:py-9"
        >
          <div className="flex flex-col gap-5 border-b border-brand-navy/8 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-2.5">
                <GoogleMark className="h-7 w-7" />
                <h2 id="reviews-heading" className="text-lg font-bold tracking-tight text-brand-navy sm:text-xl">
                  Google Reviews
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <p className="text-2xl font-bold tabular-nums text-brand-navy sm:text-[1.65rem]">
                  {ratingValue.toFixed(1)}
                </p>
                <StarRow value={ratingValue} label={`${ratingValue} out of 5 stars`} size="md" />
                <p className="text-sm text-brand-navy/55">Based on {reviewCount} reviews</p>
              </div>
            </div>

            {googleReviewsUrl ? (
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#7eb8f0] px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#6aabea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
              >
                Share your feedback
              </a>
            ) : null}
          </div>

          <div className="relative mt-7 sm:mt-8 sm:px-6">
            <ReviewCarousel reviews={reviews} />
          </div>
        </div>
      </div>
    </section>
  );
}
