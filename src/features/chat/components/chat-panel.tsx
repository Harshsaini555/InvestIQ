'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/use-chat';
import { Send, MessageSquare, Sparkles, X, User, Cpu, Copy, RefreshCw, Trash2, Download, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type InvestmentAnalysis } from '@/agent/types/investment.types';

interface ChatPanelProps {
  analysis: InvestmentAnalysis;
}

// Simple client-side Markdown formatter for bullet points, bold text, and tables
function renderMarkdown(text: string) {
  if (!text) return null;

  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let tableRows: React.ReactNode[][] = [];
  let isTable = false;

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="list-disc list-inside space-y-1 my-2 text-neutral-300 pl-2">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = (key: string) => {
    if (tableRows.length > 0) {
      // Check if second row is separator (e.g. |---|)
      const secondRow = tableRows[1];
      const hasSeparator = tableRows.length > 1 && secondRow && secondRow.every(cell => cell?.toString().trim().startsWith('-') || cell?.toString().trim() === '');
      const dataRows = hasSeparator ? tableRows.filter((_, i) => i !== 1) : tableRows;
      const headerRow = dataRows[0];

      renderedElements.push(
        <div key={`table-wrapper-${key}`} className="overflow-x-auto my-3 border border-white/5 rounded-lg">
          <table className="w-full text-left text-[11px] border-collapse bg-neutral-950/20">
            <thead>
              <tr className="border-b border-white/10 bg-neutral-950/60 text-neutral-400 font-semibold">
                {headerRow && headerRow.map((cell, idx) => (
                  <th key={`th-${idx}`} className="p-2 border-r border-white/5 last:border-0">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {dataRows.slice(1).map((row, rIdx) => (
                <tr key={`tr-${rIdx}`} className="hover:bg-white/5 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={`td-${cIdx}`} className="p-2 border-r border-white/5 last:border-0">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      isTable = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Table parsing: begins and ends with |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList(`pre-table-${idx}`);
      isTable = true;
      const cells = trimmed
        .split('|')
        .slice(1, -1)
        .map(c => {
          // Parse bold inside cell
          const cellText = c.trim();
          return parseInlineMarkdown(cellText);
        });
      tableRows.push(cells);
      return;
    } else if (isTable) {
      flushTable(`table-end-${idx}`);
    }

    // List item parsing: starts with - or *
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.substring(2);
      listItems.push(
        <li key={`li-${idx}`} className="text-xs">
          {parseInlineMarkdown(content)}
        </li>
      );
      return;
    } else {
      flushList(`list-end-${idx}`);
    }

    // Header parsing: e.g. ### Title
    if (trimmed.startsWith('### ')) {
      renderedElements.push(
        <h5 key={`h5-${idx}`} className="text-xs font-bold text-white mt-3 mb-1">
          {parseInlineMarkdown(trimmed.substring(4))}
        </h5>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      renderedElements.push(
        <h4 key={`h4-${idx}`} className="text-sm font-extrabold text-blue-400 mt-4 mb-2">
          {parseInlineMarkdown(trimmed.substring(3))}
        </h4>
      );
      return;
    }

    // Normal paragraph
    if (trimmed === '') {
      renderedElements.push(<div key={`space-${idx}`} className="h-2" />);
    } else {
      renderedElements.push(
        <p key={`p-${idx}`} className="text-xs text-neutral-300 leading-relaxed">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  // Final flush
  flushList('final');
  flushTable('final');

  return <div className="space-y-1.5">{renderedElements}</div>;
}

// Sub-parser for bolding **text** or inline code `code`
function parseInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let keyIdx = 0;

  // Process bold formatting **...** and inline code `...`
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const matches = currentText.split(regex);

  if (matches.length === 1) {
    return text;
  }

  matches.forEach((part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      parts.push(
        <strong key={`b-${keyIdx++}`} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      parts.push(
        <code key={`code-${keyIdx++}`} className="font-mono bg-neutral-950 border border-white/5 rounded px-1 text-[10px] text-violet-300">
          {part.slice(1, -1)}
        </code>
      );
    } else {
      parts.push(part);
    }
  });

  return <span key={`inline-wrapper`}>{parts}</span>;
}

export function ChatPanel({ analysis }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Hook details
  const { messages, status, error, sendMessage, clearHistory } = useChat();

  const isStreaming = status === 'streaming';

  // Auto scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const presetQuestions = [
    'Why did you recommend Buy?',
    'What are the biggest risks?',
    'Compare with Microsoft.',
  ];

  const handleSend = (text: string) => {
    if (!text.trim() || isStreaming) return;
    sendMessage(analysis.overallInvestmentScore.value.toString(), text, analysis);
    setInput('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleRegenerate = () => {
    if (messages.length < 2 || isStreaming) return;
    // Find last user message
    const userMsgs = messages.filter((m) => m.role === 'user');
    const lastUser = userMsgs[userMsgs.length - 1];
    if (!lastUser || isStreaming) return;
    const lastUserContent = lastUser.content;
    
    // Pop last assistant message and user message from list before resending
    sendMessage(analysis.overallInvestmentScore.value.toString(), lastUserContent, analysis);
  };

  const handleExport = () => {
    if (messages.length === 0) return;
    const textContent = messages
      .map((m) => `[${m.role.toUpperCase()}] (${m.createdAt})\n${m.content}\n\n`)
      .join('---\n\n');
    
    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${analysis.overallInvestmentScore.value}_chat_history.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mb-4 mr-2 h-[540px] w-[380px] rounded-2xl border border-white/10 bg-neutral-900/90 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-neutral-950/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Research Co-Pilot</h4>
                  <span className="text-[9px] text-neutral-500 font-mono">STRICT FACTS AGENT</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {messages.length > 0 && (
                  <>
                    <button
                      onClick={handleExport}
                      title="Export History"
                      className="rounded-lg p-1 text-neutral-500 hover:bg-white/5 hover:text-white"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={clearHistory}
                      title="Clear Chat"
                      className="rounded-lg p-1 text-neutral-500 hover:bg-white/5 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-neutral-500 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Static Welcome Message if history is empty */}
              {messages.length === 0 && (
                <div className="flex gap-2.5 justify-start">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-800 p-1 text-[10px] text-blue-400 font-bold border border-white/5">
                    <Cpu className="h-3 w-3" />
                  </div>
                  <div className="rounded-xl px-3 py-2 text-xs bg-neutral-950/40 border border-white/5 text-neutral-300 rounded-tl-none space-y-2">
                    <p>Hello! I am your AI Investment Research Co-Pilot.</p>
                    <p>I have read the complete equity report. Ask me follow-up questions about scores, SWOT indicators, or catalyst details. I will answer **only** using facts from the report.</p>
                  </div>
                </div>
              )}

              {/* Hook Messages */}
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-800 p-1 text-[10px] text-blue-400 font-bold border border-white/5">
                        <Cpu className="h-3 w-3" />
                      </div>
                    )}
                    <div className="group relative max-w-[80%]">
                      <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-neutral-950/40 border border-white/5 text-neutral-300 rounded-tl-none'}`}>
                        {isUser ? msg.content : renderMarkdown(msg.content)}
                      </div>
                      
                      {/* Copy Helper for AI replies */}
                      {!isUser && msg.content && (
                        <div className="absolute right-2 -bottom-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 px-1 py-0.5 rounded border border-white/5">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title="Copy Response"
                            className="text-neutral-500 hover:text-white"
                          >
                            {copiedId === msg.id ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                    {isUser && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-500/10 p-1 text-[10px] text-blue-400 font-bold border border-blue-500/20">
                        <User className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Bounce Indicator */}
              {isStreaming && messages[messages.length - 1]?.content === '' && (
                <div className="flex gap-2.5 justify-start">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-800 p-1 text-[10px] text-blue-400 font-bold border border-white/5 animate-pulse">
                    <Cpu className="h-3 w-3" />
                  </div>
                  <div className="rounded-xl px-3 py-2.5 text-xs bg-neutral-950/40 border border-white/5 text-neutral-500 rounded-tl-none flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Error messages */}
              {error && (
                <div className="rounded-lg border border-red-500/15 bg-red-500/5 p-3 text-[10px] text-red-400 leading-relaxed">
                  Error generating streamed response: {error}
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Presets */}
            {messages.length === 0 && (
              <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-white/5 bg-neutral-950/20">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="rounded-full border border-white/5 bg-neutral-900 px-2.5 py-1 text-[9px] text-neutral-400 hover:border-white/10 hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Controls panel: copy, clear, regenerate */}
            {messages.length > 1 && !isStreaming && (
              <div className="px-4 py-1.5 flex items-center justify-between border-t border-white/5 bg-neutral-950/10">
                <span className="text-[9px] text-neutral-500 font-mono">Ready</span>
                <button
                  onClick={handleRegenerate}
                  className="inline-flex items-center gap-1 text-[9px] text-neutral-400 hover:text-white bg-neutral-950/40 px-2 py-0.5 rounded border border-white/5"
                >
                  <RefreshCw className="h-2.5 w-2.5" /> Regenerate last response
                </button>
              </div>
            )}

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2 border-t border-white/5 bg-neutral-950/40 p-3"
            >
              <input
                type="text"
                placeholder="Ask co-pilot a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isStreaming}
                className="w-full rounded-lg border border-white/5 bg-neutral-900/60 px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-blue-500/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow shadow-blue-500/20 hover:scale-102 active:scale-98 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-transform"
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    </div>
  );
}
