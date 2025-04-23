import React, { useState, useEffect } from 'react';
import { setupDriver } from '../api/drivers';

export default function DriverSetup() {
  const [form, setForm] = useState({ name: '', vehicle_info: '', capacity: 4 });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setupDriver().then(({ data }) => {
      if (data) setForm(data);
    }).catch(() => {});
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await setupDriver(form);
      setMsg('Profile saved successfully!');
    } catch {
      setMsg('Error saving profile');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4">Driver Setup</h2>
      {msg && <div className="text-secondary mb-2">{msg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* name, vehicle_info, capacity inputs */}
      </form>
    </div>
  );
}
