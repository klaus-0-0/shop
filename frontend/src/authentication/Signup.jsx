import React, { useState } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${config.apiUrl}/Signup`,
        { username, email, password, role },
        { withCredentials: true }
      );
      console.log(response);
      navigate("/Dashboard");
    } catch (error) {
      console.log("signup failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-6">
          Create Account
        </h1>
        <div className="flex flex-col gap-4">
          <input
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPasword(e.target.value)}
            placeholder="Password"
          />

          {/* Role Selector */}
          <select
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button
            className="w-full py-3 mt-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            onClick={handleSignup}
          >
           {loading? "loading..." : "Sign Up"}
          </button>

          <p className="text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-400 hover:underline cursor-pointer"
              onClick={() => navigate("/Login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
