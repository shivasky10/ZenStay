if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose =require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsroute = require("./routes/listing.js");
const reviewsroute=require("./routes/review.js");
const userroute=require("./routes/user.js");


// const mongourl="mongodb://127.0.0.1:27017/zenstay";
const dbUrl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"public")));


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 *1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


// app.get("/demouser",async (req,res)=>{
//     let fakeuser = new User({
//         email : "demo@getMaxListeners.com",
//         username:"demouser1"

//     });
//     let registeduser=await User.register(fakeuser,"abcd");
//     res.send(registeduser);
// });

//routes path
app.use("/listings", listingsroute);
app.use("/listings/:id/reviews", reviewsroute);
app.use("/",userroute);

app.get("/",(req,res)=>{
    res.redirect("/listings");
})



async function main(){
    await mongoose.connect(dbUrl);
}

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log("error",err.message);
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




app.listen(8080,()=>{
    console.log("listening on 8080");
})