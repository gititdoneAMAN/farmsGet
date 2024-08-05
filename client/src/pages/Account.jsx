import React, { useContext } from "react";
import { userContext } from "../UserContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Places from "./Places";
import Bookings from "./Bookings";

const Account = () => {
  const navigate = useNavigate();

  let { subPage } = useParams();
  console.log(subPage);
  if (subPage === undefined) {
    subPage = "Profile";
  }

  const { loggedIn, setLoggedIn, isReady } = useContext(userContext);

  async function logout() {
    localStorage.removeItem("token");
    setLoggedIn(null);
    navigate("/login");
  }

  if (!isReady) {
    return <div>Loading......</div>;
  }
  if (isReady && !loggedIn) {
    return <div>Please log in to view your account</div>;
  }

  function handleStyle(type = null) {
    let style = "rounded-3xl px-4 py-2 shadow-md flex gap-2";

    if (type === subPage) {
      style += " bg-red-500 text-white";
    } else {
      style += " bg-white";
    }
    return style;
  }

  return (
    <div>
      <nav className="mt-[3rem]">
        <div className="flex justify-center w-full gap-[4rem]">
          <Link to={"/account"} className={handleStyle("Profile")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            My Profile
          </Link>
          <Link to={"/account/bookings"} className={handleStyle("bookings")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            My Bookings
          </Link>
          <Link to={"/account/places"} className={handleStyle("places")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
            My Products
          </Link>
        </div>
      </nav>
      {subPage === "Profile" ? (
        <div className="flex flex-col items-center justify-center mt-8 gap-3">
          <span className="text-xl">{`Hello!, ${loggedIn.fullname}`}</span>
          <button
            onClick={logout}
            className="rounded-3xl bg-red-500 text-white w-full max-w-[400px] pt-1 pb-2 "
          >
            Logout
          </button>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.93987826577!2d77.5702690735891!3d12.97569721479144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16056f420465%3A0xa95f996d1d0f8d92!2sNadaprabhu%20Kempegowda%20Metro%20Station%2C%20Majestic!5e0!3m2!1sen!2sin!4v1720769589636!5m2!1sen!2sin"
              width="800"
              height="450"
              className="border:0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="bg-white h-[400px] w-[800px] mt-4 rounded-3xl grid grid-cols-2 grid-rows-2">
            <div className="flex flex-col justify-center items-center border-r border-b">
              <p>Products Listed: 5</p>
            </div>
            <div className="flex flex-col justify-center items-center border-l border-b">
              <p>Products Ordered: 0</p>
            </div>
            <div className="flex flex-col justify-center items-center border-t border-r">
              <p>Total Earnings: 0</p>
            </div>
            <div className="flex flex-col justify-center items-center border-t border-l">
              <p>Total Orders: 0</p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {subPage === "places" ? <Places /> : <></>}
      {subPage === "bookings" ? <Bookings /> : <></>}
    </div>
  );
};

export default Account;
