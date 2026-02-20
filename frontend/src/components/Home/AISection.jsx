import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faArrowRight,
  faCogs,
  faShoppingCart,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const AISection = () => {
  const howItWorksSteps = [
    {
      icon: faShoppingCart,
      title: "Track Purchases",
      description:
        "We analyze the books you purchase to understand your reading preferences.",
    },
    {
      icon: faStar,
      title: "Analyze Reviews",
      description:
        "Your reviews help us understand what you love about specific books and genres.",
    },
    {
      icon: faCogs,
      title: "Generate Matches",
      description:
        "Our AI matches your preferences with similar books in our database.",
    },
  ];

  return (
    <>
      <div className="ai-section">
        <Row className="align-items-center">
          <Col md={8} className="ai-section-content">
            <h3>
              <FontAwesomeIcon icon={faBrain} className="me-2" />
              Get Personalized Recommendations
            </h3>
            <p>
              Our AI analyzes your reading history, purchased books, and reviews
              to understand your preferences and suggest books you'll love.
            </p>
            <div>
              <Link to="/Marketplace" className="btn btn-primary me-2">
                <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                Get Your Recommendations
              </Link>
            </div>
          </Col>
          <Col md={4} className="text-center">
            <FontAwesomeIcon icon={faBrain} className="ai-brain-icon" />
          </Col>
        </Row>
      </div>

      <div className="dashboard-card ai-how-it-works mt-5">
        <Row className="mb-4">
          <Col xs={12}>
            <h4 className="how-it-works-title">
              <FontAwesomeIcon icon={faCogs} className="me-2" />
              How Our AI Works
            </h4>
            <p className="how-it-works-subtitle">
              Understanding the magic behind your personalized recommendations
            </p>
          </Col>
        </Row>
        <Row>
          {howItWorksSteps.map((step, index) => (
            <Col md={4} key={index} className="how-it-works-step">
              <div className="how-it-works-icon">
                <FontAwesomeIcon icon={step.icon} />
              </div>
              <h5>{step.title}</h5>
              <p>{step.description}</p>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default AISection;
