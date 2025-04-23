import apiClient from '../utils/apiClient';

export const signup = data => apiClient.post('/auth/signup', data);
export const login = creds => apiClient.post('/auth/login', creds);
export const getProfile = () => apiClient.get('/auth/me');
export const updateProfile = formData => apiClient.put('/auth/profile', formData);
