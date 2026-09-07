'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState('general');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch channels and initial messages from Supabase
  const fetchChannelsAndMessages = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // 1. Fetch all channels
      const { data: channelsData, error: chanError } = await supabase
        .from('chat_channels')
        .select('*')
        .order('created_at', { ascending: true });

      if (chanError) throw chanError;

      // 2. Fetch all messages
      const { data: messagesData, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      // Combine messages into channels
      const structuredChannels = (channelsData || []).map((chan) => {
        const chanMessages = (messagesData || [])
          .filter((m) => m.channel_id === chan.id)
          .map((m) => ({
            id: m.id,
            sender_id: m.sender_id,
            sender_name: m.sender_name,
            sender_avatar: m.sender_avatar || '',
            text: m.text,
            is_internal_note: m.is_internal_note,
            time: new Date(m.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));

        return {
          ...chan,
          messages: chanMessages,
        };
      });

      setChannels(structuredChannels);
      if (structuredChannels.length > 0 && !activeChannelId) {
        setActiveChannelId(structuredChannels[0].id);
      }
    } catch (err) {
      console.error('Failed to load chat channels/messages from Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, [activeChannelId]);

  useEffect(() => {
    fetchChannelsAndMessages();
  }, [fetchChannelsAndMessages]);

  // Realtime Supabase Subscription for chat_messages
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channelSubscription = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMsg = payload.new;
          if (!newMsg) return;

          setChannels((prev) =>
            prev.map((c) =>
              c.id === newMsg.channel_id
                ? {
                    ...c,
                    last_message: newMsg.text,
                    last_time: new Date(newMsg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    messages: [
                      ...(c.messages || []),
                      {
                        id: newMsg.id,
                        sender_id: newMsg.sender_id,
                        sender_name: newMsg.sender_name,
                        sender_avatar: newMsg.sender_avatar || '',
                        text: newMsg.text,
                        is_internal_note: newMsg.is_internal_note,
                        time: new Date(newMsg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        }),
                      },
                    ],
                  }
                : c
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSubscription);
    };
  }, []);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0] || null;

  const sendMessage = async (text, isInternalNote = false) => {
    if (!text?.trim() || !activeChannelId) return;

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = 'msg-' + Date.now();
    const newMsg = {
      id: msgId,
      sender_id: 'usr-admin',
      sender_name: 'Super Admin',
      sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      text: text.trim(),
      is_internal_note: isInternalNote,
      time: formattedTime,
    };

    // Optimistic local update
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

    // Push to Supabase table
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('chat_messages').insert({
          id: msgId,
          channel_id: activeChannelId,
          sender_id: newMsg.sender_id,
          sender_name: newMsg.sender_name,
          sender_avatar: newMsg.sender_avatar,
          text: newMsg.text,
          is_internal_note: newMsg.is_internal_note,
        });

        await supabase.from('chat_channels').update({
          last_message: newMsg.text,
          last_time: newMsg.time,
          updated_at: new Date().toISOString(),
        }).eq('id', activeChannelId);
      } catch (err) {
        console.warn('Failed to push message to Supabase:', err.message);
      }
    }
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
        loading,
        sendMessage,
        openChatWithChannel,
        refreshChat: fetchChannelsAndMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
