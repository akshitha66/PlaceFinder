const express =  require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//require for User controller
const userController = require("../controllers/users.js");

//combining signup form and route
router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup)
);

//combining login form and route
router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash:true }) , userController.login);

//logout
router.get("/logout", userController.logout);

module.exports = router;
//signup form
/*router.get("/signup", userController.renderSignupForm);*/

//signup route
/*router.post("/signup", wrapAsync(userController.signup));*/

//login form
/*router.get("/login", userController.renderLoginForm);*/

//login route
/*router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash:true }) , userController.login);*/

