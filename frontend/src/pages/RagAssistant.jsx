import React, { useEffect, useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Send, 
  Key, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle, 
  Plus, 
  CheckCircle2, 
  FileText,
  Bookmark,
  ChevronRight
} from 'lucide-react';
import { ragApi } from '../services/api';

export default function RagAssistant({ onOpenGeminiModal, isGeminiSet }) {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Full Stack Java & React Engineer');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your AI Recruitment RAG Knowledge Assistant. Ask me anything about role requirements, company hiring policies, interview question banks, or compensation guidelines!',
      citations: [],
      engine: 'Gemini RAG Engine'
    }
  ]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Document Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('RECRUITMENT_POLICY');
  const [newRole, setNewRole] = useState('All Roles');
  const [newContent, setNewContent] = useState('');
  const [newKeywords, setNewKeywords] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await ragApi.getDocuments(selectedCategory);
      setDocuments(res.data || []);
    } catch (err) {
      console.error("Error fetching knowledge docs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = question;
    setQuestion('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsQuerying(true);

    try {
      const res = await ragApi.query(userMsg, targetRole);
      const data = res.data;
      setChatHistory(prev => [...prev, {
        sender: 'assistant',
        text: data.answer,
        citations: data.citations || [],
        engine: data.engine || 'Gemini RAG Engine'
      }]);
    } catch (err) {
      setChatHistory(prev => [...prev, {
        sender: 'assistant',
        text: "Error querying RAG knowledge base: " + (err.response?.data?.error || err.message),
        citations: []
      }]);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    try {
      await ragApi.addDocument({
        title: newTitle,
        docCategory: newCategory,
        targetRole: newRole,
        content: newContent,
        keywords: newKeywords
      });
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewKeywords('');
      fetchDocuments();
    } catch (err) {
      alert("Failed to add document: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 mb-1">
            <BrainCircuit className="w-4 h-4 text-purple-300" />
            <span>Phase 2: RAG Knowledge Assistant (Gemini API)</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Recruitment Knowledge Base & QA</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Ask role-specific questions, query hiring policy compliance guidelines, and generate interview questions backed by semantic context chunks.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenGeminiModal}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-md ${
              isGeminiSet 
                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-purple-500/20'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>{isGeminiSet ? 'Gemini API Connected' : 'Paste Gemini API Key'}</span>
            {isGeminiSet && <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-bounce" />}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Knowledge Doc</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive RAG QA Chat Assistant */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card border border-purple-500/20 flex flex-col justify-between h-[620px]">
          <div className="space-y-4 flex flex-col h-full overflow-hidden">
            {/* Chat Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Role-Specific RAG Assistant</h3>
                  <span className="text-[11px] text-slate-400">Context: JDs, Policies & Question Bank</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Target Role:</span>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="Senior Full Stack Java & React Engineer">Senior Full Stack Java Engineer</option>
                  <option value="AI / ML Lead">AI / ML Lead - Generative AI</option>
                  <option value="DevOps & Cloud Architect">DevOps & Cloud Architect</option>
                  <option value="All Roles">All Roles / Global Policy</option>
                </select>
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider block">
                          Knowledge Base Sources Cited:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.citations.map((c, ci) => (
                            <span key={ci} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                              📄 {c.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.engine && (
                      <div className="text-[10px] text-slate-500 font-mono text-right pt-1">
                        Engine: {msg.engine}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isQuerying && (
                <div className="flex justify-start">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30 text-purple-300 text-xs flex items-center space-x-2 animate-pulse">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                    <span>Gemini RAG Engine retrieving semantic chunks...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskQuestion} className="pt-3 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about role requirements, candidate guidelines, or interview questions..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={isQuerying || !question.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold flex items-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md shadow-purple-500/20"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Knowledge Base Document Library */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between h-[620px]">
          <div className="space-y-3 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Indexed Documents</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">{documents.length} Docs</span>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-2.5 py-1 rounded-lg ${selectedCategory === '' ? 'bg-purple-600 text-white font-semibold' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('RECRUITMENT_POLICY')}
                className={`px-2.5 py-1 rounded-lg ${selectedCategory === 'RECRUITMENT_POLICY' ? 'bg-purple-600 text-white font-semibold' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
              >
                Policies
              </button>
              <button
                onClick={() => setSelectedCategory('INTERVIEW_QUESTION_REPOSITORY')}
                className={`px-2.5 py-1 rounded-lg ${selectedCategory === 'INTERVIEW_QUESTION_REPOSITORY' ? 'bg-purple-600 text-white font-semibold' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
              >
                Question Bank
              </button>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loading ? (
                <div className="text-center text-slate-500 text-xs py-8">Loading knowledge chunks...</div>
              ) : documents.map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 hover:border-purple-500/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {doc.docCategory}
                    </span>
                    <span className="text-[10px] text-slate-500">{doc.targetRole}</span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-xs">{doc.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    {doc.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="text-base font-bold text-white">Add Knowledge Document</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddDocument} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Remote Office Equipment Stipend Policy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                  >
                    <option value="RECRUITMENT_POLICY">Recruitment Policy</option>
                    <option value="INTERVIEW_QUESTION_REPOSITORY">Interview Question Bank</option>
                    <option value="JOB_DESCRIPTION">Job Description</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Role</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Content *</label>
                <textarea
                  rows="4"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste policy text, guidelines, or interview questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
                >
                  Index into RAG Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
