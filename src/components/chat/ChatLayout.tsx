import React, { useMemo, useState } from "react";
import type { Conversation, Message } from "../../data/mock";
import { IconX } from "../icons";
import { Button } from "../ui/button";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { ProfilePanel } from "./ProfilePanel";
import { Sidebar } from "./Sidebar";

export const ChatLayout: React.FC<{
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
}> = ({ conversations, messagesByConversation }) => {
  const [activeId, setActiveId] = useState<string>(conversations[0]?.id ?? "");
  const [messagesMap, setMessagesMap] = useState(messagesByConversation);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) || conversations[0],
    [conversations, activeId]
  );

  const messages = messagesMap[active.id] ?? [];

  const handleSend = (text: string) => {
    const msg: Message = {
      id: Math.random().toString(36).slice(2),
      content: text,
      timestamp: new Date().toISOString(),
    } as Message;
    setMessagesMap((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), msg],
    }));
  };

  return (
    <div className="flex h-dvh w-full bg-(--bg) text-(--text)">
      {/* Sidebar: static on md+, drawer on mobile */}
      <div className="hidden md:block">
        <Sidebar
          items={conversations}
          activeId={active.id}
          onSelect={setActiveId}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          name={active.name}
          avatar={active.avatar}
          subtitle={active.online ? "آنلاین" : "آخرین بازدید اخیرا"}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
        />
        <MessageList messages={messages} name={active.name} />
        <MessageInput onSend={handleSend} />
      </div>

      {/* Profile: static on lg+, drawer on smaller */}
      <div className="hidden lg:block">
        <ProfilePanel name={active.name} avatar={active.avatar} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="h-full w-80 bg-(--sidebar) shadow-xl">
            <Sidebar
              items={conversations}
              activeId={active.id}
              onSelect={(id) => {
                setActiveId(id);
                setSidebarOpen(false);
              }}
            />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-2 top-2">
            <Button
              variant="secondary"
              size="icon"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              <IconX className="size-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Profile Drawer (for < lg) */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1" onClick={() => setProfileOpen(false)} />
          <div className="h-full w-80 bg-(--panel) shadow-xl border-l border-(--border)">
            <ProfilePanel name={active.name} avatar={active.avatar} />
          </div>
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
      )}
    </div>
  );
};
