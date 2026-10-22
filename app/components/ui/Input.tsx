import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type InputProps = {
  label?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({
  label,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return <div className="flex flex-col gap-1">{label && <label htmlFor={inputId} className="block text-sm font-medium text-brand-navy">{label}</label>} <input id={inputId} className={cn("w-full min-h-12 rounded-full border border-brand-green/20 bg-white px-5 py-2.5 text-sm text-brand-ink placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green", error && "border-red-500", className)} {...props} />{error && <p className="text-xs text-red-600">{error}</p>}</div>;
}
type TextareaProps = {
  label?: string;
  error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return <div className="flex flex-col gap-1">{label && <label htmlFor={inputId} className="block text-sm font-medium text-brand-navy">{label}</label>} <textarea id={inputId} className={cn("w-full min-h-[140px] rounded-3xl border border-brand-green/20 bg-white px-5 py-3 text-sm text-brand-ink placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green", error && "border-red-500", className)} {...props} />{error && <p className="text-xs text-red-600">{error}</p>}</div>;
}
type SelectProps = {
  label?: string;
  error?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
  label,
  error,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return <div className="flex flex-col gap-1">{label && <label htmlFor={inputId} className="block text-sm font-medium text-brand-navy">{label}</label>} <select id={inputId} className={cn("w-full min-h-12 rounded-full border border-brand-green/20 bg-white px-5 py-2.5 text-sm text-brand-ink focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green", error && "border-red-500", className)} {...props}>{children}</select>{error && <p className="text-xs text-red-600">{error}</p>}</div>;
}


