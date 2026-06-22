import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-zinc-800 text-white"
      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
  }`;

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 font-black text-zinc-950 shadow-glow">
            TF
          </span>
          <span>
            <span className="block text-base font-semibold text-white">TaskFlow</span>
            <span className="hidden text-xs text-zinc-500 sm:block">Plan. Track. Finish.</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            Profile
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-zinc-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-200"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
