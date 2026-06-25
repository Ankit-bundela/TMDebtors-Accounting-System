import { useState } from "react";
import LoginImage from "../assets/images/login.png";
import GoogleLogo from "../assets/images/google.png";
import MicrosoftLogo from "../assets/images/microsoft.png";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);

  // ✅ ADDED STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ---------------- LOGIN FUNCTION ----------------
  const handleLogin = async () => {
    try {
      setError("");

      const response = await fetch("http://localhost:8000/loginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.detail || "Invalid credentials");
      }

    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE (UNCHANGED) */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        
        <img src={LoginImage} alt="dashboard" className="w-[420px] z-10" />

        <div className="absolute top-16 left-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">💼</div>
            <h2 className="text-lg font-semibold text-gray-800">Debtors</h2>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Welcome Back!
          </h1>

          <p className="text-gray-500 max-w-sm">
            Sign in to access your debtors management dashboard
          </p>
        </div>

        <div className="absolute bottom-16 left-16 bg-white shadow-md rounded-xl p-5 w-64">
          <p className="text-sm text-gray-500">Total Outstanding</p>
          <h2 className="text-xl font-bold text-indigo-600">$48,750</h2>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        
        <div className="bg-white shadow-lg rounded-xl p-10 w-[400px]">
          
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Login</h2>
          <p className="text-gray-500 mb-6">
            Enter your credentials to access your account
          </p>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* OPTIONS */}
          <div className="flex justify-between items-center mb-6 text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-indigo-500" />
              Remember me
            </label>

            <a href="#" className="text-indigo-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* BUTTON (ONLY CHANGE) */}
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Login →
          </button>

          {/* DIVIDER */}
          <div className="text-center my-5 text-gray-400">
            or continue with
          </div>

          {/* SOCIAL */}
          <div className="flex gap-3">
            
            <button className="w-1/2 flex items-center justify-center gap-2 border p-2 rounded-lg hover:bg-gray-100">
              <img src={GoogleLogo} alt="google" className="w-5 h-5" />
              Google
            </button>

            <button className="w-1/2 flex items-center justify-center gap-2 border p-2 rounded-lg hover:bg-gray-100">
              <img src={MicrosoftLogo} alt="microsoft" className="w-5 h-5" />
              Microsoft
            </button>

          </div>

          {/* FOOTER */}
          <p className="text-sm text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 cursor-pointer hover:underline">
              Register here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}