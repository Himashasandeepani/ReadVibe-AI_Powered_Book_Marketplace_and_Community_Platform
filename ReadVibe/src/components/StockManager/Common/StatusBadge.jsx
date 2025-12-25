// import React from 'react';
// import { BOOK_STATUSES, ORDER_STATUSES, REQUEST_STATUSES, SUPPLIER_STATUSES } from '../utils/constants';

// const StatusBadge = ({ status, type = 'book' }) => {
//   const getBadgeClass = () => {
//     switch(type) {
//       case 'order':
//         return getOrderStatusClass(status);
//       case 'request':
//         return getRequestStatusClass(status);
//       case 'supplier':
//         return getSupplierStatusClass(status);
//       default:
//         return getStockStatusClass(status);
//     }
//   };

//   const getStockStatusClass = (status) => {
//     switch(status) {
//       case BOOK_STATUSES.IN_STOCK: return "badge bg-success";
//       case BOOK_STATUSES.LOW_STOCK: return "badge bg-warning text-dark";
//       case BOOK_STATUSES.OUT_OF_STOCK: return "badge bg-danger";
//       default: return "badge bg-secondary";
//     }
//   };

//   const getOrderStatusClass = (status) => {
//     switch(status) {
//       case ORDER_STATUSES.PROCESSING: return "badge bg-warning text-dark";
//       case ORDER_STATUSES.SHIPPED: return "badge bg-info text-dark";
//       case ORDER_STATUSES.DELIVERED: return "badge bg-success";
//       default: return "badge bg-secondary";
//     }
//   };

//   const getRequestStatusClass = (status) => {
//     switch(status) {
//       case REQUEST_STATUSES.PENDING: return "badge bg-warning text-dark";
//       case REQUEST_STATUSES.APPROVED: return "badge bg-success";
//       case REQUEST_STATUSES.REJECTED: return "badge bg-danger";
//       case REQUEST_STATUSES.FULFILLED: return "badge bg-info text-dark";
//       default: return "badge bg-secondary";
//     }
//   };

//   const getSupplierStatusClass = (status) => {
//     return status === SUPPLIER_STATUSES.ACTIVE ? "badge bg-success" : "badge bg-secondary";
//   };

//   return (
//     <span className={getBadgeClass()}>
//       {status}
//     </span>
//   );
// };

// export default StatusBadge;






import React from "react";

const StatusBadge = ({ 
  status, 
  type = "stock",
  className = "" 
}) => {
  const getStatusClass = () => {
    switch (type) {
      case "stock":
        return {
          "In Stock": "badge bg-success",
          "Low Stock": "badge bg-warning text-dark",
          "Out of Stock": "badge bg-danger",
        }[status] || "badge bg-secondary";
      case "order":
        return {
          Processing: "badge bg-warning text-dark",
          Shipped: "badge bg-info text-dark",
          Delivered: "badge bg-success",
          "Out for Delivery": "badge bg-primary",
          Returned: "badge bg-dark",
        }[status] || "badge bg-secondary";
      case "request":
        return {
          Pending: "badge bg-warning text-dark",
          Approved: "badge bg-success",
          Rejected: "badge bg-danger",
          Fulfilled: "badge bg-info text-dark",
        }[status] || "badge bg-secondary";
      case "supplier":
        return status === "Active" ? "badge bg-success" : "badge bg-secondary";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <span className={`${getStatusClass()} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;