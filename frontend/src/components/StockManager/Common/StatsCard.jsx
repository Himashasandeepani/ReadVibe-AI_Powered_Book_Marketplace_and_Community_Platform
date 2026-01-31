// import React from 'react';

// const StatsCard = ({ number, label, variant = 'default', icon = null }) => {
//   const getVariantClass = () => {
//     switch(variant) {
//       case 'success': return 'text-success';
//       case 'warning': return 'text-warning';
//       case 'danger': return 'text-danger';
//       case 'info': return 'text-info';
//       case 'primary': return 'text-primary';
//       default: return '';
//     }
//   };

//   return (
//     <div className="stats-card">
//       <div className={`stats-number ${getVariantClass()}`}>
//         {icon && <span className="me-2">{icon}</span>}
//         {number}
//       </div>
//       <div className="stats-label">{label}</div>
//     </div>
//   );
// };

// export default StatsCard;




import React from "react";

const StatsCard = ({ number, label, className = "", variant = "" }) => {
  const variantClass = variant ? `stats-card-${variant}` : "";
  
  return (
    <div className={`stats-card ${variantClass} ${className}`}>
      <div className="stats-number">{number}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
};

export default StatsCard;