import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const DownloadAppSection: React.FC = () => {
  const qrCodeUrl = "https://www.example.com/download-app";

  return (
    <div
      className="d-flex flex-column flex-lg-row align-items-center justify-content-between rounded p-5 mt-5"
      style={{
        position: "relative",
        backgroundColor: "#F1F4FF",
        width: "80%",
      }}
    >
      <div className="text-start mb-4 mb-lg-0">
        <h6 className="text-uppercase mb-3" style={{ color: "#5667AB" }}>
          Download App
        </h6>
        <h2 className="fw-bold mb-4">Get Started With Local Baba Today!</h2>
        <p className="text-muted">
          Discover food wherever and whenever and get your food delivered
          quickly.
        </p>
      </div>

      <div className="position-relative text-center">
        <QRCodeCanvas value={qrCodeUrl} style={{ maxWidth: "250px" }} />
        <p className="mt-3 text-muted">Scan the QR code to download the app</p>

        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "10px",
            width: "30px",
            height: "30px",
            backgroundColor: "#ffcc00",
            borderRadius: "50%",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            left: "10px",
            width: "15px",
            height: "15px",
            backgroundColor: "#ff4444",
            borderRadius: "50%",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "-20px",
            width: "20px",
            height: "20px",
            backgroundColor: "#0066ff",
            borderRadius: "50%",
          }}
        ></div>
      </div>
    </div>
  );
};

export default DownloadAppSection;
