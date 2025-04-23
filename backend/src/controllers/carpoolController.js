// List riders subscribed to a carpool
exports.listMembers = async (req, res) => {
  const { carpoolId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT u.id AS user_id, u.email, m.id AS member_id
       FROM carpool_members m
       JOIN users u ON m.user_id = u.id
       WHERE m.carpool_id = $1`,
      [carpoolId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List members error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
