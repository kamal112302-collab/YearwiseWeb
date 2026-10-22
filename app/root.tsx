import type { ReactNode } from "react";
import { Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";

var links$1 = () => [{
  rel: "icon",
  href: "/favicon.png?v=2",
  type: "image/png"
}, {
  rel: "apple-touch-icon",
  href: "/favicon.png?v=2"
}, {
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap"
}];
function meta$9() {
  return [{
    title: "Yearwise Services — One Crew for Every Season"
  }, {
    name: "description",
    content: "Lawn care, snow removal, and junk hauling in Thunder Bay. One company, one number, 365 days a year. Call (807) 358-2540 for a free quote."
  }];
}

function Layout({
  children
}: {
  children: ReactNode;
}) {
  return <html lang="en-CA"> <head> <meta charSet="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1" /> <Meta /> <Links /></head> <body> <a href="#main-content" className="skip-link">Skip to content</a>{children} <ScrollRestoration /> <Scripts /></body></html>;
}
function App() {
  return <Outlet />;
}
function ErrorBoundary({
  error
}: Route.ErrorBoundaryProps) {
  let message = "Something went wrong";
  let details = "An unexpected error occurred.";
  let status = 500;
  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.status === 404 ? "Page not found" : "Error";
    details = error.status === 404 ? "The page you're looking for doesn't exist." : error.statusText || details;
  }
  return <main className="min-h-dvh bg-background flex items-center justify-center px-4"> <div className="text-center max-w-md"> <p className="text-6xl font-display text-brand-green mb-4">{status}</p> <h1 className="text-2xl font-display text-brand-navy mb-2">{message}</h1> <p className="text-muted-foreground mb-8">{details}</p> <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-brand-green text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity">Back to home</a></div></main>;
}

export default App;
export { ErrorBoundary, Layout, links$1 as links, meta$9 as meta };
