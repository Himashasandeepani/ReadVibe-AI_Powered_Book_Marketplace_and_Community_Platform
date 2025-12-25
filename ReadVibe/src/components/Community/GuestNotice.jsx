import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const GuestNotice = ({ currentUser }) => {
  if (currentUser) return null;

  return (
    <div className="guest-restriction">
      <div className="d-flex align-items-center">
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="me-2"
          style={{ color: "var(--secondary-blue)" }}
        />
        <div>
          <strong>Guest Access:</strong> You can view posts but need to
          <Link to="/login"> login</Link> to create posts, comment, or like.
        </div>
      </div>
    </div>
  );
};

export default GuestNotice;