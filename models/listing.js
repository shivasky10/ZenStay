const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ListingSchema = new schema({
    title : {
        type :String,
        required : true,
    },
    description : String,
    image: {
    filename: String,
    url: String
  },
  //  image: {
  //   type: String,
  //   default:
  //     "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  //   set: (v) =>
  //     v === ""
  //       ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  //       : v,
  // },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;