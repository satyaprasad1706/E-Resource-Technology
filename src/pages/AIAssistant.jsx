import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, User, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { askGeminiTutorStream } from '../services/gemini';

const AIAssistant = () => {
  const { currentUser } = useAuth();
  
  const [messages, setMessages] = useState([
    {
      id: "m0",
      sender: "AI",
      text: `Hello ${currentUser?.name || 'Student'}! I am your E-Resource Gemini AI Tutor. 🤖\n\nEnter any academic topic name below (e.g., **Normalization**, **Binary Search**, **Semaphores** or other course subjects) and I will generate comprehensive explanations, summary lists, key review points, and instant solved quiz questions in real-time streaming!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  // Markdown to HTML renderer for clean student interface without raw characters
  const parseBold = (text) => {
    if (!text) return "";
    const parts = text.split('**');
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-extrabold text-slate-800 dark:text-slate-100">{part}</strong>;
      }
      // Strip any other lingering markdown indicators (like quotes or single asterisks)
      return part.replace(/[\*_`"']/g, (m) => {
        if (m === '"' || m === "'") return m; // keep legitimate quotes
        return "";
      });
    });
  };

  const renderMessageText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // 1. Headers (### or ####)
      if (line.startsWith('### ') || line.startsWith('#### ')) {
        const cleanLine = line.replace(/^#{3,4}\s+/, '').replace(/[\*_`]/g, '');
        return (
          <h4 key={idx} className="text-xs md:text-sm font-extrabold text-primary dark:text-blue-400 mt-4 mb-2 flex items-center border-b pb-1.5 border-slate-100 dark:border-slate-700/60 uppercase tracking-wider">
            {cleanLine}
          </h4>
        );
      }
      // 2. Bullet lists (- or *)
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const cleanLine = parseBold(line.substring(2));
        return (
          <li key={idx} className="list-disc pl-2 ml-4 text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-medium mt-1">
            {cleanLine}
          </li>
        );
      }
      // 3. Normal paragraphs
      return (
        <p key={idx} className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium min-h-[1.2em]">
          {parseBold(line)}
        </p>
      );
    });
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isStreaming) return;

    const topic = inputText.trim();
    const userMessage = {
      id: `mu-${Date.now()}`,
      sender: "User",
      text: topic,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsStreaming(true);

    // Initial empty AI message placeholder to write streaming chunks into
    const aiMessageId = `mai-${Date.now()}`;
    const aiPlaceholder = {
      id: aiMessageId,
      sender: "AI",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiPlaceholder]);

    let accumulatedText = "";

    try {
      await askGeminiTutorStream(
        topic,
        // Chunk received callback
        (chunk) => {
          accumulatedText += chunk;
          setMessages(prev =>
            prev.map(m => m.id === aiMessageId ? { ...m, text: accumulatedText } : m)
          );
        },
        // Complete callback
        (finalText) => {
          setMessages(prev =>
            prev.map(m => m.id === aiMessageId ? { ...m, text: finalText } : m)
          );
          setIsStreaming(false);
        }
      );
    } catch (error) {
      console.error("Gemini AI stream call error:", error);
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMessageId 
            ? { ...m, text: "⚠️ Sorry, E-Resource Gemini AI Tutor is currently offline. Please try typing another standard subject topic." } 
            : m
        )
      );
      setIsStreaming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 transition-colors duration-200">
      
      {/* Container holding Chat Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden h-[75vh] flex flex-col justify-between transition-colors">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-750 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary dark:text-blue-400 border border-primary/20">
              <Brain className="h-5.5 w-5.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base flex items-center space-x-1.5">
                <span>E-Resource Gemini AI Assistant</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                  GEMINI FL-2.5
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Live streaming academic tutor support
              </p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            Live Stream Mode
          </span>
        </div>

        {/* Chat Screen (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 bg-slate-50/30 dark:bg-slate-900/10 no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Message Block */}
              <div className={`flex items-start space-x-3 max-w-[85%] md:max-w-[78%]`}>
                {msg.sender === 'AI' && (
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-slate-700 flex items-center justify-center text-primary dark:text-blue-400 flex-shrink-0 font-bold border border-blue-200 dark:border-slate-655 text-xs">
                    AI
                  </div>
                )}
                
                <div className="space-y-1">
                  {/* Bubble body */}
                  <div className={`p-4 rounded-2xl shadow-sm text-xs md:text-sm leading-relaxed ${
                    msg.sender === 'User'
                      ? 'bg-primary text-white rounded-tr-none font-bold'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-150 dark:border-slate-700 font-medium'
                  }`}>
                    
                    <div className="space-y-1.5 leading-relaxed">
                      {msg.text ? (
                        renderMessageText(msg.text)
                      ) : (
                        isStreaming && msg.id === messages[messages.length - 1].id && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium animate-pulse">
                            ⚡ Gemini is writing answer outlines...
                          </p>
                        )
                      )}
                    </div>
                  </div>
                  {/* Timestamp label */}
                  <p className="text-[9px] text-slate-400 text-right px-1 mt-0.5 font-medium">
                    {msg.timestamp}
                  </p>
                </div>

                {msg.sender === 'User' && (
                  <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white flex-shrink-0 font-bold text-xs">
                    {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                )}
              </div>

            </div>
          ))}

          {/* Streaming Indicator */}
          {isStreaming && (
            <div className="flex justify-start items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-slate-700 flex items-center justify-center text-primary dark:text-blue-400 flex-shrink-0 font-bold border border-blue-200 dark:border-slate-650 animate-pulse">
                AI
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce duration-300" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce duration-300" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce duration-300" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Panel */}
        <form onSubmit={handleSend} className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-750 flex items-center space-x-2">
          <input
            type="text"
            disabled={isStreaming}
            placeholder={isStreaming ? "Wait for Gemini to finish streaming..." : "Ask Gemini: e.g. Normalization, Binary Search, Semaphores..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isStreaming}
            className="p-2.5 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-semibold shadow-sm transition flex-shrink-0"
            title="Ask AI Tutor"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AIAssistant;
export { AIAssistant };
