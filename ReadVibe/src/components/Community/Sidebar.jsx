import React from "react";
import { 
  topContributors, 
  popularTags, 
  communityGuidelines 
} from "./utils";

const Sidebar = ({ onTagClick }) => {
  return (
    <div className="community-sidebar sidebar-sticky">
      <h5>
        <i className="fas fa-crown me-2"></i>Top Contributors
      </h5>
      <div id="topContributors">
        {topContributors.map((contributor, index) => (
          <div className="contributor-item" key={index}>
            <div className="contributor-avatar">
              {contributor.avatar}
            </div>
            <div className="contributor-info">
              <h6 className="mb-0">{contributor.name}</h6>
              <small className="text-muted">
                {contributor.posts} posts
              </small>
            </div>
          </div>
        ))}
      </div>

      <h5 className="mt-4">
        <i className="fas fa-tags me-2"></i>Popular Tags
      </h5>
      <div className="popular-tags mt-2" id="popularTags">
        {popularTags.map((tag, index) => (
          <span
            key={index}
            className="badge bg-light text-dark tag-badge"
            onClick={() => onTagClick(tag)}
            style={{ cursor: "pointer", margin: "2px" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <h5>
          <i className="fas fa-info-circle me-2"></i>Community Guidelines
        </h5>
        <div className="card border-0 bg-light mt-2">
          <div className="card-body p-3">
            <ul className="list-unstyled mb-0 small">
              {communityGuidelines.map((guideline, index) => (
                <li className="mb-2" key={index}>
                  <i className="fas fa-check-circle text-success me-2"></i>
                  {guideline}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;