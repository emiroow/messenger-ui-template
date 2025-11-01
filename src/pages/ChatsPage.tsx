import React from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/chat/Sidebar";
import { conversations as defaultConversations } from "../data/mock";

export const ChatsPage: React.FC<{
  conversations?: typeof defaultConversations;
}> = ({ conversations = defaultConversations }) => {
  const navigate = useNavigate();
  return (
    <div className="flex h-dvh w-full bg-(--bg) text-(--text)">
      <Sidebar
        items={conversations}
        onSelect={(id) => navigate(`/chat/${id}`)}
      />
    </div>
  );
};

export default ChatsPage;
