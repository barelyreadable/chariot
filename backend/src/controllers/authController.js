// backend/src/controllers/authController.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { email, password, role, greggs_pref='None', drink_pref='None' } = req.body;
  const profilePic = req.file?.path || null;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const { rows } = await pool.query(
      `INSERT INTO users(email,password,role,profile_picture,greggs_pref,drink_pref)
       VALUES($1,$2,$3,$4,$5,$6)
       RETURNING id,role,profile_picture,greggs_pref,drink_pref`,
      [email, hashed, role, profilePic, greggs_pref, drink_pref]
    );
    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, role: user.role, profile_picture: user.profile_picture,
        greggs_pref: user.greggs_pref, drink_pref: user.drink_pref },
      process.env.JWT_SECRET, { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query(
    'SELECT id,password,role,profile_picture,greggs_pref,drink_pref FROM users WHERE email=$1',
    [email]
  );
  if (!rows.length) return res.status(400).json({ message: 'User not found' });
  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Wrong credentials' });
  const token = jwt.sign(
    { id: user.id, role: user.role, profile_picture: user.profile_picture,
      greggs_pref: user.greggs_pref, drink_pref: user.drink_pref },
    process.env.JWT_SECRET, { expiresIn: '8h' }
  );
  res.json({ token });
};

exports.me = async (req, res) => {
  const { id } = req.user;
  const { rows } = await pool.query(
    'SELECT id,email,role,profile_picture,greggs_pref,drink_pref FROM users WHERE id=$1',
    [id]
  );
  res.json(rows[0]);
};

exports.updateProfile = async (req, res) => {
  const { id } = req.user;
  const { greggs_pref, drink_pref } = req.body;
  const profilePic = req.file?.path;
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    if (profilePic) { fields.push(`profile_picture=$${idx++}`); values.push(profilePic); }
    if (greggs_pref) { fields.push(`greggs_pref=$${idx++}`); values.push(greggs_pref); }
    if (drink_pref)  { fields.push(`drink_pref=$${idx++}`);  values.push(drink_pref); }
    if (!fields.length) return res.status(400).json({ message: 'Nothing to update' });

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id=$${idx} RETURNING profile_picture,greggs_pref,drink_pref`,
      values
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
