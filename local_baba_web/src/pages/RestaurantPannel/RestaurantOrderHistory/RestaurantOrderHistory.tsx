import React, { useEffect, useState } from "react";
import { Navbar, OrderTable } from "../../../components";
import { toast, ToastContainer } from "react-toastify";

export default function RestaurantOrderHistory() {
  const [showPopup, setShowPopup] = useState(false);

  const tableHead = [
    "Order ID",
    "Customer name",
    "Restaurant Name",
    "Order Placed Date / Time",
    "Location",
    "Total Bill",
  ];

  const handleShow = () => setShowPopup(true);
  const handleClose = () => setShowPopup(false);
  return (
    <div className="w-full">
      <ToastContainer position="bottom-left" />
      <Navbar
        title="Restaurant List"
        subTitle="Registered restaurants on local baba"
      />
      <OrderTable
        type={"history"}
        tableHead={tableHead}
      />
    </div>
  );
}
