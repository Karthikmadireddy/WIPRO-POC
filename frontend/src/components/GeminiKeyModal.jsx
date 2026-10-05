import React, { useState } from 'react';
import { X, Key, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ragApi } from '../services/api';

export default function GeminiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [apiKey, setApiKey] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setLoading(true);
    setStatusMsg('');

    try {
      await ragApi.setApiKey(apiKey.trim());
      setStatusMsg('Gemini API Key saved and activated successfully!');
      if (onKeyUpdated) onKeyUpdated(true);
      setTimeout(() => {
        onClose();
        setStatusMsg('');
        setApiKey('');
      }, 1500);
    } catch (err) {
      setStatusMsg('Failed to update Gemini API Key: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Paste Gemini API Key</h3>
              <p className="text-xs text-slate-400">Powers Phase 2 RAG & Phase 3 Agent Studio</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 space-y-1">
            <div className="flex items-center space-x-2 font-semibold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Google Gemini 1.5 Flash Model</span>
            </div>
            <p className="text-[11px] text-purple-300/80 leading-relaxed">
              Your key is stored securely in memory for microservice RAG search and candidate screening evaluation.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-semibold">
              Enter Gemini API Key <span className="text-rose-400">*</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono text-xs"
              required
            />
          </div>

          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              statusMsg.includes('successfully') 
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
            }`}>
              {statusMsg.includes('successfully') ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving Key...' : 'Activate Gemini Key'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
