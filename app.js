const express = require("express");
const app = express();
const mongoose =require("mongoose");

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

app.get("/testListing",async (req,res)=>{
    let sampleListing = new Listing({
        title : "Villa 101",
        description : "at city",
        price : 1500,
        location : "hyderabad",
        country : "india",
    });

    await sampleListing.save();
    console.log("saved");
    res.send("testing  done");
    
});


app.get("/",(req,res)=>{
    res.send("iam root");
})

app.listen(8080,()=>{
    console.log("listening on 8080");
})