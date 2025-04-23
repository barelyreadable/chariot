CREATE TABLE carpool_members (
  id SERIAL PRIMARY KEY,
  carpool_id INTEGER NOT NULL REFERENCES carpools(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(carpool_id, user_id)
);
