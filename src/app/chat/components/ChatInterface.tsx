'use client';

import React, { useState, useEffect } from 'react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface ChatMessage {
  text: string;
  username: string;
  timestamp: number;
}

interface OnlineUser {
  username: string;
  lastSeen: number;
}

interface EmojiMartData {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
}

interface ChatInterfaceProps {
  onClose?: () => void;
}

export default function ChatInterface({ onClose }: ChatInterfaceProps = {}) {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState<string>('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  // Replace SSE with polling
  useEffect(() => {
    if (!isUsernameSet) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    // Fetch messages immediately
    fetchMessages();

    // Set up polling interval
    const intervalId = setInterval(fetchMessages, 1000);

    return () => clearInterval(intervalId);
  }, [isUsernameSet]);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('chatUsername');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsUsernameSet(true);
    }
  }, []);

  useEffect(() => {
    if (!isUsernameSet) return;

    const updateOnlineStatus = async () => {
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, timestamp: Date.now() }),
        });

        const response = await fetch('/api/users');
        const users = await response.json();
        setOnlineUsers(users);
      } catch (error) {
        console.error('Failed to update online status:', error);
      }
    };

    updateOnlineStatus();
    const intervalId = setInterval(updateOnlineStatus, 5000);

    return () => clearInterval(intervalId);
  }, [isUsernameSet, username]);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      sessionStorage.setItem('chatUsername', username);
      setIsUsernameSet(true);
    }
  };

  const handleSend = async () => {
    if (inputMessage.trim()) {
      const newMessage: ChatMessage = {
        text: inputMessage,
        username: username,
        timestamp: Date.now()
      };

      try {
        await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        });

        setInputMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Update clearChat function to use the API
  const clearChat = async () => {
    try {
      await fetch('/api/chat', {
        method: 'DELETE',
      });
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  const onEmojiClick = (emoji: EmojiMartData) => {
    setInputMessage(prevInput => prevInput + emoji.native);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.emoji-picker-container') && !target.closest('.emoji-button')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!isUsernameSet) {
    return (
      <div className="w-full max-w-4xl bg-[#c0c0c0] border-[3px] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_grey,inset_2px_2px_#fff] p-1">
        <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between mb-1">
          <span className="text-sm font-bold">Welcome to Chat</span>
          <button 
            onClick={handleClose}
            className="w-5 h-5 bg-[#c0c0c0] border-[2px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] text-xs flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          <form onSubmit={handleUsernameSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              className="p-2 bg-white border-[2px] border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#c0c0c0] text-black px-4 py-2 border-[2px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] active:border-[#0a0a0a] active:border-l-[#0a0a0a] active:border-t-[#0a0a0a] hover:bg-[#d4d4d4]"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl bg-[#c0c0c0] border-[3px] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_grey,inset_2px_2px_#fff] p-1">
        <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between mb-1">
          <span className="text-sm font-bold">Chat Window - {username}</span>
          <div className="flex gap-1">
            <button
              onClick={clearChat}
              className="text-xs bg-[#c0c0c0] text-black px-2 border-[1px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a]"
            >
              Clear Chat
            </button>
            <button className="w-5 h-5 bg-[#c0c0c0] border-[2px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] text-xs flex items-center justify-center">_</button>
            <button className="w-5 h-5 bg-[#c0c0c0] border-[2px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] text-xs flex items-center justify-center">□</button>
            <button 
              onClick={handleClose}
              className="w-5 h-5 bg-[#c0c0c0] border-[2px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 p-4">
          <div className="flex gap-4">
            {/* Chat messages */}
            <div className="flex-1 flex flex-col space-y-2 bg-white border-[2px] border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] p-2 h-[400px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-none max-w-[80%] ${message.username === username
                    ? 'bg-[#000080] text-white self-end'
                    : 'bg-[#c0c0c0] border-[2px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] self-start'
                    }`}
                >
                  <div className="text-xs mb-1 font-bold">
                    {message.username === username ? 'You' : message.username}
                  </div>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>

            {/* Online Users */}
            <div className="w-56 bg-white border-[2px] border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] p-2 h-[400px] overflow-y-auto">
              <div className="font-bold mb-2">Online Users</div>
              {onlineUsers.map((user) => (
                <div
                  key={user.username}
                  className="text-sm py-1 px-2 mb-1 bg-[#c0c0c0] border-[1px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a]"
                >
                  {user.username}
                </div>
              ))}
            </div>
          </div>

          {/* Chat input */}
          <div className="mt-4 flex gap-2 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-2 bg-white border-[2px] border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] focus:outline-none"
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="emoji-button bg-[#c0c0c0] text-black px-4 py-2 border-[2px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] active:border-[#0a0a0a] active:border-l-[#0a0a0a] active:border-t-[#0a0a0a] hover:bg-[#d4d4d4]"
            >
              😊
            </button>
            <button
              onClick={handleSend}
              className="bg-[#c0c0c0] text-black px-4 py-2 border-[2px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] active:border-[#0a0a0a] active:border-l-[#0a0a0a] active:border-t-[#0a0a0a] hover:bg-[#d4d4d4]"
            >
              Send
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-container absolute bottom-full right-0 mb-2">
                <Picker 
                  data={data} 
                  onEmojiSelect={onEmojiClick}
                  theme="light"
                  set="native"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 