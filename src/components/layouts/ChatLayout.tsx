import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  currentUserId,
  type Conversation,
  type Message,
} from "../../data/mock";
import { ChatHeader } from "../chat/ChatHeader";
import { MessageInput } from "../chat/MessageInput";
import { MessageList } from "../chat/MessageList";
import { ProfilePanel } from "../chat/ProfilePanel";
import { Sidebar } from "../chat/Sidebar";
import { IconX } from "../icons";
import { Button } from "../ui/button";

export const ChatLayout: React.FC<{
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
}> = ({ conversations, messagesByConversation }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const initialId = conversations[0]?.id ?? "";
  const activeId =
    id && conversations.some((c) => c.id === id) ? id : initialId;
  const [messagesMap, setMessagesMap] = useState(messagesByConversation);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(true);

  // Ensure URL always has a valid chat id
  useEffect(() => {
    if (!id || !conversations.some((c) => c.id === id)) {
      if (initialId) navigate(`/chat/${initialId}`, { replace: true });
    }
  }, [id, conversations, initialId, navigate]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) || conversations[0],
    [conversations, activeId]
  );

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
    <div className="relative flex h-dvh w-full bg-(--bg) text-(--text)">
      {/* Sidebar (left) fixed on md+, drawer on small */}
      <div className="hidden md:block">
        <Sidebar
          items={conversations}
          activeId={active.id}
          onSelect={(nextId) => navigate(`/chat/${nextId}`)}
        />
      </div>

      {/* Main chat (center) */}
      <div className={"chat-wallpaper flex min-w-0 flex-1 flex-col"}>
        <ChatHeader
          name={active.name}
          avatar={active.avatar}
          subtitle={active.online ? "Online" : "Last seen recently"}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenProfile={() => setProfileOpen((v) => !v)}
        />
        <MessageList messages={messages} name={active.name} />
        <MessageInput onSend={handleSend} />
      </div>

      {/* Reserve space when profile panel is open so header/buttons remain visible */}
      {profileOpen ? (
        <div className="hidden md:block w-80 shrink-0" aria-hidden />
      ) : null}

      {/* Desktop profile panel (animated toggle) */}
      <AnimatePresence>
        {profileOpen && (
          <motion.aside
            initial={{ x: 96, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute right-0 top-0 z-20 hidden h-full w-80 md:block"
          >
            <div className="relative h-full">
              <ProfilePanel
                name={active.name}
                avatar={active.avatar}
                handle={active.handle}
                userId={active.userId}
              />
              <div className="absolute right-2 top-2">
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Close profile"
                  onClick={() => setProfileOpen(false)}
                >
                  <IconX className="size-5" />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar Drawer (opens from left) with animation */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: -96 }}
              animate={{ x: 0 }}
              exit={{ x: -96 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="h-full w-80 bg-(--sidebar) shadow-xl border-r border-(--border)"
            >
              <Sidebar
                items={conversations}
                activeId={active.id}
                onSelect={(nextId) => {
                  navigate(`/chat/${nextId}`);
                  setSidebarOpen(false);
                }}
              />
            </motion.div>
            <motion.div
              className="flex-1 bg-black/40"
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <div className="absolute right-2 top-2">
              <Button
                variant="secondary"
                size="icon"
                aria-label="Close"
                onClick={() => setSidebarOpen(false)}
              >
                <IconX className="size-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
