// Centralized API service for the Lead Scoring System
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

export const getLeads = async () => {
  const res = await axios.get(`${API_BASE}/leads`);
  return res.data;
};

export const getLead = async (id: string) => {
  const res = await axios.get(`${API_BASE}/leads/${id}`);
  return res.data;
};

export const getLeadHistory = async (id: string) => {
  const res = await axios.get(`${API_BASE}/leads/${id}/history`);
  return res.data;
};

export const getLeaderboard = async () => {
  const res = await axios.get(`${API_BASE}/leads/leaderboard`);
  return res.data;
};

export const getEventTypes = async () => {
  const res = await axios.get(`${API_BASE}/events/event-types`);
  return res.data;
};

export const submitEvent = async (payload: { lead_id: string; event_type: string; metadata?: any }) => {
  const res = await axios.post(`${API_BASE}/events`, payload);
  return res.data;
};
