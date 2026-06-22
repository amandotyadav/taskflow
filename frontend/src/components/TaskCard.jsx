const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const formattedDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(task.createdAt));

  return (
    <article className="group rounded-lg border border-white/10 bg-zinc-900/70 p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className={`break-words text-lg font-semibold ${
              task.completed ? "text-zinc-500 line-through" : "text-white"
            }`}
          >
            {task.title}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">{formattedDate}</p>
        </div>
        <button
          onClick={() => onToggle(task)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
            task.completed
              ? "bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
              : "bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
          }`}
        >
          {task.completed ? "Completed" : "Pending"}
        </button>
      </div>

      <p className="mt-4 min-h-12 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-400">
        {task.description || "No description added."}
      </p>

      <div className="mt-5 flex items-center justify-end gap-2 border-t border-white/10 pt-4">
        <button
          onClick={() => onEdit(task)}
          className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
