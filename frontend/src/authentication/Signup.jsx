import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { data } from "react-router-dom";
import config from "../config";
import { useNavigate } from "react-router-dom";


const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPasword] = useState("");
    const [role, setRole] = useState("USER");

    const navigate = useNavigate();

    
    const handleSignup = async () => {
        try {
            const response = await axios.post(`${config.apiUrl}/Signup`, {
                username,
                email,
                password,
                role
            }, {
                withCredentials: true
            });
            console.log(response)
            navigate("/Dashboard");
        } catch (error) {
            console.log("signup failed", error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
            <div className="flex flex-col bg-gray-950 p-10 gap-6 rounded-4xl w-full max-w-lg">
                <h1 className="font-bold text-blue-500 text-2xl flex flex-col items-center gap-3 ">Signup</h1>
                <input className="w-full p-3  text-white bg-gray-500 border-2 rounded-sm" onChange={(e) => setUsername(e.target.value)} placeholder="username" />
                <input className="w-full p-3  text-white bg-gray-500 border-2 rounded-sm" onChange={(e) => setEmail(e.target.value)} placeholder="emai" />
                <input className="w-full p-3  text-white bg-gray-500 border-2 rounded-sm" type="password" onChange={(e) => setPasword(e.target.value)} placeholder="password" />
{/*                 <input className="w-full p-3  text-white bg-gray-500 border-2 rounded-sm" onChange={(e) => setRole(e.target.value)} placeholder="role" />
                <button className="bg-blue-600 cursor-pointer p-3 rounded-lg font-bold hover:bg-blue-800 transition duration-300" onClick={handleSignup}>Signup</button> */}
                <button className="bg-blue-600 cursor-pointer p-3 rounded-lg font-bold hover:bg-blue-800 transition duration-300" onClick={()=>navigate("/Login")}>Login</button>
            </div>
        </div>
    )
}

export default Signup;
