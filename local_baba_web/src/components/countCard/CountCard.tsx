import React from "react";
import { FileText, Building, History, Bike } from "lucide-react";

function CountCard({ data = [] }: any) {
  return (
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between flex-wrap">
        {data.map((card: any, index: any) => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountCard;
