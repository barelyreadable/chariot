import apiClient from '../utils/apiClient';

export const setupDriver = data => apiClient.post('/drivers', data);
export const getDriverCarpools = () => apiClient.get('/carpools/mine');
