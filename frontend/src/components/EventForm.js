import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

export default function EventForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    title: '',
    start_time: '',
    end_time: '',
    meet_point: 'Clubhouse',
    pickup_time: '',
    greggs_pickup: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      apiClient.get(`/events/${id}`)
        .then(({ data }) => {
          setForm({
            title: data.title,
            start_time: data.start_time.slice(0,16),
            end_time: data.end_time.slice(0,16),
            meet_point: data.meet_point,
            pickup_time: data.pickup_time,
            greggs_pickup: data.greggs_pickup
          });
        })
        .catch(() => setError('Failed to load event'));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        start_time: form.start_time,
        end_time: form.end_time,
        meet_point: form.meet_point,
        pickup_time: form.pickup_time,
        greggs_pickup: form.greggs_pickup
      };
      if (isEdit) await apiClient.put(`/events/${id}`, payload);
      else await apiClient.post('/events', payload);
      navigate('/events');
    } catch {
      setError('Error saving event');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4">{isEdit ? 'Edit' : 'Create'} Event</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700">Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">End Time</label>
          <input
            type="datetime-local"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Meet Point</label>
          <select
            name="meet_point"
            value={form.meet_point}
            onChange={handleChange}
            className="mt-1 block w-full"
          >
            <option>Clubhouse</option>
            <option>Door Pickup</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Pickup Time</label>
          <input
            type="time"
            name="pickup_time"
            value={form.pickup_time}
            onChange={handleChange}
            required
            className="mt-1 block"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="greggs_pickup"
            checked={form.greggs_pickup}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">Greggs Pickup</label>
        </div>
        <button
          type="submit"
          className="bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-accent transition"
        >
          {isEdit ? 'Update' : 'Create'} Event
        </button>
      </form>
    </div>
  );
}
