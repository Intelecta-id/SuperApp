'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { ApiProvider } from '../contexts/ApiContext';
import { ChatProvider } from '../contexts/ChatContext';
import ToastContainer from '../components/layout/ToastContainer';
import FloatingChatDrawer from '../components/chat/FloatingChatDrawer';

export default function Providers({ children }) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ApiProvider>
          <ChatProvider>
            {children}
            <ToastContainer />
            <FloatingChatDrawer />
          </ChatProvider>
        </ApiProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
