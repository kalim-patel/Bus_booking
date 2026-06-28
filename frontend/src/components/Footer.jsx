import { Link } from "react-router-dom";

const GITHUB_URL = "https://github.com";

const footerLinks = {
  explore: [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "FAQ", to: "/faq" },
    { label: "Support", to: "/support" },
  ],
  legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Contact", to: "/support" },
  ],
};

export function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">BUS TRACK</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Smart and simple bus ticket booking for everyday travel across Maharashtra and beyond.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Explore</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-600 transition hover:text-sky-700 focus:outline-none focus-visible:underline dark:text-slate-400 dark:hover:text-sky-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Legal</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-600 transition hover:text-sky-700 focus:outline-none focus-visible:underline dark:text-slate-400 dark:hover:text-sky-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Connect</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Email: support@bustrack.example</li>
              <li>Phone: +91 90000 00000</li>
              <li>Pune, India</li>
            </ul>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex text-sm font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-400"
            >
              GitHub →
            </a>
          </div>
        </div>

        <p className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          © {new Date().getFullYear()} BUS TRACK. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
