import React from "react";
import { Row } from "react-bootstrap";

const ProgressSteps = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: "Delivery" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Confirmation" },
  ];

  return (
    <div className="delivery-progress">
      <Row className="text-center">
        {steps.map((step) => (
          <div className="col" key={step.number}>
            <div
              className={`delivery-step ${currentStep >= step.number ? "active" : ""}`}
            >
              <div className="delivery-step-circle">{step.number}</div>
              <div className="delivery-step-label">{step.label}</div>
            </div>
          </div>
        ))}
      </Row>
    </div>
  );
};

export default ProgressSteps;
