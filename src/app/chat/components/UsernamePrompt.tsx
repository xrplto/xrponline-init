import React from 'react';

interface UsernamePromptProps {
  username: string;
  setUsername: (username: string) => void;
  handleUsernameSubmit: (e: React.FormEvent) => void;
}

export default function UsernamePrompt({ username, setUsername, handleUsernameSubmit }: UsernamePromptProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <form onSubmit={handleUsernameSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <div className="text-center font-bold">Enter your username to join the chat</div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-2 bg-white border-[2px] border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#c0c0c0] text-black px-4 py-2 border-[2px] border-[#dfdfdf] border-r-[#0a0a0a] border-b-[#0a0a0a]"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
} 