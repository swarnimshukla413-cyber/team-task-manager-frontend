import { useState } from "react";

const API = "https://team-task-manager-backend-eygg.onrender.com/api";

function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // ================= LOGIN =================
  const login = async () => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.error || data.message || "Login failed");
        return;
      }

      onLogin(data);

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // ================= SIGNUP =================
  const signup = async () => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      console.log("SIGNUP RESPONSE:", data);

      if (!res.ok) {
        alert(data.error || data.message || "Signup failed");
        return;
      }

      onLogin(data);

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>{isLogin ? "Login" : "Signup"}</h2>

      {!isLogin && (
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={isLogin ? login : signup}>
        {isLogin ? "Login" : "Signup"}
      </button>

      <p>
        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}
      </p>

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Signup" : "Login"}
      </button>
    </div>
  );
}

export default Auth;