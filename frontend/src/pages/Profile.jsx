import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { Sidebar, MobileNav } from "../components/Sidebar.jsx";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required.";
    if (!emailRegex.test(form.email)) e.email = "Valid email is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.address.trim()) e.address = "Address is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.put("/api/auth/profile", {
        username: form.username,
        email: form.email,
        phone: form.phone,
        address: form.address,
      });
      setUser(data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/", { replace: true });
  };

  const field = (label, name, type = "text", extra = {}) => (
    <div>
      <label htmlFor={`profile-${name}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        id={`profile-${name}`}
        type={type}
        value={form[name]}
        onChange={set(name)}
        disabled={name === "email"}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `profile-${name}-error` : undefined}
        className={`mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 outline-none ring-sky-500/30 transition focus:border-sky-500 focus:ring-4 disabled:bg-slate-100 disabled:cursor-not-allowed dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800 ${
          name === "email" ? "bg-slate-50 dark:bg-slate-800" : ""
        }`}
        {...extra}
      />
      {errors[name] && (
        <p id={`profile-${name}-error`} className="mt-1 text-xs text-rose-600" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0 dark:bg-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button type="button" onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white">
              BT
            </span>
            <span className="font-display text-lg font-bold text-slate-900 dark:text-white">BUS TRACK</span>
          </button>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              title={user?.username}
            >
              {(user?.username || "?").slice(0, 1).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 sm:inline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 space-y-8 px-4 py-8 sm:px-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Profile</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Manage your account information and preferences.
            </p>
          </div>

          <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-800">
            <form onSubmit={handleSubmit} className="space-y-5">
              {field("Username", "username")}
              {field("Email", "email", "email")}
              {field("Phone Number", "phone", "tel")}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={set("address")}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 outline-none ring-sky-500/30 transition focus:border-sky-500 focus:ring-4 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-sky-50 p-3 text-xs text-slate-600">
                <svg className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Email cannot be changed. Contact support if you need to update it.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60 dark:from-sky-500 dark:to-indigo-500"
              >
                {loading ? "Updating profile…" : "Update Profile"}
              </button>
            </form>
          </div>

          <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Account Info</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Member Since</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-200">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">User ID</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-200">{user?.id || "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Preferences</h2>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Toggle dark theme for the application</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? "bg-sky-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </main>
      </div>

      <MobileNav onLogout={handleLogout} />
    </div>
  );
}
