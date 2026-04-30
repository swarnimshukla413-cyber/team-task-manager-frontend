import { useEffect, useState } from "react";

const API = "https://team-task-manager-backend-eygg.onrender.com/api";

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  // ================= FETCH =================

  const fetchProjects = async () => {
    const res = await fetch(`${API}/projects`);
    const data = await res.json();
    setProjects(data);
  };

  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  // ================= CREATE =================

  const createProject = async () => {
    if (!projectName.trim()) return;

    const res = await fetch(`${API}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: projectName }),
    });

    const newProject = await res.json();

    setProjects((prev) => [...prev, newProject]);
    setProjectName("");
  };

  const createTask = async () => {
    if (!taskTitle.trim() || !selectedProject) return;

    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: taskTitle,
        dueDate: new Date().toISOString(),
        projectId: Number(selectedProject),
      }),
    });

    const newTask = await res.json();

    setTasks((prev) => [...prev, newTask]);
    setTaskTitle("");
  };

  // ================= UPDATE =================

  const markComplete = async (taskId) => {
    const res = await fetch(`${API}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "DONE" }),
    });

    const updatedTask = await res.json();

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? updatedTask : t))
    );
  };

  // ================= INIT =================

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  // ================= UI =================

  return (
    <div style={{ padding: "30px", fontFamily: "Segoe UI" }}>
      <h1>Team Task Manager 🚀</h1>

      {/* CREATE PROJECT */}
      <div>
        <h2>Create Project</h2>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
        />
        <button onClick={createProject}>Add Project</button>
      </div>

      <h2>Projects</h2>

      {projects.map((p) => (
        <div key={p.id}>
          <h3>{p.name}</h3>

          {tasks
            .filter((t) => t.projectId === p.id)
            .map((t) => (
              <div key={t.id}>
                <span
                  style={{
                    textDecoration:
                      t.status === "DONE" ? "line-through" : "none",
                  }}
                >
                  {t.title}
                </span>

                <button onClick={() => markComplete(t.id)}>
                  ✔
                </button>
              </div>
            ))}
        </div>
      ))}

      {/* CREATE TASK */}
      <div>
        <h2>Create Task</h2>

        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task title"
        />

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button onClick={createTask}>Add Task</button>
      </div>
    </div>
  );
}

export default App;