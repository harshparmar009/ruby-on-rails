import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./services/taskApi";
import "./App.css";

const initialForm = {
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
  completed: false,
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Could not load tasks. Check whether Rails is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newTask = await createTask(form);
      setTasks((current) => [newTask, ...current]);
      setForm(initialForm);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.errors?.join(", ") ||
          "Could not create task"
      );
    }
  };

  const toggleCompleted = async (task) => {
    try {
      const completed = !task.completed;

      const updatedTask = await updateTask(task.id, {
        completed,
        status: completed ? "completed" : "pending",
      });

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id ? updatedTask : item
        )
      );
    } catch (err) {
      console.error(err);
      setError("Could not update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setTasks((current) =>
        current.filter((task) => task.id !== id)
      );
    } catch (err) {
      console.error(err);
      setError("Could not delete task");
    }
  };

  return (
    <main className="container">
      <header>
        <h1>Task Manager by ruby on rails</h1>
        <p>React frontend connected to Rails and PostgreSQL</p>
      </header>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task title"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Task description"
        />

        <div className="form-row">
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit">Create task</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <section className="task-list">
          {tasks.length === 0 && <p>No tasks created yet.</p>}

          {tasks.map((task) => (
            <article
              key={task.id}
              className={`task-card ${
                task.completed ? "completed" : ""
              }`}
            >
              <div>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <span>{task.priority}</span>
                <span>{task.status}</span>
              </div>

              <div className="actions">
                <button onClick={() => toggleCompleted(task)}>
                  {task.completed ? "Reopen" : "Complete"}
                </button>

                <button
                  className="delete"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;
