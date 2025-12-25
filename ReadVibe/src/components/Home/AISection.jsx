import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBrain, 
  faArrowRight, 
  faCogs, 
  faShoppingCart, 
  faStar, 
  faCogs as faCogsSolid 
} from "@fortawesome/free-solid-svg-icons";

const AISection = ({ aiInsight }) => {
  const aiSteps = [
    {
      icon: faShoppingCart,
      title: "Track Purchases",
      description: "We analyze the books you purchase to understand your reading preferences."
    },
    {
      icon: faStar,
      title: "Analyze Reviews",
      description: "Your reviews help us understand what you love about specific books and genres."
    },
    {
      icon: faCogsSolid,
      title: "Generate Matches",
      description: "Our AI matches your preferences with similar books in our database."
    }
  ];

  return (
    <>
      <div className="container">
        <div className="ai-section">
          <div className="row align-items-center">
            <div className="col-md-8 ai-section-content">
              <h3>
                <FontAwesomeIcon icon={faBrain} className="me-2" />
                Get Personalized Recommendations
              </h3>
              <p>
                Our AI analyzes your reading history, purchased books, and
                reviews to understand your preferences and suggest books you'll
                love.
              </p>
              <div>
                <Link to="/Marketplace" className="btn btn-primary me-2">
                  <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                  Get Your Recommendations
                </Link>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <FontAwesomeIcon icon={faBrain} className="ai-brain-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="dashboard-card ai-how-it-works">
          <div className="row mb-4">
            <div className="col-12">
              <h4 className="how-it-works-title">
                <FontAwesomeIcon icon={faCogs} className="me-2" />
                How Our AI Works
              </h4>
              <p className="how-it-works-subtitle">
                Understanding the magic behind your personalized recommendations
              </p>
            </div>
          </div>
          <div className="row">
            {aiSteps.map((step, index) => (
              <div key={index} className="col-md-4 how-it-works-step">
                <div className="how-it-works-icon">
                  <FontAwesomeIcon icon={step.icon} />
                </div>
                <h5>{step.title}</h5>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AISection;