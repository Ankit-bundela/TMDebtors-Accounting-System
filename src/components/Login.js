import React, { useState } from "react";
import TMAlert from "./TMAlert";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ open: true, message: "Login successful", severity: "success" });

        // Save user from backend to localStorage
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("token", data.token);

        // Redirect to home after 1.5s
        setTimeout(() => navigate("/home"), 1500);
      } else {
        setAlert({ open: true, message: data.error || "Invalid credentials", severity: "error" });
      }
    } catch (error) {
      console.error(error);
      setAlert({ open: true, message: "Server error", severity: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-lg mb-4"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-lg mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Sign In
        </button>

        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="text-blue-500 hover:underline">
            Register Now
          </button>
        </p>

        <TMAlert
          open={alert.open}
          severity={alert.severity}
          message={alert.message}
          onClose={() => setAlert({ ...alert, open: false })}
        />
      </div>
    </div>
  );
};

export default Login;