const express = require("express");
const router = express.Router();
const User = require("../models/users");
const img = require("../models/image");
const upload = require("../config/multer");
const auth = require("../middleware/auth");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


// Home Page

router.get("/", (req, res) => {
    res.render("Home");
});


// Signup Page

router.get("/signup", (req, res) => {
    res.render("signup");
});


// Login Page

router.get("/login", (req, res) => {
    res.render("login");
});

// Dashboard

router.get("/Dashboard", auth, async (req, res) => {

    const images = await img.find();

    res.render("Dashboard", {
        user: req.user,
        images
    });

});

// image

router.get("/image", (req, res) => {

    res.render("image");

});


// image upload

router.post("/image", upload.single("image"), async (req, res) => {

    const { name } = req.body;

    if (!name) {
        return res.send("Please enter a name")
    }
    if (!req.file) {
        return res.send("Please select an image.");
    }

    await img.create({

        name: req.body.name,
        image: req.file.filename

    });

    res.redirect("/Dashboard")

});

// Signup

router.post("/signup", async (req, res) => {

    try {

        const { email, password, confirm_password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("User alredy Exist");
        }

        if (!email) {
            return res.send("enter your email");
        }

        if (!password) {
            return res.send("Create new password");
        }

        if (password !== confirm_password) {
            return res.send("Password and Confirm Password do not match");
        }

        if (password.length < 6) {
            return res.send("Password must be at least 6 characters");
        }

        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const user = new User({
            email,
            password: hashedPassword,
        });

        await user.save();

        return res.redirect("/login");

    }

    catch (error) {

        console.log(error);

        res.send("Something Went Wrong");

    }

});

// Login

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!email || !password) {
            return res.status(400).send("Email and password are required.");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send("Invalid Password");
        }

        // req.session.user = user;

        // return res.redirect("Dashboard");

        const token = jwt.sign(
            {
                id: user._id,
                // email: user.email
            }, "abc123", {

            expiresIn: "1h"
        });

        res.cookie("token", token, {
            httpOnly: true
        });

        res.redirect("/Dashboard")



    } catch (error) {
        console.error(error);
        return res.status(500).send("Something Went Wrong");
    }


});




module.exports = router;


