// backend/src/controllers/eventController.js
const pool = require('../db');

exports.create = async (req, res) => {
  const { title, start_time, end_time, meet_point, pickup_time, greggs_pickup, journey_time_mins } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO events(title,start_time,end_time,meet_point,pickup_time,greggs_pickup,journey_time_mins)
       VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, start_time, end_time, meet_point, pickup_time, greggs_pickup, journey_time_mins]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.list = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM events ORDER BY start_time`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, start_time, end_time, meet_point, pickup_time, greggs_pickup, journey_time_mins } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE events
       SET title=$1,start_time=$2,end_time=$3,meet_point=$4,pickup_time=$5,greggs_pickup=$6,journey_time_mins=$7
       WHERE id=$8 RETURNING *`,
      [title, start_time, end_time, meet_point, pickup_time, greggs_pickup, journey_time_mins, id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM events WHERE id=$1', [id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Event not found' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
