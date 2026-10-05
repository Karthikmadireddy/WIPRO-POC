import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Search, 
  Play, 
  CheckCircle2, 
  Layers, 
  Wrench, 
  Bot, 
  FileText, 
  Award,
  ArrowRight,
  ShieldCheck,
  User,
  Briefcase
} from 'lucide-react';
import { agentApi, candidateApi, jobApi } from '../services/api';

export default function AgentStudio({ initialCandidate }) {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');

  // Natural Language Search State
  const [nlQuery, setNlQuery] = useState('Find candidates with 6+ years experience in Java and Spring Boot');
  const [nlSearchResults, setNlSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Multi-Agent Pipeline State
  const [isExecuting, setIsExecuting] = useState(false);
  const [pipelineResults, setPipelineResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [candRes, jobRes] = await Promise.all([
        candidateApi.getAll(),
        jobApi.getAll()
      ]);
      const cList = candRes.data || [];
      const jList = jobRes.data || [];
      setCandidates(cList);
      setJobs(jList);

      if (initialCandidate) {
        setSelectedCandidateId(initialCandidate.id);
      } else if (cList.length > 0) {
        setSelectedCandidateId(cList[0].id);
      }

      if (jList.length > 0) {
        setSelectedJobId(jList[0].id);
      }
    } catch (err) {
      console.error("Error initializing Agent Studio:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNlSearch = async (e) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await agentApi.naturalSearch(nlQuery);
      setNlSearchResults(res.data);
    } catch (err) {
      alert("Search failed: " + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRunPipeline = async () => {
    if (!selectedCandidateId || !selectedJobId) return;

    setIsExecuting(true);
    setPipelineResults(null);

    try {
      const res = await agentApi.executePipeline(
        parseInt(selectedCandidateId, 10),
        parseInt(selectedJobId, 10)
      );
      setPipelineResults(res.data);
    } catch (err) {
      alert("Pipeline execution failed: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-1">
            <Cpu className="w-4 h-4 text-blue-300" />
            <span>Phase 3: Context-Aware Agents & Tool Calling</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Agent Studio & Tool Execution</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Natural language talent discovery search, autonomous resume screening agent, evaluation agent, interview prep agent, and hiring recommendation engine.
          </p>
        </div>
      </div>

      {/* Section 1: Natural Language Talent Search */}
      <div className="p-6 rounded-2xl glass-card border border-blue-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-white text-sm">
            <Search className="w-5 h-5 text-blue-400" />
            <span>Recruiter Natural Language Talent Discovery</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
            NL Parsing Active
          </span>
        </div>

        <form onSubmit={handleNlSearch} className="flex gap-3">
          <input
            type="text"
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            placeholder="Type natural language candidate requirements (e.g. Find candidates with 6+ years experience in Java and Spring Boot)..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isSearching || !nlQuery.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold flex items-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md shadow-blue-500/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isSearching ? 'Searching...' : 'Search Talent'}</span>
          </button>
        </form>

        {nlSearchResults && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <p className="text-xs text-purple-300 font-medium">💡 Agent Reasoning: {nlSearchResults.agentReasoning}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {nlSearchResults.candidates.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-200">{item.candidate.fullName}</h4>
                    <p className="text-[11px] text-slate-400">{item.candidate.title} • {item.candidate.yearsExperience} Yrs Exp</p>
                    <span className="text-[10px] text-slate-500">{item.relevanceExplanation}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.searchMatchScore}% Fit
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Multi-Agent Collaboration Workflow Setup */}
      <div className="p-6 rounded-2xl glass-card border border-purple-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <span>Execute 4-Agent Collaboration Pipeline with Tool Calling</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">ScreeningAgent ➔ EvaluationAgent ➔ InterviewAgent ➔ HiringRecommendationAgent</p>
          </div>

          <button
            onClick={handleRunPipeline}
            disabled={isExecuting || !selectedCandidateId || !selectedJobId}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-xs font-bold flex items-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-purple-500/20"
          >
            <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{isExecuting ? 'Agents Executing Pipeline...' : 'Run Autonomous Multi-Agent Pipeline'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Candidate for Evaluation *</label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.fullName} ({c.title})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Target Job Requisition *</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.jobCode} - {j.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pipeline Execution Display */}
        {isExecuting && (
          <div className="p-8 rounded-xl bg-slate-950 border border-purple-500/40 text-center space-y-3 animate-pulse">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto animate-spin" />
            <h4 className="font-bold text-purple-300 text-sm">Autonomous Multi-Agent Collaboration Active</h4>
            <p className="text-xs text-slate-400">Invoking parseResumeTool() & scoreCandidateMatchTool(), generating interview questions, and creating trace logs...</p>
          </div>
        )}

        {pipelineResults && (
          <div className="space-y-6 pt-2">
            {/* Final Recommendation Card */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Synthesis Result</span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Recommendation: <span className="text-emerald-400">{pipelineResults.recommendation}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Candidate {pipelineResults.candidate?.fullName} scored <strong className="text-emerald-300">{pipelineResults.matchScore}% match</strong> for {pipelineResults.job?.title}.
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono">
                Trace ID: {pipelineResults.traceId}
              </div>
            </div>

            {/* Tool Calling Details Box */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                <span>Tool Calling Payload Traces</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-blue-400 font-bold block mb-1">🔧 Tool: parseResumeTool</span>
                  <pre className="text-[10px] text-slate-300 overflow-x-auto">
                    {JSON.stringify(pipelineResults.toolCallingDetails?.parseResumeTool, null, 2)}
                  </pre>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-purple-400 font-bold block mb-1">🔧 Tool: scoreCandidateMatchTool</span>
                  <pre className="text-[10px] text-slate-300 overflow-x-auto">
                    {JSON.stringify(pipelineResults.toolCallingDetails?.scoreCandidateMatchTool, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Interview Prep Plan */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Interview Preparation Agent Output Plan</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {pipelineResults.interviewPlan?.map((q, qi) => (
                  <li key={qi} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start space-x-2">
                    <span className="font-bold text-purple-400">Q{qi + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
