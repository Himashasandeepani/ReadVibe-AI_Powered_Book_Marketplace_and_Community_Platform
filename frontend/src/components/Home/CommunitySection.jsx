import { useEffect, useState } from "react";
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
  faInbox,
} from "@fortawesome/free-solid-svg-icons";
import {
  fetchCommunityPostsApi,
  fetchCommunityPostWithCommentsApi,
} from "../../utils/communityApi";

const CommunitySection = ({ currentUser }) => {
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const posts = await fetchCommunityPostsApi();
        const previewPosts = await Promise.all(
          posts.slice(0, 2).map(async (post) => {
            const details = await fetchCommunityPostWithCommentsApi(post.id);
            const comments = Array.isArray(details.comments) ? details.comments : [];
            const name = post.userFullName || post.username || "User";
            const initials = name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() || "U")
              .join("");

            return {
              id: post.id,
              user: name,
              initials: initials || "US",
              time: post.createdAt
                ? new Date(post.createdAt).toLocaleString()
                : "Recently",
              content: post.content,
              likes: Number(post.likesCount) || 0,
              comments: Number(post.commentsCount) || comments.length || 0,
              commentsList: comments.map((comment) => ({
                user: comment.userFullName || comment.username || "User",
                comment: comment.content,
              })),
            };
          }),
        );

        setCommunityPosts(previewPosts);
      } catch (error) {
        console.error("Failed to load community posts for home preview", error);
        setCommunityPosts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, []);

  const handleLike = () => {
    if (!currentUser) {
      alert("Please login to like posts");
      return;
    }

    alert("Open the community page to like posts.");
  };

  const handleAddComment = () => {
    if (!currentUser) {
      alert("Please login to comment on posts");
      return;
    }

    alert("Open the community page to comment on posts.");
  };

  const isLiked = () => false;

  const renderCommunityPost = (
    post,
    commentValue,
    onCommentChange,
    onAddComment,
  ) => (
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
          onClick={() =>
            document.querySelector(`#comment-input-${post.id}`)?.focus()
          }
          disabled={!currentUser}
          title={!currentUser ? "Login to comment" : "Add comment"}
        >
          <FontAwesomeIcon icon={faComment} />
          <span className="ms-1">{post.comments}</span>
        </Button>
        <Button variant="outline-secondary" size="sm" title="Share this post">
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

      {loading ? (
        <Row>
          <Col xs={12} className="text-center py-5">
            <p className="text-muted mb-0">Loading community posts...</p>
          </Col>
        </Row>
      ) : communityPosts.length > 0 ? (
        <Row>
          {communityPosts.map((post) => (
            <Col md={6} key={post.id}>
              {renderCommunityPost(post, "", () => {}, handleAddComment)}
            </Col>
          ))}
        </Row>
      ) : (
        <Row>
          <Col xs={12}>
            <div className="community-card text-center py-5">
              <FontAwesomeIcon icon={faInbox} className="fa-3x text-muted mb-3" />
              <h5 className="mb-2">No community posts yet</h5>
              <p className="text-muted mb-0">
                Be the first to start a discussion in the community.
              </p>
            </div>
          </Col>
        </Row>
      )}

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
