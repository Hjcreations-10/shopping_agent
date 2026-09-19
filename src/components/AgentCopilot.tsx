import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  ChevronDown,
  ChevronUp,
  Cpu,
  Bot,
  Zap,
  ArrowRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Utensils,
  TrendingDown,
  CheckCircle2,
  Activity,
  Lightbulb
} from 'lucide-react';
import { AgentMessage, AgentPlanResponse, ProductCategory } from '../types';
import { joyAudio, fireMiniSparkleConfetti } from '../utils/joyEffects';

interface AgentCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: AgentPlanResponse | null;
  onReplan: (query: string) => void;
  geminiApiKey?: string;
  onOpenSettings?: () => void;
}

const DEFAULT_CHIPS = [
  { label: '🍳 15-Min Dinner Recipe', query: 'What quick dinner can I cook with the items in my basket?' },
  { label: '💰 Trim ₹300 from Budget', query: 'How can I save ₹300 on this basket while keeping good nutrition?' },
  { label: '💪 Protein Breakdown', query: 'What is the daily protein breakdown of this basket per person?' },
  { label: '🔍 Explain Selections', query: 'Why did you pick these specific items instead of other brands?' }
];

export const AgentCopilot: React.FC<AgentCopilotProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onReplan,
  geminiApiKey,
  onOpenSettings
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome',
      role: 'agent',
      content: "Hello! I'm **ShopPilot AI Co-Pilot**. I'm actively monitoring your basket, budget, and nutritional balance. Ask me anything, request custom recipes, or tell me how to refine your cart!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thought: 'Initialized multi-turn shopping assistant in active session memory.',
      toolUsed: 'ShopPilot.agentCore'
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle Speech Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[#•\-_]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechEnabled(false);
    } else {
      setSpeechEnabled(true);
      const lastAgentMsg = [...messages].reverse().find(m => m.role === 'agent');
      if (lastAgentMsg) {
        speakText(lastAgentMsg.content);
      }
    }
  };

  // Voice Input (Web Speech Recognition)
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        setIsListening(true);
        joyAudio.playPop();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        setInput('Can we find a cheaper alternative for the pulses?');
        setIsListening(false);
      }, 1000);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isThinking) return;

    const userMsg: AgentMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    joyAudio.playPop();

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiApiKey ? { 'x-gemini-api-key': geminiApiKey } : {})
        },
        body: JSON.stringify({
          message: query,
          previousState: currentPlan,
          sessionId: currentPlan?.sessionId
        })
      });

      if (res.ok) {
        const data = await res.json();
        const agentMsg: AgentMessage = {
          id: `agent-${Date.now()}`,
          role: 'agent',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          thought: data.thought,
          toolUsed: data.toolUsed,
          suggestedAction: data.suggestedAction
        };
        setMessages(prev => [...prev, agentMsg]);
        joyAudio.playSparkle();

        if (speechEnabled) {
          speakText(data.reply);
        }
      } else {
        throw new Error('Failed to get agent response');
      }
    } catch {
      // Fallback
      const fallbackMsg: AgentMessage = {
        id: `agent-err-${Date.now()}`,
        role: 'agent',
        content: `I analyzed your request: "${query}". Based on your budget of ₹${currentPlan?.basket.budget.toLocaleString() || '2,500'}, I recommend keeping whole staples intact and adjusting non-essential items.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        thought: 'Fallback heuristic response triggered.',
        toolUsed: 'BasketOptimizer.heuristic'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleActionClick = (action: NonNullable<AgentMessage['suggestedAction']>) => {
    joyAudio.playCelebrationChime();
    fireMiniSparkleConfetti();
    if (action.type === 'replan') {
      onReplan(action.payload);
      onClose();
    } else {
      handleSendMessage(`Execute action: ${action.label}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Floating Animated Co-Pilot Window */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[92vw] sm:w-[420px] h-[580px] bg-white/95 backdrop-blur-xl border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-3 ui-glow-emerald"
          >
            {/* Co-Pilot Header */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-3.5 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center space-x-2.5">
                {/* Reactive Agent Orb in Header */}
                <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-sm">
                  {isThinking ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-xl border border-dashed border-white"
                    />
                  ) : null}
                  <Bot className="w-4 h-4 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-stone-900" />
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold font-['Outfit']">ShopPilot AI Co-Pilot</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                      {geminiApiKey ? '⚡ Gemini' : '🧠 ADK Engine'}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-time autonomous shopping agent</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {/* Voice Narration Audio Toggle */}
                <button
                  onClick={toggleSpeech}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    speechEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                  title={speechEnabled ? 'Mute AI Voice' : 'Enable AI Voice Narration'}
                >
                  {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Minimize Button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Minimize Co-Pilot"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Close Co-Pilot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Voice Speaking Visualizer */}
            {isSpeaking && (
              <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-3 py-1.5 flex items-center justify-between text-xs text-emerald-800">
                <span className="text-[11px] font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>ShopPilot Speaking...</span>
                </span>
                <div className="flex items-center space-x-1 h-3">
                  <span className="w-0.5 bg-emerald-600 rounded-full ui-soundwave-bar" />
                  <span className="w-0.5 bg-emerald-600 rounded-full ui-soundwave-bar" />
                  <span className="w-0.5 bg-emerald-600 rounded-full ui-soundwave-bar" />
                  <span className="w-0.5 bg-emerald-600 rounded-full ui-soundwave-bar" />
                  <span className="w-0.5 bg-emerald-600 rounded-full ui-soundwave-bar" />
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-stone-50/50">
              {messages.map((msg) => {
                const isAgent = msg.role === 'agent';
                const isThoughtExpanded = expandedThoughtId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {isAgent && (
                        <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-xs mb-1">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                          isAgent
                            ? 'bg-white text-stone-900 border border-stone-200'
                            : 'bg-emerald-600 text-white font-medium'
                        }`}
                      >
                        {/* Markdown / Text rendering */}
                        <div className="whitespace-pre-line">{msg.content}</div>

                        {/* Tool Executed Chip */}
                        {msg.toolUsed && (
                          <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center gap-1 text-[10px] text-stone-400 font-mono">
                            <Cpu className="w-3 h-3 text-indigo-500" />
                            <span>Tool: {msg.toolUsed}</span>
                          </div>
                        )}

                        {/* Suggested Cart Action Button */}
                        {msg.suggestedAction && (
                          <div className="mt-2 pt-2 border-t border-emerald-100">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleActionClick(msg.suggestedAction!)}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-300" />
                                <span>{msg.suggestedAction.label}</span>
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Agent Chain-of-Thought Toggle */}
                    {msg.thought && (
                      <div className="ml-8 mt-1">
                        <button
                          onClick={() => setExpandedThoughtId(isThoughtExpanded ? null : msg.id)}
                          className="inline-flex items-center gap-1 text-[10px] text-stone-600 hover:text-emerald-700 font-mono transition-colors cursor-pointer"
                        >
                          <Lightbulb className="w-2.5 h-2.5 text-amber-500" />
                          <span>{isThoughtExpanded ? 'Hide agent thought trace' : 'Inspect agent thought trace'}</span>
                          {isThoughtExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                        </button>

                        {isThoughtExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 p-2 rounded-lg bg-stone-900 text-emerald-300 text-[11px] font-mono border border-stone-800 shadow-inner max-w-sm"
                          >
                            <div className="flex items-center gap-1 text-[10px] text-stone-400 mb-1">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                              <span>INTERNAL AGENT REASONING:</span>
                            </div>
                            <p>{msg.thought}</p>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Agent Thinking Live State */}
              {isThinking && (
                <div className="flex items-center space-x-2 text-xs text-stone-500 bg-white border border-emerald-200/80 p-3 rounded-2xl shadow-xs w-fit">
                  <div className="relative w-4 h-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600"></span>
                  </div>
                  <span className="font-medium text-emerald-800 animate-pulse">
                    ShopPilot reasoning & checking constraints...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-3 py-2 bg-stone-100/80 border-t border-stone-200/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
              {DEFAULT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.query)}
                  disabled={isThinking}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-stone-200 text-[11px] font-medium text-stone-700 transition-colors shadow-2xs cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-stone-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer flex-shrink-0 ${
                    isListening
                      ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                      : 'bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200 border-stone-200'
                  }`}
                  title="Speak to Agent"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-600" />}
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isThinking}
                  placeholder={isListening ? 'Listening to your voice...' : 'Ask ShopPilot anything...'}
                  className="flex-1 text-xs sm:text-sm px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 placeholder:text-stone-400 font-medium"
                />

                {/* Send Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isThinking || !input.trim()}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Floating Orb Trigger */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          if (isMinimized) {
            setIsMinimized(false);
          } else {
            onClose();
          }
          joyAudio.playPop();
        }}
        className="relative group cursor-pointer"
        title="ShopPilot AI Assistant"
      >
        {/* Pulsing ambient aura */}
        <div className="absolute inset-0 rounded-full bg-emerald-400 blur-md opacity-40 group-hover:opacity-75 transition-opacity" />

        {/* 3D-like Glowing Agent Orb Button */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-white flex items-center justify-center shadow-lg border-2 border-white">
          <Bot className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />

          {/* Glowing Status Dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-xs flex items-center justify-center text-[8px] font-bold text-stone-900">
            AI
          </span>
        </div>
      </motion.button>
    </div>
  );
};
