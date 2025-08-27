import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";

const CreateShop = () => {
  const [shopname, setShopname] = useState("");
  const [address, setAddress] = useState("");
  const [userId, setUserId] = useState("");
  const [shopusername, setShopUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getID = JSON.parse(localStorage.getItem("user-info"));
    if (getID) {
      const usersID = getID.id;
      setUserId(usersID);
      console.log("User ID loaded:", usersID);
    }
  }, []);

  const handleShop = async () => {
    try {
      const res = await axios.post(`${config.apiUrl}/createShop`, {
        shopname,
        address,
        userId,
        shopusername,
      });

      console.log("Shop created:", res.data);
      setShopname("");
      setAddress("");
      setShopUserName("");
    } catch (err) {
      console.error("Shop creation failed:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      
      <div className="m-6">
        <button
          onClick={() => navigate("/Dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
           Back to Dashboard
        </button>
      </div>

      
      <div className="max-w-md mx-auto bg-gray-950 rounded-xl p-6 space-y-5 shadow-lg ">
        <h2 className="text-2xl font-bold text-center text-blue-400">Create a New Shop</h2>

        <input
          type="text"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded placeholder-gray-400 "
          placeholder="Shop Name"
          value={shopname}
          onChange={(e) => setShopname(e.target.value)}
        />

        <input
          type="text"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded placeholder-gray-400 "
          placeholder="Shop Username"
          value={shopusername}
          onChange={(e) => setShopUserName(e.target.value)}
        />

        <input
          type="text"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded placeholder-gray-400 "
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="flex justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            onClick={handleShop}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateShop;