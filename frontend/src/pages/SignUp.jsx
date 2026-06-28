import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required.";
    if (!emailRegex.test(form.email)) e.email = "Valid email is required.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
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
      await api.post("/api/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
      });
      toast.success("Account created! Please sign in.");
      navigate("/signin", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = "text", extra = {}) => (
    <div>
      <label htmlFor={`signup-${name}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        id={`signup-${name}`}
        type={type}
        value={form[name]}
        onChange={set(name)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `signup-${name}-error` : undefined}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none ring-sky-500/30 transition focus:border-sky-500 focus:ring-4 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        {...extra}
      />
      {errors[name] && (
        <p id={`signup-${name}-error`} className="mt-1 text-xs text-rose-600" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 px-4 py-10 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">BUS TRACK</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
          {field("Username", "username")}
          {field("Email", "email", "email")}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative mt-1">
              <input
                type={show ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-20 text-slate-900 outline-none ring-sky-500/30 transition focus:border-sky-500 focus:ring-4 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-sky-700 dark:text-sky-400"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
          </div>
          {field("Confirm Password", "confirmPassword", "password")}
          {field("Phone Number", "phone", "tel")}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={set("address")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 outline-none ring-sky-500/30 transition focus:border-sky-500 focus:ring-4 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60 dark:from-sky-500 dark:to-indigo-500"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-sky-700 hover:underline dark:text-sky-400">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
