"use client";

import { ReactNode, useCallback, useContext, useState } from "react";
import React, { createContext } from "react";

interface ChatContextType {
  isOpen: boolean | undefined;
  toggleChat: (newOpen: boolean) => void | undefined;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
    console.log(newOpen, isOpen);
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("Must be used within ChatProvider");
  return context;
}
