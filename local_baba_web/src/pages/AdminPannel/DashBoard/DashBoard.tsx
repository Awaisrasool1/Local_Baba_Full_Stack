import React from "react";
import { CountCard, Navbar } from "../../../components";

const DashBoard: React.FC = () => {
  return (
    <div className="w-full">
      <Navbar title="Dashboard" subTitle="Hi, John Doe. Welcome back !" />
      <CountCard />
    </div>
  );
};

export default DashBoard;
