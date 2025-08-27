import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "../config";
import { useLocation } from "react-router-dom";

const UserShop = () => {
  const [shopName, setShopName] = useState("");
  const [userId, setUserId] = useState("");
  const [shopId, setShopId] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const shop = location.state;
    if (shop) {
      setShopName(shop.shopname);
      setUserId(shop.userId);
      setShopId(shop.id);
    }
  }, [location.state]);

  useEffect(() => {
    if (shopId) {
      FetchReviews();
    }
  }, [shopId]);

  const FetchReviews = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/api/fetchreviews/${shopId}`);

      if (!res.data.reviews || res.data.reviews.length === 0) {
        console.log("No reviews found");
        setReview([]);
      } else {
        console.log("Reviews =", res.data.reviews);
        setReview(res.data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleUserReview = async () => {
    const numericRating = parseInt(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      alert("Please enter a rating between 1 and 5.");
      return;
    }

    try {
      const res = await axios.post(`${config.apiUrl}/userRating`, {
        userId,
        shopId,
        comment,
        rating: numericRating,
      });

      console.log("Review submitted:", res.data);
      alert("Review submitted successfully!");
      setComment("");
      setRating("");
      await FetchReviews(); // Refresh reviews after submission
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.response?.data?.message || "Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-10">
      <div className="flex flex-col gap-6 items-center">
        <div className="border border-white p-4 bg-blue-500 rounded">
          <h2 className="text-xl font-bold">{shopName}</h2>
        </div>

        <input
          className="text-white p-2 bg-transparent border rounded w-64"
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <input
          className="text-white p-2 bg-transparent border rounded w-64"
          placeholder="Rating (1–5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <button
          className="bg-green-500 p-2 rounded mt-2 hover:bg-green-600"
          onClick={handleUserReview}
        >
          Submit Review
        </button>

        <div className="mt-10 w-full max-w-xl">
          <h3 className="text-lg font-semibold mb-4">User Reviews</h3>
          {review.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            review.map((r, idx) => (
              <div key={idx} className="border p-4 mb-2 rounded bg-gray-700">
                <p><strong>Rating:</strong> {r.rating}</p>
                <p><strong>Comment:</strong> {r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserShop;