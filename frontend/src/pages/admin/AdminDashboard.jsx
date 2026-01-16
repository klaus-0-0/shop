import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/shopping-bag.png";

const AdminDashboard = () => {
  const [userData, setUserdata] = useState([]);
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/csrf-token`);
        setCsrfToken(res.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token", error.message);
      }
    };

    fetchCsrfToken();
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/AdminDashboard`, {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      setUserdata(res.data.users);
      console.log("Admin data:", res.data);
    } catch (err) {
      console.error("Failed to fetch admin data:", err.response?.data?.message || err.message);
    }
  };

  const handleUserShop = (user) => {
    navigate(`/AdminUserShop/${user.id}`, { state: user })
  }

  const handleSignout = ()=>{
    localStorage.removeItem("userData");
    navigate("/login");
  }
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <img src={logo} className="h-10 w-10" alt="logo" />
          <h1 className="ml-2 text-2xl font-semibold">Shop</h1>

          <div className="ml-auto flex items-center gap-4">
            {/* <button
              onClick={() => navigate("/create-shop")}
              className="px-4 py-2 text-sm font-medium  rounded-lg hover:bg-blue-500 transition cursor-pointer"
            >
              Create Shop
            </button> */}

            <button className="px-4 py-2 text-sm font-medium  rounded-lg hover:bg-red-500 transition cursor-pointer" onClick={()=> handleSignout()}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center mt-5">
      <input className="h-10 w-100 border rounded-3xl text-center" placeholder="search...">
      </input>
       </div>

      <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {userData.map((user, index) => (
          <div
            key={index}
            onClick={() => handleUserShop(user)}
            className="h-50 bg-cyan-800 rounded-lg shadow-lg p-6 hover:bg-cyan-700 transition duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{user.shopname}</h2>
            {<p className="text-sm text-white">📧 {user.shopusername}</p>}
            {/* {<p className="text-sm text-amber-100">🛡️ Role: {user.role}</p>} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;