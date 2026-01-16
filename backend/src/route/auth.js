require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { z } = require("zod");

const authMiddleware = require("../middleware/userAuthMiddleware");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const csrf = require("csurf");

// CSRF middleware (cookie based)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true
  }
});

//  CSRF TOKEN ROUTE
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use(express.json());


router.get("/check", authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Name must be at least 20 characters")
    .max(60, "Name must be at most 60 characters"),

  email: z.string().email({ message: "Invalid email format" }),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters")
    .regex(/[A-Z]/, "Password must contain one uppercase letter")
    .regex(/[!@#$%^&*]/, "Password must contain one special character"),

  role: z
    .enum(["ADMIN", "USER"])
    .optional()
});

router.post("/Signup", async (req, res) => {

  // Zod validation
  const validationResult = signupSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: validationResult.error.issues[0].message
    });
  }

  const { username, email, password, role } = validationResult.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

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

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.TOKEN,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 5 * 60 * 60 * 1000
    });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
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

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 5 * 60 * 60 * 1000
    })

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

router.post("/logout", csrfProtection, (req, res) => {
  // Clear auth token
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });

  // Clear CSRF cookie (default name is _csrf)
  res.clearCookie("_csrf");


  return res.status(200).json({
    message: "Logout successful"
  });
});


module.exports = router;
