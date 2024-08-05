const express = require("express");
const {
  loginSchema,
  registerSchema,
  placesSchema,
  bookingSchema,
} = require("./types");
const cors = require("cors");
const { User, Place, Booking, Distribution } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const download = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

const { verifyToken } = require("./middleware");
const { exit, exitCode } = require("process");
const { default: mongoose } = require("mongoose");

const app = express();
require("dotenv").config();

app.use("/uploads", express.static(__dirname + `\\uploads`));
app.use(express.json());
app.use(cors());

console.log(process.env.name);
// console.log(process.env);

app.post("/login", async (req, res) => {
  const payload = req.body;
  const parsedPayload = loginSchema.safeParse(payload);

  const { username, password } = parsedPayload.data;

  console.log(parsedPayload);

  if (parsedPayload.success) {
    const user = await User.findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        jwt.sign(
          { username, id: user._id },
          process.env.JWT_SECRET,
          (err, token) => {
            if (err) throw err;
            res.json({ msg: "login success", token, user: user });
          }
        );
      } else {
        console.log("Password is wrong ");
        res.status(401).json({ msg: "login failed" });
      }
    }
  } else {
    res.json({ msg: "login failed" });
  }
});

app.post("/register", async (req, res) => {
  const payload = req.body;
  const parsedPayload = registerSchema.safeParse(payload);

  console.log(parsedPayload);
  if (parsedPayload.success) {
    const { username, password, fullname } = parsedPayload.data;

    const hashedPassword = await bcrypt.hash(password, 10);
    parsedPayload.data.password = hashedPassword;

    const user = await User.create(parsedPayload.data);
    res.json({ msg: "register success" });
  } else {
    res.json({ msg: "register failed" });
  }
});

app.post("/profile", async (req, res) => {
  const { token } = req.body;
  try {
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(username);
    const user = await User.findOne({ username });
    console.log(user);
    res.json({ user: user });
  } catch (err) {
    res.json({ msg: "Error in the profile route" });
  }
});

app.post("/uploadImage", (req, res) => {
  try {
    const { link } = req.body;

    console.log(link);
    console.log(__dirname);

    const newLink = "photo" + Date.now() + ".jpg";
    console.log(newLink);
    download
      .image({
        url: link,
        dest: __dirname + `\\uploads\\` + newLink,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })
      .then(() => {
        res.json({
          msg: "image uploaded",
          filename: newLink,
        });
      });
  } catch (err) {
    console.log("Error in the upload image route", err);
    res.json({ msg: "Error in the upload image route" });
  }
});

const photoMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photoMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const data = originalname.split(".");
    const ext = data[data.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places/:id?", verifyToken, async (req, res) => {
  console.log("----------------------------" + req.params.id);
  if (!req.params.id) {
    const payload = req.body;
    const parsedPayload = placesSchema.safeParse(payload);

    if (parsedPayload.success) {
      const {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkout,
        maxGuests,
        price,
        quantity,
      } = parsedPayload.data;

      const newPlace = {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkout,
        maxGuests,
        owner: req.id,
        price,
        quantity,
      };
      const data = await Place.create(newPlace);
      console.log("------------------------------");
      console.log(data);
      res.json({ msg: "places added" });
    } else {
      res.json({ msg: "places not added" });
    }
  } else {
    const placeData = await Place.findOne({ _id: req.params.id });
    console.log(placeData);
    res.json({ placeData: placeData });
  }
});

app.put("/places/:id", verifyToken, async (req, res) => {
  const payload = req.body;
  const parsedPayload = placesSchema.safeParse(payload);

  if (parsedPayload.success) {
    await Place.updateOne({ _id: req.params.id }, parsedPayload.data);
    res.json({ msg: "places updated" });
  } else {
    res.json({ msg: "places not updated" });
  }
});

app.get("/userPlacesData", verifyToken, async (req, res) => {
  console.log(req.id);
  const data = await Place.find({ owner: req.id });
  res.json({ userData: data });
});

app.get("/data", async (req, res) => {
  const placesData = await Place.find();
  res.json({ placesData });
});

app.get("/listedPlace/:id", async (req, res) => {
  const response = await Place.findOne({ _id: req.params.id });
  console.log(response);
  res.json({ listedPlace: response });
});

