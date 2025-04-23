import apiClient from '../utils/apiClient';

export const joinCarpool = carpoolId => apiClient.post(`/riders/join/${carpoolId}`);
export const autoMatch = eventId => apiClient.post(`/riders/automatch/${eventId}`);
export const getCoRiders = eventId => apiClient.get(`/riders/coriders/${eventId}`);
