import { useState } from "react";
import toast from "react-hot-toast";
import { MarketingLayout } from "../components/MarketingLayout.jsx";
import { api } from "../services/api.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!emailRegex.test(form.email)) e.email = "Valid email is required.";
    if (form.subject.trim().length < 3) e.subject = "Subject must be at least 3 characters.";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/api/contact", form);
      toast.success("Message sent! We will respond soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = "text", multiline = false) => (
    <div>
      <label htmlFor={`support-${name}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={`support-${name}`}
          rows={5}
          value={form[name]}
          onChange={set(name)}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `support-${name}-error` : undefined}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none ring-sky-500/30 transition focus:border-sky-500 focus:ring-4 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      ) : (
        <input
          id={`support-${name}`}
          type={type}
          value={form[name]}
          onChange={set(name)}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `support-${name}-error` : undefined}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none ring-sky-500/30 transition focus:border-sky-500 focus:ring-4 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      )}
      {errors[name] && (
        <p id={`support-${name}-error`} className="mt-1 text-xs text-rose-600" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <MarketingLayout title="Contact & Support">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Have a question or need help? Fill out the form below and our team will get back to you.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-800">
          {field("Name", "name")}
          {field("Email", "email", "email")}
          {field("Subject", "subject")}
          {field("Message", "message", "text", true)}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:from-sky-500 dark:to-indigo-500"
          >
            {loading ? "Sending…" : "Send Message"}
          </button>
        </form>

        <aside className="mt-8 rounded-2xl bg-slate-100 p-5 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          <p className="font-semibold text-slate-900 dark:text-white">Other ways to reach us</p>
          <ul className="mt-2 space-y-1">
            <li>Email: support@bustrack.example</li>
            <li>Phone: +91 90000 00000</li>
            <li>Hours: Mon–Sat, 9 AM – 6 PM IST</li>
          </ul>
        </aside>
      </div>
    </MarketingLayout>
  );
}
