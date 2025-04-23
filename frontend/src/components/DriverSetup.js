import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export default function DriverSetup() {
  const [form, setForm] = useState({ name: '', vehicle_info: '', capacity: 4 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch existing driver profile
    apiClient.get('/drivers')
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          setForm({
            name: data[0].name,
            vehicle_info: data[0].vehicle_info,
            capacity: data[0].capacity
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await apiClient.post('/drivers', form);
      setMessage('Profile saved successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error saving profile');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4">Driver Setup</h2>
      {message && <div className="text-secondary mb-2">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
          />
        </div>
        <div>
          <label className="block text-gray-700">Vehicle Info</label>
          <input
            type="text"
            name="vehicle_info"
            value={form.vehicle_info}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
          />
        </div>
        <div>
          <label className="block text-gray-700">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            min="1"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
          />
        </div>
        <button
          type="submit"
          className="bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-accent transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
