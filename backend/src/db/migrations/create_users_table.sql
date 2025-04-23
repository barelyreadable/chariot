CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','driver','rider')),
  profile_picture VARCHAR(512),
  greggs_pref VARCHAR(50) DEFAULT 'None',
  drink_pref VARCHAR(50) DEFAULT 'None'
);
