import { Check } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { LinkButton } from "../ui/Button";

export function TurfProgramCard({
  name,
  price,
  features,
  featured = false,
}: {
  name: string;
  price: number;
  features: string[];
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "flex h-full flex-col rounded-2xl border-2 border-brand-green bg-brand-surface px-5 py-6"
          : "flex h-full flex-col rounded-2xl border border-brand-navy/15 bg-white px-5 py-6"
      }
    >
      {featured ? (
        <p className="text-xs font-semibold tracking-wide text-brand-green-deep">Popular</p>
      ) : (
        <p className="text-xs font-semibold tracking-wide text-brand-navy/50">Season program</p>
      )}
      <h4 className="mt-3 text-xl font-semibold text-brand-navy">{name}</h4>
      <p className="mt-4 font-display text-4xl font-extrabold tracking-tight text-brand-navy">
        {formatCurrency(price)}
      </p>
      <ul className="mt-6 flex flex-1 flex-col gap-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-brand-navy/85">
            <Check className="mt-0.5 size-4 shrink-0 text-brand-green-deep" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <LinkButton href="/contact" variant="primary" size="md" className="mt-8 w-full">
        Get a Free Quote
      </LinkButton>
    </article>
  );
}
