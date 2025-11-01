import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageInput } from "../components/chat/MessageInput";
import { MessageList } from "../components/chat/MessageList";
import {
  conversations,
  currentUserId,
  messagesByConversation,
  type Message,
} from "../data/mock";

export const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const active = useMemo(() => {
    const targetId = id || conversations[0]?.id;
    return conversations.find((c) => c.id === targetId) || conversations[0];
  }, [id]);

  const [messagesMap, setMessagesMap] = useState(messagesByConversation);
  const messages = messagesMap[active.id] ?? [];

  const handleSend = (text: string) => {
    const msg: Message = {
      id: Math.random().toString(36).slice(2),
      userId: currentUserId,
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessagesMap((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), msg],
    }));
  };

  return (
    <div className="chat-wallpaper flex h-dvh w-full flex-col bg-(--bg) text-(--text)">
      <ChatHeader
        name={active.name}
        avatar={active.avatar}
        subtitle={active.online ? "Online" : "Last seen recently"}
        onOpenSidebar={() => navigate("/chats")}
        onOpenProfile={() => navigate(`/profile/${active.id}`)}
      />
      <MessageList messages={messages} name={active.name} />
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatPage;
