import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const ProgressSteps = ({ currentStep = 3 }) => {
  const steps = [
    { number: 1, label: "Delivery", completed: true },
    { number: 2, label: "Payment", completed: true },
    { number: 3, label: "Confirmation", active: true },
  ];

  return (
    <div className="checkout-steps mb-5">
      <div className="d-flex justify-content-between align-items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="step-indicator">
              <div className={`step-circle ${step.completed ? "completed" : ""} ${step.active ? "active" : ""}`}>
                {step.completed ? <FontAwesomeIcon icon={faCheck} /> : step.number}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="step-connector">
                <div className="progress-bar" style={{ width: step.completed ? "100%" : "0%" }}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;