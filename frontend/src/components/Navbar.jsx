import React from 'react';
import { Bot, Key, Database, Radio, Sparkles, Cpu, Layers } from 'lucide-react';

export default function Navbar({ onOpenGeminiModal, onOpenDbModal, isGeminiSet }) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">AI Recruitment</span>
              <span className="gradient-text font-black text-lg">Hub</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 rounded-full">
                Spring Boot v3.2
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-2">
              <span>Multi-Agent Orchestration</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1"></span>
                Microservices Active
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Kafka Badge */}
        <button 
          onClick={onOpenDbModal}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-purple-500/30 text-slate-300 hover:text-purple-300 text-xs font-medium flex items-center space-x-2 transition-all hover:border-purple-500/60"
        >
          <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Kafka Portal</span>
        </button>

        {/* Database Config Badge */}
        <button 
          onClick={onOpenDbModal}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-blue-500/30 text-slate-300 hover:text-blue-300 text-xs font-medium flex items-center space-x-2 transition-all hover:border-blue-500/60"
        >
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>External DB Specs</span>
        </button>

        {/* Gemini Key Config Button */}
        <button
          onClick={onOpenGeminiModal}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
            isGeminiSet 
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-md shadow-purple-500/20'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>{isGeminiSet ? 'Gemini API Connected' : 'Paste Gemini Key'}</span>
          {isGeminiSet && <Sparkles className="w-3 h-3 text-amber-300 animate-bounce" />}
        </button>
      </div>
    </header>
  );
}
