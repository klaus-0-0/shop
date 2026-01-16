const express = require("express")
const cors = require("cors")
const app = express();
const PORT = 3000;
const cookieParser = require('cookie-parser');
const csrf = require("csurf");

const auth = require("./route/auth")
const shopRoute = require("./route/userShopRoute");
const admindata = require("./route/adminShopRoute")

app.use(cors({
    origin: "http://localhost:5173",
    // origin: "https://frontend-wr1l.onrender.com",
    credentials: true
}));
app.use(cookieParser()); 
app.use(express.json());

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    }
});

// crsf to all except GET
app.use((req, res, next) => {
    if (req.method === "GET") {
        return next();
    }
    csrfProtection(req, res, next);
});

app.use("/api", auth);
app.use("/api", shopRoute);
app.use("/api", admindata);

app.get("/", (req, res) => {
    console.log("sucess");
    res.status(200).json({ message: "success" })
})

app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`)
}) 
