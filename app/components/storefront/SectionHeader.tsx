import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  actions,
  as = "h2",
  titleClassName,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  as?: "h1" | "h2" | "h3";
  titleClassName?: string;
  className?: string;
}) {
  const Heading = as;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <Heading
          id={id}
          className={cn(
            as === "h1" || as === "h2" ? "display" : "text-lg font-semibold text-brand-navy",
            as === "h1" && "mt-3 text-4xl sm:text-5xl",
            as === "h2" && "text-3xl sm:text-4xl",
            !eyebrow && as === "h1" ? "" : eyebrow ? "mt-3" : "",
            titleClassName,
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p
            className={cn(
              "mt-3 max-w-xl text-brand-navy/75",
              as === "h3" ? "text-sm text-brand-navy/70" : "text-base leading-relaxed",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
