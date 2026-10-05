import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DatabaseKafkaGuideModal from './components/DatabaseKafkaGuideModal';
import GeminiKeyModal from './components/GeminiKeyModal';

import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Jobs from './pages/Jobs';
import Interviews from './pages/Interviews';
import RagAssistant from './pages/RagAssistant';
import AgentStudio from './pages/AgentStudio';
import McpHub from './pages/McpHub';
import Observability from './pages/Observability';

import { ragApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isGeminiSet, setIsGeminiSet] = useState(false);
  const [screeningCandidate, setScreeningCandidate] = useState(null);

  useEffect(() => {
    checkGeminiKeyStatus();
  }, []);

  const checkGeminiKeyStatus = async () => {
    try {
      const res = await ragApi.getKeyStatus();
      setIsGeminiSet(res.data?.configured || false);
    } catch (err) {
      console.warn("Could not check Gemini key status:", err.message);
    }
  };

  const handleRunScreening = (candidate) => {
    setScreeningCandidate(candidate);
    setActiveTab('agent-studio');
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenGeminiModal={() => setIsGeminiModalOpen(true)}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        isGeminiSet={isGeminiSet}
      />

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard setActiveTab={setActiveTab} />
          )}
          {activeTab === 'candidates' && (
            <Candidates onRunScreening={handleRunScreening} />
          )}
          {activeTab === 'jobs' && (
            <Jobs />
          )}
          {activeTab === 'interviews' && (
            <Interviews />
          )}
          {activeTab === 'rag' && (
            <RagAssistant
              onOpenGeminiModal={() => setIsGeminiModalOpen(true)}
              isGeminiSet={isGeminiSet}
            />
          )}
          {activeTab === 'agent-studio' && (
            <AgentStudio initialCandidate={screeningCandidate} />
          )}
          {activeTab === 'mcp-hub' && (
            <McpHub />
          )}
          {activeTab === 'observability' && (
            <Observability />
          )}
        </main>
      </div>

      {/* Global Configuration Modals */}
      <DatabaseKafkaGuideModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />

      <GeminiKeyModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        onKeyUpdated={(status) => setIsGeminiSet(status)}
      />
    </div>
  );
}
