const express = require("express")
const cors = require("cors")
const app = express();
const PORT = 3000;

const cookieParser = require('cookie-parser');
const auth = require("./auth")
const admindata = require("./admin/data")

app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json()); 
app.use("/api", auth);
app.use("/api", admindata);


app.get("/", (req, res) => {
    console.log("sucess");
    res.status(200).json({ message: "success" })
})

app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`)
}) 