import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
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
  const overlay = useLocation().pathname === "/" && !scrolled;

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
        overlay ? "header-transparent" : "header-solid"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <img
            src={overlay ? "/brand/logo-horizontal-dark.png" : "/brand/logo-horizontal-light.png"}
            alt="Yearwise Services"
            width={1003}
            height={224}
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
                    ? overlay ? "text-white" : "text-brand-green-deep"
                    : overlay
                      ? "text-white/75 hover:text-white"
                      : "text-brand-navy/80 hover:text-brand-green-deep"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${tel}`}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
              overlay ? "text-white" : "text-brand-navy"
            )}
          >
            {phone}
          </a>
          <Link
            to="/contact"
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
              overlay
                ? "bg-white text-brand-navy hover:bg-white/90"
                : "bg-brand-green text-white hover:bg-brand-green-deep"
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
            overlay
              ? "border-white/30 text-white"
              : "border-brand-green/20 text-brand-navy"
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
                    isActive ? "font-semibold text-brand-green-deep" : "text-brand-navy"
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
              className="mt-1 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-green text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-green-deep"
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
          <img src="/brand/logo-horizontal-light.png" alt="Yearwise Services" width={1003} height={224} className="h-14 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            One insured crew for lawn care, snow removal, and junk hauling in Thunder Bay. Same number, every season.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-navy">Explore</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li><Link to="/services" className="cursor-pointer hover:text-brand-green-deep">Services</Link></li>
            <li><Link to="/about" className="cursor-pointer hover:text-brand-green-deep">About</Link></li>
            <li><Link to="/faq" className="cursor-pointer hover:text-brand-green-deep">FAQ</Link></li>
            <li><Link to="/blog" className="cursor-pointer hover:text-brand-green-deep">Guides</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-navy">Contact</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li><a href={`tel:${tel}`} className="cursor-pointer hover:text-brand-green-deep">{phone}</a></li>
            <li><a href={`mailto:${email}`} className="cursor-pointer hover:text-brand-green-deep">{email}</a></li>
            <li><Link to="/contact" className="cursor-pointer hover:text-brand-green-deep">Request a quote</Link></li>
            <li><Link to="/policies/privacy" className="cursor-pointer hover:text-brand-green-deep">Privacy</Link></li>
            <li><Link to="/policies/terms" className="cursor-pointer hover:text-brand-green-deep">Terms</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-brand-green/10 px-4 py-5 text-center text-xs text-brand-ink/50">
        Copyright © {new Date().getFullYear()} Yearwise Services. Thunder Bay, Ontario.
      </p>
    </footer>
  );
}
