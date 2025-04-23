import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export default function RiderBooking() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [carpools, setCarpools] = useState([]);
  const [message, setMessage] = useState('');

  // Load events on mount
  useEffect(() => {
    apiClient.get('/events').then(({ data }) => setEvents(data));
  }, []);

  // Load carpools when event changes
  const loadCarpools = eventId => {
    setSelectedEvent(eventId);
    apiClient.get(`/carpools/${eventId}`).then(({ data }) => setCarpools(data));
  };

  // Rider manual join
  const joinCarpool = async carpoolId => {
    try {
      await apiClient.post(`/riders/join/${carpoolId}`);
      setMessage('Joined carpool successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error joining carpool');
    }
  };

  // Rider auto-match
  const autoMatch = async () => {
    try {
      const { data } = await apiClient.post(`/riders/automatch/${selectedEvent}`);
      setMessage(`Auto-matched into carpool ${data.carpool_id}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Auto-match failed');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4">Book a Ride</h2>
      {message && <div className="text-secondary mb-2">{message}</div>}

      <label className="block mb-4">
        Select Event:
        <select
          className="mt-1 block w-full border-gray-300 rounded-md"
          value={selectedEvent}
          onChange={e => loadCarpools(e.target.value)}
        >
          <option value="">--Choose Event--</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.title}</option>
          ))}
        </select>
      </label>

      {selectedEvent && (
        <div className="mb-4">
          <button
            onClick={autoMatch}
            className="bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-accent transition"
          >
            Auto-Match Me
          </button>
        </div>
      )}

      {carpools.length > 0 && (
        <ul className="space-y-2">
          {carpools.map(c => (
            <li
              key={c.id}
              className="flex justify-between items-center border p-2 rounded-md"
            >
              <span>
                {c.name} ({c.vehicle_info}), Seats: {c.capacity}
              </span>
              <button
                onClick={() => joinCarpool(c.id)}
                className="bg-secondary text-white font-bold py-1 px-3 rounded-md hover:bg-accent transition"
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedEvent && carpools.length === 0 && (
        <p>No drivers have subscribed yet. Try auto-match.</p>
      )}
    </div>
  );
}

{
  "name": "carpool-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.7.3",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5",
    "helmet": "^6.0.1",
    "express-rate-limit": "^6.5.1",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
