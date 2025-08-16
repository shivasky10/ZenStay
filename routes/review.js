const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIN, isReviewAuthor}=require("../midddleware.js")






router.post("/",isLoggedIN, validateReview,wrapAsync(async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await listing.save();
    await  newReview.save();
    console.log("new review saved")
    req.flash("success","new review created");
    res.redirect(`/listings/${listing.id}`);
}));

//delete review route
router.delete("/:reviewId",isLoggedIN,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}))

module.exports=router;