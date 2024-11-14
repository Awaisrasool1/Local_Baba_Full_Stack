import React, { useEffect, useState } from "react";
import { CustomTable, Navbar, PopupForm } from "../../../components";
import { add_restaurant, get_restaurant } from "../../../services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: string;
  openingTime: string;
  closingTime: string;
}
function Restaurants() {
  const [showPopup, setShowPopup] = useState(false);
  const [latLong, setLatLong] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    userType: "",
    openingTime: "",
    closingTime: "",
  });

  const handleShow = () => setShowPopup(true);
  const handleClose = () => setShowPopup(false);

  const tableHead = [
    "Restaurant ID",
    "Restaurant Name",
    "Restaurant Address",
    "Cuisine Type",
    "Operating Hours",
    "Total Orders (Today)",
  ];

  const addRestaurant = async () => {
    try {
      const data = {
        Email: formData.email,
        Password: formData.password,
        Phone: formData.phoneNumber,
        Name: formData.name,
        Image: "asdasd",
        ServiesTypeId: "1",
        Location: `${String(latLong[0])},${String(latLong[1])}`,
        OpeningTime: formData.openingTime,
        ClosingTime: formData.closingTime,
        address: String(latLong[2]),
      };
      const res = await add_restaurant(data);

      if (res.status === "success") {
        toast(res.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          userType: "",
          openingTime: "",
          closingTime: "",
        });
        handleClose();
      } else {
        toast(res.message || "Failed to add restaurant.");
      }
    } catch (err: any) {
      console.error(err.response.data.message);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="w-full">
      <ToastContainer position="bottom-left" />
      <Navbar
        title="Restaurant List"
        subTitle="Registered restaurants on local baba"
      />
      <CustomTable
        type={"restaurant"}
        tableHead={tableHead}
        isPopup
        onPopUp={handleShow}
      />
      <PopupForm
        onSubmit={addRestaurant}
        setFormData={setFormData}
        formData={formData}
        show={showPopup}
        handleClose={handleClose}
        setLatLong={setLatLong}
        latLong={latLong}
      />
    </div>
  );
}

export default Restaurants;
