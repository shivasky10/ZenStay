const express = require("express");
const app = express();
const mongoose =require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");

const mongourl="mongodb://127.0.0.1:27017/zenstay";

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"public")));


const sessionOptions={
    secret:"secretcode",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});

//routes path
app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);





async function main(){
    await mongoose.connect(mongourl);
}

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log("error");
})








// middleware 

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let{status,message}=err;
    res.render("error.ejs",{message})
    // res.status(status).send(message);
});

app.get("/",(req,res)=>{
    res.send("iam root");
})


app.listen(8080,()=>{
    console.log("listening on 8080");
})