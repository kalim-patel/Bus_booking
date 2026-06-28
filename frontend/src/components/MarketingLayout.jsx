import { Navbar } from "./Navbar.jsx";
import { Footer } from "./Footer.jsx";

/** Shared layout for public marketing / info pages */
export function MarketingLayout({ children, title }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {title && (
          <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
              <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">{title}</h1>
            </div>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
