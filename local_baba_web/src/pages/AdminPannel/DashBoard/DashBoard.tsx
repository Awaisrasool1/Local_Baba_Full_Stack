import React, { useEffect, useState } from "react";
import { CountCard, Navbar } from "../../../components";
import { get_admin_dashboard } from "../../../services";
import { FileText, Building, Bike, User } from "lucide-react";

const DashBoard: React.FC = () => {
  const [cards, setCards] = useState([
    {
      icon: <FileText size={40} color="#00AEEF" />,
      count: 75,
      label: "Total Orders",
      isPositive: true,
    },
    {
      icon: <Building size={40} color="#00AEEF" />,
      count: 357,
      label: "Total Restaurants",
      isPositive: true,
    },
    {
      icon: <Bike size={40} color="#00AEEF" />,
      count: 160,
      label: "No of Riders",
      isPositive: false,
    },
    {
      icon: <User size={40} color="#00AEEF" />,
      count: 65,
      label: "No of Users",
      isPositive: false,
    },
  ]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await get_admin_dashboard();

      setCards((prevCards) =>
        prevCards.map((card) => {
          if (card.label === "Total Orders") {
            return { ...card, count: res.data.orderCound };
          } else if (card.label === "Total Restaurants") {
            return { ...card, count: res.data.restaurantCount };
          } else if (card.label === "No of Riders") {
            return { ...card, count: res.data.riderCount };
          } else if (card.label === "No of Users") {
            return { ...card, count: res.data.userCount };
          }
          return card;
        })
      );
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };
  return (
    <div className="w-full">
      <Navbar title="Dashboard" subTitle="Hi, John Doe. Welcome back !" />
      <CountCard data={cards} />
    </div>
  );
};

export default DashBoard;
