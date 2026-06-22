const Loader = ({ label = "Loading" }) => (
  <div className="flex items-center justify-center gap-3 text-sm text-zinc-300">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-sky-400" />
    <span>{label}</span>
  </div>
);

export default Loader;
