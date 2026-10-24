import { Link } from "react-router";
import { cn } from "../../lib/utils";

export function Breadcrumbs({ items, className }: { items: { name: string; to?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brand-navy/70", className)}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.to && !last ? (
                <Link to={item.to} className="cursor-pointer hover:text-brand-green-deep">
                  {item.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined}>{item.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
