const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ListingSchema = new schema({
    title : {
        type :String,
        required : true,
    },
    description : String,
    image : {
        type : String,
        default : "https://unsplash.com/photos/city-skyline-illuminated-at-dusk-Gb4pnnlVRxk",
        set : (v)=> v==""? "https://unsplash.com/photos/city-skyline-illuminated-at-dusk-Gb4pnnlVRxk":v, 
    },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;