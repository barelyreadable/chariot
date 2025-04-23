import apiClient from '../utils/apiClient';

export const joinCarpool = id => apiClient.post(`/riders/join/${id}`);
export const autoMatch = eventId => apiClient.post(`/riders/automatch/${eventId}`);
export const getCoRiders = eventId => apiClient.get(`/riders/coriders/${eventId}`);
