import apiClient from '../utils/apiClient';

export const getCarpools = eventId => apiClient.get(`/carpools/${eventId}`);
export const getMembers = carpoolId => apiClient.get(`/carpools/${carpoolId}/members`);
export const toggleGreggs = (carpoolId, enabled) =>
  apiClient.patch(`/carpools/${carpoolId}/greggs-toggle`, { enabled });
export const subscribeEvent = (eventId, payload) =>
  apiClient.post(`/carpools/${eventId}/subscribe`, payload);
