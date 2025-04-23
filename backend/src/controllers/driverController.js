// backend/src/controllers/driverController.js
const pool = require('../db');

exports.createOrUpdate = async (req, res) => {
  const userId = req.user.id;
  const { name, vehicle_info, capacity } = req.body;
  try {
    const { rows: existing } = await pool.query(
      'SELECT id FROM drivers WHERE user_id=$1', [userId]
    );
    let driver;
    if (existing.length) {
      const { rows } = await pool.query(
        `UPDATE drivers
         SET name=$1, vehicle_info=$2, capacity=$3
         WHERE user_id=$4 RETURNING *`,
        [name, vehicle_info, capacity, userId]
      );
      driver = rows[0];
    } else {
      const { rows } = await pool.query(
        `INSERT INTO drivers(user_id,name,vehicle_info,capacity)
         VALUES($1,$2,$3,$4) RETURNING *`,
        [userId, name, vehicle_info, capacity]
      );
      driver = rows[0];
    }
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.list = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT d.id,d.user_id,d.name,d.vehicle_info,d.capacity,u.email
       FROM drivers d JOIN users u ON d.user_id=u.id
       ORDER BY d.name`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
