import React, { createContext, useContext, useState } from 'react';
import { mockChatChannels, mockCurrentUser } from '../services/mockData';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [channels, setChannels] = useState(mockChatChannels || []);
  const [activeChannelId, setActiveChannelId] = useState(mockChatChannels?.[0]?.id || 'general');
  const [isOpen, setIsOpen] = useState(false);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0] || null;

  const sendMessage = (text, isInternalNote = false) => {
    if (!text.trim() || !activeChannelId) return;

    const newMsg = {
      id: 'msg-' + Date.now(),
      sender_id: mockCurrentUser?.uuid || 'usr-admin',
      sender_name: mockCurrentUser?.name || 'Operator',
      sender_avatar: mockCurrentUser?.avatar_url || '',
      text: text.trim(),
      is_internal_note: isInternalNote,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeChannelId
          ? {
              ...c,
              last_message: text.trim(),
              last_time: newMsg.time,
              messages: [...(c.messages || []), newMsg],
            }
          : c
      )
    );
  };

  const openChatWithChannel = (channelId) => {
    setActiveChannelId(channelId);
    setIsOpen(true);
  };

  return (
    <ChatContext.Provider
      value={{
        channels,
        activeChannel,
        activeChannelId,
        setActiveChannelId,
        isOpen,
        setIsOpen,
        sendMessage,
        openChatWithChannel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