app.post("/bookings/:id", verifyToken, async (req, res) => {
  const response = await Place.findOne({ _id: req.params.id });

  if (!response) {
    res.json({ msg: "Invalid Booking for places" });
  } else {
    const payload = req.body;

    console.log(payload);

    // const parsedPayload = bookingSchema.safeParse(payload);

    // console.log("111111111111111111111111111111");
    // console.log(parsedPayload);

    if (payload) {
      const {
        checkIn,
        checkOut,
        numGuests,
        userName,
        email,
        phone,
        price,
        quantity,
      } = payload;

      console.log("---------------", new Date(checkIn));

      // const placeBookingData = await Place.findOne({ _id: req.params.id });

      const bookingDetailsArray = response.bookingDetails.length;

      if (!bookingDetailsArray) {
        const bookingData = await Booking.create({
          place: req.params.id,
          checkIn,
          checkOut,
          numGuests,
          userName,
          email,
          phone,
          price,
          quantity,
          rentedDetails: [
            {
              renterId: req.id,
              entryDate: checkIn,
              exitDate: checkOut,
            },
          ],
        });

        await Place.updateOne(
          { _id: req.params.id },
          {
            $push: {
              bookingDetails: bookingData._id,
            },
          }
        );

        await User.updateOne(
          { _id: req.id },
          {
            $push: {
              bookingDetails: bookingData._id,
            },
          }
        );

        res.json({ msg: "booking success" });
      } else {
        const bookingId = response.bookingDetails[bookingDetailsArray - 1];

        const data = await Booking.findOne({ _id: bookingId });

        console.log("priniting the data", data);

        if (data) {
          const dataLength = data.rentedDetails.length;
          checkOutDate =
            data.rentedDetails.length > 0
              ? data.rentedDetails[dataLength - 1].exitDate
              : null;

          console.log("checkOutDate", checkOutDate);
          console.log("checkOutDateee", new Date(checkOutDate));

          if (new Date(checkIn) <= new Date(checkOutDate)) {
            res.json({ msg: "Already booked" });
          } else {
            const bookingData = await Booking.create({
              place: req.params.id,
              checkIn,
              checkOut,
              numGuests,
              userName,
              email,
              phone,
              price,
              quantity,
              rentedDetails: [
                {
                  renterId: req.id,
                  entryDate: checkIn,
                  exitDate: checkOut,
                },
              ],
            });

            await Place.updateOne(
              { _id: req.params.id },
              {
                $push: {
                  bookingDetails: bookingData._id,
                },
              }
            );

            await User.updateOne(
              { _id: req.id },
              {
                $push: {
                  bookingDetails: bookingData._id,
                },
              }
            );

            res.json({ msg: "booking success" });
          }
        }
      }
    } else {
      res.json({ msg: "Error occured" });
    }
  }
});

app.get("/bookingDetails", verifyToken, async (req, res) => {
  const userBookingData = await User.findOne({ _id: req.id });

  const bookingDetailsArray = userBookingData.bookingDetails;

  if (bookingDetailsArray.length == 0) {
    res.json({ msg: "No bookings found" });
  } else {
    const responseArray = [];
    for (let i = 0; i < bookingDetailsArray.length; i++) {
      const response = await Booking.findOne({ _id: bookingDetailsArray[i] });
      responseArray.push(response);
    }
    res.json({ bookingDetails: responseArray });
  }
});

app.post("/bookingDetails/:id", verifyToken, async (req, res) => {
  const payload = req.body;
  const parsedPayload = bookingSchema.safeParse(payload);

  const params = req.params.id;

  if (!parsedPayload) {
    res.json({
      msg: "Error in the booking route",
    });
  } else {
    const placeData = await Place.findOne({ _id: params });

    if (!placeData) {
      res.json({
        msg: "Place Cannot be found",
      });
    } else {
      const quantity = placeData.quantity;
      console.log("@@@@@@@@@@@@@", quantity);
      console.log("@@@@@@@@@@@@@", payload.orderAmount);
      if (payload.orderAmount > quantity) {
        res.json({
          msg: "Order amount is too big and not available that much",
        });
      } else {
        const bookingData = await Booking.create({
          userName: payload.userName,
          email: payload.email,
          phone: payload.phone,
          price: payload.price,
          orderAmount: payload.orderAmount,
        });

        await Place.updateOne(
          {
            _id: params,
          },
          {
            $set: {
              quantity: quantity - payload.orderAmount,
            },
          }
        );

        const userData = await User.updateOne(
          {
            _id: req.id,
          },
          {
            $push: {
              bookingDetails: bookingData._id,
            },
          }
        );

        const transitToken = jwt.sign(
          {
            bookingId: bookingData._id,
            username: payload.userName,
            email: payload.email,
            phone: payload.phone,
          },
          process.env.JWT_SECRET
        );

        const tokenData = await Distribution.create({
          transitToken,
        });

        const distributerData = await User.find({
          role: "Distributer",
        });

        await User.updateOne(
          {
            _id: distributerData[0]._id,
          },
          {
            $push: {
              distributionData: tokenData._id,
            },
          }
        );

        res.json({
          msg: "Order placed",
          transitToken,
        });
      }
    }
  }
});

app.get("/distributionData", verifyToken, async (req, res) => {
  const userDistributionData = await User.findOne({ _id: req.id });
  const distributionDataArray = userDistributionData.distributionData;

  if (distributionDataArray.length == 0) {
    res.json({ msg: "No distribution data found" });
  } else {
    const responseArray = [];
    for (let i = 0; i < distributionDataArray.length; i++) {
      const response = await Distribution.findOne({
        _id: distributionDataArray[i],
      });
      const dataInside = jwt.verify(
        response.transitToken,
        process.env.JWT_SECRET
      );
      responseArray.push(dataInside);
    }
    res.json({ msg: "Data sent!", distributionData: responseArray });
  }
});

app.get("/mapData", async (req, res) => {
  const userData = await User.findOne({ _id: req.id });
  res.json({
    data: userData,
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
