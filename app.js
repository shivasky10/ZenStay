const express = require("express");
const app = express();
const mongoose =require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"public")));

const mongourl="mongodb://127.0.0.1:27017/zenstay";

const Listing = require("./models/listing.js");

async function main(){
    await mongoose.connect(mongourl);
}

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log("error");
})

//index route
app.get("/listings",async(req,res)=>{
   let allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
})

//newroute
app.get("/listings/new", async(req,res)=>{
    res.render("listings/new.ejs");
})

//create route
app.post("/listings", async (req,res)=>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
})



//show route
app.get("/listing/:id", async (req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//update route
app.put("/listings/:id",async (req,res)=>{
    let { id }=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
});

//delete route
app.delete("/listings/:id",async (req,res)=>{
    let { id }=req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
});


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "Villa 101",
//         description : "at city",
//         price : 1500,
//         location : "hyderabad",
//         country : "india",
//     });

//     await sampleListing.save();
//     console.log("saved");
//     res.send("testing  done");
    
// });


app.get("/",(req,res)=>{
    res.send("iam root");
})

app.listen(8080,()=>{
    console.log("listening on 8080");
})