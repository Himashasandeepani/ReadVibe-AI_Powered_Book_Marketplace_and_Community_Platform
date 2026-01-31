import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faStar, faBookMedical, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const QuickActions = ({ onViewOrders, onViewReviews, onRequestBook }) => {
  const actions = [
    {
      label: "View Order History",
      icon: faShoppingBag,
      variant: "outline-primary",
      onClick: onViewOrders,
    },
    {
      label: "View My Reviews",
      icon: faStar,
      variant: "outline-success",
      onClick: onViewReviews,
    },
    {
      label: "Request a Book",
      icon: faBookMedical,
      variant: "outline-info",
      onClick: onRequestBook,
    },
  ];

  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        <h4 className="mb-3">Quick Actions</h4>
        <Row>
          {actions.map((action, index) => (
            <Col md={4} className="mb-3" key={index}>
              <Button
                variant={action.variant}
                className="w-100 d-flex align-items-center justify-content-between py-3"
                onClick={action.onClick}
              >
                <div>
                  <FontAwesomeIcon icon={action.icon} className="me-2" />
                  {action.label}
                </div>
                <FontAwesomeIcon icon={faChevronRight} size="xs" />
              </Button>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QuickActions;