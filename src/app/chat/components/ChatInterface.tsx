'use client';

import React, { useState, useEffect } from 'react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import UsernamePrompt from './UsernamePrompt';
import LatestBuys from './LatestBuys';

interface ChatMessage {
  id?: string;
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

interface ClickCounts {
  [url: string]: number;
}

type UserStatus = 'online' | 'inactive' | 'offline';

const urlRegex = /(https?:\/\/[^\s]+)/g;

const isXLink = (url: string): boolean => {
  return url.match(/(?:x\.com|twitter\.com)/i) !== null;
};

const renderUsername = (message: ChatMessage, currentUser: string) => {
  const isAdmin = message.username === 'XRPOnline';
  if (message.isPrivate) {
    return message.username === currentUser
      ? `You → ${message.recipient}`
      : `${message.username} → You`;
  }
  return (
    <span className="flex items-center gap-1">
      {message.username === currentUser ? 'You' : message.username}
      {isAdmin && (
        <span title="Admin" className="text-xs">
          👑
        </span>
      )}
    </span>
  );
};

const getUserStatus = (lastSeen: number): UserStatus => {
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
  const [clickCounts, setClickCounts] = useState<ClickCounts>({});
  const [showWarning, setShowWarning] = useState(false);

  const renderMessageWithLinks = (message: ChatMessage) => {
    const { text, ogImage, ogTitle, isPrivate } = message;

    const gifMatch = text.match(/^\[GIF\]\((.*)\)$/);
    if (gifMatch) {
      return <img src={gifMatch[1]} alt="GIF" className="max-w-[200px] max-h-[200px] rounded object-contain" />;
    }

    const handleRaidClick = async (url: string) => {
      try {
        const response = await fetch('/api/clicks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });
        const data = await response.json();
        
        setClickCounts(prev => ({
          ...prev,
          [url]: data.count
        }));
        
        window.open(url, '_blank');
      } catch (error) {
        console.error('Failed to track click:', error);
        window.open(url, '_blank');
      }
    };

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
                      onClick={() => handleRaidClick(part)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Raid 🚀 {clickCounts[part] ? `(${clickCounts[part]})` : ''}
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

  // Optimize message polling by increasing interval and adding error handling
  useEffect(() => {
    if (!isUsernameSet) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat');
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    // Fetch messages immediately
    fetchMessages();

    // Poll every 3 seconds instead of every second
    const intervalId = setInterval(fetchMessages, 3000);

    return () => clearInterval(intervalId);
  }, [isUsernameSet]);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('chatUsername');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsUsernameSet(true);
    }
  }, []);

  // Optimize online users polling
  useEffect(() => {
    if (!isUsernameSet) return;

    const updateOnlineStatus = async () => {
      try {
        // Batch these requests together
        const [updateResponse, usersResponse] = await Promise.all([
          fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, timestamp: Date.now() }),
          }),
          fetch('/api/users')
        ]);

        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const users = await usersResponse.json();
        setOnlineUsers(users);
      } catch (error) {
        console.error('Failed to update online status:', error);
      }
    };

    updateOnlineStatus();
    // Increase polling interval to 10 seconds
    const intervalId = setInterval(updateOnlineStatus, 10000);

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

  // Optimize click counts loading
  useEffect(() => {
    const loadClickCounts = async () => {
      // Extract unique X/Twitter URLs
      const uniqueUrls = [...new Set(
        messages
          .map(msg => msg.text.match(urlRegex))
          .flat()
          .filter((url): url is string => url !== null && isXLink(url))
      )];
      
      if (uniqueUrls.length === 0) return;

      try {
        // Batch all click count requests together
        const responses = await Promise.all(
          uniqueUrls.map(url => 
            fetch(`/api/clicks?url=${encodeURIComponent(url)}`)
              .then(res => res.json())
              .then(data => ({ url, count: data.count }))
          )
        );

        // Update all click counts at once
        const newClickCounts = responses.reduce((acc, { url, count }) => {
          acc[url] = count;
          return acc;
        }, {} as ClickCounts);

        setClickCounts(prev => ({
          ...prev,
          ...newClickCounts
        }));
      } catch (error) {
        console.error('Failed to load click counts:', error);
      }
    };

    loadClickCounts();
  }, [messages]); // Only run when messages change

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await fetch(`/api/chat?id=${messageId}`, {
        method: 'DELETE',
      });
      // Remove message from local state
      setMessages(prevMessages => 
        prevMessages.filter(message => message.id !== messageId)
      );
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  useEffect(() => {
    const showWarningMessage = () => {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000); // Hide after 5 seconds
    };

    // Show warning immediately on component mount
    showWarningMessage();
    
    // Show warning every 5 minutes
    const intervalId = setInterval(showWarningMessage, 300000);

    return () => clearInterval(intervalId);
  }, []);

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
      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-2 rounded shadow-lg max-w-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <p className="text-sm">
              Warning: Never share personal information, wallet seeds, or any identifying details in chat.
            </p>
            <button 
              onClick={() => setShowWarning(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Main content area */}
      <div className="flex-1 p-0 overflow-hidden">
        {/* Latest Buys Bar - New Position */}
        <div className="w-full bg-white mb-1">
          <LatestBuys />
        </div>
        
        <div className="flex flex-col md:flex-row gap-0 h-[calc(100%-40px)]">
          {/* Chat messages */}
          <div className="flex-1 flex flex-col bg-white border border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] p-4 overflow-y-auto">
            {messages.filter(message =>
              !message.isPrivate ||
              message.username === username ||
              message.recipient === username
            ).map((message, index) => (
              <div
                key={index}
                className={`py-4 px-5 rounded mb-4 max-w-[92%] text-[20px] leading-relaxed ${
                  message.isPrivate
                    ? message.username === username
                      ? 'bg-pink-500 text-white self-end'
                      : 'bg-pink-400 border border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] self-start'
                    : message.username === 'XRPOnline'
                      ? 'bg-rose-400 text-white self-start'
                      : message.username === username
                        ? 'bg-[#000080] text-white self-end'
                        : 'bg-[#c0c0c0] border border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a] self-start'
                }`}
              >
                <div className="text-[18px] font-bold mb-2.5 flex justify-between items-center">
                  <div>{renderUsername(message, username)}</div>
                  {username === 'XRPOnline' && message.id && (
                    <button
                      onClick={() => handleDeleteMessage(message.id!)}
                      className="text-xs hover:text-red-500 transition-colors"
                      title="Delete message"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <div className="break-words">
                  {renderMessageWithLinks(message)}
                </div>
              </div>
            ))}
          </div>

          {/* Online Users - improved mobile view */}
          <div className="w-full md:w-32 flex flex-col bg-white">
            <div className="border border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] p-1 h-[120px] md:h-auto overflow-y-auto shrink-0">
              <div className="font-bold text-[10px] mb-1 border-b pb-1">
                Online Users ({onlineUsers.length})
              </div>
              <div className="flex flex-wrap md:block gap-1">
                {onlineUsers.map((user) => {
                  const status = getUserStatus(user.lastSeen);
                  const isCurrentUser = user.username === username;
                  const isAdmin = user.username === 'XRPOnline';
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
                        {isAdmin && (
                          <span title="Admin" className="text-xs">
                            👑
                          </span>
                        )}
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