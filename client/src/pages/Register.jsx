import React, { useState } from "react";
import Login from "./Login";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    await axios
      .post("/register", {
        username,
        password,
        fullname,
        role,
        location,
      })
      .then((response) => {
        console.log(response);
        alert("User Registered");
        navigate("/login");
      });
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState({
    lat: 0,
    long: 0,
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
  }

  return (
    <div className="flex min-h-screen w-full items-centers justify-around overflow-hidden">
      <div className="flex my-[5%] items-center justify-around rounded-3xl  h-[55%] w-[40%] bg-white">
        <div className="h-full w-full py-5 px-8 justify-center items-center">
          <h1 className="text-3xl font-bold mb-5 text-center">Register</h1>

          <form>
            <div>
              <input
                className="w-full bg-[#f3f4f6] rounded-3xl h-[45px] text-xl px-4 pb-2 pt-1 my-[5px]"
                type="text"
                id="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                className="w-full bg-[#f3f4f6] rounded-3xl h-[45px] text-xl px-4 pb-2 pt-1 my-[5px]"
                type="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                className="w-full bg-[#f3f4f6] rounded-3xl h-[45px] text-xl px-4 pb-2 pt-1 my-[5px]"
                type="text"
                id="fullname"
                placeholder="Fullname"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="flex gap-3 justify-between">
              <span>Select a Role:</span>
              <label className="flex gap-1">
                <input
                  type="radio"
                  name="role"
                  value={"Farmer"}
                  onChange={() => {
                    setRole("Farmer");
                  }}
                />
                <span>Farmer</span>
              </label>
              <label className="flex gap-1">
                <input
                  type="radio"
                  name="role"
                  value={"Consumer"}
                  onChange={() => {
                    setRole("Consumer");
                  }}
                />
                <span>Consumer</span>
              </label>
              <label className="flex gap-1">
                <input
                  type="radio"
                  name="role"
                  value={"Distributer"}
                  onChange={() => {
                    setRole("Distributer");
                  }}
                />
                <span>Distributer</span>
              </label>
            </div>
            <div>
              <input
                className="w-full bg-[#f3f4f6] rounded-3xl h-[45px] text-xl px-4 pb-2 pt-1 my-[5px]"
                type="text"
                id="username"
                placeholder="Link for Location"
                value={location.lat + "," + location.long}
                readOnly
              />
            </div>
            <button
              type="submit"
              className="bg-[#f5385d] w-full rounded-3xl h-[45px] text-xl px-4 pb-2 pt-1 my-[10px]  font-semibold text-white"
              onClick={handleSubmit}
            >
              Register
            </button>
          </form>

          <div className="text-center my-1 pb-2">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
