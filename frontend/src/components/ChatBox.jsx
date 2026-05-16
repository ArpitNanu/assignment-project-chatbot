import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const ChatBox = ({ documentId, token }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Added JWT token
        },
        body: JSON.stringify({
          question: userMessage.text, // Matched variable name to backend
          documentId: documentId
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to get response");

      // Matched variable name to backend response
      const aiMessage = { text: data.answer, sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = { text: error.message || "Error connecting to server.", sender: 'ai' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 p-4 rounded mt-4 bg-white shadow-sm">
      <h4 className="font-medium mb-4">Chat with Document</h4>
      
      <div className="h-80 overflow-y-auto border border-gray-200 p-4 mb-4 bg-gray-50 rounded">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-20 italic">
            Ask me anything about the document you just uploaded!
          </p>
        )}
        
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span className={`inline-block p-3 rounded-lg max-w-[85%] text-sm ${
              msg.sender === 'user' 
                ? 'bg-blue-100 text-blue-900 rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
            }`}>
              <strong className="block text-xs opacity-60 mb-1 uppercase tracking-wider">
                {msg.sender === 'user' ? 'You' : 'AI Assistant'}
              </strong> 
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-left text-gray-500 italic text-sm mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="flex-grow p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
