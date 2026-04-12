import React from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { formatDate, getOrderDisplayDate, getOrderPaymentInfo } from "./utils";

const OrderInfoSection = ({ order }) => {
  const orderDate = getOrderDisplayDate(order);
  const paymentInfo = getOrderPaymentInfo(order);

  return (
    <div className="order-info-section mb-4">
      <h6>
        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
        Order Information
      </h6>
      <Row className="order-info-grid">
        <Col md={4} className="order-info-item mb-3">
          <span className="label">Order Number:</span>
          <span className="value">{order.orderNumber || order.id}</span>
        </Col>
        <Col md={8} className="order-info-item mb-3">
          <span className="label">Order Date:</span>
          <span className="value">
            {orderDate ? formatDate(orderDate) : "N/A"}
          </span>
        </Col>
        <Col md={4} className="order-info-item mb-3">
          <span className="label">Payment Method:</span>
          <span className="value">{paymentInfo.method}</span>
        </Col>
        <Col md={8} className="order-info-item mb-3">
          <span className="label">Transaction ID:</span>
          <span className="value">{paymentInfo.transactionId}</span>
        </Col>
      </Row>
    </div>
  );
};

export default OrderInfoSection;
