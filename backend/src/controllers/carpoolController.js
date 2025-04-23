// backend/src/controllers/carpoolController.js
const pool = require('../db');

// Driver opt-in (create or noop if exists)
exports.subscribe = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;
  const { meet_point, pickup_time, greggs_enabled=true } = req.body;
  try {
    const { rows: drv } = await pool.query(
      'SELECT id FROM drivers WHERE user_id=$1', [userId]
    );
    if (!drv.length) return res.status(400).json({ message: 'Driver profile missing' });
    const driverId = drv[0].id;
    const { rows } = await pool.query(
      `INSERT INTO carpools(event_id,driver_id,meet_point,pickup_time,greggs_enabled)
       VALUES($1,$2,$3,$4,$5)
       ON CONFLICT (event_id,driver_id) DO UPDATE
         SET meet_point=EXCLUDED.meet_point,pickup_time=EXCLUDED.pickup_time,greggs_enabled=EXCLUDED.greggs_enabled
       RETURNING *`,
      [eventId, driverId, meet_point, pickup_time, greggs_enabled]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// List carpools for event
exports.list = async (req, res) => {
  const { eventId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT c.id, d.name, d.vehicle_info, d.capacity,
              c.meet_point, c.pickup_time, c.greggs_enabled
       FROM carpools c
       JOIN drivers d ON c.driver_id=d.id
       WHERE c.event_id=$1`,
      [eventId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// List members
exports.listMembers = async (req, res) => {
  const { carpoolId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT u.id AS member_id, u.email, u.profile_picture, u.greggs_pref, u.drink_pref
       FROM carpool_members m
       JOIN users u ON m.user_id=u.id
       WHERE m.carpool_id=$1`,
      [carpoolId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle Greggs
exports.toggleGreggs = async (req, res) => {
  const { carpoolId } = req.params;
  const { enabled } = req.body;
  try {
    await pool.query(
      'UPDATE carpools SET greggs_enabled=$1 WHERE id=$2',
      [enabled, carpoolId]
    );
    res.json({ carpoolId, greggs_enabled: enabled });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
