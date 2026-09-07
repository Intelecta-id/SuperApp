'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Hash,
  Lock,
  MessageSquare,
} from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';

export const FloatingChatDrawer = () => {
  const { channels, activeChannel, activeChannelId, setActiveChannelId, isOpen, setIsOpen, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, activeChannel?.messages]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText, isInternalNote);
    setInputText('');
  };

  return (
    <aside className="fixed bottom-0 right-0 w-96 h-[85vh] bg-coal-900 border-l border-t border-coal-600 rounded-none shadow-2xl z-40 flex flex-col overflow-hidden backdrop-blur-2xl">
      {/* Drawer Header */}
      <div className="p-3.5 border-b border-coal-700 bg-coal-850 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-none bg-coal-800 border border-coal-600 text-lightgray-100">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-semibold text-xs text-lightgray-100">Realtime Channel Ops</h3>
              <span className="w-2 h-2 rounded-none bg-lightgray-200"></span>
            </div>
            <p className="text-[10px] text-coal-400 font-mono">Supabase Realtime Channel</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-none hover:bg-coal-800 text-coal-400 hover:text-lightgray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Channel Switcher Pills */}
      <div className="p-2 border-b border-coal-700 bg-coal-950 flex gap-1.5 overflow-x-auto custom-scrollbar">
        {(channels || []).map((channel) => {
          const isActive = channel.id === activeChannelId;
          return (
            <button
              key={channel.id}
              onClick={() => setActiveChannelId(channel.id)}
              className={`px-2.5 py-1 rounded-none text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-coal-800 text-lightgray-100 border border-coal-600 shadow-sm'
                  : 'text-coal-400 hover:text-lightgray-200 hover:bg-coal-900 border border-transparent'
              }`}
            >
              <Hash className="w-3 h-3 text-coal-400" />
              <span>{channel.name}</span>
              {channel.unread_count > 0 && (
                <span className="w-1.5 h-1.5 rounded-none bg-lightgray-200"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-coal-900">
        {(!activeChannel?.messages || activeChannel.messages.length === 0) && (
          <div className="text-center py-12 text-xs text-coal-400 font-mono">
            Belum ada pesan di channel ini.
          </div>
        )}
        {activeChannel?.messages?.map((msg) => {
          const isNote = msg.is_internal_note;
          return (
            <div
              key={msg.id}
              className={`p-3 rounded-none border transition-colors ${
                isNote
                  ? 'bg-coal-950 border-coal-600 text-lightgray-200'
                  : 'bg-coal-850 border-coal-700 text-lightgray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {msg.sender_avatar ? (
                    <img
                      src={msg.sender_avatar}
                      alt={msg.sender_name}
                      className="w-5 h-5 rounded-none object-cover border border-coal-600"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-none bg-coal-800 border border-coal-600 text-[10px] flex items-center justify-center font-bold text-lightgray-100">
                      {msg.sender_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-lightgray-100">{msg.sender_name}</span>
                  {isNote && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-none bg-coal-800 border border-coal-600 text-lightgray-300 font-mono flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Internal Note
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-coal-400 font-mono">{msg.time}</span>
              </div>
              <p className="text-xs leading-relaxed text-lightgray-300 font-sans">{msg.text}</p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Internal Note Toggle Bar */}
      <div className="px-3 py-1.5 bg-coal-950 border-t border-coal-700 flex items-center justify-between text-[11px]">
        <button
          type="button"
          onClick={() => setIsInternalNote(!isInternalNote)}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-none transition-colors border ${
            isInternalNote
              ? 'bg-coal-800 border-coal-600 text-lightgray-100 font-medium'
              : 'text-coal-400 hover:text-lightgray-200 border-transparent'
          }`}
        >
          <Lock className="w-3 h-3" />
          <span>{isInternalNote ? 'Mode: Catatan Internal (Tim)' : 'Pesan Publik Channel'}</span>
        </button>
        <span className="text-[10px] font-mono text-coal-400">Supabase Sync</span>
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-coal-850 border-t border-coal-700 flex items-center gap-2">
        <input
          type="text"
          placeholder={isInternalNote ? 'Tulis catatan internal untuk tim...' : 'Ketik pesan ke channel...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3 py-2 rounded-none text-xs outline-none border bg-coal-900 border-coal-700 text-lightgray-100 placeholder-coal-400 focus:border-coal-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-none bg-lightgray-100 hover:bg-white text-coal-950 disabled:opacity-30 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
};

export default FloatingChatDrawer;
