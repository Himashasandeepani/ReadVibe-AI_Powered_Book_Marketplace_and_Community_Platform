import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCheck } from "@fortawesome/free-solid-svg-icons";

const DeliveryTimeline = ({ shipDate, deliveryDate, processingDays }) => {
  return (
    <div className="delivery-timeline mt-4">
      <h6>
        <FontAwesomeIcon icon={faClock} className="me-2" />
        Delivery Timeline
      </h6>
      <div className="timeline mt-3">
        <div className="timeline-item completed">
          <div className="timeline-marker">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="timeline-content">
            <div className="timeline-title">Order Placed</div>
            <div className="timeline-date">Today</div>
          </div>
        </div>
        <div className="timeline-item active">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <div className="timeline-title">Processing</div>
            <div className="timeline-date">
              {processingDays === 0
                ? "Same day"
                : processingDays === 1
                  ? "1 business day"
                  : `${processingDays} business days`}
            </div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <div className="timeline-title">Shipped</div>
            <div className="timeline-date">{shipDate}</div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <div className="timeline-title">Delivered</div>
            <div className="timeline-date">{deliveryDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTimeline;
