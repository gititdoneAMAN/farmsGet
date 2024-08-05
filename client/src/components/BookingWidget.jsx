import { differenceInCalendarDays } from "date-fns/differenceInCalendarDays";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../UserContext";
import axios from "axios";

const BookingWidget = ({ listedPlaceData }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [nameData, setNameData] = useState("");
  const [emailData, setEmailData] = useState("");
  const [phoneData, setPhoneData] = useState("");
  const [orderAmount, setOrderAmount] = useState(0);
  const navigate = useNavigate();

  const { loggedIn } = useContext(userContext);

  const caluclatePrice = React.useCallback(() => {
    setTotalPrice(orderAmount * listedPlaceData.price);
  }, [orderAmount, listedPlaceData]);

  useEffect(() => {
    caluclatePrice();
  }, [orderAmount, listedPlaceData]);

  async function handleSubmit() {
    if (!loggedIn) {
      alert("Please login to continue");
      navigate("/login");
    } else {
      caluclatePrice();
      const response = await axios.post(
        `/bookingDetails/` + listedPlaceData._id,
        {
          userName: nameData,
          email: emailData,
          phone: phoneData,
          price: totalPrice,
          orderAmount: orderAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      alert(`Order Placed`);
      navigate("/account/bookings");
    }
  }

  return (
    <div className="p-3 bg-white w-full  rounded-2xl">
      <h2 className="text-center text-2xl font-semibold">{`₹ ${listedPlaceData.price}/per kg`}</h2>

      <div className="flex flex-col">
        <label className="flex flex-col gap-1 ">
          Quantity
          <input
            type="number"
            className="p-3 bg-gray-200 rounded-3xl w-full"
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
            placeholder="2"
            required
            min={0}
            max={10}
          />
        </label>

        <div>
          <label className="flex flex-col gap-1 w-full">
            Name
            <input
              type="text"
              value={nameData}
              onChange={(e) => setNameData(e.target.value)}
              className="p-3 bg-gray-200 rounded-3xl w-full"
              required
              placeholder="John Doe"
            />
          </label>
          <label className="flex flex-col gap-1 w-full">
            Email
            <input
              type="text"
              value={emailData}
              onChange={(e) => setEmailData(e.target.value)}
              className="p-3 bg-gray-200 rounded-3xl w-full"
              required
              placeholder="john@example.com"
            />
          </label>
          <label className="flex flex-col gap-1 w-full">
            Mobile
            <input
              type="text"
              value={phoneData}
              onChange={(e) => setPhoneData(e.target.value)}
              className="p-3 bg-gray-200 rounded-3xl w-full"
              required
              placeholder="0123456789"
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-red-500 text-white mt-4 w-full p-3 rounded-3xl"
      >
        Book now
      </button>
    </div>
  );
};

export default BookingWidget;
