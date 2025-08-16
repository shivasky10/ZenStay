const mongoose = require("mongoose");
const initData = require("./data.js");

const mongourl="mongodb://127.0.0.1:27017/zenstay";

const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect(mongourl);
}

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log("error");
})

const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"689f189c8b58ed538ea3d6dd"}))
    await Listing.insertMany(initData.data);
    console.log("data saveddd");
}

initDb();