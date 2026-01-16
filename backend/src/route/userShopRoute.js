require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const authMiddleware = require("../middleware/userAuthMiddleware");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const csrf = require("csurf");

// CSRF middleware (cookie based)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  }
});

router.post("/createShop", authMiddleware, csrfProtection, async (req, res) => {
  try {
    const { shopname, address, shopusername } = req.body;
    const userId = req.user.userId;
    console.log("userid = ",userId);
    
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

router.get("/fetchShops", authMiddleware, async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      include: {
        reviews: true,
      },
    });
    if (shops.length == 0) {
      return res.status(404).json({ message: "no shops avilable" });
    }
    else {
      console.log("shops", shops);
      return res.status(200).json({ message: "here all shops list", shops })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
})

router.post("/userRating", authMiddleware, csrfProtection, async (req, res) => {
  const { shopId, comment, rating } = req.body;
  const userId = req.user.userId;

  if (!shopId || !comment || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      shopId_userId: { shopId, userId }
    }
  });

  if (existingReview) {
    return res.status(409).json({
      message: "You've already reviewed this shop."
    });
  }

  const review = await prisma.review.create({
    data: {
      userId,
      shopId,
      comment,
      rating
    }
  });

  res.status(201).json({ message: "Review submitted", review });
}
);

router.get("/fetchreviews/:id", authMiddleware, async (req, res) => {
  try {
    const shopId = req.params.id;

    // First, verify the shop exists
    const shop = await prisma.shop.findUnique({
      where: { id: shopId }
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found"
      });
    }

    // Fetch reviews for the shop with user details
    const reviews = await prisma.review.findMany({
      where: {
        shopId: shopId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        shop: {
          select: {
            shopname: true,
            shopusername: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      reviews: reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
});

// Update Password Route
router.put("/updatePassword", authMiddleware, csrfProtection, async (req, res) => {
  const userId = req.user.userId; 
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  // Check if new password matches confirmation
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and confirmation do not match"
    });
  }

  // Password strength validation
  if (newPassword.length < 1) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long"
    });
  }

  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as current password"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Log the password change (optional - for security audit)
    console.log(`Password updated for user: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message
    });
  }
});

module.exports = router;
