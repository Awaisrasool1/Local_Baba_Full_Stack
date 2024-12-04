import React, { useEffect, useState } from "react";
import { CountCard, Navbar } from "../../../components";
import { get_restaurant_dashboard } from "../../../services";
import { Utensils, ClipboardList, Clipboard, History } from "lucide-react";
function RestaurantDashBoard() {
  const [cards, setCards] = useState([
    {
      icon: <Utensils size={40} color="#00AEEF" />,
      count: 75,
      label: "Total Menu",
      isPositive: true,
    },
    {
      icon: <ClipboardList size={40} color="#00AEEF" />,
      count: 357,
      label: "Running Order",
      isPositive: true,
    },
    {
      icon: <Clipboard size={40} color="#00AEEF" />,
      count: 160,
      label: "Order Requests",
      isPositive: false,
    },
    {
      icon: <History size={40} color="#00AEEF" />,
      count: 65,
      label: "Order History",
      isPositive: false,
    },
  ]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await get_restaurant_dashboard();
      setCards((prevCards) =>
        prevCards.map((card) => {
          if (card.label === "Total Menu") {
            return { ...card, count: res.data.totalProducts };
          } else if (card.label === "Running Order") {
            return { ...card, count: res.data.acceptedOrders };
          } else if (card.label === "Order Requests") {
            return { ...card, count: res.data.pendingOrders };
          } else if (card.label === "Order History") {
            return { ...card, count: res.data.totalOrders };
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
}

export default RestaurantDashBoard;
