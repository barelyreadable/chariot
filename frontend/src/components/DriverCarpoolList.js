import React, { useState, useEffect } from 'react';
import { getMembers, toggleGreggs } from '../api/carpools';
import { useParams } from 'react-router-dom';

export default function DriverCarpoolList() {
  const { eventId } = useParams();
  const [members, setMembers] = useState([]);
  const [greggsEnabled, setGreggsEnabled] = useState(true);

  useEffect(() => {
    getMembers(eventId).then(({ data }) => setMembers(data));
  }, [eventId]);

  const handleToggle = async () => {
    const { data } = await toggleGreggs(eventId, !greggsEnabled);
    setGreggsEnabled(data.greggs_enabled);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4">Riders for Your Car</h2>
      <button
        onClick={handleToggle}
        className="mb-4 bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-accent transition"
      >
        {greggsEnabled ? 'Disable Greggs' : 'Enable Greggs'}
      </button>
      {members.map(m => (
        <div key={m.member_id} className="flex items-center space-x-4 border p-2 mb-2 rounded-md">
          {m.profile_picture && <img src={m.profile_picture} className="w-10 h-10 rounded-full" alt="" />}
          <div>
            <div>{m.email}</div>
            <div className="text-sm text-gray-600">
              Greggs: {m.greggs_pref}, Drink: {m.drink_pref}
            </div>
          </div>
        </div>
      ))}
    </div>
);
}
