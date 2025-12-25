// import React from "react";
// import { Button, Form } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { 
//   faClock, 
//   faHeart, 
//   faComment, 
//   faShareAlt, 
//   faPaperPlane 
// } from "@fortawesome/free-solid-svg-icons";

// const CommunityPost = ({ 
//   post, 
//   isLoggedIn, 
//   commentText, 
//   setCommentText, 
//   onLike, 
//   onComment, 
//   onAddComment, 
//   onShare 
// }) => {
//   return (
//     <div className="community-card">
//       <div className="d-flex align-items-center mb-3">
//         <div className="user-avatar">{post.initials}</div>
//         <div>
//           <h6 className="mb-0">{post.user}</h6>
//           <small className="text-muted">
//             <FontAwesomeIcon icon={faClock} className="me-1" />
//             {post.time}
//           </small>
//         </div>
//       </div>
//       <p>{post.content}</p>
//       <div className="d-flex">
//         <Button
//           variant="outline-secondary"
//           size="sm"
//           className="me-2"
//           onClick={() => onLike(post.id)}
//           disabled={!isLoggedIn}
//           title={!isLoggedIn ? "Login to like" : "Like this post"}
//         >
//           <FontAwesomeIcon
//             icon={faHeart}
//             className={post.likedByUser ? "text-danger" : ""}
//           />
//           <span className="ms-1">{post.likes}</span>
//         </Button>
//         <Button
//           variant="outline-secondary"
//           size="sm"
//           className="me-2"
//           onClick={() => onComment(post.id)}
//           disabled={!isLoggedIn}
//           title={!isLoggedIn ? "Login to comment" : "Add comment"}
//         >
//           <FontAwesomeIcon icon={faComment} />
//           <span className="ms-1">{post.comments}</span>
//         </Button>
//         <Button
//           variant="outline-secondary"
//           size="sm"
//           onClick={() => onShare(post.id)}
//           title="Share this post"
//         >
//           <FontAwesomeIcon icon={faShareAlt} />
//           <span className="ms-1">Share</span>
//         </Button>
//       </div>

//       <div className="mt-3">
//         <div className="comments-section">
//           <h6 className="mb-2">
//             <FontAwesomeIcon icon={faComment} className="me-2" />
//             Comments ({post.comments})
//           </h6>
//           <div className="comment-list">
//             {post.commentsList.map((comment, index) => (
//               <div key={index} className="comment-item mb-2">
//                 <small className="text-muted">{comment.user}</small>
//                 <p className="mb-1">{comment.comment}</p>
//               </div>
//             ))}
//           </div>

//           {isLoggedIn && (
//             <div className="add-comment mt-3">
//               <Form.Group>
//                 <Form.Control
//                   id={`comment-input-${post.id}`}
//                   type="text"
//                   placeholder="Add a comment..."
//                   value={commentText}
//                   onChange={(e) => setCommentText(e.target.value)}
//                   size="sm"
//                 />
//                 <Button
//                   variant="primary"
//                   size="sm"
//                   className="mt-2"
//                   onClick={() => onAddComment(post.id)}
//                   disabled={!commentText.trim()}
//                 >
//                   <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
//                   Post Comment
//                 </Button>
//               </Form.Group>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommunityPost;








import React from "react";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faShareAlt, faClock, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const CommunityPost = ({ 
  post, 
  isLoggedIn, 
  onLike, 
  onComment, 
  onShare, 
  onAddComment,
  commentText,
  setCommentText 
}) => {
  return (
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
          onClick={() => onLike(post.id)}
          disabled={!isLoggedIn}
          title={!isLoggedIn ? "Login to like" : "Like this post"}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={post.likedByUser ? "text-danger" : ""}
          />
          <span className="ms-1">{post.likes}</span>
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          className="me-2"
          onClick={() => onComment(post.id)}
          disabled={!isLoggedIn}
          title={!isLoggedIn ? "Login to comment" : "Add comment"}
        >
          <FontAwesomeIcon icon={faComment} />
          <span className="ms-1">{post.comments}</span>
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => onShare(post)}
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

          {isLoggedIn && (
            <div className="add-comment mt-3">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  size="sm"
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  onClick={() => onAddComment(post.id, commentText)}
                  disabled={!commentText.trim()}
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
};

export default CommunityPost;