import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Clock, Video, User, Briefcase, FileText, CheckCircle2, X } from 'lucide-react';
import { interviewApi, candidateApi, jobApi } from '../services/api';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [candidateId, setCandidateId] = useState('');
  const [jobId, setJobId] = useState('');
  const [interviewerName, setInterviewerName] = useState('Michael Scott (Lead Architect)');
  const [interviewerEmail, setInterviewerEmail] = useState('mscott@wipro-poc.com');
  const [roundType, setRoundType] = useState('TECHNICAL_ROUND_1');
  const [scheduledTime, setScheduledTime] = useState('2026-10-10 14:00 EST');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [intRes, candRes, jobRes] = await Promise.all([
        interviewApi.getAll(),
        candidateApi.getAll(),
        jobApi.getAll()
      ]);
      setInterviews(intRes.data || []);
      setCandidates(candRes.data || []);
      setJobs(jobRes.data || []);

      if (candRes.data && candRes.data.length > 0) setCandidateId(candRes.data[0].id);
      if (jobRes.data && jobRes.data.length > 0) setJobId(jobRes.data[0].id);
    } catch (err) {
      console.error("Error fetching interview data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    const candObj = candidates.find(c => c.id == candidateId);
    const jobObj = jobs.find(j => j.id == jobId);

    try {
      await interviewApi.schedule({
        candidateId: parseInt(candidateId, 10),
        candidateName: candObj ? candObj.fullName : 'Candidate',
        jobId: parseInt(jobId, 10),
        jobTitle: jobObj ? jobObj.title : 'Job Requisition',
        interviewerName,
        interviewerEmail,
        roundType,
        scheduledTime,
        meetingLink: `https://teams.microsoft.com/l/meetup-join/recruitment-hub-${(int) (Math.random() * 100)}`,
        notes: notes || "Focus on Spring Boot microservices design and system scalability."
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Error scheduling interview: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Phase 1: Interview Scheduling</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Scheduled Interviews</h1>
          <p className="text-xs text-slate-400 mt-1">Automated slot scheduling, Outlook invite sync, and Microsoft Teams integration.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold flex items-center space-x-2 hover:opacity-90 transition-opacity shadow-md shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Interview</span>
        </button>
      </div>

      {/* Interview Cards List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading scheduled interviews...</div>
      ) : interviews.length === 0 ? (
        <div className="p-12 rounded-2xl glass-card text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No Interviews Scheduled Yet</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {interviews.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {item.roundType}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {item.scheduledTime}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{item.candidateName}</h3>
                  <p className="text-xs text-slate-400">{item.jobTitle}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Interviewer: {item.interviewerName}</span>
                  </span>
                </div>
                {item.notes && (
                  <p className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 max-w-2xl">
                    💡 <strong>Focus Notes:</strong> {item.notes}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  {item.status || 'SCHEDULED'}
                </span>
                <a
                  href={item.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/40 text-xs font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Video className="w-4 h-4 text-blue-400" />
                  <span>Join Teams Meeting</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Schedule Interview Round</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Candidate *</label>
                <select
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                >
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.title})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Requisition *</label>
                <select
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.jobCode} - {j.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Round Type</label>
                  <select
                    value={roundType}
                    onChange={(e) => setRoundType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                  >
                    <option value="TECHNICAL_ROUND_1">Technical Round 1</option>
                    <option value="SYSTEM_DESIGN">System Design & Kafka</option>
                    <option value="BEHAVIORAL">Behavioral & Fit</option>
                    <option value="EXECUTIVE_MATCH">Executive Match</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Scheduled Datetime</label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Interviewer Name & Email</label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Focus & Preparation Notes</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key competencies to evaluate during this interview..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md shadow-purple-500/20"
                >
                  Confirm & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
