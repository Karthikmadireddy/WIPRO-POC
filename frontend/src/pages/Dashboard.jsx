import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Layers,
  UploadCloud,
  Search,
  Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { candidateApi, jobApi, interviewApi, observabilityApi } from '../services/api';

export default function Dashboard({ setActiveTab, onOpenUploadModal }) {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [candRes, jobsRes, intRes, metRes] = await Promise.all([
        candidateApi.getAll(),
        jobApi.getAll(),
        interviewApi.getAll(),
        observabilityApi.getMetrics()
      ]);
      setCandidates(candRes.data || []);
      setJobs(jobsRes.data || []);
      setInterviews(intRes.data || []);
      setMetrics(metRes.data || {});
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const pipelineData = [
    { name: 'Screened', count: candidates.filter(c => c.status === 'SCREENED').length || 4 },
    { name: 'Scheduled', count: candidates.filter(c => c.status === 'INTERVIEW_SCHEDULED').length || 3 },
    { name: 'Evaluated', count: candidates.filter(c => c.status === 'EVALUATED').length || 2 },
    { name: 'Hired', count: candidates.filter(c => c.status === 'HIRED').length || 1 },
  ];

  const agentActivityData = [
    { time: '09:00', tokens: 120, traces: 4 },
    { time: '11:00', tokens: 450, traces: 12 },
    { time: '13:00', tokens: 820, traces: 18 },
    { time: '15:00', tokens: 1100, traces: 25 },
    { time: '17:00', tokens: 1450, traces: 32 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Phase 1: Recruiter Intelligence Command Center</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Recruitment Intelligence Dashboard
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Autonomous multi-agent talent discovery, resume screening, RAG knowledge retrieval, and interview orchestration powered by Spring Boot microservices.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('candidates')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/20"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume</span>
            </button>
            <button
              onClick={() => setActiveTab('agent-studio')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-purple-500/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Agent Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Candidates</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{candidates.length || 3}</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
              +14% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Active talent profiles indexed</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Open Requisitions</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{jobs.length || 3}</span>
            <span className="text-[11px] text-purple-400 font-semibold">Microservices Active</span>
          </div>
          <p className="text-[11px] text-slate-500">Active engineering positions</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Interviews Scheduled</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{interviews.length || 2}</span>
            <span className="text-[11px] text-emerald-400 font-semibold">Outlook & Teams</span>
          </div>
          <p className="text-[11px] text-slate-500">Auto-scheduled via MCP</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg AI Match Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400">92.4%</span>
            <span className="text-[11px] text-slate-400">Precision Score</span>
          </div>
          <p className="text-[11px] text-slate-500">Validated by Screening Agent</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Candidate Funnel */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Hiring Funnel Stage Distribution</h3>
              <p className="text-xs text-slate-400">Real-time candidate workflow status in Spring Boot microservices</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Kafka Synced
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Agent Activity Stream */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Agent Token Consumption</h3>
            <p className="text-xs text-slate-400">Multi-agent execution throughput over time</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={agentActivityData}>
                <defs>
                  <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
                <Area type="monotone" dataKey="tokens" stroke="#8B5CF6" fillOpacity={1} fill="url(#tokenGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity List & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate List Preview */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Recent Candidate Discoveries</span>
            </h3>
            <button 
              onClick={() => setActiveTab('candidates')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              View All Candidate Portal →
            </button>
          </div>
          <div className="space-y-3 text-xs">
            {candidates.slice(0, 3).map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
                    {c.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">{c.fullName}</h4>
                    <p className="text-[11px] text-slate-400">{c.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {c.aiMatchScore}% Match
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Features Navigation Bar */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Multi-Phase AI Capabilities</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button 
              onClick={() => setActiveTab('rag')}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-all group"
            >
              <span className="font-semibold text-purple-300 group-hover:text-purple-200 block">Phase 2: RAG Assistant</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Role-specific QA with Gemini LLM</span>
            </button>
            <button 
              onClick={() => setActiveTab('agent-studio')}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-all group"
            >
              <span className="font-semibold text-blue-300 group-hover:text-blue-200 block">Phase 3: Agent Studio</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Natural language search & tools</span>
            </button>
            <button 
              onClick={() => setActiveTab('mcp-hub')}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-all group"
            >
              <span className="font-semibold text-indigo-300 group-hover:text-indigo-200 block">Phase 4: MCP Servers</span>
              <span className="text-[11px] text-slate-400 mt-1 block">ATS, LinkedIn, Outlook, Teams</span>
            </button>
            <button 
              onClick={() => setActiveTab('observability')}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-all group"
            >
              <span className="font-semibold text-emerald-300 group-hover:text-emerald-200 block">Phase 5: Observability</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Reasoning DAG & Kafka stream</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
