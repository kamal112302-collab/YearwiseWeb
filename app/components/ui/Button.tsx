import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Link } from "react-router";

export var variants = {
  primary: "bg-brand-green text-white hover:bg-brand-green-deep",
  secondary: "bg-brand-navy text-white hover:opacity-90",
  outline: "border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white",
  ghost: "text-brand-navy hover:bg-brand-mint"
};
export var sizes = {
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-11 px-6 py-2.5 text-sm",
  lg: "min-h-12 px-8 py-3 text-base"
};
type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return <button className={cn("inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)} {...props} />;
}
export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  href,
  children
}) {
  const classes = cn("inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition-colors", variants[variant ?? "primary"], sizes[size ?? "md"], className);
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) return <a href={href} className={classes}>{children}</a>;
  return <Link to={href} prefetch="intent" className={classes}>{children}</Link>;
}


