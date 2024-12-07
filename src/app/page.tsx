'use client';

import Image from "next/image";
import "./win98.css";
import Markets from './components/Markets';
import ChatInterface from './chat/components/ChatInterface';
import { useState, MouseEvent } from 'react';

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
    <div className="win98-desktop min-h-screen p-8 pb-20 gap-16 sm:p-20">
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

      <div className="text-white text-center mb-8 text-2xl font-bold">
        Welcome to XRPOnline
        <div className="text-sm dial-up-animation">●●● Connected at 56.6 Kbps ●●●</div>
      </div>

      <main className="win98-window max-w-2xl mx-auto">
        <div className="win98-title-bar">
          <span>XRPOnline - Your Gateway to Digital Assets</span>
          <div className="flex gap-1">
            <button className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0">_</button>
            <button className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0">□</button>
            <button className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0">×</button>
          </div>
        </div>

        <div className="p-4 bg-[#f0f0f0]">
          <div className="flex flex-col items-center gap-8">
            <div className="text-2xl font-bold aol-text">XRPOnline v1.0</div>
            <div className="bg-white p-4 border-2 border-[#1f3973] w-full">
              <h2 className="text-center font-bold mb-4 text-[#1f3973]">TODAY&apos;S FEATURES</h2>
              <ol className="list-inside list-decimal text-sm space-y-4">
                <li className="mb-2">
                  Access your digital wallet through{" "}
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
      </main>

      <footer className="mt-8 win98-window max-w-2xl mx-auto">
        <div className="win98-title-bar">
          <span>Quick Navigation</span>
        </div>
        <div className="p-4 flex gap-6 flex-wrap justify-center bg-[#f0f0f0]">
          <button 
            className="aol-button flex items-center gap-2"
            onClick={() => setIsMarketsOpen(true)}
          >
            <Image
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
              className="invert"
            />
            Markets
          </button>
          <button 
            className="aol-button flex items-center gap-2"
            onClick={() => setIsChatOpen(true)}
          >
            <Image
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
              className="invert"
            />
            Chat Rooms
          </button>
          <button 
            className="aol-button flex items-center gap-2"
            onClick={() => setIsHelpOpen(true)}
          >
            <Image
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
              className="invert"
            />
            Help Center
          </button>
        </div>
      </footer>

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

      <div className="text-white text-center mt-8 text-sm">
        <div>You&apos;ve Got XRP!</div>
        <div>© 1999 XRPOnline - All Rights Reserved</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-[30px] bg-[#c0c0c0] border-t-[1px] border-white flex items-center">
        <button className="win98-button h-[22px] px-2 mx-1 flex items-center gap-2">
          <Image
            src="/windows98.png"
            alt="Start"
            width={16}
            height={16}
            className="mr-1"
          />
          Start
        </button>
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
              src="/globe.svg"
              alt="Help"
              width={16}
              height={16}
              className="mr-1"
            />
            Help Center
          </button>
        )}
      </div>
    </div>
  );
}



