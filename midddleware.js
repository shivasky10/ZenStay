module.exports.isLoggedIN=(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.flash("error","please login");
        return res.redirect("/login");
    }
    next();
}