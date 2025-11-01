import { AnimatePresence, motion } from "framer-motion";
import React, { Fragment, useEffect, useRef } from "react";
import { currentUserId, type Message } from "../../data/mock";
import { ScrollArea } from "../ui/scroll-area";
import { MessageBubble } from "./MessageBubble";

export const MessageList: React.FC<{
  messages: Message[];
  name?: string;
}> = ({ messages, name }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 px-4 py-4">
      <div className="mx-auto max-w-3xl space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const day = new Date(m.timestamp).toDateString();
            const prevDay = prev
              ? new Date(prev.timestamp).toDateString()
              : null;
            const showDate = !prev || day !== prevDay;
            const author =
              m.userId === currentUserId ? "me" : ("them" as const);
            return (
              <Fragment key={m.id}>
                {showDate ? (
                  <motion.div
                    className="py-2 text-center text-xs opacity-70"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    {new Date(m.timestamp).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </motion.div>
                ) : null}
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                >
                  <MessageBubble
                    author={author}
                    content={m.content}
                    timestamp={m.timestamp}
                    name={author === "them" ? name : "Me"}
                    showAvatar={
                      author === "them" &&
                      (i === 0 || messages[i - 1].userId === currentUserId)
                    }
                  />
                </motion.div>
              </Fragment>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
