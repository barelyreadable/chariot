import apiClient from '../utils/apiClient';

export const getEvents = () => apiClient.get('/events');
export const createEvent = d => apiClient.post('/events', d);
export const updateEvent = (id,d) => apiClient.put(`/events/${id}`, d);
export const deleteEvent = id => apiClient.delete(`/events/${id}`);
