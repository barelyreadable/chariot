import React, { createContext, useState } from 'react';
import apiClient from '../utils/apiClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    const payload = JSON.parse(atob(data.token.split('.')[1]));
    localStorage.setItem('token', data.token);
    setUser({
      id: payload.id,
      role: payload.role,
      profile_picture: payload.profile_picture,
      greggs_pref: payload.greggs_pref,
      drink_pref: payload.drink_pref
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
