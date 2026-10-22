import { useEffect, useRef } from "react";

export function useHomeMotion() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let revert: (() => void) | undefined;
    let alive = true;

    void import("../../lib/gsap.client").then(({ gsap, ensureGsap, prefersReducedMotion }) => {
      if (!alive || prefersReducedMotion()) return;
      ensureGsap();

      const ctx = gsap.context(() => {
        // ── Hero text entrance ──
        gsap.from(root.querySelectorAll("[data-hero]"), {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });

        // ── Hero photo scale entrance ──
        const heroPhoto = root.querySelector("[data-hero-photo]");
        if (heroPhoto) {
          gsap.from(heroPhoto, {
            scale: 1.12,
            duration: 1.6,
            ease: "power2.out",
            clearProps: "transform",
          });
        }

        // ── Floating service cards ──
        gsap.to(root.querySelectorAll("[data-float]"), {
          y: -14,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.5 },
        });

        // ── Counter animations ──
        root.querySelectorAll("[data-counter]").forEach((el) => {
          const target = parseInt(el.getAttribute("data-target") ?? "0", 10);
          const suffix = el.getAttribute("data-suffix") ?? "";
          const obj = { val: 0 };

          gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: "power2.out",
            snap: { val: 1 },
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
            },
            onUpdate: () => {
              (el as HTMLElement).textContent = Math.round(obj.val) + suffix;
            },
          });
        });

        // ── Scroll reveal for all [data-reveal] ──
        root.querySelectorAll("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 36,
            opacity: 0,
            duration: 0.85,
            ease: "power2.out",
            immediateRender: false,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          });
        });
      }, root);

      revert = () => ctx.revert();
    });

    return () => {
      alive = false;
      revert?.();
    };
  }, []);

  return rootRef;
}
