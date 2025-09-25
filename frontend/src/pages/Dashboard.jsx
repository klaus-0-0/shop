import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

const Dashboard = () => {
  const [shops, setShops] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkToken();
    fetchUserShops();
  }, []);

  const checkToken = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/check`, {
        withCredentials: true,
      });
      console.log("Token valid:", res.data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        navigate("/Login");
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  const fetchUserShops = async () => {
    try {
      const res = await axios.post(
        `${config.apiUrl}/fetchShops`,
        {},
        { withCredentials: true }
      );

      if (!res.data || res.data.length === 0) {
        console.log("No shops found");
      } else {
        setShops(res.data.shops);
        console.log("Fetched shops:", res.data.shops);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const handleUser = (shop) => {
    console.log("clicked", shop.id);
    navigate(`/UserShop/${shop.id}`, { state: shop });
  };

  const filteredShops = shops.filter(
    (shop) =>
      shop.shopname.toLowerCase().includes(filter.toLowerCase()) ||
      shop.shopusername.toLowerCase().includes(filter.toLowerCase()) ||
      shop.user?.email?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col gap-10">
      {/* Navbar */}
      <div className="sticky top-0 bg-gray-800 p-6 flex gap-x-4 shadow-md z-10">
        <button
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-2 rounded-lg font-bold hover:scale-105 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate("/Dashboard")}
        >
          Home
        </button>
        <button
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-2 rounded-lg font-bold hover:scale-105 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate("/Signup")}
        >
          Signup
        </button>
        <button
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2 rounded-lg font-bold hover:scale-105 hover:shadow-lg transition cursor-pointer"
          onClick={() => {
            localStorage.removeItem("user-info");
            navigate("/Login");
          }}
        >
          Log-Out
        </button>
        <button
          className="ml-auto bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg font-bold hover:scale-105 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate("/CreateShop")}
        >
          + Create Shop
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-md">
        🏪 Dashboard
      </h1>

      {/* Search Filter */}
      <div className="flex justify-center px-4">
        <input
          type="text"
          placeholder="🔍 Search by shop name, owner or email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-md p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
        />
      </div>

      {/* Shop Listings */}
      <div className="flex flex-wrap justify-center gap-8 p-6">
        {filteredShops.length > 0 ? (
          filteredShops.map((shop, index) => (
            <div
              key={index}
              className="w-80 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:scale-105 hover:shadow-2xl transition transform"
              onClick={() => handleUser(shop)}
            >
              <h2 className="text-2xl font-bold text-white mb-3">
                {shop.shopname}
              </h2>
              <p className="text-sm text-gray-200 mb-1">
                👤 Owner: {shop.shopusername}
              </p>
              <p className="text-sm text-gray-300 mb-3">
                📍 Address: {shop.address}
              </p>
              <div className="mt-4 text-left">
                <p className="text-yellow-300 font-bold">
                  {shop.avgRating
                    ? "★".repeat(shop.avgRating) +
                      "☆".repeat(5 - shop.avgRating)
                    : "No rating yet"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-lg">No shops found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
