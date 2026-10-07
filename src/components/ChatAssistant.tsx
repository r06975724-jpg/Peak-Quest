import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RefreshCw, 
  Mountain, 
  ExternalLink, 
  Compass, 
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Trek } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedTreks?: string[];
}

interface ChatAssistantProps {
  treks: Trek[];
  onSelectTrek: (trek: Trek) => void;
  onBookTrek: (trek: Trek) => void;
}

const STARTER_PROMPTS = [
  '🏔️ Best beginner trek in Himachal under ₹6,000?',
  '❄️ Top winter snow treks in Uttarakhand',
  '🎒 What gear is essential for Hampta Pass?',
  '⚡ 2-day weekend summit trek from Delhi',
  '🌿 When is the best time to visit Valley of Flowers?',
  '🩺 Altitude safety & AMS prevention guidelines'
];

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  treks,
  onSelectTrek,
  onBookTrek,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Namaste! I'm **Assistant**, your Peak Quest India trail and heritage guide.

I can help you:
        - Find trails and historic forts across all of **India**
- Compare difficulty, duration, and budgets starting from **₹5,000 INR**
- Get gear packing lists and high-altitude safety advice (AMS protocols)
- Plan day-by-day itineraries and best seasonal windows

What mountain trail are you looking to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  // Find relevant trek IDs mentioned in assistant text
  const detectMentionedTreks = (text: string): Trek[] => {
    const textLower = text.toLowerCase();
    return treks.filter((t) => {
      const nameParts = t.name.toLowerCase().split(' ');
      const mainKeyword = nameParts[0]; // e.g. "triund", "hampta", "nag", "kedarkantha", "valley", "har", "beas", "pin", "brahmatal"
      return textLower.includes(t.name.toLowerCase()) || textLower.includes(mainKeyword);
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build messages payload for API
      const conversationHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const replyContent = data.reply || "I'm here to help with all your Himalayan trekking questions.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      // Helpful fallback response
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `I am currently analyzing your trail request. Here are quick recommendations based on our catalog:

- **Triund Trail (Himachal Pradesh)**: 2 Days, 2,828m, Easy, ₹5,000 INR. Perfect weekend summit.
- **Nag Tibba (Uttarakhand)**: 2 Days, 3,022m, Easy, ₹5,200 INR. Best beginner summit near Mussoorie.
- **Kedarkantha Winter Summit (Uttarakhand)**: 5 Days, 3,810m, ₹7,999 INR. Iconic snow adventure.
- **Hampta Pass (Himachal Pradesh)**: 5 Days, 4,287m, ₹10,499 INR. Dramatic crossover trek into Spiti.

Would you like more details or packing gear checklists for any of these?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat refreshed! I'm **Assistant**, your Peak Quest mountain advisor. How can I help you plan your next Himalayan journey today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          id="open-assistant-chat-btn"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#1E2822] hover:bg-[#2D3633] text-[#FDFCF7] p-3 sm:px-4 sm:py-3.5 rounded-full shadow-2xl border border-[#4A6741]/40 flex items-center gap-3 transition-all duration-300 transform hover:scale-105 group min-h-[48px] min-w-[48px]"
          title="Chat with Assistant"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#4A6741] flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#86EFAC] rounded-full border-2 border-[#1E2822] animate-pulse" />
          </div>

          <div className="hidden sm:block text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm text-white">Assistant</span>
              <span className="text-[10px] bg-[#4A6741]/40 text-[#86EFAC] px-1.5 py-0.2 rounded font-mono font-semibold">AI Guide</span>
            </div>
            <p className="text-[11px] text-[#D1CDC0]">Ask trek tips & planning</p>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="assistant-chat-container"
          className={`fixed z-50 transition-all duration-300 shadow-2xl overflow-hidden border border-[#E8E4D9] flex flex-col ${
            isMinimized
              ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-72 sm:w-80 h-14 rounded-2xl bg-[#1E2822]'
              : 'bottom-3 right-3 sm:bottom-6 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-[420px] md:w-[460px] h-[540px] max-h-[82dvh] rounded-2xl bg-[#FDFCF7]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#1E2822] text-[#FDFCF7] p-3.5 sm:p-4 flex items-center justify-between shrink-0 border-b border-[#2D3633]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-[#4A6741] flex items-center justify-center text-white shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#86EFAC] rounded-full border-2 border-[#1E2822]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-white">Assistant</h3>
                  <span className="text-[10px] bg-[#4A6741]/50 text-[#86EFAC] px-1.5 py-0.5 rounded font-mono font-medium">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-[#D1CDC0]">Peak Quest Himalayan Trekking AI</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="reset-assistant-chat-btn"
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 text-[#D1CDC0] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                id="minimize-assistant-chat-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 text-[#D1CDC0] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transform transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>

              <button
                id="close-assistant-chat-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 text-[#D1CDC0] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FDFCF7] text-[#2D3633] text-xs sm:text-sm">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const mentioned = !isUser ? detectMentionedTreks(msg.content) : [];

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[88%]">
                        {!isUser && (
                          <div className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center shrink-0 mb-1 text-[11px] font-bold">
                            <Mountain className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl leading-relaxed shadow-xs ${
                            isUser
                              ? 'bg-[#8B5E3C] text-white rounded-br-none'
                              : 'bg-[#F3F1EA] text-[#2D3633] border border-[#E8E4D9] rounded-bl-none'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            <div className="prose prose-sm max-w-none text-[#2D3633] space-y-1.5">
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mentioned Trek Action Chips */}
                      {!isUser && mentioned.length > 0 && (
                        <div className="mt-2.5 ml-8 flex flex-wrap gap-1.5">
                          {mentioned.slice(0, 3).map((trek) => (
                            <div
                              key={trek.id}
                              className="inline-flex items-center gap-1.5 bg-white border border-[#E8E4D9] hover:border-[#4A6741] rounded-lg px-2.5 py-1 text-[11px] shadow-2xs transition-colors"
                            >
                              <span className="font-semibold text-[#2D3633]">{trek.name.split(' ')[0]}</span>
                              <span className="text-[#8B5E3C] font-bold font-mono">₹{trek.startingPriceINR.toLocaleString('en-IN')}</span>
                              <button
                                onClick={() => {
                                  onSelectTrek(trek);
                                  setIsMinimized(true);
                                }}
                                className="text-[#4A6741] hover:underline font-bold ml-1 flex items-center gap-0.5"
                              >
                                <span>Inspect</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="text-[10px] text-[#8B9691] mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-end gap-2 max-w-[80%]">
                    <div className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center shrink-0 mb-1">
                      <Bot className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="bg-[#F3F1EA] border border-[#E8E4D9] p-3 rounded-2xl rounded-bl-none text-xs text-[#5C6662] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#4A6741] rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[#4A6741] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-[#4A6741] rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] font-medium text-[#5C6662] ml-1">Assistant is checking trails...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Starter Prompt Chips */}
              {messages.length <= 2 && (
                <div className="px-3 py-2 bg-[#F3F1EA] border-t border-[#E8E4D9] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                  {STARTER_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="whitespace-nowrap bg-white hover:bg-[#E8E4D9] text-[#2D3633] text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#E8E4D9] transition-colors shrink-0"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-[#E8E4D9] flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  id="assistant-chat-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Assistant about treks, gear, AMS, prices..."
                  disabled={isLoading}
                  className="flex-1 bg-[#FDFCF7] border border-[#E8E4D9] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#2D3633] placeholder-[#8B9691] focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                />
                <button
                  id="send-assistant-chat-btn"
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-[#8B5E3C] hover:bg-[#734B2E] disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center shrink-0"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
