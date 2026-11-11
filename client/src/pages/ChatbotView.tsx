import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { AudioPlayer } from '../components/common/AudioPlayer';
import {
  MessageSquare,
  Send,
  PlusCircle,
  Sparkles,
  Bot,
  User,
  Trash2,
  AlertCircle,
  HelpCircle,
  Tag
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  category?: string;
  key_points?: string[];
  follow_up_question?: string;
}

export const ChatbotView: React.FC = () => {
  const { language, t } = useLanguage();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await api.getChatConversations();
      if (res.success && res.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !activeConvId) {
          selectConversation(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const selectConversation = async (convId: string) => {
    setActiveConvId(convId);
    setErrorMsg(null);
    try {
      const res = await api.getChatMessages(convId);
      if (res.success && res.data) {
        setMessages(
          res.data.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content
          }))
        );
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const startNewConversation = () => {
    setActiveConvId(null);
    setMessages([]);
    setErrorMsg(null);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setErrorMsg(null);
    setInputText('');

    // Optimistically append user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const res = await api.sendChatMessage({
        conversationId: activeConvId || undefined,
        message: text,
        preferredLanguage: language
      });

      if (res.success && res.data) {
        const aiData = res.data;
        if (!activeConvId && aiData.conversationId) {
          setActiveConvId(aiData.conversationId);
          loadConversations();
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: aiData.answer,
          category: aiData.category,
          key_points: aiData.key_points,
          follow_up_question: aiData.follow_up_question
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setErrorMsg(res.message || 'Failed to get answer from Krishi Mitra.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with assistant.');
    } finally {
      setIsSending(false);
    }
  };

  const sampleQuestions = [
    'Which crop is best suited for black soil in rabi season?',
    'How can I control leaf curl virus in tomato organically?',
    'What are the symptoms of potassium deficiency in maize?',
    'How much water is saved using drip irrigation in cotton?'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[78vh]">
        {/* Sidebar */}
        <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-agri-700" />
              <span>Consultations</span>
            </h3>
            <button
              onClick={startNewConversation}
              className="p-1 text-agri-700 hover:text-agri-800 hover:bg-agri-100 rounded-lg transition-colors"
              title="New Consultation"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => selectConversation(c.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium truncate transition-all ${
                  activeConvId === c.id
                    ? 'bg-agri-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                {c.title}
              </button>
            ))}

            {conversations.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No previous chats.</p>
            )}
          </div>
        </div>

        {/* Chat Main Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Krishi Mitra AI Assistant</h2>
                <p className="text-[11px] text-slate-500">Ask in English, ಕನ್ನಡ, or हिन्दी</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              Online
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-10">
                <div className="w-14 h-14 rounded-2xl bg-agri-100 flex items-center justify-center text-agri-700 mb-4 shadow-inner">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">How can Krishi Mitra help you today?</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Ask about soil preparation, pest control, crop duration, or government package of practices.
                </p>

                <div className="w-full space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Try Asking:
                  </span>
                  {sampleQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-agri-400 bg-slate-50 hover:bg-agri-50/40 text-xs text-slate-700 transition-all font-medium"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start space-x-3 ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-agri-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                      m.role === 'user'
                        ? 'bg-agri-700 text-white font-medium rounded-tr-xs shadow-xs'
                        : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {m.category && (
                      <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white/80 text-[10px] font-bold text-slate-600 uppercase border border-slate-200">
                        <Tag className="w-3 h-3 text-agri-600" />
                        <span>Topic: {m.category}</span>
                      </div>
                    )}

                    {m.key_points && m.key_points.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/80">
                        <span className="font-bold block text-[11px] mb-1">Key Takeaways:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {m.key_points.map((kp, idx) => (
                            <li key={idx}>{kp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {m.follow_up_question && (
                      <div className="pt-2 border-t border-slate-200/80">
                        <button
                          onClick={() => handleSendMessage(m.follow_up_question)}
                          className="text-left font-bold text-agri-800 hover:text-agri-900 bg-agri-100/70 hover:bg-agri-200 p-2 rounded-lg transition-colors block w-full text-[11px]"
                        >
                          👉 Follow up: "{m.follow_up_question}"
                        </button>
                      </div>
                    )}

                    {m.role === 'assistant' && (
                      <div className="pt-1 flex justify-end">
                        <AudioPlayer text={m.content} langCode={language} />
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isSending && (
              <div className="flex items-center space-x-3 text-xs text-slate-500 py-2">
                <div className="w-8 h-8 rounded-lg bg-agri-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-xs flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-agri-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-agri-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-agri-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium text-slate-500 ml-1">Krishi Mitra is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-slate-200 bg-white">
            {errorMsg && (
              <p className="text-xs text-rose-600 mb-2 font-medium">{errorMsg}</p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask any farming question..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-agri-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="px-5 py-3 bg-agri-600 hover:bg-agri-700 text-white rounded-xl font-bold shadow-xs transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

