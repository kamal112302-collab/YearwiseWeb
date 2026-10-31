import { useState } from "react";
import { mediaUrl, type Photo } from "../../lib/media";

export function BeforeAfter({
  before,
  after,
  tall = false,
  hideCaption = false,
  className = "",
}: {
  before: Photo;
  after: Photo;
  tall?: boolean;
  hideCaption?: boolean;
  className?: string;
}) {
  const [position, setPosition] = useState(50);
  const [focused, setFocused] = useState(false);

  return (
    <figure className={className}>
      <div
        className={`relative overflow-hidden bg-brand-navy ${
          tall ? "h-[78vh] min-h-[32rem]" : "h-[22rem] rounded-xl sm:h-[28rem] lg:h-[32rem]"
        } ${focused ? "ring-2 ring-brand-green ring-offset-2" : ""}`}
      >
        <img
          src={mediaUrl(after.id, 1600)}
          alt=""
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src={mediaUrl(before.id, 1600)}
          alt=""
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        <span className="pointer-events-none absolute left-3 top-3 bg-brand-navy/80 px-2 py-1 text-xs font-semibold text-white">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 bg-brand-navy/80 px-2 py-1 text-xs font-semibold text-white">
          After
        </span>
        <span className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${position}%` }} aria-hidden />
        <span
          className="pointer-events-none absolute top-1/2 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-navy/10 bg-white"
          style={{ left: `${position}%` }}
          aria-hidden
        />
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          aria-label="Drag to compare before and after"
          aria-valuetext={`${Math.round(position)} percent before`}
          onChange={(event) => setPosition(Number(event.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      {!hideCaption ? (
        <figcaption className={`text-sm text-muted-foreground ${tall ? "mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8" : "mt-3"}`}>
          Before: {before.alt}. After: {after.alt}.
        </figcaption>
      ) : null}
    </figure>
  );
}
