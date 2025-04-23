import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export default function DriverEventOptIn() {
  const [events, setEvents] = useState([]);
  const [choice, setChoice] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    apiClient.get('/events').then(({ data }) => setEvents(data));
  }, []);

  const handleChange = (eid, field, val) => {
    setChoice(prev => ({ ...prev, [eid]: { ...prev[eid], [field]: val } }));
  };

  const subscribe = async eid => {
    const payload = {
      meet_point: choice[eid]?.meet_point,
      pickup_time: choice[eid]?.pickup_time,
      greggs_enabled: choice[eid]?.greggs_enabled
    };
    try {
      await apiClient.post(`/carpools/${eid}/subscribe`, payload);
      setMsg(`Opted in to event ${eid}`);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to opt in');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4">Driver Event Opt-In</h2>
      {msg && <div className="text-secondary mb-2">{msg}</div>}
      {events.map(ev => (
        <div key={ev.id} className="border p-4 rounded-md mb-4">
          <h3 className="font-bold">{ev.title}</h3>
          <label className="block mt-2">Meet Point</label>
          <select
            value={choice[ev.id]?.meet_point || ev.meet_point}
            onChange={e => handleChange(ev.id, 'meet_point', e.target.value)}
            className="mt-1 block w-full"
          >
            <option>Clubhouse</option>
            <option>Door Pickup</option>
            <option>Other</option>
          </select>
          <label className="block mt-2">Pickup Time</label>
          <input
            type="time"
            value={choice[ev.id]?.pickup_time || ev.pickup_time}
            onChange={e => handleChange(ev.id, 'pickup_time', e.target.value)}
            className="mt-1 block w-full"
          />
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              checked={choice[ev.id]?.greggs_enabled ?? true}
              onChange={e => handleChange(ev.id, 'greggs_enabled', e.target.checked)}
              className="mr-2"
            />
            Offer Greggs Pickup
          </label>
          <button
            onClick={() => subscribe(ev.id)}
            className="mt-4 bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-accent transition"
          >
            Opt In
          </button>
        </div>
      ))}
    </div>
);
}
