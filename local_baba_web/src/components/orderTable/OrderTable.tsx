import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { get_nonPenging_orders, get_penging_orders } from "../../services";
import { formatDate } from "../../api/api";
import { Button } from "react-bootstrap";
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

interface Props {
  tableHead: string[];
  type: string;
  isPopup?: boolean;
  onPopUp?: () => void;
}
const OrderTable: React.FC<Props> = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [role, setRole] = useState<number>();

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
          const res = await get_nonPenging_orders(currentPage, rowsPerPage);
          if (res.status == 200) {
            console.log(res.data);
            setTableData(res?.data?.data);
            setTotalItems(res.data.totalItems);
          }
        } else {
          const res = await get_penging_orders(currentPage, rowsPerPage);
          if (res.status == 200) {
            console.log(res.data);
            setTableData(res?.data?.data);
            setTotalItems(res.data?.data?.length);
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
                    {props.type != "history" &&
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
                      color: val.status == "Pending" ? "#FFA800" : "",
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
    </div>
  );
};

export default OrderTable;
