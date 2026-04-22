import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCheck } from "@fortawesome/free-solid-svg-icons";

const statusOrder = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Returned",
];

const normalizeStatus = (status) => String(status || "Processing").trim().toLowerCase();

const formatTimelineDate = (value) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getLatestStatus = (trackingUpdates = [], currentStatus = "Processing") => {
  const latestUpdate = Array.isArray(trackingUpdates) && trackingUpdates.length > 0
    ? trackingUpdates[trackingUpdates.length - 1]
    : null;

  return latestUpdate?.status || currentStatus || "Processing";
};

const getStatusIndex = (status) => {
  const normalized = normalizeStatus(status);
  const index = statusOrder.findIndex(
    (item) => normalizeStatus(item) === normalized,
  );
  return index >= 0 ? index : 0;
};

const DeliveryTimeline = ({
  shipDate,
  deliveryDate,
  processingDays,
  trackingUpdates = [],
  currentStatus = "Processing",
}) => {
  const latestStatus = getLatestStatus(trackingUpdates, currentStatus);
  const activeIndex = getStatusIndex(latestStatus);
  const latestUpdateByStatus = (targetStatus) =>
    [...trackingUpdates]
      .reverse()
      .find((update) => normalizeStatus(update.status) === normalizeStatus(targetStatus));

  const stages = [
    { title: "Order Placed", date: "Today" },
    {
      title: "Processing",
      date:
        processingDays === 0
          ? "Same day"
          : processingDays === 1
            ? "1 business day"
            : `${processingDays} business days`,
    },
    {
      title: "Shipped",
      date:
        formatTimelineDate(latestUpdateByStatus("Shipped")?.timestamp) ||
        shipDate,
    },
    {
      title: "Out for Delivery",
      date:
        formatTimelineDate(latestUpdateByStatus("Out for Delivery")?.timestamp) ||
        "On the way",
    },
    {
      title: "Delivered",
      date:
        formatTimelineDate(latestUpdateByStatus("Delivered")?.timestamp) ||
        deliveryDate,
    },
    {
      title: "Returned",
      date:
        formatTimelineDate(latestUpdateByStatus("Returned")?.timestamp) ||
        "Only shown if the order is returned",
    },
  ];

  return (
    <div className="delivery-timeline mt-4">
      <h6>
        <FontAwesomeIcon icon={faClock} className="me-2" />
        Delivery Timeline
      </h6>
      <div className="timeline mt-3">
        {stages.map((stage, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isPending = index > activeIndex;

          return (
            <div
              key={stage.title}
              className={`timeline-item ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""} ${isPending ? "pending" : ""}`.trim()}
            >
              <div className="timeline-marker">
                {(isCompleted || isActive) && <FontAwesomeIcon icon={faCheck} />}
              </div>
              <div className="timeline-content">
                <div className="timeline-title">{stage.title}</div>
                <div className="timeline-date">{stage.date}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryTimeline;
