import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"
import './App.css'
import UserShop from "./pages/UserShop";
import Signup from "./authentication/Signup";
import Login from "./authentication/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateShop from "./pages/CreateShop";
import AdminUserShop from "./pages/admin/AdminUserShop";

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/userShop/:id" element={<UserShop />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createShop" element={<CreateShop />} />

        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminUserShop/:id" element={<AdminUserShop />} />
      </Routes>
    </Router>
  )
}

export default App
