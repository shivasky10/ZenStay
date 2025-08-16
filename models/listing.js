// const mongoose = require("mongoose");
// const schema = mongoose.Schema;
// const Review =require("./review.js")

// const ListingSchema = new schema({
//     title : {
//         type :String,
//         required : true,
//     },
//     description : String,
// //     image: {
// //     filename: String,
// //     url: {
// //       type: String,
// // }},
// //   image: {
// //   type: String,
// //   default:
// //     "https://unsplash.com/photos/a-narrow-alleyway-in-a-japanese-city-at-night-YgOho40k3kc",
// //   set: (v) =>
// //     v === ""
// //       ? "https://unsplash.com/photos/a-narrow-alleyway-in-a-japanese-city-at-night-YgOho40k3kc"
// //       : v,
// // },
//     //  image: {
//     //  type: String,
//     //   default: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
//     //   set: v => v === "" 
//     //   ? "https://images.unsplash.com/photo-1542291026-7eec264c27ff" 
//     //   : v
//     // },
//     image: {
//     type: String,
//     default: DEFAULT_IMAGE,
//     set: v => {
//       // If it's not a non-empty string, return default.
//       if (typeof v !== "string" || v.trim() === "") {
//         return DEFAULT_IMAGE;
//       }
//       return v;
//     }
//   },


//     price : Number,
//     location : String,
//     country : String,
//     reviews:[{
//       type:schema.Types.ObjectId,
//       ref:"Review"
//     }]
// });

// // ListingSchema.post("findOneAndDelete",async(listing)=>{
// //   if(listing){
// //     await Review.deleteMany({ _id: { $in: listing.reviews }});
// //   }
// // });
// ListingSchema.post("findOneAndDelete", async (listing) => {
//   if (listing) {
//     console.log("DELETING REVIEWS FOR LISTING:", listing._id);
//     console.log("Reviews to delete:", listing.reviews); 
//     await Review.deleteMany({ _id: { $in: listing.reviews } });
//   }
// });


// const Listing = mongoose.model("Listing",ListingSchema);
// module.exports = Listing;

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
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60",
      set: (v) =>
        v.trim() === ""
          ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60"
          : v,
    },
    filename: {
      type: String,
      default: ""
    }
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