const Listing = require("../models/listing");

module.exports.index= async(req,res)=>{
   let allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = async(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing =async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
};

module.exports.showListing = async (req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing doesnot exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.renderEditForm = async (req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing doesnot exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250,h_300,c_fill");

    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let { id }=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (listing && listing.reviews.length > 0) {
        console.log("Manually deleting reviews:", listing.reviews);
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success"," listing deleted");
    res.redirect("/listings");
};