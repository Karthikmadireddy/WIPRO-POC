import React, { useEffect, useState } from 'react';
import { Network, Server, Play, CheckCircle2, RefreshCw, Terminal, Layers, ArrowRight } from 'lucide-react';
import { mcpApi } from '../services/api';

export default function McpHub() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedTool, setSelectedTool] = useState('');
  const [paramInput, setParamInput] = useState('{"candidateId": "CAND-101", "email": "candidate@example.com"}');
  const [executionResult, setExecutionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    fetchMcpServers();
  }, []);

  const fetchMcpServers = async () => {
    try {
      setLoading(true);
      const res = await mcpApi.getServers();
      const sList = res.data || [];
      setServers(sList);
      if (sList.length > 0) {
        setSelectedServer(sList[0]);
        if (sList[0].tools && sList[0].tools.length > 0) {
          setSelectedTool(sList[0].tools[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching MCP servers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async (e) => {
    e.preventDefault();
    if (!selectedServer || !selectedTool) return;

    setIsExecuting(true);
    setExecutionResult(null);

    let parsedParams = {};
    try {
      if (paramInput.trim()) parsedParams = JSON.parse(paramInput);
    } catch (err) {
      alert("Invalid JSON format in parameters input field");
      setIsExecuting(false);
      return;
    }

    try {
      const res = await mcpApi.executeTool(selectedServer.id, selectedTool, parsedParams);
      setExecutionResult(res.data);
    } catch (err) {
      alert("Tool execution failed: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-blue-900/40 to-slate-900/40 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1">
            <Network className="w-4 h-4 text-indigo-300" />
            <span>Phase 4: Model Context Protocol (MCP) Server Gateways</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">MCP Integration Hub</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Standardized tool execution connectors for ATS, LinkedIn, Outlook, Microsoft Teams, and Google Calendar MCP servers.
          </p>
        </div>
        <button
          onClick={fetchMcpServers}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Heartbeats</span>
        </button>
      </div>

      {/* 5 MCP Server Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {servers.map((srv) => (
          <div
            key={srv.id}
            onClick={() => {
              setSelectedServer(srv);
              if (srv.tools && srv.tools.length > 0) setSelectedTool(srv.tools[0]);
            }}
            className={`p-4 rounded-2xl cursor-pointer transition-all ${
              selectedServer?.id === srv.id
                ? 'bg-slate-900 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20'
                : 'glass-card border border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold">{srv.status}</span>
            </div>
            <h3 className="font-bold text-white text-xs">{srv.name}</h3>
            <span className="text-[10px] font-mono text-slate-500 block mb-2">{srv.version}</span>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">{srv.description}</p>
          </div>
        ))}
      </div>

      {/* Interactive MCP Console */}
      {selectedServer && (
        <div className="p-6 rounded-2xl glass-card border border-indigo-500/30 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {selectedServer.name} - Tool Runner Console
                </h3>
                <span className="text-xs text-slate-400 font-mono">Server ID: {selectedServer.id}</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-500/30">
              JSON-RPC 2.0 Ready
            </span>
          </div>

          <form onSubmit={handleExecute} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Server Capability / Tool *</label>
                <select
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono"
                >
                  {selectedServer.tools?.map((tool, ti) => (
                    <option key={ti} value={tool}>{tool}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">JSON RPC Execution Parameters</label>
                <input
                  type="text"
                  value={paramInput}
                  onChange={(e) => setParamInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isExecuting || !selectedTool}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold flex items-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md shadow-indigo-500/20"
              >
                <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>{isExecuting ? 'Dispatching Request...' : `Execute ${selectedTool}`}</span>
              </button>
            </div>
          </form>

          {/* Execution Result Box */}
          {executionResult && (
            <div className="p-5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-emerald-400 font-bold flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Execution Success Response (JSON-RPC 2.0 Payload)
                </span>
                <span>Execution ID: {executionResult.executionId}</span>
              </div>
              <pre className="p-4 rounded-lg bg-slate-900 text-slate-200 text-[11px] overflow-x-auto border border-slate-800">
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
