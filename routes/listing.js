const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIN, isOwner,validateListing } = require("../midddleware.js");

const listingControllers = require("../controllers/listings.js");


//index and create post route
router.route("/")
.get(wrapAsync(listingControllers.index))
.post(isLoggedIN,validateListing,wrapAsync(listingControllers.createListing));


//newform route
router.get("/new", isLoggedIN, listingControllers.renderNewForm);

//show , updating ,destroy listing
router.route("/:id")
.get(listingControllers.showListing )
.put(isLoggedIN,isOwner,validateListing, wrapAsync(listingControllers.updateListing))
.delete(isLoggedIN,isOwner,wrapAsync(listingControllers.destroyListing));

//editing the listing  route
router.get("/:id/edit",isLoggedIN,isOwner,listingControllers.renderEditForm);


module.exports=router;