import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Hash,
  Paperclip,
  Smile,
  Lock,
  MessageSquare,
  Sparkles,
  ChevronDown,
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
    <aside className="fixed bottom-0 right-0 w-96 h-[85vh] bg-[#0D0D11] border-l border-t border-white/10 rounded-tl-2xl shadow-2xl z-40 flex flex-col overflow-hidden backdrop-blur-2xl animate-slide-up">
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/5 bg-[#14141B] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-zinc-800 border border-white/10 text-white">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-semibold text-xs text-white">Realtime Operations Chat</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">Firebase Firestore Stream</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Channel Switcher Pills */}
      <div className="p-2 border-b border-white/5 bg-[#08080C] flex gap-1.5 overflow-x-auto custom-scrollbar">
        {channels.map((channel) => {
          const isActive = channel.id === activeChannelId;
          return (
            <button
              key={channel.id}
              onClick={() => setActiveChannelId(channel.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-zinc-800 text-white border border-white/10 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Hash className="w-3 h-3 text-zinc-400" />
              <span>{channel.name}</span>
              {channel.unread_count > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-[#09090D]">
        {activeChannel?.messages?.map((msg) => {
          const isNote = msg.is_internal_note;
          return (
            <div
              key={msg.id}
              className={`p-3 rounded-xl border transition-all ${
                isNote
                  ? 'bg-amber-950/20 border-amber-500/20 text-amber-100'
                  : 'bg-[#14141B] border-white/5 text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {msg.sender_avatar ? (
                    <img
                      src={msg.sender_avatar}
                      alt={msg.sender_name}
                      className="w-5 h-5 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center font-bold text-white">
                      {msg.sender_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-zinc-200">{msg.sender_name}</span>
                  {isNote && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Internal Note
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">{msg.time}</span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-300 font-sans">{msg.text}</p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Internal Note Toggle Bar */}
      <div className="px-3 py-1.5 bg-[#0D0D11] border-t border-white/5 flex items-center justify-between text-[11px]">
        <button
          type="button"
          onClick={() => setIsInternalNote(!isInternalNote)}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
            isInternalNote
              ? 'bg-amber-500/20 text-amber-300 font-medium'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          <Lock className="w-3 h-3" />
          <span>{isInternalNote ? 'Mode: Catatan Internal (Privat Tim)' : 'Pesan Publik Channel'}</span>
        </button>
        <span className="text-[10px] font-mono text-zinc-400">Shift + Enter for newline</span>
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-[#14141B] border-t border-white/5 flex items-center gap-2">
        <input
          type="text"
          placeholder={isInternalNote ? 'Tulis catatan internal untuk tim...' : 'Ketik pesan obrolan...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none border transition-colors ${
            isInternalNote
              ? 'bg-amber-950/20 border-amber-500/30 text-amber-100 placeholder-amber-400/50'
              : 'bg-[#0D0D11] border-white/10 text-zinc-100 placeholder-zinc-500 focus:border-white/25'
          }`}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 disabled:opacity-40 disabled:hover:bg-zinc-100 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
};

export default FloatingChatDrawer;
