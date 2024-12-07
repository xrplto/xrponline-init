'use client';

import React, { useState, useEffect } from 'react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import UsernamePrompt from './UsernamePrompt';

interface ChatMessage {
  text: string;
  username: string;
  timestamp: number;
  ogImage?: string;
  ogTitle?: string;
  recipient?: string;
  isPrivate?: boolean;
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

interface GifResult {
  url: string;
  preview: string;
}

interface TenorResult {
  media_formats: {
    gif: {
      url: string;
    };
    tinygif: {
      url: string;
    };
  };
}

const urlRegex = /(https?:\/\/[^\s]+)/g;

const isXLink = (url: string): boolean => {
  return url.match(/(?:x\.com|twitter\.com)/i) !== null;
};

const renderUsername = (message: ChatMessage, currentUser: string) => {
  if (message.isPrivate) {
    return message.username === currentUser
      ? `You → ${message.recipient}`
      : `${message.username} → You`;
  }
  return message.username === currentUser ? 'You' : message.username;
};

const renderMessageWithLinks = (message: ChatMessage) => {
  const { text, ogImage, ogTitle, isPrivate } = message;

  const gifMatch = text.match(/^\[GIF\]\((.*)\)$/);
  if (gifMatch) {
    return <img src={gifMatch[1]} alt="GIF" className="max-w-[100px] max-h-[100px] rounded object-contain" />;
  }

  const parts = text.split(urlRegex);
  return (
    <div>
      {isPrivate && (
        <span className="text-xs italic mr-2">[Private] </span>
      )}
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <div key={i} className="link-preview">
              <div className="flex items-center gap-2">
                <a
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {part}
                </a>
                {isXLink(part) && (
                  <button
                    onClick={() => window.open(part, '_blank')}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Raid 🚀
                  </button>
                )}
              </div>
              {ogImage && (
                <div className="mt-2 link-preview-card border rounded overflow-hidden max-w-[80px]">
                  <img src={ogImage} alt={ogTitle || 'Link preview'} className="w-full h-auto" />
                  {ogTitle && <div className="p-1 text-[10px] font-medium truncate">{ogTitle}</div>}
                </div>
              )}
            </div>
          );
        }
        return part;
      })}
    </div>
  );
};

