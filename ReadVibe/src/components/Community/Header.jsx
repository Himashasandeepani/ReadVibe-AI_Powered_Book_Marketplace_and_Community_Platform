import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faPlus, faBookMedical } from "@fortawesome/free-solid-svg-icons";

const Header = ({ onShowCreatePost, onShowRequestBook }) => {
  return (
    <div className="community-header">
      <h2 className="mb-0" style={{ color: "var(--primary-blue)" }}>
        <FontAwesomeIcon icon={faUsers} className="me-2" />
        Community Discussions
      </h2>
      <div>
        <button className="btn btn-primary" onClick={onShowCreatePost}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Create Post
        </button>
        <button className="btn btn-success ms-2" onClick={onShowRequestBook}>
          <FontAwesomeIcon icon={faBookMedical} className="me-2" />
          Request Book
        </button>
      </div>
    </div>
  );
};

export default Header;