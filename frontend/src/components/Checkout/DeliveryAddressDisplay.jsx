import React from "react";

const DeliveryAddressDisplay = ({ shipping }) => {
  if (!shipping) return null;

  return (
    <div className="delivery-address-display">
      <h6>Delivery Address</h6>
      <div id="deliveryAddress" className="delivery-address-text">
        {shipping.firstName} {shipping.lastName}
        <br />
        {shipping.address}
        <br />
        {shipping.city}, {shipping.state}
        <br />
        {shipping.zipCode}
        <br />
        {shipping.country}
        <br />
        📞 {shipping.phone}
      </div>
    </div>
  );
};

export default DeliveryAddressDisplay;