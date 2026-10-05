import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const candidateApi = {
  getAll: (params) => api.get('/candidates', { params }),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (data) => api.post('/candidates', data),
  update: (id, data) => api.put(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`),
  uploadResume: (formData) => api.post('/candidates/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const jobApi = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const interviewApi = {
  getAll: () => api.get('/interviews'),
  getByCandidate: (id) => api.get(`/interviews/candidate/${id}`),
  schedule: (data) => api.post('/interviews', data),
  update: (id, data) => api.put(`/interviews/${id}`, data),
  delete: (id) => api.delete(`/interviews/${id}`),
};

export const ragApi = {
  getDocuments: (category) => api.get('/rag/documents', { params: { category } }),
  addDocument: (doc) => api.post('/rag/documents', doc),
  deleteDocument: (id) => api.delete(`/rag/documents/${id}`),
  query: (question, targetRole) => api.post('/rag/query', { question, targetRole }),
  setApiKey: (apiKey) => api.post('/rag/set-key', { apiKey }),
  getKeyStatus: () => api.get('/rag/key-status'),
};

export const agentApi = {
  naturalSearch: (query) => api.post('/agents/natural-search', { query }),
  executePipeline: (candidateId, jobId) => api.post('/agents/execute-pipeline', { candidateId, jobId }),
};

export const mcpApi = {
  getServers: () => api.get('/mcp/servers'),
  executeTool: (serverId, toolName, parameters) => api.post('/mcp/execute', { serverId, toolName, parameters }),
};

export const observabilityApi = {
  getTraces: () => api.get('/observability/traces'),
  getTraceById: (traceId) => api.get(`/observability/traces/${traceId}`),
  getMetrics: () => api.get('/observability/metrics'),
  getKafkaStream: () => api.get('/observability/kafka-stream'),
};

export default api;
