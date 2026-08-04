require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const app = express();

connectDB();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

// const session = require("express-session");

// app.use(session({
//     secret: "mysecretkey",
//     resave: false,
//     saveUninitialized: false
// }));

app.use("/", require("./routes/web"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});



