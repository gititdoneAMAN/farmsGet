const zod = require("zod");

const loginSchema = zod.object({
  username: zod.string({ msg: "username is required" }).min(1),
  password: zod.string({ msg: "password is required" }).min(6),
});

const registerSchema = zod.object({
  username: zod.string({ msg: "username is required" }).min(1),
  password: zod.string({ msg: "password is required" }).min(6),
  fullname: zod.string({ msg: "fullname is required" }).min(1),
  role: zod.string(),
  location: zod.object({
    lat: zod.number(),
    long: zod.number(),
  }),
});

const placesSchema = zod.object({
  title: zod.string(),
  address: zod.string(),
  addedPhotos: zod.array(zod.string()),
  description: zod.string(),
  perks: zod.array(zod.string()),
  extraInfo: zod.string(),
  checkIn: zod.number(),
  checkout: zod.number(),
  maxGuests: zod.number(),
  price: zod.number(),
  quantity: zod.number(),
});

const bookingSchema = zod.object({
  userName: zod.string(),
  email: zod.string().email(),
  phone: zod.string(),
  price: zod.number(),
  orderAmount: zod.number(),
});

module.exports = {
  loginSchema,
  registerSchema,
  placesSchema,
  bookingSchema,
};
