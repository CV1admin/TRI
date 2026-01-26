
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TABS } from './constants';
import { TabType, QuantumState, LogEntry, ChatMessage } from './types';
import { QuantumVisualizer } from './components/QuantumVisualizer';
import { generateQuantumReasoning, startQuantumChat } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  Terminal, 
  Send, 
  Play, 
  RotateCcw, 
  History, 
  Settings, 
  Box, 
  Database,
  ArrowRight,
  BrainCircuit,
  Activity,
  Code
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.SIMULATE);
  const [fieldInput, setFieldInput] = useState('ϕ₁ + Ξα');
  const [intensity, setIntensity] = useState(1);
  const [quantumLogs, setQuantumLogs] = useState<LogEntry[]>([]);
  const [chartData, setChartData] = useState<QuantumState[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [physicsCode, setPhysicsCode] = useState(`// Physics-as-Code Editor\n// Define the evolutionary logic of the quantum field\n\nfunction evolve(field) {\n  const entropy = Math.random() * 0.1;\n  const coherence = field.coherence * 0.98;\n  \n  return {\n    ...field,\n    entropy,\n    coherence\n  };\n}`);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Initialize Data
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const last = prev[prev.length - 1] || { entropy: 0.5, coherence: 0.8, stability: 0.9, timestamp: Date.now() };
        const next = {
          entropy: Math.max(0.1, Math.min(0.9, last.entropy + (Math.random() - 0.5) * 0.1)),
          coherence: Math.max(0.1, Math.min(1, last.coherence + (Math.random() - 0.5) * 0.05)),
          stability: Math.max(0, Math.min(1, last.stability + (Math.random() - 0.5) * 0.08)),
          timestamp: Date.now(),
        };
        return [...prev.slice(-19), next];
      });
    }, 2000);

    addLog('System', 'Quantum Stack Initialized (v2.5-flash-native)');
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const addLog = (type: LogEntry['type'] | 'System', message: string) => {
    const log: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type: type === 'System' ? 'info' : type as any,
      message
    };
    setQuantumLogs(prev => [log, ...prev].slice(0, 50));
  };

  const handleSimulate = () => {
    addLog('quantum', `Field Simulation Cycle triggered with input: ${fieldInput}`);
    setIntensity(prev => prev === 1 ? 2.5 : 1);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;

    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsProcessing(true);

    try {
      const response = await generateQuantumReasoning(chatInput);
      setChatMessages(prev => [...prev, { role: 'model', text: response }]);
      addLog('info', 'AI Reasoning Engine synchronized');
    } catch (error) {
      addLog('error', `AI Reasoning failure: ${error instanceof Error ? error.message : 'Unknown disconnect'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BrainCircuit className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-slate-400">
              Civilisation.one <span className="text-blue-500 text-sm font-medium ml-2">Quantum Stack</span>
            </h1>
            <p className="text-[10px] mono text-slate-500 uppercase tracking-widest">Temporal Reality Interface</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Core Stable</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="text-blue-500" size={14} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">7.42 THz</span>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 overflow-hidden bg-slate-950 relative">
        
        {/* Sidebar Nav */}
        <nav className="w-20 md:w-64 border-r border-slate-800 bg-slate-950/50 flex flex-col z-10">
          <div className="p-4 flex-1 space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${
                  activeTab === tab.id 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_-5px_rgba(37,99,235,0.4)]' 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <span className={`${activeTab === tab.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {tab.icon}
                </span>
                <span className="hidden md:block text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 mt-auto">
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/50">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Cluster Load</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-2/3 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <section className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Tab Views */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {activeTab === TabType.SIMULATE && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="h-[400px] md:h-[500px]">
                    <QuantumVisualizer input={fieldInput} intensity={intensity} />
                  </div>
                  
                  <div className="glass p-6 rounded-2xl border border-slate-800/50 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1 space-y-2 w-full">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Field Expression Vector</label>
                        <div className="relative group">
                          <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                          <input 
                            value={fieldInput}
                            onChange={(e) => setFieldInput(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-blue-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all mono text-sm"
                            placeholder="e.g. quantum.entangle(particle_A, particle_B)"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={handleSimulate}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95 whitespace-nowrap"
                      >
                        <Play size={18} fill="currentColor" />
                        Execute Evolution
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass p-6 rounded-2xl border border-slate-800/50 h-[300px]">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity size={14} className="text-emerald-500" />
                      Live Metrics
                    </h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="timestamp" hide />
                          <YAxis domain={[0, 1]} hide />
                          <Tooltip 
                            contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} 
                            labelStyle={{ display: 'none' }}
                          />
                          <Line type="monotone" dataKey="coherence" stroke="#10b981" strokeWidth={2} dot={false} animationDuration={300} />
                          <Line type="monotone" dataKey="entropy" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={300} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Coherence</p>
                        <p className="text-emerald-400 font-bold">{(chartData[chartData.length - 1]?.coherence * 100 || 0).toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Entropy</p>
                        <p className="text-blue-400 font-bold">{(chartData[chartData.length - 1]?.entropy * 100 || 0).toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Stability</p>
                        <p className="text-indigo-400 font-bold">{(chartData[chartData.length - 1]?.stability * 100 || 0).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-2xl border border-slate-800/50 flex-1 flex flex-col h-[calc(100%-324px)] min-h-[400px]">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <History size={14} />
                      Quantum Event Log
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {quantumLogs.map((log) => (
                        <div key={log.id} className="border-l-2 border-slate-800 pl-4 py-1 animate-in fade-in slide-in-from-left-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                              log.type === 'error' ? 'text-rose-500' : 
                              log.type === 'warning' ? 'text-amber-500' :
                              log.type === 'quantum' ? 'text-blue-400' : 'text-slate-500'
                            }`}>{log.type}</span>
                            <span className="text-[10px] text-slate-600 mono">{log.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-medium">{log.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === TabType.REASON && (
              <div className="max-w-4xl mx-auto h-full flex flex-col gap-6">
                <div className="glass flex-1 rounded-2xl border border-slate-800/50 overflow-hidden flex flex-col relative">
                  <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                      <BrainCircuit size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200">AI Reasoning Core</h3>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Gemini-3 Pro Neural Link</p>
                    </div>
                  </div>

                  <div 
                    ref={chatScrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
                  >
                    {chatMessages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <Box size={48} className="mb-4 text-blue-500" />
                        <h4 className="text-lg font-bold text-slate-300">Neural Link Idle</h4>
                        <p className="text-sm text-slate-500 max-w-xs">Initialize a reasoning sequence to interact with the core stack intelligence.</p>
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' 
                            : 'bg-slate-900 border border-slate-800 text-slate-300'
                        }`}>
                          {msg.role === 'model' && (
                            <div className="text-[10px] font-bold uppercase text-blue-400 mb-2 tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                              Intelligence Response
                            </div>
                          )}
                          <div className="whitespace-pre-wrap">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex justify-start animate-pulse">
                        <div className="bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl px-5 py-4 text-xs italic">
                          Synchronizing dimensional context...
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-950 border-t border-slate-800">
                    <div className="relative group">
                      <input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isProcessing}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-6 pr-14 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm"
                        placeholder="Ask the core intelligence about the Ξα field..."
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim() || isProcessing}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-lg transition-all shadow-lg"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-600 mt-2 text-center uppercase font-bold tracking-widest">
                      Note: High-entropy queries may result in divergent reasoning.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === TabType.MEMORY && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="glass group cursor-pointer hover:border-blue-500/50 p-5 rounded-2xl border border-slate-800/50 transition-all flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-slate-900 rounded-lg text-slate-400 group-hover:text-blue-400 transition-colors">
                        <Database size={20} />
                      </div>
                      <span className="text-[10px] mono text-slate-600">SNAPSHOT {1024 - i * 42}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">Temporal Node {i+1}</h4>
                      <p className="text-xs text-slate-500 mt-1">Stored at: {new Date(Date.now() - i * 3600000).toLocaleTimeString()}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full border border-slate-950 bg-blue-500/20" />
                         <div className="w-6 h-6 rounded-full border border-slate-950 bg-indigo-500/20" />
                      </div>
                      <button className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 group">
                        Restore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === TabType.CODE && (
              <div className="h-full flex flex-col gap-6">
                <div className="flex-1 glass rounded-2xl border border-slate-800/50 overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Code className="text-blue-400" size={18} />
                      <h3 className="text-sm font-bold text-slate-200">Equation Editor <span className="text-slate-500 ml-2 font-normal">main.phys</span></h3>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-colors flex items-center gap-2">
                         <RotateCcw size={14} /> Reset
                       </button>
                       <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                         <Play size={14} fill="currentColor" /> Compile Physics
                       </button>
                    </div>
                  </div>
                  <textarea 
                    value={physicsCode}
                    onChange={(e) => setPhysicsCode(e.target.value)}
                    className="flex-1 bg-slate-950 p-6 text-emerald-500/90 mono text-sm focus:outline-none resize-none selection:bg-blue-500/30 leading-relaxed"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Status Bar */}
          <footer className="h-8 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Status</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Active Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Entropy</span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">0.042 ζ</span>
              </div>
            </div>
            <div className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              Ξα Engine 2.0.4-preview
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
