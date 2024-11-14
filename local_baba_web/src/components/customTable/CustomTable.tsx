import React, { useState, useEffect } from "react";
import { get_customers, get_restaurant, get_rider } from "../../services";
import { Plus, Search } from "lucide-react";
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
const DessertTable: React.FC<Props> = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const style = createStyleTag();
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    getRestaurant();
  }, [currentPage, rowsPerPage, searchQuery]);

  const getRestaurant = async () => {
    setTableData([]);
    let newArry: any = [];
    if (props.type == "customer") {
      const res = await get_customers(currentPage, rowsPerPage);
      if (res.status === "success") {
        res.data.map((val: any) => {
          let newObect = {
            item1: val.id,
            item2: val.name,
            item3: val.phone,
            item4: val.email,
            item5: "",
            item6: val.totalOrders,
          };
          newArry.push(newObect);
        });
        setTableData(newArry);
        setTotalItems(res.totalItems);
      }
    } else if (props.type == "restaurant") {
      const res = await get_restaurant(currentPage, rowsPerPage);
      if (res.status === "success") {
        res.data.map((val: any) => {
          let newObect = {
            item1: val.id,
            item2: val.name,
            item3: val.address,
            item4: val.serviesType,
            item5: `${val.openingTime}-${val.closingTime}`,
          };
          newArry.push(newObect);
        });
        setTableData(newArry);
        setTotalItems(res.totalItems);
      }
    } else if (props.type == "rider") {
      const res = await get_rider(currentPage, rowsPerPage);
      if (res.status === "success") {
        res.data.map((val: any) => {
          let newObect = {
            item1: val.id,
            item2: val.name,
            item3: val.phone,
            item4: val.email,
            item5: "",
            item6: val.totalOrders,
          };
          newArry.push(newObect);
        });
        setTableData(newArry);
        setTotalItems(res.totalItems);
      }
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

  const filteredData = tableData.filter((val: any) =>
    Object.values(val).some((field: any) =>
      field.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div style={styles.outerContainer}>
      <div className="align-items-center justify-content-between d-md-flex">
        <div
          className="position-relative me-4"
          style={{ width: "60%", maxWidth: "100%" }}
        >
          <input
            type="text"
            className="form-control border-0 bg-light pe-4"
            placeholder="Search by date, restaurant"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted cursor-pointer"
            size={18}
          />
        </div>
        <div className="d-flex align-items-center">
          {props.isPopup && (
            <button
              className="btn btn-light d-flex align-items-center me-3"
              onClick={props.onPopUp}
            >
              <Plus size={18} className="me-2" />
              <span>Add Restaurant</span>
            </button>
          )}
        </div>
      </div>
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
              {filteredData?.map((val: any, index: any) => (
                <tr key={index}>
                  <td style={styles.td}>{val.item1}</td>
                  <td style={styles.td}>{val.item2}</td>
                  <td style={styles.td}>{val.item3}</td>
                  <td style={styles.td}>{val.item4}</td>
                  <td style={styles.td}>{val.item5}</td>
                  <td style={styles.td}>{val.item6}</td>
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

export default DessertTable;
