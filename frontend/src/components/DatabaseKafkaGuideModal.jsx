import React, { useState } from 'react';
import { X, Database, Radio, Terminal, Copy, Check, Key, Layers, Server } from 'lucide-react';

export default function DatabaseKafkaGuideModal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const kafkaCommands = [
    {
      title: '1. Launch Kafka & Kafka UI Portal via Docker Compose',
      command: 'docker-compose -f kafka-setup/docker-compose.yml up -d'
    },
    {
      title: '2. Create Candidate Events Kafka Topic',
      command: 'kafka-topics.sh --create --topic recruitment.candidate.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1'
    },
    {
      title: '3. Create Job Requisition Events Kafka Topic',
      command: 'kafka-topics.sh --create --topic recruitment.job.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1'
    },
    {
      title: '4. Create Agent Traces Kafka Topic',
      command: 'kafka-topics.sh --create --topic recruitment.agent.traces --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1'
    },
    {
      title: '5. Create MCP Events Kafka Topic',
      command: 'kafka-topics.sh --create --topic recruitment.mcp.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1'
    },
    {
      title: '6. Stream Live Events in Terminal Console (Consumer)',
      command: 'kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic recruitment.candidate.events --from-beginning'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">External Database & Kafka Setup Guide</h2>
              <p className="text-xs text-slate-400">Database Names, Connection String Templates & Kafka Commands</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section 1: External Database Setup */}
          <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold text-base">
              <Database className="w-5 h-5" />
              <span>1. External Database Names & Connection Details</span>
            </div>
            <p className="text-xs text-slate-300">
              The backend includes an in-memory database out of the box. To connect to your external PostgreSQL or MySQL databases:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-slate-200">Recommended DB Name:</span>
                <code className="block mt-1 font-mono text-emerald-400 bg-slate-950 p-1.5 rounded">recruitment_db</code>
                <span className="text-[11px] text-slate-400 mt-1 block">PostgreSQL Port: 5432 | MySQL Port: 3306</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-slate-200">Microservice DB Option:</span>
                <code className="block mt-1 font-mono text-purple-400 bg-slate-950 p-1.5 rounded">recruitment_candidate_db, recruitment_job_db</code>
                <span className="text-[11px] text-slate-400 mt-1 block">Dedicated Microservice schemas</span>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-slate-400 font-medium">Where to configure DB connection strings:</p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-blue-300">
                Open <span className="text-amber-300 font-bold">backend/src/main/resources/application.yml</span> and set:<br/>
                <span className="text-slate-400">spring.datasource.url:</span> <span className="text-emerald-400">jdbc:postgresql://localhost:5432/recruitment_db</span><br/>
                <span className="text-slate-400">spring.datasource.username:</span> <span className="text-emerald-400">postgres</span><br/>
                <span className="text-slate-400">spring.datasource.password:</span> <span className="text-emerald-400">your_password</span>
              </div>
            </div>
          </div>

          {/* Section 2: Gemini API Key Instructions */}
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-purple-400 font-semibold text-base">
              <Key className="w-5 h-5" />
              <span>2. Gemini API Key Configuration (Phase 2 & Phase 3)</span>
            </div>
            <p className="text-xs text-slate-300">
              You can paste your Gemini API Key in 3 convenient ways:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              <li><strong className="text-purple-300">UI Modal:</strong> Click the <strong>"Paste Gemini Key"</strong> button at top-right of the portal.</li>
              <li><strong className="text-purple-300">Application File:</strong> Edit <span className="font-mono text-amber-300">backend/src/main/resources/application.yml</span> under <code className="text-emerald-400">gemini.api.key</code>.</li>
              <li><strong className="text-purple-300">Environment Variable:</strong> Set <code className="text-emerald-400">GEMINI_API_KEY=AIzaSy...</code> in your system environment.</li>
            </ul>
          </div>

          {/* Section 3: Kafka Portal Commands */}
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-purple-400 font-semibold text-base">
              <Radio className="w-5 h-5" />
              <span>3. Commands to Run Kafka Portal & Topics</span>
            </div>
            <p className="text-xs text-slate-300">
              Run these commands in your shell to spin up Kafka and create all required microservice event topics:
            </p>

            <div className="space-y-3">
              {kafkaCommands.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{item.title}</span>
                    <button
                      onClick={() => copyToClipboard(item.command, idx)}
                      className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Command</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-2 rounded bg-slate-950 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                    {item.command}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
