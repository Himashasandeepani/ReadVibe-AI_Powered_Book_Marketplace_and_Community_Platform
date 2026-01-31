// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';

// const SearchBox = ({ value, onChange, placeholder = "Search..." }) => {
//   return (
//     <div className="search-box position-relative">
//       <input
//         type="text"
//         className="form-control"
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       />
//       <FontAwesomeIcon
//         icon={faSearch}
//         className="position-absolute"
//         style={{
//           top: "50%",
//           right: "15px",
//           transform: "translateY(-50%)",
//           color: "#6c757d",
//         }}
//       />
//     </div>
//   );
// };

// export default SearchBox;



import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBox = ({ value, onChange, placeholder = "Search...", className = "" }) => {
  return (
    <div className={`search-box position-relative ${className}`}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <FontAwesomeIcon
        icon={faSearch}
        className="position-absolute search-icon"
      />
    </div>
  );
};

export default SearchBox;