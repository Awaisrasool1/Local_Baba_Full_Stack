import axios from "axios";
import { API } from "../api/api";

async function add_restaurant(data: any) {
  const res = await API.post("/admin/Restaurants/Add-Restaurant", data);
  return res.data;
}

async function add_rider(data: any) {
  const res = await API.post("/admin/Riders/add-rider", data);
  return res.data;
}

async function createProduct(data: any) {
  const res = await API.post("/restaurant/Product/add-product", data);
  return res.data;
}

async function uploadImage(formData: any) {
  const response = await axios.post("http://192.168.100.93:8080/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export { add_restaurant, add_rider, createProduct, uploadImage };
