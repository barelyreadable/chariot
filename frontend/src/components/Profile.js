import React, { useState, useEffect, useContext } from 'react';
import { getProfile, updateProfile } from '../api/auth';
import { AuthContext } from '../contexts/AuthContext';

export default function Profile() {
  const { logout } = useContext(AuthContext);
  const [form, setForm] = useState({ profile_picture: null, greggs_pref: '', drink_pref: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProfile().then(({ data }) => {
      setForm({
        profile_picture: data.profile_picture,
        greggs_pref: data.greggs_pref,
        drink_pref: data.drink_pref
      });
    });
  }, []);

  const handleFile = e => setForm(prev => ({ ...prev, profile_picture: e.target.files[0] }));
  const handlePref = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async () => {
    const fd = new FormData();
    if (form.profile_picture instanceof File) fd.append('profile_picture', form.profile_picture);
    fd.append('greggs_pref', form.greggs_pref);
    fd.append('drink_pref', form.drink_pref);
    try {
      await updateProfile(fd);
      setMessage('Profile updated!');
    } catch {
      setMessage('Update failed');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4">Your Profile</h2>
      {form.profile_picture && !(form.profile_picture instanceof File) && (
        <img src={form.profile_picture} className="w-24 h-24 rounded-full mb-4" alt="" />
      )}
      <input type="file" onChange={handleFile} className="mb-2" />
      <label className="block text-gray-700">Greggs Preference</label>
      <select name="greggs_pref" value={form.greggs_pref} onChange={handlePref} className="mt-1 block w-full mb-4">
        <option>Bacon Roll</option>
        <option>Sausage Roll</option>
        <option>Omlette Roll</option>
        <option>Bacon Sausage Roll</option>
        <option>Bacon Omlette Roll</option>
        <option>Sausage Omlette Roll</option>
        <option>Daddy Roll</option>
        <option>Porridge</option>
      </select>
      <label className="block text-gray-700">Drink Preference</label>
      <select name="drink_pref" value={form.drink_pref} onChange={handlePref} className="mt-1 block w-full mb-4">
        <option>Latte</option>
        <option>Cappucino</option>
        <option>Black Coffee</option>
        <option>White Coffee</option>
        <option>Orange Juice</option>
        <option>Water</option>
      </select>
      <button onClick={submit} className="bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-accent transition">
        Save Profile
      </button>
      {message && <div className="text-secondary mt-2">{message}</div>}
      <button onClick={logout} className="mt-4 text-red-500">Logout</button>
    </div>
);
}
