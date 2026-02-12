import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getActions = (params = {}) => api.get('/actions', { params });
export const createAction = (payload) => api.post('/actions', payload);
export const updateAction = (id, payload) => api.put(`/actions/${id}`, payload);
export const deleteAction = (id) => api.delete(`/actions/${id}`);

export const processTranscript = (text) => api.post('/transcripts/process', { text });
export const getTranscriptHistory = () => api.get('/transcripts/history');

export default api;

export const getStatus = () => api.get('/status');
