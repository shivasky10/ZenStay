const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIN, isOwner,validateListing } = require("../midddleware.js");

const listingControllers = require("../controllers/listings.js");


//index route
router.get("/",wrapAsync(listingControllers.index));

//newform route
router.get("/new", isLoggedIN, listingControllers.renderNewForm);

//creating  route
router.post("/",isLoggedIN,validateListing,wrapAsync(listingControllers.createListing));

//show route
router.get("/:id", listingControllers.showListing );

//editing the listing  route
router.get("/:id/edit",isLoggedIN,isOwner,listingControllers.renderEditForm);

//updating the listing  route
router.put("/:id",isLoggedIN,isOwner,validateListing, wrapAsync(listingControllers.updateListing));

//destroy listing
router.delete("/:id", isLoggedIN,isOwner,wrapAsync(listingControllers.destroyListing));

module.exports=router;