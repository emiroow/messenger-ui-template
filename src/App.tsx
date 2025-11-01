import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ChatLayout } from "./components/layouts/ChatLayout";
import { conversations, messagesByConversation } from "./data/mock";
import { useIsDesktop } from "./hooks/useIsDesktop";
import ChatPage from "./pages/ChatPage";
import ChatsPage from "./pages/ChatsPage";
import ProfilePage from "./pages/ProfilePage";

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/chats"
          element={
            <motion.div
              initial={{ x: -24, opacity: 0.6, scale: 0.995 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            >
              <ChatsPage />
            </motion.div>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <motion.div
              initial={{ x: 24, opacity: 0.6, scale: 0.995 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            >
              <ChatPage />
            </motion.div>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <motion.div
              initial={{ y: 24, opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            >
              <ProfilePage />
            </motion.div>
          }
        />
        <Route path="/" element={<Navigate to="/chats" replace />} />
        <Route path="*" element={<Navigate to="/chats" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return (
      <Routes>
        <Route
          path="/chat/:id"
          element={
            <ChatLayout
              conversations={conversations}
              messagesByConversation={messagesByConversation}
            />
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={`/chat/${conversations[0]?.id ?? "1"}`} replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  return <AnimatedRoutes />;
}

export default App;
