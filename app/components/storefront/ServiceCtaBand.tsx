import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { LinkButton } from "../ui/Button";

export function ServiceCtaBand({
  phone,
  tel,
  title = "Get a quote for this visit.",
  body,
}: {
  phone: string;
  tel: string;
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-brand-mint">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-24">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-xl text-base text-brand-navy/80 sm:text-lg">
            {body ?? `Call ${phone}. Most quotes take a few minutes.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={`tel:${tel}`}>Call {phone}</LinkButton>
          <Link
            to="/contact"
            className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-brand-navy/30 px-6 text-sm font-semibold text-brand-navy transition-colors duration-200 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
          >
            Request online <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
