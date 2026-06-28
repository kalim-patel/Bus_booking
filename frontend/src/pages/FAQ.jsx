import { MarketingLayout } from "../components/MarketingLayout.jsx";
import { Accordion } from "../components/Accordion.jsx";

const faqItems = [
  {
    id: "book",
    question: "How do I book a bus ticket?",
    answer:
      "Sign in, go to Dashboard, enter your from/to cities and travel date, pick a bus from search results, add passenger details, and confirm your booking.",
  },
  {
    id: "cancel",
    question: "How do I cancel a booking?",
    answer:
      "Open My Bookings, find your confirmed ticket, and tap Cancel Booking. Seats are restored to availability once cancelled.",
  },
  {
    id: "payment",
    question: "What payment methods are supported?",
    answer:
      "This demo simulates UPI, card, and net banking at checkout. No real payment is processed in Version 1.0.",
  },
  {
    id: "account",
    question: "How do I create or manage my account?",
    answer:
      "Use Sign Up to register, then Sign In with your email and password. Update your profile details anytime from the Profile page.",
  },
  {
    id: "refund",
    question: "What is the refund policy?",
    answer:
      "For this demo, cancelling a confirmed booking releases your seats. In a production app, refund timelines would depend on operator policy and payment method.",
  },
  {
    id: "seats",
    question: "Can I choose specific seat numbers?",
    answer:
      "Version 1.0 assigns demo seat labels automatically when you book. Interactive seat maps may be added in a future release.",
  },
  {
    id: "support",
    question: "How do I contact support?",
    answer:
      "Visit the Support page to submit a message. Our team reviews submissions stored securely in the system.",
  },
];

export default function FAQ() {
  return (
    <MarketingLayout title="Frequently Asked Questions">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Quick answers about booking, accounts, payments, and cancellations on BUS TRACK.
        </p>
        <Accordion items={faqItems} />
      </div>
    </MarketingLayout>
  );
}
