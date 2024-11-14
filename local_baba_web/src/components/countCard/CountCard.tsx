import React from "react";
import { FileText, Building, History, Bike } from "lucide-react";

function CountCard() {
  const cards = [
    {
      icon: <FileText size={40} color="#00AEEF" />,
      count: 75,
      label: "Total Orders",
      percentage: "4% (30 days)",
      isPositive: true,
    },
    {
      icon: <Building size={40} color="#00AEEF" />,
      count: 357,
      label: "Total Restaurants",
      percentage: "4% (30 days)",
      isPositive: true,
    },
    {
      icon: <History size={40} color="#00AEEF" />,
      count: 65,
      label: "Order History",
      percentage: "25% (30 days)",
      isPositive: false,
    },
    {
      icon: <Bike size={40} color="#00AEEF" />,
      count: 160,
      label: "No of Riders",
      percentage: "12% (30 days)",
      isPositive: false,
    },
  ];
  

  return (
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between flex-wrap">
        {cards.map((card, index) => (
          <div
            key={index}
            className="card p-3 m-3 d-flex flex-row justify-content-between"
            style={{
              width: "250px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <div
              className="icon-circle"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#E0F7FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </div>
            <div className="d-flex flex-column me-3">
              <h2 className="mb-0">{card.count}</h2>
              <p className="text-muted mb-0">{card.label}</p>
              <p
                style={{
                  color: card.isPositive ? "green" : "red",
                  fontSize: "0.9em",
                }}
              >
                {card.isPositive ? "↑" : "↓"} {card.percentage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountCard;
