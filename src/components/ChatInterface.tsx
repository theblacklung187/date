import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInterfaceProps {
  chatHistory: Array<{ user: string; message: string }>;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  chatHistory, 
  onSendMessage, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-100 rounded-lg">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`mb-2 ${
              chat.user === 'User' ? 'text-right' : 'text-left'
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                chat.user === 'User'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-300 text-gray-800'
              }`}
            >
              {chat.message}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={disabled ? "Voice mode active" : "Type your message..."}
          className={`flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled}
          className={`p-2 rounded-r-lg ${
            disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white focus:outline-none focus:ring-2 focus:ring-purple-600`}
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;