import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Radio, 
  GitCommit, 
  Clock, 
  Zap, 
  Layers, 
  RefreshCw, 
  Search, 
  Bot, 
  CheckCircle2, 
  Wrench,
  ChevronDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { observabilityApi } from '../services/api';

export default function Observability() {
  const [traces, setTraces] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [kafkaEvents, setKafkaEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [expandedTraceId, setExpandedTraceId] = useState(null);

  useEffect(() => {
    fetchObservabilityData();
    const interval = setInterval(fetchObservabilityData, 4000); // Live poll for Kafka & agent updates
    return () => clearInterval(interval);
  }, []);

  const fetchObservabilityData = async () => {
    try {
      const [trRes, metRes, kafkaRes] = await Promise.all([
        observabilityApi.getTraces(),
        observabilityApi.getMetrics(),
        observabilityApi.getKafkaStream()
      ]);
      setTraces(trRes.data || []);
      setMetrics(metRes.data || {});
      setKafkaEvents(kafkaRes.data || []);
    } catch (err) {
      console.error("Error fetching observability data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTraces = selectedAgent 
    ? traces.filter(t => t.agentName === selectedAgent)
    : traces;

  // Group traces by Trace ID for DAG visualization
  const groupedTraces = filteredTraces.reduce((acc, curr) => {
    const key = curr.traceId || 'TRACE-DEFAULT';
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/50 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Activity className="w-4 h-4 text-emerald-300" />
            <span>Phase 5: Multi-Agent Collaboration Observability & Traceability</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Agent Workflow & Decision Traces</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real-time execution monitoring, reasoning DAG workflow trees, token latency metrics, and Kafka event stream listener.
          </p>
        </div>
        <button
          onClick={fetchObservabilityData}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Traces</span>
        </button>
      </div>

      {/* System Metrics Bar */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1">
            <span className="text-slate-400">Total Execution Traces</span>
            <p className="text-xl font-bold text-white">{metrics.totalTraceLogs || 0}</p>
          </div>
          <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1">
            <span className="text-slate-400">Total Tokens Consumed</span>
            <p className="text-xl font-bold text-purple-400">{metrics.totalTokensConsumed || 0}</p>
          </div>
          <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1">
            <span className="text-slate-400">Average Latency</span>
            <p className="text-xl font-bold text-blue-400">{metrics.averageLatencyMs || 320} ms</p>
          </div>
          <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1">
            <span className="text-slate-400">Avg Confidence Score</span>
            <p className="text-xl font-bold text-emerald-400">{metrics.averageConfidenceScore || 94}%</p>
          </div>
        </div>
      )}

      {/* Interactive Agent DAG State Machine Diagram */}
      <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <span>Autonomous Multi-Agent Hand-off DAG Visualizer</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            4 Agents Collaborating
          </span>
        </div>

        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs relative">
          <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-500/40 space-y-1">
            <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-200 text-[10px] font-bold">1. ScreeningAgent</span>
            <h4 className="font-bold text-white mt-1">Resume & JD Match</h4>
            <p className="text-[11px] text-slate-400">Tools: parseResumeTool, scoreCandidateMatchTool</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/40 space-y-1">
            <span className="px-2 py-0.5 rounded bg-purple-600/30 text-purple-200 text-[10px] font-bold">2. EvaluationAgent</span>
            <h4 className="font-bold text-white mt-1">Strengths & Gap Analysis</h4>
            <p className="text-[11px] text-slate-400">Tools: candidateGapAnalyzerTool</p>
          </div>
          <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/40 space-y-1">
            <span className="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-200 text-[10px] font-bold">3. InterviewAgent</span>
            <h4 className="font-bold text-white mt-1">Custom Question Plan</h4>
            <p className="text-[11px] text-slate-400">Tools: interviewPlanGeneratorTool</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-1">
            <span className="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-200 text-[10px] font-bold">4. RecommendationAgent</span>
            <h4 className="font-bold text-white mt-1">Final Decision Matrix</h4>
            <p className="text-[11px] text-slate-400">Output: STRONG HIRE / REJECT</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Traceability Reasoning Logs */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Step-by-Step Decision Traceability Logs</span>
            </h3>

            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
            >
              <option value="">All Agents</option>
              <option value="ScreeningAgent">ScreeningAgent</option>
              <option value="EvaluationAgent">EvaluationAgent</option>
              <option value="InterviewAgent">InterviewAgent</option>
              <option value="HiringRecommendationAgent">HiringRecommendationAgent</option>
            </select>
          </div>

          <div className="space-y-3 text-xs">
            {Object.keys(groupedTraces).map((traceId) => {
              const traceGroup = groupedTraces[traceId];
              const isExpanded = expandedTraceId === traceId;
              const first = traceGroup[0];

              return (
                <div key={traceId} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div 
                    onClick={() => setExpandedTraceId(isExpanded ? null : traceId)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-purple-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                      <span className="font-mono font-bold text-purple-300">{traceId}</span>
                      <span className="text-slate-300 font-semibold">{first.candidateName || 'Candidate'}</span>
                      <span className="text-slate-500 text-[11px]">({first.jobTitle || 'Job'})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {traceGroup.length} Steps
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-800 space-y-3 font-mono">
                      {traceGroup.map((step) => (
                        <div key={step.id} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-blue-400">{step.agentName}</span>
                            <div className="flex space-x-3 text-slate-400">
                              <span>⏱ {step.executionTimeMs}ms</span>
                              <span>🪙 {step.tokensUsed} tokens</span>
                              <span className="text-emerald-400 font-bold">Confidence: {step.confidenceScore}%</span>
                            </div>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{step.reasoningOutput}</p>
                          {step.toolUsed && (
                            <div className="text-[10px] text-amber-300 bg-slate-950 p-1.5 rounded font-mono">
                              🔧 Invoked Tool: {step.toolUsed}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Kafka Event Stream Feed */}
        <div className="p-6 rounded-2xl glass-card border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Kafka Event Stream Feed</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">Broker: localhost:9092</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px] text-xs font-mono pr-1">
            {kafkaEvents.length === 0 ? (
              <div className="text-center text-slate-500 py-8">Waiting for Kafka event messages...</div>
            ) : (
              kafkaEvents.map((evt) => (
                <div key={evt.id} className="p-3 rounded-xl bg-slate-950 border border-purple-500/20 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-purple-400 font-bold">{evt.topic}</span>
                    <span className="text-slate-500">{evt.key}</span>
                  </div>
                  <pre className="p-2 rounded bg-slate-900 text-emerald-300 text-[10px] overflow-x-auto">
                    {evt.payload}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
