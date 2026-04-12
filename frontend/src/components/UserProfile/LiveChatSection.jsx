import React from "react";
import { Button, Card } from "react-bootstrap";
import LiveChatThreadList from "../LiveChat/LiveChatThreadList";

const LiveChatSection = ({ threads, onBack, onSendMessage }) => {
  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h4 className="mb-1">Live Chat</h4>
            <p className="text-muted mb-0">
              View the active conversation with support and continue the thread here.
            </p>
          </div>
          <Button variant="outline-secondary" onClick={onBack}>
            Back to Overview
          </Button>
        </div>

        <LiveChatThreadList
          title=""
          description=""
          threads={threads}
          emptyTitle="No live chat threads yet"
          emptyDescription="Open live chat from order confirmation to start a conversation."
          currentRole="user"
          onSendMessage={onSendMessage}
          sendButtonLabel="Send"
        />
      </Card.Body>
    </Card>
  );
};

export default LiveChatSection;