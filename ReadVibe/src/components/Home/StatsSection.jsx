// import React from "react";
// import { Container, Row, Col } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBook, faUsers, faSmile, faBrain } from "@fortawesome/free-solid-svg-icons";

// const StatsSection = () => {
//   const stats = [
//     {
//       icon: faBook,
//       value: "10,000+",
//       label: "Books Available"
//     },
//     {
//       icon: faUsers,
//       value: "50,000+",
//       label: "Active Readers"
//     },
//     {
//       icon: faSmile,
//       value: "95%",
//       label: "Satisfaction Rate"
//     },
//     {
//       icon: faBrain,
//       value: "24/7",
//       label: "AI Recommendations"
//     }
//   ];

//   return (
//     <Container className="my-5 stats-section">
//       <Row>
//         {stats.map((stat, index) => (
//           <Col md={3} xs={6} key={index} className="mb-4">
//             <div className="stats-card">
//               <div className="stats-number">
//                 <FontAwesomeIcon icon={stat.icon} className="me-2" />
//                 {stat.value}
//               </div>
//               <div className="stats-label">{stat.label}</div>
//             </div>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default StatsSection;









import React from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faUsers, faSmile, faBrain } from "@fortawesome/free-solid-svg-icons";

const StatsSection = ({ stockBooks }) => {
  const stats = [
    {
      icon: faBook,
      value: `${stockBooks.length}+`,
      label: "Books Available"
    },
    {
      icon: faUsers,
      value: "50,000+",
      label: "Active Readers"
    },
    {
      icon: faSmile,
      value: "95%",
      label: "Satisfaction Rate"
    },
    {
      icon: faBrain,
      value: "24/7",
      label: "AI Recommendations"
    }
  ];

  return (
    <div className="container my-5 stats-section">
      <Row>
        {stats.map((stat, index) => (
          <Col key={index} md={3} xs={6} className="mb-4">
            <div className="stats-card">
              <div className="stats-number">
                <FontAwesomeIcon icon={stat.icon} className="me-2" />
                {stat.value}
              </div>
              <div className="stats-label">{stat.label}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StatsSection;