import { Link } from "react-router-dom";
import { MarketingLayout } from "../components/MarketingLayout.jsx";

export default function PrivacyPolicy() {
  return (
    <MarketingLayout title="Privacy Policy">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 text-sm leading-relaxed text-slate-600 sm:px-6 dark:text-slate-400">
        <p className="text-xs text-slate-500">Last updated: June 2026</p>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">1. Introduction</h2>
          <p className="mt-3">
            BUS TRACK (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy. This policy explains how we
            collect, use, and protect personal information when you use our bus booking platform.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">2. Information We Collect</h2>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>Account details: name, email, phone, address</li>
            <li>Booking data: routes, travel dates, passenger names</li>
            <li>Support messages submitted via the contact form</li>
            <li>Technical data: browser type, session tokens for authentication</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">3. How We Use Information</h2>
          <p className="mt-3">
            We use your data to provide booking services, manage your account, respond to support requests, and improve
            platform reliability. We do not sell personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">4. Data Security</h2>
          <p className="mt-3">
            Passwords are hashed before storage. API access uses JWT tokens. We apply industry-standard practices to
            protect data in transit and at rest on MongoDB Atlas.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">5. Your Rights</h2>
          <p className="mt-3">
            You may update profile information from your account settings. To request account deletion or data export,
            contact us via the Support page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">6. Contact</h2>
          <p className="mt-3">
            Questions about this policy? Email support@bustrack.example or use our{" "}
            <Link to="/support" className="font-semibold text-sky-700 hover:underline dark:text-sky-400">
              Support page
            </Link>
            .
          </p>
        </section>
      </div>
    </MarketingLayout>
  );
}
