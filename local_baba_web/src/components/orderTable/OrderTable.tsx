import React, { useState, useEffect } from "react";
import {
  get_nonPenging_orders,
  get_penging_orders,
  order_status_change,
} from "../../services";
import { formatDate } from "../../api/api";
import { Button } from "react-bootstrap";
import { OrderPopup } from "../orderPopup";
import { OrderData, Props } from "./type";
import { toast, ToastContainer } from "react-toastify";
const screenWidth = window.innerWidth;

interface TableStyles {
  [key: string]: React.CSSProperties;
}

const createStyleTag = () => {
  const styleTag = document.createElement("style");
  styleTag.textContent = `
        .table-pagination-button {
            padding: 5px 10px;
            margin: 0 2px;
            background-color: white;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .table-pagination-button:hover:not(:disabled) {
            background-color: #f5f5f5;
        }
        
        .table-pagination-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
  return styleTag;
};

const styles: TableStyles = {
  outerContainer: {
    width: "100%",
  },
  foterTableContainer: {
    fontFamily: "Arial, sans-serif",
    margin: "20px auto",
    maxWidth: screenWidth - 350,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "white",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  table: {
    width: "100%",
    minWidth: "500px",
    borderCollapse: "collapse",
    backgroundColor: "white",
    color: "#333",
  },
  thead: {
    backgroundColor: "#DFF0FA",
  },
  th: {
    padding: "12px 15px",
    textAlign: "left",
    fontWeight: "600",
    color: "#333",
    borderBottom: "2px solid #ccc",
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #eee",
    textOverflow: "ellipsis",
    maxWidth: 200,
    overflow: "hidden",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 15px",
    backgroundColor: "white",
    color: "#333",
    borderTop: "1px solid #eee",
    flexWrap: "wrap",
    gap: "10px",
  },
  select: {
    padding: "5px",
    marginLeft: "10px",
    backgroundColor: "white",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  },
  paginationInfo: {
    margin: "0 15px",
  },
  paginationContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
  },
  rowSelectorContainer: {
    display: "flex",
    alignItems: "center",
  },
};

const OrderTable: React.FC<Props> = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [role, setRole] = useState<number>();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const style = createStyleTag();
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const roleStatus: any = localStorage.getItem("role");
    setRole(Number(roleStatus));
    getData();
  }, [currentPage, rowsPerPage]);

  const getData = async () => {
    try {
      if (role == 1) {
      } else {
        if (props.type == "history") {
          console.log(props.type);
          const res = await get_nonPenging_orders(currentPage, rowsPerPage);
          if (res.status == 200) {
            console.log(res.data);
            setTableData(res?.data?.data);
            setTotalItems(res.data?.data?.length || 0);
          }
        } else {
          const res = await get_penging_orders(currentPage, rowsPerPage);
          console.log(res.data)
          if (res.status == 200) {
            console.log(res.data);
            setTableData(res?.data?.data);
            setTotalItems(res.data?.data?.length || 0);
          }
        }
      }
    } catch (err: any) {
      console.log(err.response);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const handleViewDetails = (order: any) => {
    const mappedOrder: OrderData = {
      customerName: order.name,
      customerEmail: order.email,
      customerPhone: order.phone,
      orderId: order.orderId,
      status: order.status,
      address: `${order.city}, ${order.address}`,
      placedTime: formatDate(order.created_at),
      items: order.orderItem.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      totalBill: order.total_amount,
    };
    setSelectedOrder(mappedOrder);
    setShowPopup(true);
  };

  const handleClosePopup = async (status: string) => {
    await chnageStatus(status);
    setSelectedOrder(null);
    setShowPopup(false);
  };

  const chnageStatus = async (status: string) => {
    try {
      let data = {
        id: selectedOrder?.orderId,
        Status: status,
      };
      const res = await order_status_change(data);
      if (res.status == "success") {
        toast(res.message);
        getData();
      }
      console.log(res.status);
    } catch (err) {
      console.log(err);
    }
  };

  const formatContactInfo = (email: any, phone: any) => {
    return (
      <>
        <div className="text-sm text-gray-500 break-words">{email}</div>
        <div className="text-sm text-gray-500">{phone}</div>
      </>
    );
  };
  return (
    <div style={styles.outerContainer}>
      <div style={styles.foterTableContainer}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                {props?.tableHead?.map((val, index) => (
                  <th key={index} style={styles.th}>
                    {val}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData?.map((val: any, index: any) => (
                <tr key={index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>
                    <div
                      style={{ width: "100%", display: "flex", gap: "15px" }}
                    >
                      <img
                        src={val.image}
                        alt="Customer"
                        style={{
                          width: "50px",
                          height: "40px",
                          borderRadius: "35px",
                        }}
                      />
                      <div className="flex flex-col min-w-0 max-w-[200px]">
                        <span className="text-sm font-medium text-gray-900 mb-1">
                          {val.name}
                        </span>
                        {formatContactInfo(val.email, val.phone)}
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {role == 2 &&
                      val?.orderItem?.map((item: any) => (
                        <div className="flex flex-col min-w-0 max-w-[200px]">
                          {item.quantity} {item.name}
                        </div>
                      ))}
                  </td>
                  <td style={styles.td}>{formatDate(val?.created_at)}</td>
                  <td style={styles.td}>
                    {val.city},{val.address}
                  </td>
                  <td style={styles.td}>{val.total_amount}</td>
                  <td
                    style={{
                      color:
                        val.status == "Pending"
                          ? "#FFA800"
                          : val.status == "Delivered" ||
                            val.status == "Accepted"
                          ? "#00B074"
                          : "#FF5B5B",
                      padding: "12px 15px",
                      borderBottom: "1px solid #eee",
                      textOverflow: "ellipsis",
                      maxWidth: 200,
                      overflow: "hidden",
                    }}
                  >
                    {val.status}
                  </td>
                  <td style={styles.td}>
                    <Button
                      onClick={() => handleViewDetails(val)}
                      style={{
                        backgroundColor: "#248AC4",
                        borderColor: "#248AC4",
                      }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={styles.footer}>
          <div style={styles.rowSelectorContainer}>
            <span>Rows per page:</span>
            <select
              style={styles.select}
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div style={styles.paginationContainer}>
            <span style={styles.paginationInfo}>
              {(currentPage - 1) * rowsPerPage + 1}–
              {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems}
            </span>
            <div>
              <button
                className="table-pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ⟨
              </button>
              <button
                className="table-pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ⟩
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <OrderPopup
          customerEmail={selectedOrder?.customerEmail}
          customerName={selectedOrder?.customerName}
          customerPhone={selectedOrder?.customerPhone}
          address={selectedOrder?.address}
          placedTime={selectedOrder?.placedTime}
          totalBill={selectedOrder?.totalBill}
          items={selectedOrder?.items}
          type={props.type}
          status={selectedOrder?.status}
          onCross={() => setShowPopup(false)}
          onAccept={() => {
            // alert("Order Accepted!");
            handleClosePopup("Accepted");
          }}
          onDecline={() => {
            // alert("Order Declined!");
            handleClosePopup("Cancelled");
          }}
        />
      )}
      <ToastContainer position="bottom-left" />
    </div>
  );
};

export default OrderTable;
