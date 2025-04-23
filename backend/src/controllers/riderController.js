// backend/src/controllers/riderController.js
const pool = require('../db');

// Manual join
exports.joinCarpool = async (req, res) => {
  const userId = req.user.id;
  const { carpoolId } = req.params;
  try {
    const { rows } = await pool.query(
      `INSERT INTO carpool_members(carpool_id,user_id)
       VALUES($1,$2) RETURNING *`,
      [carpoolId, userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Already joined' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Auto-match
exports.autoMatch = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;
  try {
    const { rows: avail } = await pool.query(
      `SELECT c.id, (d.capacity - COUNT(m.id)) AS seats_left
       FROM carpools c
       JOIN drivers d ON c.driver_id=d.id
       LEFT JOIN carpool_members m ON m.carpool_id=c.id
       WHERE c.event_id=$1
       GROUP BY c.id,d.capacity
       HAVING (d.capacity - COUNT(m.id))>0
       ORDER BY c.id LIMIT 1`,
      [eventId]
    );
    if (!avail.length) return res.status(404).json({ message: 'No seats available' });
    const carpoolId = avail[0].id;
    const { rows } = await pool.query(
      `INSERT INTO carpool_members(carpool_id,user_id) VALUES($1,$2) RETURNING *`,
      [carpoolId, userId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// List co-riders
exports.listCoRiders = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;
  try {
    const { rows: cp } = await pool.query(
      `SELECT c.id AS carpool_id
       FROM carpools c
       JOIN carpool_members m ON m.carpool_id=c.id
       WHERE m.user_id=$1 AND c.event_id=$2`,
      [userId, eventId]
    );
    if (!cp.length) return res.status(404).json({ message: 'Not in a carpool' });
    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.profile_picture, u.greggs_pref, u.drink_pref
       FROM carpool_members m
       JOIN users u ON m.user_id=u.id
       WHERE m.carpool_id=$1 AND u.id<>$2`,
      [cp[0].carpool_id, userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
