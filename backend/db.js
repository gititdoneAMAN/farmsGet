require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

const distributionSchema = new mongoose.Schema({
  transitToken: String,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "Consumer",
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  bookingDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  distributionData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distribution",
    },
  ],
});

const placeSchema = new mongoose.Schema({
  title: String,
  address: String,
  addedPhotos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: String,
  checkout: String,
  maxGuests: Number,
  price: Number,
  quantity: Number,
  bookingDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const bookingSchema = mongoose.Schema({
  userName: String,
  email: String,
  phone: String,
  price: Number,
  orderAmount: Number,
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
  },
  bookingDetails: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);
const Place = mongoose.model("Place", placeSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Distribution = mongoose.model("Distribution", distributionSchema);

module.exports = {
  User,
  Place,
  Booking,
  Distribution,
};
