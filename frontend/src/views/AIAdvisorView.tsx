import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2, Send } from 'lucide-react';
import { glass } from '../shared';

const Reflection = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0" />
);

interface Props {
  aiModel?: 'gemini' | 'claude' | 'gpt4' | 'hybrid';
  creatorName?: string;
  niche?: string;
  sourceUrl?: string;
  contextData?: string;
}

export default function AIAdvisorView({ aiModel = 'gemini', creatorName = 'Creator', niche = 'General', sourceUrl, contextData }: Props) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: `Hi ${creatorName}! I'm your AI Advisor. Ask me anything about growing your ${niche} business — strategy, revenue, content, and more.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setMessages(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('/api/oracle/chat', {
        question: q,
        context: { name: creatorName, niche: niche, sourceUrl, contextData },
        model: aiModel
      });
      const d = res.data;
      const reply = `${d.recommendation}\n\n💰 Projected Revenue: ${d.projectedRevenue}\n📊 Confidence: ${d.confidenceScore}%\n⚠️ Risks: ${(d.risks || []).join(', ')}`;
      setMessages(m => [...m, { role: 'ai', text: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Sorry, I could not process your request. Please check your API keys.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Should I launch a course or focus on sponsorships?',
    'How can I increase my engagement rate?',
    'What type of content should I create next?',
    'How do I monetize my audience of 48K?',
  ];

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-1">AI Advisor</h2>
        <p className="text-white/50">Your personal strategic intelligence engine.</p>
      </div>

      <div className={`${glass} rounded-3xl flex flex-col flex-1 p-6`} style={{ minHeight: '520px' }}>
        <Reflection />
        <div className="relative z-10 flex flex-col flex-1">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1" style={{ maxHeight: '420px' }}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-purple-600/70 text-white rounded-br-md'
                    : 'bg-white/8 border border-white/10 text-white/90 rounded-bl-md'
                }`}>
                  {m.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/8 border border-white/10 px-5 py-3 rounded-2xl rounded-bl-md flex items-center gap-2 text-white/60 text-sm">
                  <Loader2 size={14} className="animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map(s => (
                <button key={s} onClick={() => setInput(s)}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all px-3 py-1.5 rounded-full text-xs text-white/70 hover:text-white">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask your AI Advisor anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all"
            />
            <button onClick={send} disabled={loading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
