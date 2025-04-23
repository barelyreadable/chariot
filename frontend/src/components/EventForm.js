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
    greggs_pickup: false,
    journey_time_mins: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      apiClient.get(`/events/${id}`)
        .then(({ data }) => setForm({
          title: data.title,
          start_time: data.start_time.slice(0,16),
          end_time: data.end_time.slice(0,16),
          meet_point: data.meet_point,
          pickup_time: data.pickup_time,
          greggs_pickup: data.greggs_pickup,
          journey_time_mins: data.journey_time_mins
        }))
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
      const payload = { ...form };
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
        {/* fields as defined above */}
      </form>
    </div>
);
}
