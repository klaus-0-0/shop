import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import logo from "../../assets/shopping-bag.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [filter, setFilter] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/csrf-token`);
        setCsrfToken(res.data.csrfToken);
      } catch (error) {
        console.error("failed to fetch csrftoken", error.message);
      }
    }

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    fetchUserShops();
  }, []);

  const fetchUserShops = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/fetchShops`);
      setShops(res.data?.shops || []);
      console.log(res);

    } catch (error) {
      console.error("Error fetching shops:", error.message);
    }
  };

  const handleUser = (shop) => {
    navigate(`/UserShop/${shop.id}`, { state: shop });
  };

  const handleSignout = async () => {
    try {
      await axios.post(
        `${config.apiUrl}/logout`,
        {},
        {
          headers: {
            "X-CSRF-Token": csrfToken
          },
          withCredentials: true
        }
      );

      localStorage.removeItem("userData");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-800 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <img src={logo} className="h-10 w-10 bg-white rounded-2xl" alt="logo" />
          <h1 className="ml-2 text-2xl font-semibold">Shop</h1>

          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={() => navigate("/createshop")}
              className="px-4 py-2 text-sm font-medium  rounded-lg hover:bg-blue-500 transition cursor-pointer"
            >
              Create Shop
            </button>
            <button
              onClick={() => navigate("/updatepassword")}
              className="px-4 py-2 text-sm font-medium  rounded-lg hover:bg-green-500 transition cursor-pointer"
            >
              updatePassword
            </button>

            <button className="px-4 py-2 text-sm font-medium  rounded-lg hover:bg-red-500 transition cursor-pointer" onClick={() => handleSignout()}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="flex items-center justify-center mt-5">
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border h-10 w-100 text-center rounded-2xl "
        />
      </div>

      {/* Shop Grid */}
      <div className="grid gap-6 mt-10 h-56 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {shops.map((shop) => (
          <div
            key={shop.id}
            onClick={() => handleUser(shop)}
            className="cursor-pointer bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2">
              {shop.shopname}
            </h3>
            <p className="text-sm text-gray-400">
              {shop.shopusername}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
