import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { CustomTable, Navbar, RiderPopup } from "../../../components";
import { add_rider, SignUp } from "../../../services";

interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}
function Riders() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const tableHead = [
    "Rider ID",
    "Rider Name",
    "Phone No",
    "Email",
    "Address",
    "Total Deliveries",
  ];
  const handleShow = () => setShowPopup(true);
  const handleClose = () => setShowPopup(false);

  const addRider = async () => {
    try {
      let data = {
        Name: formData.name,
        Email: formData.email,
        Password: formData.password,
        Phone: formData.phoneNumber,
      };
      const res = await add_rider(data);
      console.log(res.data);
      if (res.status === "success") {
        toast(res.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
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
      <Navbar title="Rider List" subTitle="Registered riders on local baba" />
      <CustomTable
        type="rider"
        tableHead={tableHead}
        isPopup
        onPopUp={handleShow}
      />
      <RiderPopup
        onSubmit={addRider}
        setFormData={setFormData}
        formData={formData}
        show={showPopup}
        handleClose={handleClose}
      />
    </div>
  );
}

export default Riders;
