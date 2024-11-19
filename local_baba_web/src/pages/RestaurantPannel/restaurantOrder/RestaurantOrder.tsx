import React from "react";
import { Navbar, OrderTable } from "../../../components";
import { toast, ToastContainer } from "react-toastify";

function RestaurantOrder() {
  const tableHead = [
    "Order ID",
    "Customer name",
    "Order Item",
    "Order Placed Date / Time",
    "Location",
    "Total Bill",
    "Status",
    "",
  ];

  return (
    <div className="w-full">
      <ToastContainer position="bottom-left" />
      <Navbar
        title="Restaurant List"
        subTitle="Registered restaurants on local baba"
      />
      <OrderTable type={"order"} tableHead={tableHead} />
    </div>
  );
}

export default RestaurantOrder;
