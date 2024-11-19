import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface OrderItem {
  name: string;
  quantity: number;
  total: number;
  price: number;
}

interface OrderDetailsProps {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  placedTime?: string;
  items?: OrderItem[];
  totalBill?: number;
  onAccept?: () => void;
  onDecline?: () => void;
}

const OrderDetailsPopup: React.FC<OrderDetailsProps> = ({
  customerName,
  customerEmail,
  customerPhone,
  address,
  placedTime,
  items,
  totalBill,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Details</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onDecline}
            ></button>
          </div>
          <div className="modal-body">
            {/* Responsive Customer Details */}
            <div className="container mb-3">
              <div className="row mb-md-3">
                <div className="col-12 col-md-4 mb-2">
                  <strong>Customer Name</strong>
                  <p>{customerName}</p>
                </div>
                <div className="col-12 col-md-4 mb-2">
                  <strong>Customer E-mail</strong>
                  <p>{customerEmail}</p>
                </div>
                <div className="col-12 col-md-3 mb-2">
                  <strong>Customer Phone no</strong>
                  <p>{customerPhone}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-7 mb-2">
                  <strong>Order placed Time</strong>
                  <p>{address}</p>
                </div>
                <div className="col-12 col-md-5 mb-2">
                  <strong>Address</strong>
                  <p>{placedTime}</p>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <table className="table">
              <thead>
                <tr>
                  <th>Items</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                      <td>₹ {item.total}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Payment Method and Total */}
            <div className="d-flex justify-content-between align-items-center">
              <p>
                <strong>Payment Method:</strong> {"Cash on Delivery"}
              </p>
              <h5>Total Bill: ₹ {totalBill}</h5>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" onClick={onDecline}>
              Decline
            </button>
            <button className="btn btn-success" onClick={onAccept}>
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPopup;
