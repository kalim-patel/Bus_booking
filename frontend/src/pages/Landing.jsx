import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";

const features = [
  { title: "Easy Booking", body: "Pick route, date, and bus in a few taps — no paperwork." },
  { title: "Real-Time Routes", body: "See curated routes and timings updated for your journey." },
  { title: "Affordable Travel", body: "Compare fares and choose buses that fit your budget." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-600/40 via-slate-950 to-slate-950" />
          <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-10 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:pb-32">
            <div className="max-w-2xl animate-fade-in">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Welcome</p>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                BUS TRACK
              </h1>
              <p className="mt-4 text-lg text-sky-100 sm:text-xl">
                Smart and Simple Bus Ticket Booking System
              </p>
              <p className="mt-6 text-base leading-relaxed text-slate-300">
                Book intercity buses online with confidence. Search routes, compare timings, and plan your next trip
                without standing in long queues.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-900 shadow-xl shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-50"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  Explore Features
                </a>
              </div>
            </div>

            <div className="relative mx-auto mt-16 max-w-lg animate-float lg:absolute lg:right-8 lg:top-24 lg:mx-0 lg:mt-0">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm font-medium text-sky-200">Today&apos;s snapshot</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  <li className="flex justify-between">
                    <span>Popular route</span>
                    <span className="font-semibold text-white">Pune → Mumbai</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Avg. booking time</span>
                    <span className="font-semibold text-emerald-300">Under 2 min</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Happy travellers</span>
                    <span className="font-semibold text-white">10k+</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="why" className="bg-slate-900 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Why Choose Us</h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              BUS TRACK keeps things simple: clear routes, honest pricing, and a dashboard that gets you from search to
              seat without friction.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {["Transparent pricing", "Trusted operators", "Responsive support"].map((title) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-6 transition hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-900/40"
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Built for students, commuters, and families who want a dependable booking flow.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-20 text-slate-900">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Features</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="font-display text-xl font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-3 text-slate-600">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}
