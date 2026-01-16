import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/user/Dashboard";
import UserShop from "./pages/user/UserShop";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import CreateShop from "./pages/user/CreateShop";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUserShop from "./pages/admin/AdminUserShop";
import UpdatePassword from "./pages/user/UpdatePassword";

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
        <Route path="/updatepassword" element={<UpdatePassword />} />

        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminUserShop/:id" element={<AdminUserShop />} />
      </Routes>
    </Router>
  )
}

export default App
