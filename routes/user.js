const { Router } = require("express");
const User = require("../models/user.js");

const router = Router();

router.get("/signin", (req, res) => {
    res.render("signin");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/logout" , (req , res) => {
     return res.clearCookie('token').render("signin");
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    if(email === "" || password === "") {
        return res.render("signup", {
            error: "password or email cannot be empty."
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup", {
                error: "An account is already registered with this email."
            });
        }

        await User.create({
            fullName,
            email,
            password
        });

     
        return res.redirect("signin");

    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).send("Server Error");
    }
});


router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPasswordAndGenerateTokens(email, password); // Use await
        console.log(token);
        return res.cookie('token' , token).redirect("/");
    } catch (error) {
        // This errror is send in locals when can be use in ejs file where u will have the locals
        res.render("signin" , {
            error : "Inccorrect email or password"
        });
    }
});

module.exports = router;
