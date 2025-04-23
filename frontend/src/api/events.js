import apiClient from '../utils/apiClient';

export const createEvent = data => apiClient.post('/events', data);
export const updateEvent = (id, data) => apiClient.put(`/events/${id}`, data);
export const getEvents = () => apiClient.get('/events');
export const deleteEvent = id => apiClient.delete(`/events/${id}`);
