

const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");

const ListingSchema = new schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image: {
      url:String,
      filename:String,
  },
    price : Number,
    location : String,
    country : String,
    reviews:[{
        type:schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
      type:schema.Types.ObjectId,
      ref:"User",
    }
});

// ListingSchema.post("findOneAndDelete", async (listing) => {
//     if (listing) {
//         console.log("DELETING REVIEWS FOR LISTING:", listing._id);
//         console.log("Reviews to delete:", listing.reviews);
//         await Review.deleteMany({ _id: { $in: listing.reviews } });
//     }
// });

ListingSchema.pre("findOneAndDelete", async function (next) {
    const listing = await this.model.findOne(this.getQuery());
    if (listing) {
        console.log("Deleting reviews:", listing.reviews);
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    } else {
        console.log("No listing found for deletion.");
    }
    next();
});


const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;