const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIN, isOwner,validateListing } = require("../midddleware.js");



//index route
router.get("/",async(req,res)=>{
   let allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
})

//newroute
router.get("/new", isLoggedIN,async(req,res)=>{
    res.render("listings/new.ejs");
})

//create route
router.post("/",isLoggedIN,validateListing,wrapAsync(async (req,res,next)=>{
    const newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
    
    }));



//show route
router.get("/:id", async (req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing doesnot exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
});

//edit route
router.get("/:id/edit",isLoggedIN,isOwner,async (req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//update route
router.put("/:id",isLoggedIN,isOwner,validateListing, wrapAsync(async (req,res)=>{
    let { id }=req.params;
    // let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}));


router.delete("/:id", isLoggedIN,isOwner,wrapAsync(async (req, res) => {
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