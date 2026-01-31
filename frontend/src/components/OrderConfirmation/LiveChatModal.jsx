import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

const LiveChatModal = ({ show, onHide }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "support",
      message: "Hello! How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Simulate auto-reply after 1 second
    setTimeout(() => {
      const autoReply = {
        id: messages.length + 2,
        sender: "support",
        message:
          "Thanks for your message. Our support team will review your query and get back to you shortly.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1000);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faComment} className="me-2" />
          Live Chat Support
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="chat-container" style={{ height: "400px", overflowY: "auto" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === "user" ? "message-user" : "message-support"}`}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: msg.sender === "user" ? "#007bff" : "#e9ecef",
                  color: msg.sender === "user" ? "white" : "black",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  display: "inline-block",
                  maxWidth: "70%",
                }}
              >
                {msg.message}
              </div>
              <div className="text-muted small mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
        <Form onSubmit={handleSendMessage} className="mt-3">
          <div className="input-group">
            <Form.Control
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <Button variant="primary" type="submit">
              Send
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LiveChatModal;