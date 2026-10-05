import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  BrainCircuit, 
  Cpu, 
  Network, 
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const phases = [
    {
      phaseTitle: 'Phase 1: Core Portal',
      items: [
        { id: 'dashboard', label: 'Recruiter Dashboard', icon: LayoutDashboard },
        { id: 'candidates', label: 'Candidate Management', icon: Users },
        { id: 'jobs', label: 'Job Requisitions', icon: Briefcase },
        { id: 'interviews', label: 'Interview Scheduler', icon: Calendar },
      ]
    },
    {
      phaseTitle: 'Phase 2: RAG Assistant',
      items: [
        { id: 'rag', label: 'RAG Knowledge Assistant', icon: BrainCircuit, badge: 'Gemini' },
      ]
    },
    {
      phaseTitle: 'Phase 3: Context Agents',
      items: [
        { id: 'agent-studio', label: 'Agent Studio & Tooling', icon: Cpu, badge: 'Tools' },
      ]
    },
    {
      phaseTitle: 'Phase 4: MCP Protocol',
      items: [
        { id: 'mcp-hub', label: 'MCP Servers Hub', icon: Network, badge: '5 Servers' },
      ]
    },
    {
      phaseTitle: 'Phase 5: Observability',
      items: [
        { id: 'observability', label: 'Multi-Agent Traceability', icon: Activity, badge: 'Kafka' },
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 p-4 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6 overflow-y-auto pr-1">
        {phases.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-2">
            <h3 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {group.phaseTitle}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/40 text-blue-300 font-semibold shadow-md shadow-blue-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                        isActive ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    ) : (
                      isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold mb-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Architecture State</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Spring Boot Microservices + React + Kafka Portal + Gemini AI.
          </p>
        </div>
      </div>
    </aside>
  );
}
