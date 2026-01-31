import React from "react";
import { Card } from "react-bootstrap";
import OrderItems from "./OrderItems";
import OrderTotals from "./OrderTotals";
import DeliveryAddressDisplay from "./DeliveryAddressDisplay";
import SecurityBadges from "./SecurityBadges";

const OrderSummary = ({ orderData }) => {
  return (
    <Card className="checkout-order-summary">
      <Card.Body>
        <h5 className="mb-3">Order Summary</h5>

        <OrderItems items={orderData.items} />

        <OrderTotals totals={orderData.totals} />

        <DeliveryAddressDisplay shipping={orderData.shipping} />

        <SecurityBadges />
      </Card.Body>
    </Card>
  );
};

export default OrderSummary;