import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      return "Name, email, and password are required";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Enter a valid email address";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create account"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
        >
          <div>
            <h1 className="text-2xl font-semibold text-white">Create your account</h1>
            <p className="mt-2 text-sm text-zinc-400">Start with a clean workspace in seconds.</p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-zinc-300">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                placeholder="Alex Morgan"
                autoComplete="name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-300">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-300">Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center rounded-lg bg-sky-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader label="Creating account" /> : "Sign up"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link className="font-semibold text-sky-300 hover:text-sky-200" to="/login">
              Sign in
            </Link>
          </p>
        </form>

        <div className="rounded-lg border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950/50 p-8 shadow-2xl shadow-black/40 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            TaskFlow
          </p>
          <h2 className="mt-5 max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Bring every task into clear view.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
            Capture work, filter by status, and keep momentum visible from one responsive dashboard.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signup;
