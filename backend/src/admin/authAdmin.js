const jwt = require("jsonwebtoken");

function isAdmin(req, res, next) {
    const token = req.cookies.accessToken;
    // console.log("req.cookies", req.cookies)
    // console.log("token", token)
    if (!token) return res.status(401).json({ message: "No token provided" });

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
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = isAdmin;