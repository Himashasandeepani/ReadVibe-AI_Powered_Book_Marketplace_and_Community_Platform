import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "../Common/StatusBadge";
import ActionButtons from "../Common/ActionButtons";
import { formatCurrency, getStockPercentage } from "../utils";

const BooksTable = ({ 
  books, 
  sortConfig, 
  onSort, 
  onEdit, 
  onDelete, 
  onRestock, 
  onToggleFeatured 
}) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === "asc" ? faSortUp : faSortDown;
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover stock-manager-table">
        <thead>
          <tr>
            <th>
              <button
                className="btn btn-link p-0 text-decoration-none text-dark fw-bold"
                onClick={() => onSort("title")}
              >
                Title
                <FontAwesomeIcon
                  icon={getSortIcon("title")}
                  className="ms-1"
                />
              </button>
            </th>
            <th>Author</th>
            <th>Category</th>
            <th>
              <button
                className="btn btn-link p-0 text-decoration-none text-dark fw-bold"
                onClick={() => onSort("price")}
              >
                Price
                <FontAwesomeIcon
                  icon={getSortIcon("price")}
                  className="ms-1"
                />
              </button>
            </th>
            <th>Stock Level</th>
            <th>Value</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                <div className="fw-medium">{book.title}</div>
                <small className="text-muted">ISBN: {book.isbn}</small>
              </td>
              <td>{book.author}</td>
              <td>
                <span className="badge bg-secondary">{book.category}</span>
              </td>
              <td>
                <div className="fw-medium">
                  {formatCurrency(book.price)}
                </div>
                <small className="text-muted">
                  Cost: {formatCurrency(book.costPrice)}
                </small>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <div
                    className="progress grow me-2"
                    style={{ height: "8px" }}
                  >
                    <div
                      className={`progress-bar ${
                        getStockPercentage(book) > 50
                          ? "bg-success"
                          : getStockPercentage(book) > 20
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                      style={{
                        width: `${Math.min(getStockPercentage(book), 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-nowrap">
                    {book.stock}/{book.maxStock}
                  </div>
                </div>
              </td>
              <td>
                <div className="fw-medium">
                  {formatCurrency(book.price * book.stock)}
                </div>
                <small className="text-muted">
                  Profit:{" "}
                  {formatCurrency((book.price - book.costPrice) * book.stock)}
                </small>
              </td>
              <td>
                <StatusBadge status={book.status} type="stock" />
              </td>
              <td>
                <ActionButtons
                  onEdit={() => onEdit(book.id)}
                  onDelete={() => onDelete(book.id)}
                  onRestock={() => onRestock(book.id, 10)}
                  onToggleFeatured={() => onToggleFeatured(book.id)}
                  isFeatured={book.featured}
                  showEdit={true}
                  showDelete={true}
                  showRestock={true}
                  showToggleFeatured={true}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BooksTable;