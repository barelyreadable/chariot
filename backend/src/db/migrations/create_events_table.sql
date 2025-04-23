CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  meet_point VARCHAR(20) NOT NULL CHECK (meet_point IN ('Clubhouse','Door Pickup','Other')),
  pickup_time TIME NOT NULL,
  greggs_pickup BOOLEAN NOT NULL DEFAULT FALSE
);
