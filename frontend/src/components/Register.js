import RegisterImage from "../assets/images/register.png";
import GoogleLogo from "../assets/images/google.png";
import MicrosoftLogo from "../assets/images/microsoft.png";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const [showPassword, setShowPassword] = useState(false);

  // ✅ ADDED STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ---------------- REGISTER FUNCTION ----------------
  const handleRegister = async () => {
    try {
      setError("");

      // basic validation
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const response = await fetch("http://localhost:8000/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "user"
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Registration successful");
        navigate("/login");
      } else {
        setError(data.detail || "Registration failed");
      }

    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE (UNCHANGED) */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">

        <img src={RegisterImage} alt="register" className="w-[420px] z-10" />

        <div className="absolute top-16 left-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-600 text-white p-2 rounded-lg">💼</div>
            <h2 className="text-lg font-semibold text-gray-800">Debtors</h2>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Create Account
          </h1>

          <p className="text-gray-500 max-w-sm">
            Sign up to get started with your debtors management
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 py-3">

        <div className="bg-white shadow-lg rounded-xl p-10 w-[400px] my-4">

          <h2 className="text-2xl font-bold mb-2 text-gray-800">Register</h2>
          <p className="text-gray-500 mb-6">
            Create your account to get started
          </p>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          {/* FULL NAME */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full mt-1 p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-green-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* TERMS */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <input type="checkbox" className="accent-green-500" />
            <span>
              I agree to the Terms of Service and Privacy Policy
            </span>
          </div>

          {/* REGISTER BUTTON */}
          <button
            onClick={handleRegister}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Register →
          </button>

          {/* SOCIAL */}
          <div className="text-center my-5 text-gray-400">
            or continue with
          </div>

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
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Login here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;