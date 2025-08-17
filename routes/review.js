const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIN, isReviewAuthor}=require("../midddleware.js")
const reviewControllers = require("../controllers/reviews.js");





//creating new reviews
router.post("/",isLoggedIN, validateReview,wrapAsync(reviewControllers.createReview));

//destroy review route
router.delete("/:reviewId",isLoggedIN,isReviewAuthor,wrapAsync(reviewControllers.destroyReview));

module.exports=router;