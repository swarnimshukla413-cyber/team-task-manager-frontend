import { useEffect, useState } from "react";
import Auth from "./Auth";

const API = "https://team-task-manager-backend-eygg.onrender.com/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  // ================= AUTH HEADER =================
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  // ================= FETCH =================

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/projects`, {
        headers: authHeader,
      });
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`, {
        headers: authHeader,
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CREATE =================

  const createProject = async () => {
    if (!projectName.trim()) return;

    try {
      const res = await fetch(`${API}/projects`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ name: projectName }),
      });

      const newProject = await res.json();
      setProjects((prev) => [...prev, newProject]);
      setProjectName("");
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async () => {
    if (!taskTitle.trim() || !selectedProject) return;

    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({
          title: taskTitle,
          dueDate: new Date().toISOString(),
          projectId: Number(selectedProject),
        }),
      });

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTaskTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UPDATE =================

  const markComplete = async (taskId) => {
    try {
      const res = await fetch(`${API}/tasks/${taskId}`, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify({ status: "DONE" }),
      });

      const updatedTask = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= INIT =================

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchTasks();
    }
  }, [token]);

  // ================= LOGOUT =================

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  // ================= AUTH SCREEN =================

  if (!token) {
    return (
      <Auth
        onLogin={(data) => {
          console.log("LOGIN DATA:", data);

          // ✅ Validate token
          if (!data.token) {
            alert("Login failed: No token received");
            return;
          }

          // ✅ Handle BOTH backend formats
          const userRole = data.user?.role || data.role;

          if (!userRole) {
            alert("Login failed: Role missing");
            return;
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("role", userRole);

          setToken(data.token);
          setRole(userRole);
        }}
      />
    );
  }

  // ================= DASHBOARD STATS =================

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "DONE").length;
  const pending = tasks.filter((t) => t.status === "PENDING").length;

  // ================= UI =================

  return (
    <div style={{ padding: "30px", fontFamily: "Segoe UI" }}>
      <h1>Team Task Manager 🚀</h1>

      <button onClick={logout}>Logout</button>

      {/* DASHBOARD */}
      <h2>Dashboard</h2>
      <p>Total Tasks: {total}</p>
      <p>Completed: {completed}</p>
      <p>Pending: {pending}</p>

      {/* ADMIN ONLY */}
      {role === "ADMIN" && (
        <div>
          <h2>Create Project</h2>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
          />
          <button onClick={createProject}>Add Project</button>
        </div>
      )}

      {/* PROJECT LIST */}
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

                <button onClick={() => markComplete(t.id)}>✔</button>
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