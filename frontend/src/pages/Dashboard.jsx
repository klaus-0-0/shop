import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

const Dashboard = () => {
  const [shops, setShops] = useState([]);
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
      const res = await axios.post(`${config.apiUrl}/fetchShops`, {}, {
        withCredentials: true,
      });

      if (!res.data || res.data.length === 0) {
        console.log("No shops found");
      } else {
        setShops(res.data.shops); // res.data is now an array
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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col gap-10">
      <div className="sticky top-0 bg-gray-700 p-6 flex gap-x-4">
        <button className="bg-blue-600 p-3 cursor-pointer font-bold rounded-lg hover:bg-blue-700 transition duration-300" onClick={() => navigate("/Dashboard")}>Home</button>
        <button className="bg-blue-600 p-3 cursor-pointer font-bold rounded-lg hover:bg-blue-700 transition duration-300" onClick={() => navigate("/Signup")}>Signup</button>
        <button className="bg-blue-600 p-3 cursor-pointer font-bold rounded-lg hover:bg-blue-700 transition duration-300" onClick={() => {
          localStorage.removeItem("user-info")
          navigate("/Login")
        }}>
          Log-Out
        </button>

        <button
          className="bg-green-600 p-3 cursor-pointer font-bold rounded-lg hover:bg-green-700 transition duration-300"
          onClick={() => navigate("/CreateShop")}
        >
          Create Shop
        </button>
      </div>
      <h1 className="text-4xl font-bold text-white">Dashboard</h1>
      <div className="flex flex-wrap flex-col items-center md:flex-row gap-6">
        {shops.map((shop, index) => (
          <div
            key={index}
            className="border-3 border-black p-7 text-white  bg-blue-600 cursor-pointer hover:bg-blue-800 transition duration-300 rounded-xl px-20 "
            onClick={() => handleUser(shop)}
          >
            <p className="text-white text-2xl p-10 font-bold">{shop.shopname}</p>
            <p className="text-black text-sm font-bold">address: {shop.shopusername}</p>
            <p className="text-black text-sm font-bold">address: {shop.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;