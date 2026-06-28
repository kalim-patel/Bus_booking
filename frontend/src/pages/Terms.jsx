import { MarketingLayout } from "../components/MarketingLayout.jsx";

export default function Terms() {
  return (
    <MarketingLayout title="Terms & Conditions">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 text-sm leading-relaxed text-slate-600 sm:px-6 dark:text-slate-400">
        <p className="text-xs text-slate-500">Last updated: June 2026</p>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">1. Acceptance</h2>
          <p className="mt-3">
            By accessing BUS TRACK, you agree to these Terms & Conditions. If you do not agree, please do not use the
            service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">2. Service Description</h2>
          <p className="mt-3">
            BUS TRACK is a demo bus ticket booking platform. Route listings, seat availability, and payments are provided
            for demonstration purposes unless otherwise stated.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">3. User Accounts</h2>
          <p className="mt-3">
            You are responsible for maintaining the confidentiality of your login credentials and for all activity under
            your account. Provide accurate registration information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">4. Bookings & Cancellations</h2>
          <p className="mt-3">
            Confirmed bookings may be cancelled from My Bookings while status is confirmed. Cancellation restores seats to
            inventory. Refund rules in production would follow operator policies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
          <p className="mt-3">
            BUS TRACK is provided &quot;as is&quot; without warranties. We are not liable for travel delays, operator
            changes, or losses arising from use of this demo platform.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">6. Changes</h2>
          <p className="mt-3">
            We may update these terms periodically. Continued use after changes constitutes acceptance of the revised
            terms.
          </p>
        </section>
      </div>
    </MarketingLayout>
  );
}
