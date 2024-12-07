'use client';

import Image from "next/image";
import "./win98.css";
import Link from "next/link";
import Markets from './components/Markets';
import ChatInterface from './chat/components/ChatInterface';
import { useState } from 'react';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="win98-desktop min-h-screen p-8 pb-20 gap-16 sm:p-20">
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
          <Link href="/markets">
            <button className="aol-button flex items-center gap-2">
              <Image
                src="/file.svg"
                alt="File icon"
                width={16}
                height={16}
                className="invert"
              />
              Markets
            </button>
          </Link>
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
          <button className="aol-button flex items-center gap-2">
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

      {isChatOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsChatOpen(false);
            }
          }}
        >
          <div className="relative w-[95%] max-w-4xl" onClick={e => e.stopPropagation()}>
            <ChatInterface 
              onClose={() => setIsChatOpen(false)} 
            />
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
            src="/windows-logo.png"
            alt="Start"
            width={16}
            height={16}
            className="mr-1"
          />
          Start
        </button>
      </div>

      <Markets />
    </div>
  );
}



