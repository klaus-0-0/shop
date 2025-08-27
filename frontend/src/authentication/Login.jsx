import React from "react";
import { useState } from "react";
import config from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handlelogin = async () => {
        const res = await axios.post(`${config.apiUrl}/Login`, {
            email,
            password
        }, {
            withCredentials: true
        })
        console.log(res)
        const resData = await res.data.user.role;
        const userId = await res.data.user;
        localStorage.setItem("user-info", JSON.stringify(userId))

        if (resData == "ADMIN") {
            navigate("/AdminDashboard");
        }
        else {
            navigate("/Dashboard");
        }

    }
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-950 p-8 rounded-xl shadow-lg space-y-6">
                <h2 className="text-2xl font-bold text-green-500 text-center">Login</h2>

                <input
                    type="email"
                    className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md placeholder-gray-400 "
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md placeholder-gray-400 "
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-3 rounded-md transition duration-300 cursor-pointer"
                    onClick={handlelogin}
                >
                    Login
                </button>
                <button
                    className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-3 rounded-md transition duration-300 cursor-pointer"
                    onClick={()=>navigate("/Signup")}
                >
                    Signup
                </button>
            </div>
        </div>
    );
}

export default Login;