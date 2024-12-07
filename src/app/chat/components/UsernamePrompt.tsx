import React, { useState, useEffect } from 'react';

interface UsernamePromptProps {
  username: string;
  setUsername: (username: string) => void;
  handleUsernameSubmit: (e: React.FormEvent) => void;
}

export default function UsernamePrompt({ username, setUsername, handleUsernameSubmit }: UsernamePromptProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [existingUsers, setExistingUsers] = useState<{username: string, lastSeen: number}[]>([]);

  useEffect(() => {
    // Fetch existing users when component mounts
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setExistingUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if username already exists
    const userExists = existingUsers.some(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );

    if (userExists) {
      setError('User currently being used');
      return;
    }

    if (username === 'XRPOnline') {
      if (password === 'XRPOnline@123') {
        setError('');
        handleUsernameSubmit(e);
      } else {
        setError('Invalid password');
      }
    } else {
      handleUsernameSubmit(e);
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <div className="text-center font-bold">Enter your username to join the chat</div>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setShowPassword(e.target.value === 'XRPOnline');
            setError('');
          }}
          placeholder="Username"
          className="p-2 bg-white border-[2px] border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] focus:outline-none"
        />
        {showPassword && (
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Password"
            className="p-2 bg-white border-[2px] border-[#0a0a0a] border-r-[#dfdfdf] border-b-[#dfdfdf] focus:outline-none"
          />
        )}
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
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