import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faClock,
  faHeart,
  faComment,
  faShareAlt,
  faPaperPlane,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const CommunitySection = ({ currentUser }) => {
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      user: "John Doe",
      initials: "JD",
      time: "2 hours ago",
      content: `"Just finished 'Project Hail Mary' and it's absolutely mind-blowing! The character development is incredible."`,
      likes: 24,
      comments: 8,
      likedByUser: false,
      commentsList: [
        {
          user: "Emily R.",
          comment: `"I loved this book too! The ending was perfect."`,
        },
        {
          user: "Mike T.",
          comment: `"One of the best sci-fi books I've read this year!"`,
        },
      ],
    },
    {
      id: 2,
      user: "Sarah Johnson",
      initials: "SJ",
      time: "5 hours ago",
      content: `"Looking for fantasy recommendations similar to Brandon Sanderson's works. Any suggestions?"`,
      likes: 45,
      comments: 12,
      likedByUser: false,
      commentsList: [
        {
          user: "David L.",
          comment: `"Check out Robert Jordan's Wheel of Time series!"`,
        },
        {
          user: "Anna K.",
          comment: `"Patrick Rothfuss' books are amazing if you haven't read them."`,
        },
      ],
    },
  ]);

  const [commentText, setCommentText] = useState("");
  const [commentText2, setCommentText2] = useState("");

  const handleLike = (postId) => {
    if (!currentUser) {
      alert("Please login to like posts");
      return;
    }

    setCommunityPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByUser: !post.likedByUser,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleAddComment = (postId, comment) => {
    if (!comment.trim()) return;

    const newComment = {
      user: currentUser?.username || "You",
      comment: comment,
    };

    setCommunityPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentsList: [...post.commentsList, newComment],
            }
          : post
      )
    );

    if (postId === 1) {
      setCommentText("");
    } else {
      setCommentText2("");
    }

    alert("Comment added!");
  };

  const isLiked = (postId) => {
    const post = communityPosts.find((p) => p.id === postId);
    return post?.likedByUser || false;
  };

  const renderCommunityPost = (post, commentValue, onCommentChange, onAddComment) => (
    <div className="community-card">
      <div className="d-flex align-items-center mb-3">
        <div className="user-avatar">{post.initials}</div>
        <div>
          <h6 className="mb-0">{post.user}</h6>
          <small className="text-muted">
            <FontAwesomeIcon icon={faClock} className="me-1" />
            {post.time}
          </small>
        </div>
      </div>
      <p>{post.content}</p>
      <div className="d-flex">
        <Button
          variant="outline-secondary"
          size="sm"
          className="me-2"
          onClick={() => handleLike(post.id)}
          disabled={!currentUser}
          title={!currentUser ? "Login to like" : "Like this post"}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={isLiked(post.id) ? "text-danger" : ""}
          />
          <span className="ms-1">{post.likes}</span>
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          className="me-2"
          onClick={() => document.querySelector(`#comment-input-${post.id}`)?.focus()}
          disabled={!currentUser}
          title={!currentUser ? "Login to comment" : "Add comment"}
        >
          <FontAwesomeIcon icon={faComment} />
          <span className="ms-1">{post.comments}</span>
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          title="Share this post"
        >
          <FontAwesomeIcon icon={faShareAlt} />
          <span className="ms-1">Share</span>
        </Button>
      </div>

      <div className="mt-3">
        <div className="comments-section">
          <h6 className="mb-2">
            <FontAwesomeIcon icon={faComment} className="me-2" />
            Comments ({post.comments})
          </h6>
          <div className="comment-list">
            {post.commentsList.map((comment, index) => (
              <div key={index} className="comment-item mb-2">
                <small className="text-muted">{comment.user}</small>
                <p className="mb-1">{comment.comment}</p>
              </div>
            ))}
          </div>

          {currentUser && (
            <div className="add-comment mt-3">
              <Form.Group>
                <Form.Control
                  id={`comment-input-${post.id}`}
                  type="text"
                  placeholder="Add a comment..."
                  value={commentValue}
                  onChange={(e) => onCommentChange(e.target.value)}
                  size="sm"
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  onClick={() => onAddComment(post.id, commentValue)}
                  disabled={!commentValue.trim()}
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                  Post Comment
                </Button>
              </Form.Group>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Container className="my-5">
      <h2 className="section-title">
        <FontAwesomeIcon icon={faComments} className="me-2" />
        From Our Community
        <div className="section-title-line"></div>
      </h2>

      <Row>
        <Col md={6}>
          {renderCommunityPost(
            communityPosts[0],
            commentText,
            setCommentText,
            handleAddComment
          )}
        </Col>

        <Col md={6}>
          {renderCommunityPost(
            communityPosts[1],
            commentText2,
            setCommentText2,
            handleAddComment
          )}
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
    </Container>
  );
};

export default CommunitySection;