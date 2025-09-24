import React, { useState } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";
import wall from "../assets/SignBI.png";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setLoading(true);
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
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <img
        src={wall}
        alt="Background"
        className="absolute w-full h-full object-cover opacity-100"
      />

      {/* Navigation Bar */}
      <nav className="w-full bg-white p-4 flex justify-end relative z-10">
        <div className="flex space-x-6">
          <button
            className="text-black font-bold mt-4"
            onClick={() => navigate("")}
          >
            About
          </button>
          <div className="flex justify-center pt-4 gap-4">
            <button
              className="w-50 bg-black hover:bg-cyan-700 text-white py-2 px-4 rounded font-medium transition"
              onClick={handleSignup}
            >
              Sign up
            </button>
            <button
              className="w-50 bg-white hover:bg-cyan-700 text-black border border-black py-2 px-4 rounded font-medium transition"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </div>
        </div>
      </nav>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center lg:justify-start p-4 relative z-10">
        <div className="w-full max-w-md lg:ml-60 bg-white bg-opacity-90 p-6 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Welcome</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPasword(e.target.value)}
            />
            <select
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <div className="flex justify-center pt-4 gap-4">
              <button
                className="w-50 bg-black hover:bg-cyan-700 text-white py-2 px-4 rounded font-medium transition"
                onClick={handleSignup}
              >
                {loading ? "Loading..." : "Sign up"}
              </button>
              <button
                className="w-50 bg-white hover:bg-cyan-700 text-black border border-black py-2 px-4 rounded font-medium transition"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
