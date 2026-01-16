import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/shopping-bag.png"
function UpdatePassword() {
    const [csrfToken, setCsrfToken] = useState("");
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${config.apiUrl}/csrf-token`)
            .then(res => setCsrfToken(res.data.csrfToken))
            .catch(() => setError("Failed to load CSRF token"));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);
            await axios.put(
                `${config.apiUrl}/updatePassword`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "X-Csrf-Token": csrfToken,
                        "Content-Type": "application/json",
                    },
                }
            );

            setSuccess("Password updated successfully");
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 ">
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
                    <img src={logo} className="h-10 w-10" alt="logo" />
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

            <div className="flex items-center justify-center mt-10">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow ">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Update Password
                </h2>

                {error && (
                    <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="mb-4 text-sm text-green-600 bg-green-50 p-2 rounded">
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-4 text-sm text-blue-600 hover:underline block text-center"
                >
                    ← Back
                </button>
            </div>
            </div>
        </div>
    );
}

export default UpdatePassword;
