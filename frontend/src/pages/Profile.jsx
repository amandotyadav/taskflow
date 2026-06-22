import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  useEffect(() => {
    if (!message && !error) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setMessage("");
      setError("");
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [message, error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      setMessage("Profile updated");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950/40 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Profile
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Account details
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Keep your visible workspace identity up to date.
        </p>
      </section>

      {(message || error) && (
        <div
          className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
            error
              ? "border-rose-400/30 bg-rose-500/10 text-rose-200"
              : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {error || message}
        </div>
      )}

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-lg border border-white/10 bg-zinc-900/70 p-6">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-400 text-2xl font-black text-zinc-950">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <h2 className="mt-5 break-words text-xl font-semibold text-white">{user?.name}</h2>
          <p className="mt-2 break-words text-sm text-zinc-400">{user?.email}</p>
          <div className="mt-6 rounded-lg border border-white/10 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Member since</p>
            <p className="mt-2 text-sm font-medium text-zinc-200">
              {user?.createdAt
                ? new Intl.DateTimeFormat("en", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  }).format(new Date(user.createdAt))
                : "Recently"}
            </p>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-white/10 bg-white/[0.05] p-6 backdrop-blur"
        >
          <h2 className="text-xl font-semibold text-white">Update profile</h2>
          <p className="mt-2 text-sm text-zinc-400">Your email is used for authentication.</p>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-zinc-300">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                placeholder="Your name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-300">Email</span>
              <input
                value={user?.email || ""}
                readOnly
                className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950/40 px-4 py-3 text-zinc-500 outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-7 flex min-w-36 items-center justify-center rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader label="Saving" /> : "Save profile"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Profile;
