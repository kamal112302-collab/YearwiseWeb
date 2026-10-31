import { LayoutDashboard, Shovel, FileQuestion, Inbox, Newspaper, Image, Settings, Snowflake, X, Menu, LogOut } from "lucide-react";
import { useState, useEffect, Fragment } from "react";
import { cn } from "../../lib/utils";
import { NavLink, Form } from "react-router";

export var navItems = [{
  to: "/admin",
  label: "Dashboard",
  icon: LayoutDashboard,
  end: true
}, {
  to: "/admin/services",
  label: "Services",
  icon: Shovel
}, {
  to: "/admin/snow-pricing",
  label: "Snow Pricing",
  icon: Snowflake
}, {
  to: "/admin/faqs",
  label: "FAQs",
  icon: FileQuestion
}, {
  to: "/admin/inquiries",
  label: "Inquiries",
  icon: Inbox
}, {
  to: "/admin/blog",
  label: "Blog",
  icon: Newspaper
}, {
  to: "/admin/media",
  label: "Media",
  icon: Image
}, {
  to: "/admin/settings",
  label: "Settings",
  icon: Settings
}];
export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);
  return <Fragment> <button type="button" className="fixed z-50 flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-brand-navy text-white lg:hidden top-4 left-4 cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>{mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />} <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-navy text-white transition-transform lg:static lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}> <div className="border-b border-white/10 px-5 py-6"> <span className="font-display text-lg font-bold">Yearwise Admin</span></div> <nav className="flex flex-1 flex-col gap-1 p-3">{navItems.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileOpen(false)} className={({
          isActive
        }) => cn("flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium cursor-pointer", isActive ? "bg-brand-green text-white" : "text-white/80 hover:bg-white/10")}> <item.icon className="size-4 shrink-0" aria-hidden />{item.label}</NavLink>)}</nav> <Form method="post" action="/admin/logout" className="border-t border-white/10 p-3"> <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-white/80 hover:bg-white/10 cursor-pointer"> <LogOut className="size-4" aria-hidden />Sign out</button></Form></aside></Fragment>;
}


