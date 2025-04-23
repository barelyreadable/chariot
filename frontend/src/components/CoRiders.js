import React, { useState, useEffect } from 'react';
import { getCoRiders } from '../api/riders';
import { useParams } from 'react-router-dom';

export default function CoRiders() {
  const { eventId } = useParams();
  const [riders, setRiders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getCoRiders(eventId)
      .then(({ data }) => setRiders(data))
      .catch(() => setError('Failed to load co-riders'));
  }, [eventId]);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4">Your Co-Riders</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {riders.length > 0 ? (
        riders.map(u => (
          <div key={u.user_id} className="flex items-center space-x-4 border p-2 mb-2 rounded-md">
            {u.profile_picture && <img src={u.profile_picture} className="w-10 h-10 rounded-full" alt="" />}
            <div>
              <div>{u.email}</div>
              <div className="text-sm text-gray-600">Greggs: {u.greggs_pref}, Drink: {u.drink_pref}</div>
            </div>
          </div>
        ))
      ) : (
        <p>No co-riders yet.</p>
      )}
    </div>
);
}
