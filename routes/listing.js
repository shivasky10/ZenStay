const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");




const validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errmsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}



//index route
router.get("/",async(req,res)=>{
   let allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
})

//newroute
router.get("/new", async(req,res)=>{
    res.render("listings/new.ejs");
})

//create route
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
    
    }));



//show route
router.get("/:id", async (req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","listing doesnot exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
});

//edit route
router.get("/:id/edit",async (req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//update route
router.put("/:id",validateListing, wrapAsync(async (req,res)=>{
    let { id }=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(!listing){
        req.flash("error","listing doesnot exist");
        return res.redirect("/listings");
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}));


router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (listing && listing.reviews.length > 0) {
        console.log("Manually deleting reviews:", listing.reviews);
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success"," listing deleted");
    res.redirect("/listings");
}));

module.exports=router;