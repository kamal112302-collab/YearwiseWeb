import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";

export type ExpandingCardItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type ExpandingCardsProps = {
  items: ExpandingCardItem[];
  defaultId?: string;
  renderExpanded: (item: ExpandingCardItem) => ReactNode;
  className?: string;
};

export function ExpandingCards({ items, defaultId, renderExpanded, className }: ExpandingCardsProps) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(defaultId ?? items[0]?.id ?? "");
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!items.some((item) => item.id === activeId) && items[0]) {
      setActiveId(items[0].id);
    }
  }, [items, activeId]);

  function activate(id: string) {
    setActiveId(id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(id);
    }
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 120, damping: 20 };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:h-[28rem] md:flex-row md:gap-3 lg:h-[32rem]",
        className,
      )}
      role="tablist"
      aria-label="Services"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <motion.div
            key={item.id}
            layout={!reduceMotion}
            transition={transition}
            className={cn(
              "relative isolate min-h-0 overflow-hidden rounded-2xl",
              isActive
                ? "min-h-[28rem] flex-[1] md:min-h-0 md:flex-[2.2]"
                : "min-h-28 flex-none md:min-h-0 md:flex-[0.7]",
            )}
            onMouseEnter={() => {
              if (finePointer) activate(item.id);
            }}
          >
            <div className="absolute inset-0">
              <img
                src={item.imageUrl}
                alt=""
                width={1200}
                height={900}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div
                className={cn(
                  "absolute inset-0",
                  isActive
                    ? "bg-gradient-to-t from-brand-navy via-brand-navy/85 to-brand-navy/35"
                    : "bg-gradient-to-t from-brand-navy/95 via-brand-navy/55 to-brand-navy/25",
                )}
              />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {isActive ? (
                <motion.div
                  key={`${item.id}-open`}
                  id={`visit-panel-${item.id}`}
                  role="tabpanel"
                  aria-labelledby={`visit-tab-${item.id}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                  className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6 md:p-7"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected
                    aria-controls={`visit-panel-${item.id}`}
                    id={`visit-tab-${item.id}`}
                    tabIndex={0}
                    onClick={() => activate(item.id)}
                    onKeyDown={(event) => onKeyDown(event, item.id)}
                    className="sr-only"
                  >
                    {item.title}, expanded
                  </button>
                  <div className="max-w-xl">{renderExpanded(item)}</div>
                </motion.div>
              ) : (
                <motion.button
                  key={`${item.id}-closed`}
                  type="button"
                  role="tab"
                  aria-selected={false}
                  aria-controls={`visit-panel-${item.id}`}
                  id={`visit-tab-${item.id}`}
                  tabIndex={0}
                  onClick={() => activate(item.id)}
                  onKeyDown={(event) => onKeyDown(event, item.id)}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                  className="relative z-10 flex h-full w-full cursor-pointer items-end p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green sm:p-5 md:items-center md:justify-center md:p-3"
                >
                  <span className="text-lg font-semibold text-white md:rotate-180 md:[writing-mode:vertical-rl]">
                    {item.title}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
