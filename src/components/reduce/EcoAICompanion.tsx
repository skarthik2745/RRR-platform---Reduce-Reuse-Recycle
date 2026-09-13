import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { generateResponse } from '../../services/ecoAI';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const EcoAICompanion: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m EcoAI, your sustainable living companion! 🌱 Ask me about reducing waste, reusing items, or any sustainability questions!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const response = await generateResponse(currentInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('EcoAI error:', error);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again!',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };



  return (
    <div className="min-h-screen p-12 w-full" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 70%, #533483 100%)', minHeight: '120vh', width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-4" style={{
          fontFamily: 'Playfair Display',
          color: '#FFD700',
          textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)'
        }}>
          EcoAI Companion
        </h2>
        <p className="text-xl" style={{ color: '#FFD700' }}>
          Your intelligent guide to sustainable living
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
        {/* Left Side - Robot Image */}
        <div className="lg:col-span-2 flex items-center justify-center">
          <div className="relative">
            <img 
              src="/WhatsApp Image 2025-11-22 at 11.58.52_a2462025.jpg" 
              alt="EcoAI Robot" 
              className="w-[600px] h-[600px] object-contain rounded-3xl"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(16, 185, 129, 0.5))'
              }}
            />
          </div>
        </div>

        {/* Right Side - Chat Interface */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #065f46 50%, #365314 100%)',
            border: '3px solid #FFD700',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(16, 185, 129, 0.1)',
            height: '700px',
            filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))'
          }}>
            {/* Chat Header */}
            <div className="p-6 border-b-2 rounded-t-3xl" style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #059669 50%, #84cc16 100%)',
              borderColor: 'rgba(255, 215, 0, 0.5)'
            }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                    boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)'
                  }}
                >
                  <Bot size={24} style={{ color: '#ffffff' }} />
                </div>
                <div className="px-2">
                  <h3 className="font-bold text-white text-lg" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.5)' }}>EcoAI Assistant</h3>
                  <p className="text-sm text-lime-200" style={{ textShadow: '0 0 4px rgba(132, 204, 22, 0.5)' }}>Your Sustainable Companion</p>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 rounded-full bg-green-400"
                    style={{ animation: 'pulse 2s infinite' }}
                  />
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ height: '440px' }}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.isUser ? 'rounded-br-sm' : 'rounded-bl-sm'
                      }`}
                      style={{
                        background: message.isUser 
                          ? 'linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #0d9488 100%)'
                          : 'linear-gradient(135deg, #059669 0%, #22c55e 50%, #84cc16 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        boxShadow: message.isUser 
                          ? '0 0 15px rgba(30, 64, 175, 0.4)'
                          : '0 0 15px rgba(5, 150, 105, 0.4)',
                        textShadow: '0 0 4px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{
                      background: 'linear-gradient(135deg, #059669 0%, #22c55e 50%, #84cc16 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 0 15px rgba(5, 150, 105, 0.4)'
                    }}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms', filter: 'drop-shadow(0 0 2px #ffffff)' }} />
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms', filter: 'drop-shadow(0 0 2px #ffffff)' }} />
                        <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms', filter: 'drop-shadow(0 0 2px #ffffff)' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 215, 0, 0.3)' }}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me about sustainable living..."
                  className="flex-1 px-5 py-4 rounded-xl border-2 focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderColor: '#10b981',
                    color: '#ffffff',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 0 10px rgba(16, 185, 129, 0.1), 0 0 20px rgba(16, 185, 129, 0.1)'
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #22c55e 50%, #84cc16 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    boxShadow: '0 0 15px rgba(5, 150, 105, 0.4)'
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};