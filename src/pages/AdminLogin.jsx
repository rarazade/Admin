import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/admins/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      localStorage.setItem("token", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f242b]">
      <form onSubmit={handleLogin} className="bg-[#292F36] p-8 rounded-lg w-full max-w-sm shadow-lg">
        <h2 className="text-white text-2xl mb-4 font-semibold">Admin Login</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#1f242b] text-white border border-gray-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#1f242b] text-white border border-gray-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#4ECDC4] text-black font-semibold py-2 rounded hover:bg-[#3fb8b3]"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
