const pool = require('../db');

// Create or update a driver profile (driver only)
exports.createOrUpdate = async (req, res) => {
  const userId = req.user.id;
  const { name, vehicle_info, capacity } = req.body;

  try {
    // Check if a driver profile already exists for this user
    const existing = await pool.query(
      'SELECT id FROM drivers WHERE user_id = $1',
      [userId]
    );

    let driver;
    if (existing.rows.length) {
      // Update
      const result = await pool.query(
        `UPDATE drivers
         SET name = $1,
             vehicle_info = $2,
             capacity = $3
         WHERE user_id = $4
         RETURNING id, user_id, name, vehicle_info, capacity`,
        [name, vehicle_info, capacity, userId]
      );
      driver = result.rows[0];
    } else {
      // Insert new
      const result = await pool.query(
        `INSERT INTO drivers(user_id, name, vehicle_info, capacity)
         VALUES($1, $2, $3, $4)
         RETURNING id, user_id, name, vehicle_info, capacity`,
        [userId, name, vehicle_info, capacity]
      );
      driver = result.rows[0];
    }

    res.json(driver);

  } catch (err) {
    console.error('DriverController.createOrUpdate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// List all drivers (driver & admin)
exports.list = async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.id,
              d.user_id,
              d.name,
              d.vehicle_info,
              d.capacity,
              u.email AS user_email
       FROM drivers d
       JOIN users u ON d.user_id = u.id
       ORDER BY d.name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('DriverController.list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

