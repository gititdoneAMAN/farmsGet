import { Link } from "react-router-dom";
import Ctapic from "../assets/cta.jpg";
const Cta = () => {
  return (
    <div className="h-screen w-full ">
      <div className="bg-white rounded-3xl p-2 grid grid-cols-2 gap-2">
        <div>
          <img
            src={Ctapic}
            alt="img"
            className="w-[600px] h-[500px] rounded-3xl"
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <h1 className="text-3xl font-bold">Why Choose FarmGet?</h1>
          <p>
            Locally Sourced Goods: Every product on our platform is sourced from
            local farmers and producers, ensuring that you get the freshest and
            most delicious items while supporting your community. Sustainable
            Practices: Our farmers are committed to sustainable farming
            practices that protect the environment and promote biodiversity. By
            choosing Harvest Haven, you're supporting eco-friendly agriculture.
            Seasonal Produce: Enjoy the best of each season with our rotating
            selection of fruits, vegetables, and other farm-fresh goods. Our
            marketplace ensures that you get produce at its peak ripeness and
            flavor.
          </p>
          <div className="flex gap-2">
            <Link
              to={"/home"}
              className="bg-red-500 text-white rounded-3xl py-2 px-3"
            >
              MarketPlace
            </Link>
            <Link
              to={"/register"}
              className="bg-red-500 text-white rounded-3xl py-2 px-3 "
            >
              Join us!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cta;
