import { Link } from "react-router-dom";
import { MarketingLayout } from "../components/MarketingLayout.jsx";

const team = [
  { name: "Priya Sharma", role: "Product Lead", bio: "Focused on simple, reliable travel experiences." },
  { name: "Arjun Mehta", role: "Engineering", bio: "Builds secure, scalable booking systems." },
  { name: "Neha Patil", role: "Customer Success", bio: "Helps travellers get from search to seat smoothly." },
];

export default function About() {
  return (
    <MarketingLayout title="About BUS TRACK">
      <div className="mx-auto max-w-4xl space-y-16 px-4 py-12 sm:px-6">
        <section aria-labelledby="about-intro">
          <h2 id="about-intro" className="font-display text-xl font-semibold text-slate-900 dark:text-white">
            About BUS TRACK
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed dark:text-slate-400">
            BUS TRACK is a full-stack bus ticket booking platform built for everyday intercity travel. We help
            passengers search routes, compare buses, and complete bookings in minutes — without queues or paperwork.
          </p>
        </section>

        <section aria-labelledby="about-mission">
          <h2 id="about-mission" className="font-display text-xl font-semibold text-slate-900 dark:text-white">
            Our Mission
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed dark:text-slate-400">
            To make bus travel accessible, transparent, and stress-free for everyone. We believe booking a ticket
            should be as straightforward as choosing your route and confirming your seat.
          </p>
        </section>

        <section aria-labelledby="about-why">
          <h2 id="about-why" className="font-display text-xl font-semibold text-slate-900 dark:text-white">
            Why Choose Us
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Transparent pricing", body: "See fares upfront before you book." },
              { title: "Trusted routes", body: "Curated operators across popular corridors." },
              { title: "Responsive support", body: "Help when you need it via our support page." },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="about-features">
          <h2 id="about-features" className="font-display text-xl font-semibold text-slate-900 dark:text-white">
            Features
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-600 dark:text-slate-400">
            <li>Route search with date and city filters</li>
            <li>Real-time seat availability on listed buses</li>
            <li>Secure account and JWT-based authentication</li>
            <li>My Bookings dashboard with cancellation</li>
            <li>Digital ticket view for every booking</li>
          </ul>
        </section>

        <section aria-labelledby="about-team">
          <h2 id="about-team" className="font-display text-xl font-semibold text-slate-900 dark:text-white">
            Team
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">Placeholder team profiles for portfolio demo.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {team.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-lg font-bold text-white">
                  {member.name.charAt(0)}
                </div>
                <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-xs font-medium text-sky-700 dark:text-sky-400">{member.role}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{member.bio}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="about-contact" className="rounded-2xl bg-sky-50 p-6 dark:bg-sky-900/20">
          <h2 id="about-contact" className="font-display text-xl font-semibold text-slate-900 dark:text-white">
            Contact
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>Email: support@bustrack.example</li>
            <li>Phone: +91 90000 00000</li>
            <li>Address: Pune, Maharashtra, India</li>
          </ul>
          <Link
            to="/support"
            className="mt-4 inline-flex text-sm font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-400"
          >
            Send us a message →
          </Link>
        </section>
      </div>
    </MarketingLayout>
  );
}
