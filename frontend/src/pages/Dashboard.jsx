import { useEffect, useMemo, useState } from "react";
import Loader from "../components/Loader";
import TaskCard from "../components/TaskCard";
import api, { getErrorMessage } from "../services/api";

const emptyTask = {
  title: "",
  description: "",
  completed: false
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.tasks);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load tasks"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && task.completed) ||
        (filter === "pending" && !task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      pending: tasks.filter((task) => !task.completed).length
    }),
    [tasks]
  );

  const openCreateModal = () => {
    setEditingTask(null);
    setTaskForm(emptyTask);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      completed: task.completed
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingTask(null);
    setTaskForm(emptyTask);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!taskForm.title.trim()) {
      setError("Task title is required");
      return;
    }

    setSaving(true);
    try {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask._id}`, {
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          completed: taskForm.completed
        });
        setTasks((current) =>
          current.map((task) => (task._id === editingTask._id ? data.task : task))
        );
        setMessage("Task updated");
      } else {
        const { data } = await api.post("/tasks", {
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          completed: taskForm.completed
        });
        setTasks((current) => [data.task, ...current]);
        setMessage("Task created");
      }
      setModalOpen(false);
      setEditingTask(null);
      setTaskForm(emptyTask);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save task"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskToDelete) => {
    const confirmed = window.confirm(`Delete "${taskToDelete.title}"?`);

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      setTasks((current) => current.filter((task) => task._id !== taskToDelete._id));
      setMessage("Task deleted");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete task"));
    }
  };

  const handleToggle = async (taskToToggle) => {
    setError("");
    setMessage("");
    try {
      const { data } = await api.put(`/tasks/${taskToToggle._id}`, {
        completed: !taskToToggle.completed
      });
      setTasks((current) =>
        current.map((task) => (task._id === taskToToggle._id ? data.task : task))
      );
      setMessage(data.task.completed ? "Task marked complete" : "Task marked pending");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update task"));
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-sky-950/40 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your task command center
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Create, search, filter, and complete work from a single focused workspace.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-sky-300"
          >
            Create task
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Total", stats.total],
            ["Completed", stats.completed],
            ["Pending", stats.pending]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-zinc-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {(message || error) && (
        <div
          className={`fixed right-4 top-24 z-40 max-w-sm rounded-lg border px-4 py-3 text-sm shadow-2xl backdrop-blur ${
            error
              ? "border-rose-400/30 bg-rose-500/15 text-rose-100"
              : "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
          }`}
        >
          {error || message}
        </div>
      )}

      <section className="mt-8">
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-zinc-900/60 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 sm:max-w-md"
            placeholder="Search tasks"
          />

          <div className="grid grid-cols-3 rounded-lg border border-white/10 bg-zinc-950/80 p-1">
            {["all", "completed", "pending"].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
                  filter === option
                    ? "bg-sky-400 text-zinc-950"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20">
            <Loader label="Loading tasks" />
          </div>
        ) : filteredTasks.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-white/10 bg-zinc-900/50 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">No tasks found</h2>
            <p className="mt-3 text-sm text-zinc-400">
              Create a new task or adjust the current search and filter.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-6 rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-sky-300"
            >
              Create task
            </button>
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-lg border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {editingTask ? "Edit task" : "Create task"}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Keep the title clear and the description actionable.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-zinc-300">Title</span>
                <input
                  value={taskForm.title}
                  onChange={(event) =>
                    setTaskForm((current) => ({ ...current, title: event.target.value }))
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                  placeholder="Prepare sprint plan"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-300">Description</span>
                <textarea
                  value={taskForm.description}
                  onChange={(event) =>
                    setTaskForm((current) => ({ ...current, description: event.target.value }))
                  }
                  rows={5}
                  className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                  placeholder="Add details, notes, or acceptance criteria"
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3">
                <span>
                  <span className="block text-sm font-medium text-zinc-200">Completed</span>
                  <span className="block text-xs text-zinc-500">Mark this task as finished.</span>
                </span>
                <input
                  type="checkbox"
                  checked={taskForm.completed}
                  onChange={(event) =>
                    setTaskForm((current) => ({ ...current, completed: event.target.checked }))
                  }
                  className="h-5 w-5 rounded border-white/20 bg-zinc-950 accent-sky-400"
                />
              </label>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex min-w-32 items-center justify-center rounded-lg bg-sky-400 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader label="Saving" /> : editingTask ? "Save changes" : "Create task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
