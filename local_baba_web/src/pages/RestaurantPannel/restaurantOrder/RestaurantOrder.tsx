import React, { useEffect, useState } from "react";
import { Navbar, OrderTable } from "../../../components";
import { toast, ToastContainer } from "react-toastify";

function RestaurantOrder() {
  const [showPopup, setShowPopup] = useState(false);

  const tableHead = [
    "Order ID",
    "Customer name",
    "Order Item",
    "Order Placed Date / Time",
    "Location",
    "Total Bill",
    "Status",
    ''
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
        type={"order"}
        tableHead={tableHead}
        isPopup
        onPopUp={handleShow}
      />
    </div>
  );
}

export default RestaurantOrder;
