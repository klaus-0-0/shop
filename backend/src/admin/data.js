const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const isAdmin = require("./authAdmin");

router.post("/AdminDashboard", isAdmin, async (req, res) => {
  try {
    const userData = await prisma.shop.findMany();

    if (userData.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Here is all user data",
      users: userData,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/deleteShop", isAdmin, async (req, res) => {
  const { id } = req.body;
  try {
    const response = await prisma.shop.findUnique({ where: { id } });
    if (!response) {
      res.status(404).json({ message: "shop not deleted" });
    }
    else {
      const deleteReviews = await prisma.review.deleteMany({ where: { shopId: id } });
      const deleteShop = await prisma.shop.delete({ where: { id } });
      res.status(200).json({ message: "delete success" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server issue" });
  }
})

module.exports = router;