import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import config from "../../config";
import { useNavigate } from "react-router-dom";

const AdminUserShop = () => {
    const [shopname, setShopname] = useState("");
    const [shopusername, setShopusername] = useState("");
    const [address, setAddress] = useState("");
    const [shopId, setShopId] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const shop = location.state;
        if (shop) {
            console.log(shop);
            setShopname(shop.shopname)
            setShopusername(shop.shopusername)
            setAddress(shop.address)
            setShopId(shop.id)
        }
    }, [location.state])

    const handleDeleteShop = async () => {
        try {
            const response = await axios.post(`${config.apiUrl}/deleteShop`, {
                id: shopId
            }, {withCredentials: true});
            if (response.status === 200) { 
                alert("shop deleted success")
                navigate("/AdminDashboard");
            }
            else {
                console.log("delete failed");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-amber-800 rounded-xl p-8 space-y-6 text-center">
                <h1 className="text-3xl font-bold tracking-wide">{shopname || "Shop Name"}</h1>
                <p className="text-sm text-amber-100"> Owner: <span className="font-medium">{shopusername || "N/A"}</span></p>
                <p className="text-sm text-amber-100"> Address: <span className="font-medium">{address || "N/A"}</span></p>

                <button
                    onClick={handleDeleteShop}
                    className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                    🗑️ Delete Shop Owner
                </button>
            </div>
        </div>
    );
}

export default AdminUserShop;