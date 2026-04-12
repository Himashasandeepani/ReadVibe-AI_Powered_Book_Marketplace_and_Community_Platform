const SUPPORT_MESSAGES_STORAGE_KEY = "supportMessages";
const SUPPORT_MESSAGES_UPDATED_EVENT = "support-messages-updated";

const safeParse = (value, fallback) => {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const emitSupportMessagesUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SUPPORT_MESSAGES_UPDATED_EVENT));
};

export const getSupportMessages = () => {
  if (typeof window === "undefined") return [];
  const stored = safeParse(localStorage.getItem(SUPPORT_MESSAGES_STORAGE_KEY), []);
  return Array.isArray(stored) ? stored : [];
};

export const saveSupportMessages = (messages) => {
  if (typeof window === "undefined") return messages;
  localStorage.setItem(SUPPORT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  emitSupportMessagesUpdated();
  return messages;
};

export const createSupportMessage = ({ order, user, message, type = "support", source = "order-confirmation" }) => {
  if (!order || !user || !message?.trim()) return null;

  const now = new Date().toISOString();
  const nextMessage = {
    id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    orderId: order.id,
    orderNumber: order.orderNumber || order.id,
    userId: user.id,
    userName: user.name || user.fullName || user.username || "User",
    userEmail: user.email || "",
    subject: `Order ${order.orderNumber || order.id} support request`,
    message: message.trim(),
    type,
    source,
    status: "Open",
    createdAt: now,
    updatedAt: now,
    replies: [],
  };

  const messages = [nextMessage, ...getSupportMessages()];
  saveSupportMessages(messages);
  return nextMessage;
};

export const addSupportReply = (messageId, replyText, repliedBy = {}) => {
  if (!messageId || !replyText?.trim()) return null;

  const messages = getSupportMessages();
  const index = messages.findIndex((item) => item.id === messageId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const reply = {
    id: `REP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    senderRole: repliedBy.role || "stock",
    senderName: repliedBy.name || "Stock Manager",
    message: replyText.trim(),
    createdAt: now,
  };

  const nextMessages = messages.map((item, messageIndex) =>
    messageIndex === index
      ? {
          ...item,
          status: "Replied",
          updatedAt: now,
          replies: [...(item.replies || []), reply],
        }
      : item,
  );

  saveSupportMessages(nextMessages);
  return reply;
};

export const getSupportMessagesForUser = (userId) => {
  const normalizedUserId = String(userId ?? "");
  return getSupportMessages().filter((message) => String(message.userId) === normalizedUserId);
};

export const getUnreadSupportMessageCount = () =>
  getSupportMessages().filter((message) => message.status === "Open").length;

export const getSupportMessagesUpdatedEventName = () => SUPPORT_MESSAGES_UPDATED_EVENT;