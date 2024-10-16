const express = require("express");
const app = express();
const path = require("path");
const userRoute = require("./routes/user.js");
const blogRoute = require("./routes/blog.js");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthticationCookie } = require("./middleware/authtication.js");
const Blog = require("./models/blog.js")

const PORT = 8003;

// after giving port number 27017 we gave the name of our databse which is here blogify
mongoose.connect("mongodb://localhost:27017/blogify").then( (e) => console.log("MongoDB Connected Successfully"));

app.use(cookieParser());
app.use(checkForAuthticationCookie("token"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine' , 'ejs');
app.set("views" , path.resolve("./views"));
// The image we were trying to rendering from our pc was to homepage was not allowed by express so we make that image folder sttatic so that we can render it
app.use(express.static(path.resolve("./public")));

app.get("/" , async (req , res) => {
    const allBlogs = await Blog.find({});
    console.log(req.user);
    return res.render("home" , {
        user : req.user ,
        blogs : allBlogs,
    });
})

app.use("/user" , userRoute);
app.use("/blog" , blogRoute);

app.listen(PORT , ()=> console.log("server Started"))