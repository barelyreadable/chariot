const pool = require('../db');

// Create a new event (admin only)
exports.create = async (req, res) => {
  const { title, start_time, end_time, meet_point, pickup_time, greggs_pickup } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO events(title, start_time, end_time, meet_point, pickup_time, greggs_pickup)
       VALUES($1, $2, $3, $4, $5, $6)
       RETURNING id, title, start_time, end_time, meet_point, pickup_time, greggs_pickup`,
      [title, start_time, end_time, meet_point, pickup_time, greggs_pickup]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('EventController.create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// List all events
exports.list = async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, start_time, end_time, meet_point, pickup_time, greggs_pickup
       FROM events
       ORDER BY start_time`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('EventController.list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing event (admin only)
exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, start_time, end_time, meet_point, pickup_time, greggs_pickup } = req.body;

  try {
    const result = await pool.query(
      `UPDATE events
       SET title = $1,
           start_time = $2,
           end_time = $3,
           meet_point = $4,
           pickup_time = $5,
           greggs_pickup = $6
       WHERE id = $7
       RETURNING id, title, start_time, end_time, meet_point, pickup_time, greggs_pickup`,
      [title, start_time, end_time, meet_point, pickup_time, greggs_pickup, id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('EventController.update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an event (admin only)
exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1',
      [id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(204).end();
  } catch (err) {
    console.error('EventController.remove error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