const getUserStatus = (lastSeen: number): 'online' | 'inactive' | 'offline' => {
  const timeDiff = Date.now() - lastSeen;
  if (timeDiff < 10000) { // Within 10 seconds
    return 'online';
  } else if (timeDiff < 60000) { // Within 1 minute
    return 'inactive';
  }
  return 'offline';
};

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState<string>('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifResults, setGifResults] = useState<GifResult[]>([]);
  const [gifSearchTerm, setGifSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

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
      const urls = inputMessage.match(urlRegex);
      let ogData = {};

      if (urls) {
        try {
          const response = await fetch('/api/og', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: urls[0] }),
          });
          ogData = await response.json();
        } catch (error) {
          console.error('Failed to fetch OG data:', error);
        }
      }

      const newMessage: ChatMessage = {
        text: inputMessage,
        username: username,
        timestamp: Date.now(),
        ...ogData,
        recipient: selectedUser || undefined,
        isPrivate: selectedUser ? true : false
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
      // Check if target exists and is an Element
      const target = event.target as Element;
      if (!target) return;

      if (
        !target.closest('.emoji-picker-container') &&
        !target.closest('.emoji-button') &&
        !target.closest('.gif-picker-container') &&
        !target.closest('.gif-button')
      ) {
        setShowEmojiPicker(false);
        setShowGifPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchGifs = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
          searchTerm
        )}&limit=20&key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ`
      );
      const data = await response.json();
      const results = data.results.map((item: TenorResult) => ({
        url: item.media_formats.gif.url,
        preview: item.media_formats.tinygif.url,
      }));
      setGifResults(results);
    } catch (error) {
      console.error('Failed to fetch GIFs:', error);
    }
  };

  const handleGifSelect = async (gifUrl: string) => {
    const newMessage: ChatMessage = {
      text: `[GIF](${gifUrl})`,
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
      setShowGifPicker(false);
    } catch (error) {
      console.error('Failed to send GIF:', error);
    }
  };

  if (!isUsernameSet) {
    return (
      <UsernamePrompt
        username={username}
        setUsername={setUsername}
        handleUsernameSubmit={handleUsernameSubmit}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Main content area */}
      <div className="flex-1 p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-0 h-full">
          {/* Chat messages */}
          <div className="flex-1 flex flex-col bg-white border border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] p-4 overflow-y-auto">
            {messages.filter(message =>
              !message.isPrivate ||
              message.username === username ||
              message.recipient === username
            ).map((message, index) => (
              <div
                key={index}
                className={`py-4 px-5 rounded mb-4 max-w-[92%] text-[18px] leading-relaxed ${
                  message.isPrivate
                    ? message.username === username
                      ? 'bg-pink-500 text-white self-end'
                      : 'bg-pink-400 border border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] self-start'
                    : message.username === username
                      ? 'bg-[#000080] text-white self-end'
                      : 'bg-[#c0c0c0] border border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] self-start'
                }`}
              >
                <div className="text-[16px] font-bold mb-2.5">
                  {renderUsername(message, username)}
                </div>
                <div className="break-words">
                  {renderMessageWithLinks(message)}
                </div>
              </div>
            ))}
          </div>

          {/* Online Users - improved mobile view */}
          <div className="w-full md:w-32 bg-white border border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] p-1 h-[120px] md:h-auto overflow-y-auto shrink-0">
            <div className="font-bold text-[10px] mb-1 border-b pb-1">
              Online Users ({onlineUsers.length})
            </div>
            <div className="flex flex-wrap md:block gap-1">
              {onlineUsers.map((user) => {
                const status = getUserStatus(user.lastSeen);
                const isCurrentUser = user.username === username;
                return (
                  <div
                    key={user.username}
                    className={`text-[10px] py-1 px-2 mb-1 mr-1 md:mr-0 border border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] cursor-pointer hover:bg-[#a0a0a0] transition-colors ${
                      selectedUser === user.username ? 'bg-[#000080] text-white' : 
                      isCurrentUser ? 'bg-[#008000] text-white' : 'bg-[#c0c0c0]'
                    }`}
                    onClick={() => !isCurrentUser && setSelectedUser(user.username === selectedUser ? null : user.username)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{user.username}{isCurrentUser ? ' (You)' : ''}</span>
                      <span className="flex items-center">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          status === 'online' ? 'bg-green-500' :
                          status === 'inactive' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`} />
                      </span>
                      {selectedUser === user.username && ' (DM)'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chat input section - improved sizing */}
      <div className="p-1 bg-white border-t border-gray-200">
        <div className="flex flex-col relative">
          {selectedUser && (
            <div className="text-[10px] mb-1 text-gray-600">
              Messaging {selectedUser} privately
              <button
                onClick={() => setSelectedUser(null)}
                className="ml-1 text-[10px] text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}

          {/* Message input */}
          <div className="flex flex-wrap gap-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 min-w-[200px] px-2 py-1 text-[11px] bg-white border border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] focus:outline-none h-6"
            />

            {/* Button group */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="emoji-button bg-[#c0c0c0] text-black px-2 h-6 text-[11px] border border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] active:border-[#0a0a0a] active:border-l-[#0a0a0a] active:border-t-[#0a0a0a] hover:bg-[#d4d4d4]"
              >
                😊
              </button>
              <button
                onClick={() => setShowGifPicker(!showGifPicker)}
                className="gif-button bg-[#c0c0c0] text-black px-2 h-6 text-[11px] border border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] active:border-[#0a0a0a] active:border-l-[#0a0a0a] active:border-t-[#0a0a0a] hover:bg-[#d4d4d4]"
              >
                GIF
              </button>
              <button
                onClick={handleSend}
                className="bg-[#c0c0c0] text-black px-2 h-6 text-[11px] border border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] active:border-[#0a0a0a] active:border-l-[#0a0a0a] active:border-t-[#0a0a0a] hover:bg-[#d4d4d4]"
              >
                Send
              </button>
              <button
                onClick={clearChat}
                className="bg-[#c0c0c0] text-black px-2 h-6 text-[11px] border border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] active:border-[#0a0a0a] active:border-l-[#0a0a0a] active:border-t-[#0a0a0a] hover:bg-[#d4d4d4]"
              >
                Clear
              </button>
            </div>
          </div>

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

          {showGifPicker && (
            <div className="gif-picker-container absolute bottom-full right-0 mb-2 bg-white border-[2px] border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] p-2 w-[320px] max-w-full">
              <input
                type="text"
                value={gifSearchTerm}
                onChange={(e) => {
                  setGifSearchTerm(e.target.value);
                  searchGifs(e.target.value);
                }}
                placeholder="Search GIFs..."
                className="w-full p-2 mb-2 bg-white border-[2px] border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                {gifResults.map((gif, index) => (
                  <img
                    key={index}
                    src={gif.preview}
                    alt="GIF"
                    className="w-full cursor-pointer hover:opacity-80"
                    onClick={() => handleGifSelect(gif.url)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 