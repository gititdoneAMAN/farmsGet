import axios from "axios";

import { useEffect, useState } from "react";

const Distributer = () => {
  const [distributionData, setDistributionData] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:3000/distributionData", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setDistributionData(response.data.distributionData);
      });
  }, []);

  return (
    <div className="min-h-screen w-full">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Welcome</h1>
        <p className="text-gray-500">Distributer Dashboard</p>
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
    </div>
  );
};

export default Distributer;
