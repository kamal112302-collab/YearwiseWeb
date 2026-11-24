import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Link } from "react-router";

export const variants = {
  primary: "bg-brand-green text-white hover:bg-brand-green-deep active:bg-brand-green-deep/90",
  secondary:
    "border border-brand-navy/20 bg-white text-brand-navy hover:border-brand-green hover:text-brand-green-deep active:bg-brand-mint/60",
  outline: "border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white active:opacity-90",
  ghost: "text-brand-navy hover:bg-brand-mint active:bg-brand-mint/80",
  link: "gap-1.5 px-1 text-brand-green-deep underline-offset-4 hover:underline active:opacity-80",
  onDark: "bg-brand-green text-white hover:bg-brand-green-deep active:bg-brand-green-deep/90",
  onDarkSecondary:
    "border border-white/40 bg-transparent text-white hover:bg-white/10 active:bg-white/15",
} as const;

export const sizes = {
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-8 py-3 text-base",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

const baseClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-[color,background-color,border-color,opacity,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100";

const focusByVariant: Record<ButtonVariant, string> = {
  primary: "focus-visible:ring-brand-green",
  secondary: "focus-visible:ring-brand-green",
  outline: "focus-visible:ring-brand-green",
  ghost: "focus-visible:ring-brand-green",
  link: "focus-visible:ring-brand-green",
  onDark: "focus-visible:ring-white focus-visible:ring-offset-brand-navy",
  onDarkSecondary: "focus-visible:ring-white focus-visible:ring-offset-brand-navy",
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function LinkArrow() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function buttonClasses({
  variant,
  size,
  className,
  loading,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  className?: string;
  loading?: boolean;
}) {
  return cn(
    baseClass,
    variants[variant],
    sizes[size],
    focusByVariant[variant],
    variant === "link" && "min-h-11 rounded-none font-semibold",
    loading && "pointer-events-none opacity-70",
    className,
  );
}

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClasses({ variant, size, className, loading })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
      {variant === "link" && !loading ? <LinkArrow /> : null}
    </button>
  );
}

type LinkButtonProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  href,
  loading = false,
  children,
  ...props
}: LinkButtonProps) {
  const classes = buttonClasses({ variant, size, className, loading });
  const content = (
    <>
      {loading ? <Spinner /> : null}
      {children}
      {variant === "link" && !loading ? <LinkArrow /> : null}
    </>
  );

  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return (
      <a href={href} className={classes} aria-busy={loading || undefined} {...props}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} prefetch="intent" className={classes} aria-busy={loading || undefined} {...props}>
      {content}
    </Link>
  );
}
