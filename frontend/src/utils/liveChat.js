const LIVE_CHAT_STORAGE_KEY = "liveChatThreads";
const LIVE_CHAT_UPDATED_EVENT = "live-chat-updated";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const emitLiveChatUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LIVE_CHAT_UPDATED_EVENT));
};

const readThreads = () => {
  if (typeof window === "undefined") return [];
  const stored = safeParse(localStorage.getItem(LIVE_CHAT_STORAGE_KEY), []);
  return Array.isArray(stored) ? stored : [];
};

const writeThreads = (threads) => {
  if (typeof window === "undefined") return threads;
  localStorage.setItem(LIVE_CHAT_STORAGE_KEY, JSON.stringify(threads));
  emitLiveChatUpdated();
  return threads;
};

export const getLiveChatUpdatedEventName = () => LIVE_CHAT_UPDATED_EVENT;

export const getLiveChatThreadKey = (orderId, userId) =>
  `CHAT-${orderId ?? "unknown"}-${userId ?? "unknown"}`;

export const normalizeLiveChatThread = (thread) => ({
  ...thread,
  messages: Array.isArray(thread?.messages) ? thread.messages : [],
});

export const getLiveChatThreads = () => readThreads().map(normalizeLiveChatThread);

export const getLiveChatThread = (orderId, userId) =>
  getLiveChatThreads().find(
    (thread) => String(thread.orderId) === String(orderId) && String(thread.userId) === String(userId),
  ) || null;

export const getLiveChatThreadsForUser = (userId) =>
  getLiveChatThreads()
    .filter((thread) => String(thread.userId) === String(userId))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

export const getUnreadLiveChatThreadCount = () =>
  getLiveChatThreads().filter((thread) => thread.messages[thread.messages.length - 1]?.senderRole === "user").length;

export const ensureLiveChatThread = ({ order, user }) => {
  if (!order || !user) return null;

  const orderId = order.id;
  const userId = user.id;
  const existing = getLiveChatThread(orderId, userId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const thread = normalizeLiveChatThread({
    id: getLiveChatThreadKey(orderId, userId),
    orderId,
    orderNumber: order.orderNumber || order.id,
    userId,
    userName: user.name || user.fullName || user.username || "User",
    userEmail: user.email || "",
    status: "Open",
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        senderRole: "system",
        senderName: "Support Team",
        message: "Live chat is now open. A support agent will reply shortly.",
        createdAt: now,
      },
    ],
  });

  writeThreads([thread, ...getLiveChatThreads()]);
  return thread;
};

export const sendLiveChatMessage = ({ order, user, senderRole, senderName, message }) => {
  if (!order || !user || !message?.trim()) return null;

  const orderId = order.id;
  const userId = user.id;
  const now = new Date().toISOString();
  const nextMessage = {
    id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    senderRole,
    senderName,
    message: message.trim(),
    createdAt: now,
  };

  const threads = getLiveChatThreads();
  const index = threads.findIndex(
    (thread) => String(thread.orderId) === String(orderId) && String(thread.userId) === String(userId),
  );

  if (index === -1) {
    const thread = normalizeLiveChatThread({
      id: getLiveChatThreadKey(orderId, userId),
      orderId,
      orderNumber: order.orderNumber || order.id,
      userId,
      userName: user.name || user.fullName || user.username || "User",
      userEmail: user.email || "",
      status: "Open",
      createdAt: now,
      updatedAt: now,
      messages: [nextMessage],
    });
    writeThreads([thread, ...threads]);
    return thread;
  }

  const nextThreads = threads.map((thread, threadIndex) =>
    threadIndex === index
      ? {
          ...thread,
          updatedAt: now,
          status: "Open",
          messages: [...thread.messages, nextMessage],
        }
      : thread,
  );

  writeThreads(nextThreads);
  return nextMessage;
};

export const resolveLiveChatThread = ({ order, user }) => {
  if (!order || !user) return null;
  return ensureLiveChatThread({ order, user });
};