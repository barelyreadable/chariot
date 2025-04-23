const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    'INSERT INTO users(email,password,role) VALUES($1,$2,$3) RETURNING id,role',
    [email, hashed, role]
  );
  const user = rows[0];
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query(
    'SELECT id,password,role FROM users WHERE email=$1',
    [email]
  );
  if (!rows.length) return res.status(400).json({ message: 'User not found' });
  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Wrong credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
};
