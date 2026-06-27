const social = [
  { name: "Twitter", href: "https://twitter.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Facebook", href: "https://facebook.com" },
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">BUS TRACK</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Smart and simple bus ticket booking for everyday travel across Maharashtra and beyond.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Email: support@bustrack.example</li>
              <li>Phone: +91 90000 00000</li>
              <li>Pune, India</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Follow</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {social.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} BUS TRACK. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
