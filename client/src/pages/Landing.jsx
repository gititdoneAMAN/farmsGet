import Langing from "../assets/landing.jpg";
import Cta from "./Cta";
const Landing = () => {
  return (
    <div className="w-full min-h-screen  mx-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col justify-center bg-white rounded-3xl p-2">
          <h1 className="text-3xl font-bold">
            Welcome to FarmGet: Your Local Farmers' Marketplace
          </h1>
          <p className="text-gray-500">
            At FarmGet, we believe in the power of community and the joy of
            fresh, locally-sourced produce. Our online marketplace connects you
            with the best farmers and artisans in your area, bringing the
            farm-to-table experience right to your doorstep.
          </p>
        </div>
        <div>
          <img
            src={Langing}
            alt="pic"
            className="w-[600px] h-[500px] rounded-3xl"
          />
        </div>
      </div>
      <Cta />
    </div>
  );
};

export default Landing;
