import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "~/lib/utils";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/blog", label: "Guides" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const tel = phone.replace(/[^\d+]/g, "");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-400",
        scrolled
          ? "header-solid"
          : "header-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <img
            src={scrolled ? "/brand/logo-horizontal-light.png" : "/brand/logo-horizontal-dark.png"}
            alt="Yearwise Services"
            width={2048}
            height={417}
            className="h-9 w-auto transition-opacity duration-300 sm:h-11 object-contain"
          />
        </Link>

        {/* Desktop Nav — centered */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "cursor-pointer text-sm font-medium transition-colors duration-200",
                  isActive
                    ? scrolled ? "text-brand-green" : "text-white"
                    : scrolled
                      ? "text-brand-navy/80 hover:text-brand-green"
                      : "text-white/75 hover:text-white"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/contact"
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300",
              scrolled
                ? "bg-brand-green text-white hover:bg-brand-green-deep"
                : "bg-white text-brand-navy hover:bg-white/90"
            )}
          >
            Free Quote <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={cn(
            "inline-flex size-11 cursor-pointer items-center justify-center rounded-full border lg:hidden transition-colors duration-200",
            scrolled
              ? "border-brand-green/20 text-brand-navy"
              : "border-white/30 text-white"
          )}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 lg:hidden",
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav
          className="border-t border-brand-green/10 bg-white px-4 py-3"
          aria-label="Mobile"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "cursor-pointer rounded-xl px-3 py-3 text-sm font-medium",
                    isActive ? "bg-brand-mint text-brand-green" : "text-brand-navy"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href={`tel:${tel}`}
              className="cursor-pointer rounded-xl px-3 py-3 text-sm font-medium"
            >
              Call {phone}
            </a>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-green text-sm font-semibold text-white"
            >
              Free quote <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ phone, email }: { phone: string; email: string }) {
  const tel = phone.replace(/[^\d+]/g, "");
  return (
    <footer className="border-t border-brand-green/15 bg-brand-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <img src="/brand/logo-horizontal-light.png" alt="Yearwise Services" width={2048} height={417} className="h-14 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            One insured crew for lawn care, snow removal, and junk hauling in Thunder Bay. Same number, every season.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">Explore</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li><Link to="/services" className="cursor-pointer hover:text-brand-green">Services</Link></li>
            <li><Link to="/about" className="cursor-pointer hover:text-brand-green">About</Link></li>
            <li><Link to="/faq" className="cursor-pointer hover:text-brand-green">FAQ</Link></li>
            <li><Link to="/blog" className="cursor-pointer hover:text-brand-green">Guides</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">Contact</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li><a href={`tel:${tel}`} className="cursor-pointer hover:text-brand-green">{phone}</a></li>
            <li><a href={`mailto:${email}`} className="cursor-pointer hover:text-brand-green">{email}</a></li>
            <li><Link to="/contact" className="cursor-pointer hover:text-brand-green">Request a quote</Link></li>
            <li><Link to="/policies/privacy" className="cursor-pointer hover:text-brand-green">Privacy</Link></li>
            <li><Link to="/policies/terms" className="cursor-pointer hover:text-brand-green">Terms</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-brand-green/10 px-4 py-5 text-center text-xs text-brand-ink/50">
        Copyright © {new Date().getFullYear()} Yearwise Services. Thunder Bay, Ontario.
      </p>
    </footer>
  );
}
