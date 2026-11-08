import { useEffect, useState } from "react";
import { Link } from "react-router";

/** Mobile quote bar — hidden while the service hero is on screen. */
export function StickyQuoteBar({ phone, tel }: { phone: string; tel: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-service-hero]");
    if (!hero) {
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShow(!entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-navy/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-7xl gap-2">
        <a
          href={`tel:${tel}`}
          className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-full bg-brand-green px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-green-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
        >
          Call {phone}
        </a>
        <Link
          to="/contact"
          className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-full border border-brand-navy/25 px-4 text-sm font-semibold text-brand-navy transition-colors duration-200 hover:bg-brand-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
        >
          Free quote
        </Link>
      </div>
    </div>
  );
}
