import { getSiteSettings } from "../lib/content.server";
import { useNavigation, Outlet, useLocation } from "react-router";
import { NavigationProgress } from "../components/NavigationProgress";
import { SiteHeader, SiteFooter } from "../components/storefront/SiteHeader";
import { cn } from "../lib/utils";

import type { Route } from "./+types/storefront-layout";

async function loader$24({}) {
  return {
    settings: await getSiteSettings()
  };
}
function StorefrontLayout({
  loaderData
}: Route.ComponentProps) {
  const pending = useNavigation().state !== "idle";
  const isHome = useLocation().pathname === "/";
  const {
    settings
  } = loaderData;
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationProgress />
      <SiteHeader phone={settings.phone} />
      <main id="main-content" className={cn("flex-1 transition-opacity duration-200", !isHome && "pt-24 sm:pt-28", pending && "opacity-80")}>
        <Outlet />
      </main>
      <SiteFooter phone={settings.phone} email={settings.email} />
    </div>
  );
}

export default StorefrontLayout;
export { loader$24 as loader };
