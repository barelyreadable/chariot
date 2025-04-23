const pool = require('../db');

// Rider joins a specific carpool
exports.joinCarpool = async (req, res) => {
  const userId = req.user.id;
  const { carpoolId } = req.params;
  try {
    const result = await pool.query(
      `INSERT INTO carpool_members(carpool_id, user_id)
       VALUES($1, $2)
       RETURNING *`,
      [carpoolId, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ message: 'Already joined this carpool' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Rider auto-matches to first available carpool
exports.autoMatch = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;
  try {
    // find first carpool with free seats
    const avail = await pool.query(
      `SELECT c.id, (d.capacity - COUNT(m.id)) AS seats_left
       FROM carpools c
       JOIN drivers d ON c.driver_id = d.id
       LEFT JOIN carpool_members m ON m.carpool_id = c.id
       WHERE c.event_id = $1
       GROUP BY c.id, d.capacity
       HAVING (d.capacity - COUNT(m.id)) > 0
       ORDER BY c.id
       LIMIT 1`,
      [eventId]
    );
    if (!avail.rowCount) return res.status(404).json({ message: 'No available seats' });

    const carpoolId = avail.rows[0].id;
    const result = await pool.query(
      `INSERT INTO carpool_members(carpool_id, user_id)
       VALUES($1, $2)
       RETURNING *`,
      [carpoolId, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// List co-riders in the rider's current carpool for an event
exports.listCoRiders = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;
  try {
    // find the rider's carpool
    const { rows: cpRows } = await pool.query(
      `SELECT c.id AS carpool_id FROM carpools c
       JOIN drivers d ON c.driver_id=d.id
       JOIN carpool_members m ON m.carpool_id=c.id
       WHERE m.user_id=$1 AND c.event_id=$2`,
      [userId, eventId]
    );
    if (!cpRows.length) return res.status(404).json({ message: 'Not joined any carpool' });
    const carpoolId = cpRows[0].carpool_id;
    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.profile_picture
       FROM carpool_members m
       JOIN users u ON m.user_id=u.id
       WHERE m.carpool_id=$1 AND u.id<>$2`,
      [carpoolId, userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
