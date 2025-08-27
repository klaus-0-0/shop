import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [userData, setUserdata] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await axios.post(`${config.apiUrl}/AdminDashboard`, {}, { withCredentials: true });
      setUserdata(res.data.users);
      console.log("Admin data:", res.data);
    } catch (err) {
      console.error("Failed to fetch admin data:", err.response?.data?.message || err.message);
    }
  };

  const handleUserShop = (user) => {
    navigate(`/AdminUserShop/${user.id}`, {state: user})
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <div className="sticky top-0 z-10 bg-gray-500 text-gray-900 p-6 shadow-md">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {userData.map((user, index) => (
          <div
            key={index}
            onClick={() => handleUserShop(user)}
            className="bg-amber-800 rounded-lg shadow-lg p-6 hover:bg-amber-700 transition duration-300 cursor-pointer"
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