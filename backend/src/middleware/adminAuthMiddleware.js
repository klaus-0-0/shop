const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN);
        if (decoded.role !== "ADMIN") {
            console.log("invalid admin")
            return res.status(403).json({ message: "Access denied: Admins only" });
        }
        console.log("admin verified")
        req.user = decoded; // attach user info
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = isAdmin;