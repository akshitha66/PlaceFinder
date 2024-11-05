const User = require("../models/user");

module.exports.renderSignupForm = (req,res) => {
    //res.send("form");
    res.render("users/signup.ejs");
};
 
module.exports.signup = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err); 
            }
            req.flash("success", "Welcome to wanderlust!");
            res.redirect("/listings");
        })
        
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
  
};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req,res) => {
    //res.send("Wecome to wanderlust, you are logged in!");
    //to redirect to listings page and send success message as flash message
    req.flash("success","Wecome to wanderlust, you are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout =  (req,res,next) => {
    req.logout((err) => {
        if(err) {
           return next(err);
        }
        req.flash("success", "your are logged out!");
        res.redirect("/listings");
    })
};