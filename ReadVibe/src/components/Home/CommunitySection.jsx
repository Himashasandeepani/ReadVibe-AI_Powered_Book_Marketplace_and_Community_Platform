import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faUsers } from "@fortawesome/free-solid-svg-icons";
import CommunityPost from "./CommunityPost";

const CommunitySection = ({ 
  communityPosts, 
  isLoggedIn, 
  onLike, 
  onComment, 
  onShare, 
  onAddComment,
  commentText,
  setCommentText,
  commentText2,
  setCommentText2,
  navigate 
}) => {
  return (
    <div className="container my-5">
      <h2 className="section-title">
        <FontAwesomeIcon icon={faComments} className="me-2" />
        From Our Community
        <div className="section-title-line"></div>
      </h2>

      <Row>
        <Col md={6}>
          <CommunityPost
            post={communityPosts[0]}
            isLoggedIn={isLoggedIn}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
            onAddComment={onAddComment}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        </Col>

        <Col md={6}>
          <CommunityPost
            post={communityPosts[1]}
            isLoggedIn={isLoggedIn}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
            onAddComment={onAddComment}
            commentText={commentText2}
            setCommentText={setCommentText2}
          />
        </Col>
      </Row>

      <div className="text-center mt-4">
        <Link
          to="/community"
          className="btn btn-outline-primary join-conversation-btn"
        >
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          Join the Conversation
        </Link>
      </div>
    </div>
  );
};

export default CommunitySection;