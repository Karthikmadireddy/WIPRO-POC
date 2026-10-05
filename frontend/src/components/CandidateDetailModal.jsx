import React from 'react';
import { X, User, Mail, Phone, Briefcase, Award, FileText, CheckCircle, Sparkles, Clock } from 'lucide-react';

export default function CandidateDetailModal({ candidate, isOpen, onClose, onRunScreening }) {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
              {candidate.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white">{candidate.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {candidate.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{candidate.title} • {candidate.yearsExperience} Years Experience</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Quick Contact & Match Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Email</span>
              <div className="flex items-center space-x-2 text-slate-200">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate">{candidate.email}</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Phone</span>
              <div className="flex items-center space-x-2 text-slate-200">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>{candidate.phone}</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/40 space-y-1">
              <span className="text-[11px] text-blue-300 font-semibold uppercase">AI Match Score</span>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xl font-black text-emerald-400">{candidate.aiMatchScore || 88}%</span>
                <span className="text-[10px] text-slate-400">High Suitability</span>
              </div>
            </div>
          </div>

          {/* Extracted Skills */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-300 flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Extracted Core Skills</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.primarySkills ? candidate.primarySkills.split(',').map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium">
                  {skill.trim()}
                </span>
              )) : (
                <span className="text-slate-500">Java, Spring Boot, React, Kafka</span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-300 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>AI Resume Summary</span>
            </h3>
            <p className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
              {candidate.resumeSummary || "Extracted summary unavailable."}
            </p>
          </div>

          {/* Full Resume Text View */}
          {candidate.fullResumeText && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-300 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Full Resume Content ({candidate.resumeFileName || 'Resume Document'})</span>
              </h3>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[11px] whitespace-pre-wrap max-h-48 overflow-y-auto leading-normal">
                {candidate.fullResumeText}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">ID: CAND-{candidate.id}</span>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                onClose();
                if (onRunScreening) onRunScreening(candidate);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2 shadow-md shadow-purple-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run AI Agent Screening</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
