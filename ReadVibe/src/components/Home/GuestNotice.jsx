// import React from "react";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faInfoCircle, faHandsHelping } from "@fortawesome/free-solid-svg-icons";
// import { Container } from "react-bootstrap";

// const GuestNotice = ({ isLoggedIn }) => {
//   if (isLoggedIn) return null;

//   return (
//     <div className="guest-notice">
//       <Container>
//         <span style={{ fontWeight: "bold" }}>
//           <FontAwesomeIcon icon={faHandsHelping} className="me-2" />
//           Welcome Guest!
//         </span>
//         <div className="guest-restriction mb-4">
//           <div className="d-flex align-items-center">
//             <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
//             <div>
//               <strong>Guest Access:</strong> You can browse home but need to{" "}
//               <Link to="/login" className="text-primary fw-medium">
//                 login
//               </Link>{" "}
//               to add books to cart, wishlist, and make purchases.
//             </div>
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default GuestNotice;









import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsHelping, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const GuestNotice = () => {
  return (
    <div className="guest-notice">
      <div className="container">
        <span style={{ fontWeight: "bold" }}>
          <FontAwesomeIcon icon={faHandsHelping} className="me-2" />
          Welcome Guest!
        </span>
        <div className="guest-restriction mb-4">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
            <div>
              <strong>Guest Access:</strong> You can browse home but need to{" "}
              <Link to="/login" className="text-primary fw-medium">
                login
              </Link>{" "}
              to add books to cart, wishlist, and make purchases.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestNotice;