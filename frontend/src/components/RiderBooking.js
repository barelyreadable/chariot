import React, { useState, useEffect } from 'react';
import { getEvents } from '../api/events';
import { getCarpools } from '../api/carpools';
import { joinCarpool, autoMatch } from '../api/riders';

export default function RiderBooking() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [carpools, setCarpools] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getEvents().then(({ data }) => setEvents(data));
  }, []);

  const handleEventChange = e => {
    const eid = e.target.value;
    setSelectedEvent(eid);
    if (eid) getCarpools(eid).then(({ data }) => setCarpools(data));
    else setCarpools([]);
  };

  const handleJoin = id => {
    joinCarpool(id)
      .then(() => setMessage('Successfully joined!'))
      .catch(err => setMessage(err.response?.data?.message || 'Join failed'));
  };

  const handleAuto = () => {
    autoMatch(selectedEvent)
      .then(({ data }) => setMessage(`Auto-matched to carpool ${data.carpool_id}`))
      .catch(err => setMessage(err.response?.data?.message || 'Auto-match failed'));
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4">Book a Ride</h2>
      {message && <div className="text-secondary mb-2">{message}</div>}

      <label className="block text-gray-700">Select Event</label>
      <select value={selectedEvent} onChange={handleEventChange} className="mt-1 block w-full mb-4">
        <option value="">--Choose Event--</option>
        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
      </select>

      {selectedEvent && (
        <button onClick={handleAuto} className="bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-accent transition mb-4">
          Auto-Match Me
        </button>
      )}

      {carpools.length > 0 ? (
        carpools.map(c => (
          <div key={c.id} className="flex justify-between items-center border p-2 mb-2 rounded-md">
            <div>
              <div className="font-bold">{c.name}</div>
              <div className="text-sm text-gray-600">Seats left: {c.capacity}</div>
            </div>
            <button onClick={() => handleJoin(c.id)} className="bg-secondary text-white font-bold py-1 px-3 rounded-md hover:bg-accent transition">
              Join
            </button>
          </div>
        ))
      ) : selectedEvent ? (
        <p>No available drivers; try auto-match.</p>
      ) : null}
    </div>
);
}
