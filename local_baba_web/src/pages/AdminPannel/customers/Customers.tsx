import React from "react";
import { CustomTable, Navbar } from "../../../components";

function Customers() {
  const tableHead = [
    "ID",
    "Customer name",
    "Phone No",
    "Email",
    "Address",
    "No Of Orders",
  ];
  return (
    <div className="w-full">
      <Navbar
        title="Customers List"
        subTitle="Registered customers on local baba"
      />
      <CustomTable type={"customer"} tableHead={tableHead} />
    </div>
  );
}

export default Customers;
