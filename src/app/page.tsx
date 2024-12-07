'use client';

import Image from "next/image";
import "./win98.css";
import Markets from './components/Markets';
import ChatInterface from './chat/components/ChatInterface';
import Minesweeper from './components/Minesweeper';
import { useState, MouseEvent, useEffect } from 'react';

const DEFAULT_BG_COLOR = '#008080';

const ensureHttps = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMarketsOpen, setIsMarketsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isMarketsMinimized, setIsMarketsMinimized] = useState(false);
  const [isHelpMinimized, setIsHelpMinimized] = useState(false);
  const [showConnectionInfo, setShowConnectionInfo] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsMinimized, setIsSettingsMinimized] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BG_COLOR);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isInternetOpen, setIsInternetOpen] = useState(false);
  const [isInternetMinimized, setIsInternetMinimized] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://xrpl.org/');
  const [urlInput, setUrlInput] = useState('https://xrpl.org/');
  const [isLoading, setIsLoading] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: '95%', height: '400px' });
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isMinesweeperOpen, setIsMinesweeperOpen] = useState(false);
  const [isMinesweeperMinimized, setIsMinesweeperMinimized] = useState(false);

  // Initialize background color from sessionStorage
  useEffect(() => {
    const savedColor = sessionStorage.getItem('desktop-background-color');
    if (savedColor) {
      setBackgroundColor(savedColor);
      document.documentElement.style.setProperty('--desktop-bg-color', savedColor);
    } else {
      document.documentElement.style.setProperty('--desktop-bg-color', DEFAULT_BG_COLOR);
    }
  }, []);

  // Update sessionStorage when backgroundColor changes
  useEffect(() => {
    sessionStorage.setItem('desktop-background-color', backgroundColor);
    document.documentElement.style.setProperty('--desktop-bg-color', backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="win98-desktop min-h-screen p-8 pb-20 gap-16 sm:p-20"
      style={{ backgroundColor: backgroundColor }}
    >
      <a
        href="https://firstledger.net/token/r3q4Hhc7pSc4rGNMc1mLkzQECW4bhTnPVp/5852504F6E6C696E650000000000000000000000#"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 left-4 flex flex-col items-center w-20 group hover:cursor-pointer"
      >
        <div className="w-12 h-12 mb-1">
          <Image
            src="/firstledger.png"
            alt="FirstLedger"
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-white text-xs text-center break-words bg-[#000080] group-hover:bg-[#000080]/80 px-1">
          FirstLedger
        </span>
      </a>

      <a
        href="https://x.com/xrponlinecto"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 left-28 flex flex-col items-center w-20 group hover:cursor-pointer"
      >
        <div className="w-12 h-12 mb-1">
          <Image
            src="/xlogo.png"
            alt="X (Twitter)"
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-white text-xs text-center break-words bg-[#000080] group-hover:bg-[#000080]/80 px-1">
          X (Twitter)
        </span>
      </a>

      <div className="absolute top-32 left-4 grid gap-6">
        <button
          onClick={() => setIsMarketsOpen(true)}
          className="flex flex-col items-center w-20 group hover:cursor-pointer"
        >
          <div className="w-12 h-12 mb-1">
            <Image
              src="/file.svg"
              alt="Markets"
              width={48}
              height={48}
              className="w-full h-full object-contain invert"
            />
          </div>
          <span className="text-white text-xs text-center break-words bg-[#000080] group-hover:bg-[#000080]/80 px-1">
            Markets
          </span>
        </button>

        <button
          onClick={() => setIsChatOpen(true)}
          className="flex flex-col items-center w-20 group hover:cursor-pointer"
        >
          <div className="w-12 h-12 mb-1">
            <Image
              src="/window.svg"
              alt="Chat Rooms"
              width={48}
              height={48}
              className="w-full h-full object-contain invert"
            />
          </div>
          <span className="text-white text-xs text-center break-words bg-[#000080] group-hover:bg-[#000080]/80 px-1">
            Chat Rooms
          </span>
        </button>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex flex-col items-center w-20 group hover:cursor-pointer"
        >
          <div className="w-12 h-12 mb-1">
            <Image
              src="/help.svg"
              alt="Help Center"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-white text-xs text-center break-words bg-[#000080] group-hover:bg-[#000080]/80 px-1">
            Help Center
          </span>
        </button>

        <button
          onClick={() => setIsInternetOpen(true)}
          className="flex flex-col items-center w-20 group hover:cursor-pointer"
        >
          <div className="w-12 h-12 mb-1">
            <Image
              src="/globe.svg"
              alt="Internet Explorer"
              width={48}
              height={48}
              className="w-full h-full object-contain invert"
            />
          </div>
          <span className="text-white text-xs text-center break-words bg-[#000080] group-hover:bg-[#000080]/80 px-1">
            Internet
          </span>
        </button>

        <button
          onClick={() => setIsMinesweeperOpen(true)}
          className="flex flex-col items-center w-20 group hover:cursor-pointer"
        >
          <div className="w-12 h-12 mb-1">
            <Image
              src="/minesweeper.svg"
              alt="Minesweeper"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-white text-xs text-center break-words bg-[#000080] group-hover:bg-[#000080]/80 px-1">
            Minesweeper
          </span>
        </button>
      </div>

      <div className="absolute top-4 right-4 win98-window" style={{ width: '300px' }}>
        <div className="win98-title-bar">
          <span>Welcome Note</span>
          <div className="flex gap-1">
            <button className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0">_</button>
            <button className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0">□</button>
            <button className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0">×</button>
          </div>
        </div>

        <div className="p-4 bg-[#ffffe1]">
          <div className="flex flex-col gap-4">
            <div className="text-lg font-bold text-[#1f3973]">XRPOnline v1.0</div>
            <div className="text-sm space-y-2">
              <h2 className="font-bold text-[#1f3973]">TODAY&apos;S FEATURES:</h2>
              <ol className="list-inside list-decimal space-y-2">
                <li>
                  Access chat and other utilities through{" "}
                  <code className="bg-[#ffffff] px-1 py-0.5 border border-[#808080]">
                    xrponline.chat
                  </code>
                </li>
                <li>Track real-time XRP prices and market updates</li>
                <li>Connect with the XRP community in our chat rooms</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {isChatOpen && !isChatMinimized && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsChatOpen(false);
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="relative w-[95%] max-w-4xl win98-window"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="win98-title-bar cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
            >
              <span>Chat Room</span>
              <div className="flex gap-1">
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => {
                    setIsChatMinimized(true);
                  }}
                >
                  _
                </button>
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => setIsChatOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="w-full bg-[#c0c0c0] border-[3px] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_grey,inset_2px_2px_#fff] p-1">
              <ChatInterface />
            </div>
          </div>
        </div>
      )}

      {isMarketsOpen && !isMarketsMinimized && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsMarketsOpen(false);
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="relative w-[95%] max-w-4xl win98-window"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="win98-title-bar cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
            >
              <span>Markets</span>
              <div className="flex gap-1">
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => {
                    setIsMarketsMinimized(true);
                  }}
                >
                  _
                </button>
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => setIsMarketsOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="w-full bg-white border-[3px] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_grey,inset_2px_2px_#fff] p-4">
              <Markets />
            </div>
          </div>
        </div>
      )}

      {isHelpOpen && !isHelpMinimized && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsHelpOpen(false);
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="relative w-[95%] max-w-4xl win98-window"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="win98-title-bar cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
            >
              <span>Help Center</span>
              <div className="flex gap-1">
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => {
                    setIsHelpMinimized(true);
                  }}
                >
                  _
                </button>
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => setIsHelpOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="w-full bg-[#c0c0c0] border-[3px] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_grey,inset_2px_2px_#fff] p-4">
              <div className="bg-white p-4 border-2 border-[#1f3973]">
                <h2 className="text-center font-bold mb-4 text-[#1f3973]">FREQUENTLY ASKED QUESTIONS</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-[#1f3973]">What is XRPOnline?</h3>
                    <p className="text-sm mt-1">XRPOnline is your retro-styled gateway to the world of digital assets, specifically focused on XRP.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1f3973]">How do I use the Chat Rooms?</h3>
                    <p className="text-sm mt-1">Click on the &quot;Chat Rooms&quot; button to join discussions with other XRP enthusiasts. You can participate in various topic-specific rooms.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1f3973]">How do I track XRP prices?</h3>
                    <p className="text-sm mt-1">Use our &quot;Markets&quot; feature to view real-time XRP price updates and market information.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1f3973]">Need more help?</h3>
                    <p className="text-sm mt-1">Contact our support team at support@xrponline.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSettingsOpen && !isSettingsMinimized && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSettingsOpen(false);
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="relative w-[95%] max-w-md win98-window"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="win98-title-bar cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
            >
              <span>Display Settings</span>
              <div className="flex gap-1">
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => {
                    setIsSettingsMinimized(true);
                  }}
                >
                  _
                </button>
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="w-full bg-[#c0c0c0] border-[3px] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_grey,inset_2px_2px_#fff] p-4">
              <div className="bg-white p-4 border-2 border-[#1f3973]">
                <h2 className="text-center font-bold mb-4 text-[#1f3973]">DISPLAY PROPERTIES</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-[#1f3973] mb-2">Background Color</h3>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => {
                          const newColor = e.target.value;
                          setBackgroundColor(newColor);
                          document.documentElement.style.setProperty('--desktop-bg-color', newColor);
                        }}
                        className="win98-button p-0 h-[30px] w-[50px]"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="win98-button px-2 h-[25px]"
                      />
                    </div>
                    <div className="mt-2">
                      <button
                        className="win98-button px-2 py-1 text-sm"
                        onClick={() => setBackgroundColor('#008080')}
                      >
                        Reset to Default
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isInternetOpen && !isInternetMinimized && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsInternetOpen(false);
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="relative win98-window"
            style={{
              width: isMaximized ? '100%' : windowSize.width,
              height: isMaximized ? '100%' : 'auto',
              transform: isMaximized ? 'none' : `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'auto',
              transition: 'all 0.2s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="win98-title-bar cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
            >
              <span>Internet Explorer - {currentUrl}</span>
              <div className="flex gap-1">
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => {
                    setIsInternetMinimized(true);
                  }}
                >
                  _
                </button>
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => {
                    setIsMaximized(!isMaximized);
                    if (isMaximized) {
                      setPosition({ x: 0, y: 0 });
                      setWindowSize({ width: '95%', height: '400px' });
                    }
                  }}
                >
                  □
                </button>
                <button
                  className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                  onClick={() => {
                    setIsInternetOpen(false);
                    setIsMaximized(false);
                    setWindowSize({ width: '95%', height: '400px' });
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="w-full bg-[#c0c0c0] border-[3px] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_grey,inset_2px_2px_#fff]">
              <div className="flex items-center gap-2 p-1 border-b border-[#808080]">
                <button className="win98-button px-2 py-1">File</button>
                <button className="win98-button px-2 py-1">Edit</button>
                <button className="win98-button px-2 py-1">View</button>
                <button className="win98-button px-2 py-1">Favorites</button>
                <button className="win98-button px-2 py-1">Help</button>
              </div>
              <div className="flex items-center gap-2 p-1 border-b border-[#808080]">
                <button
                  className="win98-button px-2 py-1"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
                <button
                  className="win98-button px-2 py-1"
                  onClick={() => window.history.forward()}
                >
                  Forward
                </button>
                <button
                  className="win98-button px-2 py-1"
                  onClick={() => setIsLoading(false)}
                >
                  Stop
                </button>
                <button
                  className="win98-button px-2 py-1"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 1000);
                  }}
                >
                  Refresh
                </button>
                <button
                  className="win98-button px-2 py-1"
                  onClick={() => {
                    setUrlInput('https://xrpl.org/');
                    setCurrentUrl('https://xrpl.org/');
                  }}
                >
                  Home
                </button>
              </div>
              <div className="flex items-center gap-2 p-1 border-b border-[#808080]">
                <span>Address:</span>
                <input
                  type="text"
                  className="win98-button flex-1 px-2 py-1"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsLoading(true);
                      const formattedUrl = ensureHttps(urlInput);
                      setUrlInput(formattedUrl);
                      setCurrentUrl(formattedUrl);
                      setTimeout(() => {
                        setIsLoading(false);
                      }, 1000);
                    }
                  }}
                />
                <button
                  className="win98-button px-2 py-1"
                  onClick={() => {
                    setIsLoading(true);
                    const formattedUrl = ensureHttps(urlInput);
                    setUrlInput(formattedUrl);
                    setCurrentUrl(formattedUrl);
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 1000);
                  }}
                >
                  Go
                </button>
              </div>
              <div
                className="bg-white p-4 overflow-auto"
                style={{
                  height: isMaximized ? 'calc(100vh - 140px)' : windowSize.height
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin text-4xl">💿</div>
                  </div>
                ) : (
                  <iframe
                    src={currentUrl}
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setCurrentUrl('about:blank');
                    }}
                  />
                )}
              </div>

              {!isMaximized && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                  onMouseDown={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startWidth = parseInt(windowSize.width);
                    const startHeight = parseInt(windowSize.height);

                    const handleMouseMove = (e: globalThis.MouseEvent) => {
                      const newWidth = startWidth + (e.clientX - startX);
                      const newHeight = startHeight + (e.clientY - startY);
                      setWindowSize({
                        width: `${Math.max(400, newWidth)}px`,
                        height: `${Math.max(300, newHeight)}px`
                      });
                    };

                    const handleMouseUp = () => {
                      window.removeEventListener('mousemove', handleMouseMove);
                      window.removeEventListener('mouseup', handleMouseUp);
                    };

                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp);
                  }}
                >
                  <div className="w-0 h-0 border-8 border-transparent border-r-[#808080] border-b-[#808080] transform rotate-45" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isMinesweeperOpen && !isMinesweeperMinimized && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsMinesweeperOpen(false);
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <Minesweeper
              onClose={() => setIsMinesweeperOpen(false)}
              onMinimize={() => setIsMinesweeperMinimized(true)}
              onMouseDown={handleMouseDown}
            />
          </div>
        </div>
      )}

      <div className="mt-8"></div>

      <div className="fixed bottom-0 left-0 right-0 h-[30px] bg-[#c0c0c0] border-t-[1px] border-white flex items-center justify-between">
        <div className="flex items-center relative">
          <button
            className={`win98-button h-[22px] px-2 mx-1 flex items-center gap-2 ${isStartMenuOpen ? 'active' : ''}`}
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          >
            <Image
              src="/windows98.png"
              alt="Start"
              width={16}
              height={16}
              className="mr-1"
            />
            Start
          </button>

          {isStartMenuOpen && (
            <div
              className="absolute bottom-full left-1 mb-1 w-[200px] bg-[#c0c0c0] border-[3px] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_grey,inset_2px_2px_#fff] z-50"
              onClick={() => setIsStartMenuOpen(false)}
            >
              <div className="bg-[#000080] absolute left-0 top-0 bottom-0 w-[20px]"></div>

              <button
                className="w-full px-4 py-1 pl-8 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
                onClick={() => {
                  setIsChatOpen(true);
                }}
              >
                <Image src="/window.svg" alt="Chat" width={16} height={16} className="invert" />
                Chat Rooms
              </button>

              <button
                className="w-full px-4 py-1 pl-8 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
                onClick={() => {
                  setIsMarketsOpen(true);
                }}
              >
                <Image src="/file.svg" alt="Markets" width={16} height={16} className="invert" />
                Markets
              </button>

              <button
                className="w-full px-4 py-1 pl-8 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
                onClick={() => {
                  setIsHelpOpen(true);
                }}
              >
                <Image src="/help.svg" alt="Help" width={16} height={16} className="invert" />
                Help Center
              </button>

              <div className="border-t border-[#808080] my-1"></div>

              <button
                className="w-full px-4 py-1 pl-8 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
                onClick={() => {
                  setIsSettingsOpen(true);
                }}
              >
                <Image src="/settings.svg" alt="Settings" width={16} height={16} className="invert" />
                Display Settings
              </button>

              <button
                className="w-full px-4 py-1 pl-8 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
                onClick={() => {
                  setShowConnectionInfo(true);
                }}
              >
                <div className="w-4 h-4 flex items-center justify-center">⚡</div>
                Connection Info
              </button>
            </div>
          )}

          <div className="h-[22px] mx-1 border-l-2 border-[#808080] border-r-2 border-white"></div>

          {isChatOpen && (
            <button
              className={`win98-button h-[22px] px-2 mx-1 flex items-center gap-2 min-w-[120px] ${isChatMinimized ? 'active' : ''}`}
              onClick={() => setIsChatMinimized(false)}
            >
              <Image
                src="/window.svg"
                alt="Chat"
                width={16}
                height={16}
                className="mr-1"
              />
              Chat Room
            </button>
          )}

          {isMarketsOpen && (
            <button
              className={`win98-button h-[22px] px-2 mx-1 flex items-center gap-2 min-w-[120px] ${isMarketsMinimized ? 'active' : ''}`}
              onClick={() => setIsMarketsMinimized(false)}
            >
              <Image
                src="/file.svg"
                alt="Markets"
                width={16}
                height={16}
                className="mr-1"
              />
              Markets
            </button>
          )}

          {isHelpOpen && (
            <button
              className={`win98-button h-[22px] px-2 mx-1 flex items-center gap-2 min-w-[120px] ${isHelpMinimized ? 'active' : ''}`}
              onClick={() => setIsHelpMinimized(false)}
            >
              <Image
                src="/help.svg"
                alt="Help"
                width={16}
                height={16}
                className="mr-1"
              />
              Help Center
            </button>
          )}

          {isSettingsOpen && (
            <button
              className={`win98-button h-[22px] px-2 mx-1 flex items-center gap-2 min-w-[120px] ${isSettingsMinimized ? 'active' : ''}`}
              onClick={() => setIsSettingsMinimized(false)}
            >
              <Image
                src="/settings.svg"
                alt="Settings"
                width={16}
                height={16}
                className="mr-1"
              />
              Display Settings
            </button>
          )}

          {isInternetOpen && (
            <button
              className={`win98-button h-[22px] px-2 mx-1 flex items-center gap-2 min-w-[120px] ${isInternetMinimized ? 'active' : ''}`}
              onClick={() => setIsInternetMinimized(false)}
            >
              <Image
                src="/globe.svg"
                alt="Internet"
                width={16}
                height={16}
                className="mr-1 invert"
              />
              Internet Explorer
            </button>
          )}

          {isMinesweeperOpen && (
            <button
              className={`win98-button h-[22px] px-2 mx-1 flex items-center gap-2 min-w-[120px] ${isMinesweeperMinimized ? 'active' : ''}`}
              onClick={() => setIsMinesweeperMinimized(false)}
            >
              <Image
                src="/minesweeper.svg"
                alt="Minesweeper"
                width={16}
                height={16}
                className="mr-1"
              />
              Minesweeper
            </button>
          )}
        </div>

        <div className="flex items-center mr-2 gap-2">
          <div
            className="win98-button h-[22px] px-2 flex items-center gap-2 cursor-pointer"
            onClick={() => setShowConnectionInfo(true)}
          >
            <div className="w-4 h-4 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse">
                  ⚡
                </div>
              </div>
            </div>
            <span className="text-xs">56.6 Kbps</span>
          </div>
          <div className="win98-button h-[22px] px-2 flex items-center">
            <span className="text-xs">{currentTime}</span>
          </div>
        </div>
      </div>

      {showConnectionInfo && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setShowConnectionInfo(false)}
        >
          <div
            className="win98-window w-[400px]"
            onClick={e => e.stopPropagation()}
          >
            <div className="win98-title-bar">
              <span>Connection Status</span>
              <button
                className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
                onClick={() => setShowConnectionInfo(false)}
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-[#c0c0c0]">
              <div className="bg-white p-4 border-2 border-[#1f3973]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="animate-spin">💿</div>
                  <span className="font-bold text-[#1f3973]">CONNECTING...</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p>🌐 Dialing XRPL node...</p>
                  <p>📞 *Dial-up modem sounds intensify*</p>
                  <p>🔄 Syncing with the future of finance...</p>
                  <p>✨ Using cutting-edge XRPOnline v1.0 technology</p>
                  <p className="text-green-600">✅ Connected at blazing fast 56.6 Kbps!</p>
                  <div className="mt-4 bg-black text-green-400 p-2 font-mono text-xs">
                    <p>PING xrpl.org... Time=42ms</p>
                    <p>Ledger sync: 100%</p>
                    <p>Wallet.exe loaded successfully</p>
                    <p>Mom, don&apos;t pick up the phone!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



