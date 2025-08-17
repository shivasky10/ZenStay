const User =require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res)=>{
    try{
    let{username,email,password}=req.body;
    const newUser = new User({username,email});
    const registeduser = await User.register(newUser,password);
    console.log(registeduser);
    req.login(registeduser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","Welcome to Zenstay");
         res.redirect("/listings");
         })

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};


module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Zenstay");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out now");
        res.redirect("/listings");
    })
};
