import React from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { formatPrice } from "./utils";

const OrderItemsSection = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="order-items-section">
        <h6>
          <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
          Order Items
        </h6>
        <p className="text-muted text-center py-3">No items found</p>
      </div>
    );
  }

  return (
    <div className="order-items-section">
      <h6>
        <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
        Order Items
      </h6>
      {items.map((item, index) => (
        <div key={index} className="order-item mb-3 pb-3 border-bottom">
          <Row className="align-items-center">
            <Col xs={3} md={2}>
              <img
                src={item.image}
                alt={item.title}
                className="order-item-image img-fluid rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/60x80/DBEAFE/1E3A5F?text=Book";
                }}
              />
            </Col>
            <Col xs={9} md={6}>
              <h6 className="mb-1">{item.title}</h6>
              <p className="text-muted mb-0">by {item.author}</p>
            </Col>
            <Col xs={12} md={4} className="text-end mt-2 mt-md-0">
              <div className="order-item-price">
                {formatPrice(item.price * item.quantity)}
                <div className="order-item-quantity">Qty: {item.quantity}</div>
              </div>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsSection;
