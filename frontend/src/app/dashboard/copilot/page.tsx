'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Loader2
} from 'lucide-react';
interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  references?: string[];
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Hello, I am the **SecureMind AI Security Copilot**. I analyze employee behavior drift to identify and mitigate insider threats. How can I assist you with behavioral risk analysis today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterQuestions = [
    'Why is Karthikeyan Balaji high risk?',
    'Summarize today\'s active threat predictions.',
    'Recommend preventive actions for the database administrator threat.',
    'Explain the behavior changes flagged for Senthil Kumar.'
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      
      const botMsg: ChatMessage = {
        sender: 'assistant',
        text: data.response || 'Inference engine is currently busy. Please retry.',
        timestamp: new Date(),
        references: data.references || []
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        sender: 'assistant',
        text: 'Connection to SecureMind AI was interrupted.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      
      {/* Left Chat Window (8 columns on lg) */}
      <div className="flex-1 premium-card flex flex-col h-full overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
              <Bot className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">AI Security Copilot</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Continuous Risk Inference Engine</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] bg-[#10B981]/10 text-[#10B981] px-2.5 py-1 rounded-full font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ready</span>
          </span>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#F8FAFC]/50">
          {messages.map((msg: any, idx: number) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs border ${
                  isBot 
                    ? 'bg-[#2563EB] text-white border-[#2563EB]/10' 
                    : 'bg-[#0F172A] text-white border-[#0F172A]/10'
                }`}>
                  {isBot ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                {/* Bubble */}
                <div className="space-y-1.5 min-w-0">
                  <div className={`p-4 rounded-xl text-xs border leading-relaxed ${
                    isBot 
                      ? 'bg-white border-[#E2E8F0] text-[#1E293B] shadow-xs' 
                      : 'bg-[#2563EB] border-[#2563EB]/15 text-white font-medium'
                  }`}>
                    {/* Render helper for markdown format styling */}
                    <div className="whitespace-pre-line space-y-2">
                      {msg.text.split('\n').map((line: any, lIdx: number) => {
                        // Very simple parser for bullet points and bold sections
                        if (line.startsWith('* **')) {
                          const clean = line.replace('* **', '').replace('**', '');
                          return <div key={lIdx} className="pl-3 font-semibold text-slate-800">• <span className="font-bold">{clean}</span></div>;
                        }
                        if (line.startsWith('* ')) {
                          return <div key={lIdx} className="pl-3 text-slate-700">• {line.substring(2)}</div>;
                        }
                        if (line.startsWith('1. ')) {
                          return <div key={lIdx} className="pl-3 text-slate-700">{line}</div>;
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <div key={lIdx} className="font-bold text-[#0F172A] mt-2 first:mt-0">{line.replace(/\*\*/g, '')}</div>;
                        }
                        return <p key={lIdx} className="font-medium">{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* References & suggestions (if assistant and has references) */}
                  {isBot && msg.references && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">References:</span>
                      {msg.references.map((ref: any, rIdx: number) => (
                        <span key={rIdx} className="bg-slate-100 text-[#0F172A] text-[9px] font-bold border border-[#E2E8F0] px-2 py-0.5 rounded-full">
                          {ref}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Loading bubble */}
          {loading && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 border border-[#2563EB]/10">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex items-center gap-2 text-xs text-slate-500 font-semibold">
                <Loader2 className="w-4.5 h-4.5 animate-spin text-[#2563EB]" />
                <span>AI Security Copilot is inferring behavioral drift patterns...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input box */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} 
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about employee behavior risks, e.g., 'Why is Karthikeyan flagged?'..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2563EB] font-medium"
            />
            <button 
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-[#2563EB] hover:bg-blue-600 disabled:opacity-40 text-white p-3 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Right Sidebar Suggested Questions (4 columns on lg) */}
      <div className="lg:w-80 space-y-6 shrink-0 h-full flex flex-col">
        
        {/* Suggested Queries */}
        <div className="premium-card p-5 space-y-4 flex-1 overflow-y-auto">
          <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5 border-b border-[#E2E8F0] pb-2.5">
            <Zap className="w-4 h-4 text-[#2563EB]" />
            <span>Suggested Inquiries</span>
          </h4>
          
          <div className="space-y-2.5">
            {starterQuestions.map((q: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="w-full text-left p-3 border border-[#E2E8F0] bg-white text-xs font-semibold text-slate-650 hover:bg-[#F8FAFC] hover:border-[#2563EB]/40 rounded-xl transition-all flex items-center justify-between cursor-pointer group"
              >
                <span className="leading-relaxed truncate max-w-[200px]">{q}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Integration capabilities */}
        <div className="premium-card p-4 space-y-3 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>Modular LLM Integration</span>
          </span>
          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
            This module contains a structured routing engine. In production, change the mock handlers in <code className="bg-slate-100 text-[#0F172A] px-1 rounded">mockData.ts</code> to invoke OpenAI, Gemini, or Claude APIs directly.
          </p>
        </div>

      </div>

    </div>
  );
}
