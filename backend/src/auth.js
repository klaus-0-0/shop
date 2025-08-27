require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const authMiddleware = require("./authMiddleware");
const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(express.json()); // Ensure JSON body parsing


router.get("/check", authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/Signup", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role === "ADMIN" ? "ADMIN" : "USER"
      }
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.TOKEN, { expiresIn: "1h" });
    res.cookie('accessToken', token, {
      httpOnly: true,       // JS can't access it (XSS-safe)
      secure: true,         // only sent over HTTPS
      sameSite: 'None',     // blocks CSRF
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    return res.status(200).json({
      message: "Signup successful",
      user: { username, email, role: newUser.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/Login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await prisma.user.findUnique({ where: { email } });
    if (!userData) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: userData.id, role: userData.role }, process.env.TOKEN, { expiresIn: "1h" });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: userData.id,
        name: userData.username,
        email: userData.email,
        role: userData.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server issue" });
  }
});

router.post("/createShop", async (req, res) => {
  try {
    const { shopname, address, userId, shopusername } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const createshop = await prisma.shop.create({
      data: {
        shopname,
        address,
        userId,
        shopusername
      }
    });

    return res.status(200).json({ message: "Shop created successfully", createshop });
  } catch (error) {
    console.error("CreateShop error:", error);
    res.status(500).json({ message: "Server issue", error: error.message });
  }
});

router.post("/fetchShops", async (req, res) => {
  try {
    const shops = await prisma.shop.findMany();
    if (shops.length == 0) {
      return res.status(404).json({ message: "no shops avilable" });
    }
    else {
      return res.status(200).json({ message: "here all shops list", shops })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
})

router.post("/userRating", async (req, res) => {
  const { userId, shopId, comment, rating } = req.body;

  if (!userId || !shopId || !comment || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingReview = await prisma.review.findUnique({
      where: {
        shopId_userId: { shopId, userId }
      }
    });

    if (existingReview) {
      return res.status(404).json({ message: "You've already reviewed this shop." });
    }

    const newReview = await prisma.review.create({
      data: {
        userId,
        shopId,
        comment,
        rating
      }
    });

    return res.status(201).json({ message: "Review submitted", review: newReview });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ message: "Server issue" });
  }
});

// In Express
router.get("/api/fetchreviews/:shopId", async (req, res) => {
  const { shopId } = req.params;

  try {
    const reviews = await prisma.review.findMany({ where: { shopId } });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    return res.status(200).json({ message: "Here are all user reviews", reviews });
  } catch (error) {
    console.error("FetchReviews error:", error);
    res.status(500).json({ message: "Server issue" });
  }
});


module.exports = router;
