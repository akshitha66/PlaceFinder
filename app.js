if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express =  require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layouts/boilerplate'); // Set default layout if needed
const ExpressError = require("./utils/ExpressError.js");
//For sessions
const session = require("express-session");
//for flash
const flash = require("connect-flash");
//require Passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//require for routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

//start server
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

//create basic API
/*app.get("/", (req, res) => {
    res.send("Hi, i'm root");
});*/


//For Database
main().then(() => {
    console.log("connection to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


//set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//Session
const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

//implement pasport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//Demo User
/*app.get("/demouser", async(req,res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    });

    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
});*/


//For router listings
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", { message });
    //res.send("something went wrong");
    //res.status(statusCode).send(message);
});
