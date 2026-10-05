import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UploadCloud, 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  Phone, 
  Award, 
  Sparkles, 
  Eye, 
  Trash2, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { candidateApi } from '../services/api';
import CandidateDetailModal from '../components/CandidateDetailModal';

export default function Candidates({ onRunScreening }) {
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Resume Upload Form State
  const [uploadFile, setUploadFile] = useState(null);
  const [candidateNameInput, setCandidateNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, [selectedStatus]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await candidateApi.getAll({ status: selectedStatus, search: searchQuery });
      setCandidates(res.data || []);
    } catch (err) {
      console.error("Failed to load candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCandidates();
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadStatusMsg('');

    const formData = new FormData();
    formData.append('file', uploadFile);
    if (candidateNameInput) formData.append('candidateName', candidateNameInput);
    if (emailInput) formData.append('email', emailInput);

    try {
      const res = await candidateApi.uploadResume(formData);
      setUploadStatusMsg('Resume parsed successfully by Spring Boot microservice!');
      setUploadFile(null);
      setCandidateNameInput('');
      setEmailInput('');
      fetchCandidates();
      setTimeout(() => setUploadStatusMsg(''), 3000);
    } catch (err) {
      setUploadStatusMsg('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this candidate profile?")) return;
    try {
      await candidateApi.delete(id);
      fetchCandidates();
    } catch (err) {
      alert("Error deleting candidate: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Phase 1: Candidate Management Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Talent Profiles & Resumes</h1>
          <p className="text-xs text-slate-400 mt-1">Upload candidate resumes, view AI match scores, and trigger screening workflows.</p>
        </div>
      </div>

      {/* Upload Dropzone Widget */}
      <div className="p-6 rounded-2xl glass-card border border-blue-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-white text-sm">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            <span>Upload & Parse Candidate Resume (PDF / Text)</span>
          </div>
          <span className="text-[11px] text-slate-400">Spring Boot Multer Parser Active</span>
        </div>

        <form onSubmit={handleResumeUpload} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <input
            type="text"
            placeholder="Candidate Full Name (Optional)"
            value={candidateNameInput}
            onChange={(e) => setCandidateNameInput(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Candidate Email (Optional)"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isUploading || !uploadFile}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md shadow-blue-500/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isUploading ? 'Parsing Resume...' : 'Parse Resume'}</span>
          </button>
        </form>

        {uploadStatusMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{uploadStatusMsg}</span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidates by name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </form>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="SCREENED">Screened</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="EVALUATED">Evaluated</option>
            <option value="HIRED">Hired</option>
          </select>
        </div>
      </div>

      {/* Candidate Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading candidates from Spring Boot REST API...</div>
      ) : candidates.length === 0 ? (
        <div className="p-12 rounded-2xl glass-card text-center space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No Candidate Profiles Found</h3>
          <p className="text-xs text-slate-500">Upload a resume above to populate the candidate management hub!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl glass-card space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                      {c.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{c.fullName}</h3>
                      <p className="text-[11px] text-slate-400">{c.title}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {c.aiMatchScore}% Match
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{c.yearsExperience} Years Exp</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {c.primarySkills ? c.primarySkills.split(',').slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">
                      {skill.trim()}
                    </span>
                  )) : null}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 text-slate-400 border border-slate-800">
                  {c.status}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCandidate(c);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="View Profile Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRunScreening && onRunScreening(c)}
                    className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 transition-colors"
                    title="Screen with AI Agent"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 transition-colors"
                    title="Delete Candidate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Profile Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRunScreening={onRunScreening}
      />
    </div>
  );
}
