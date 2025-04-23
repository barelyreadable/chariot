#!/usr/bin/env bash

# Stop any running containers
docker-compose down

# Build images (pull latest)
docker-compose build --pull

# Start services
docker-compose up -d

# Run DB migrations
docker-compose exec backend sh -c \
  "psql \$DATABASE_URL -f src/db/migrations/create_users_table.sql && \
   psql \$DATABASE_URL -f src/db/migrations/create_events_table.sql && \
   psql \$DATABASE_URL -f src/db/migrations/create_drivers_table.sql && \
   psql \$DATABASE_URL -f src/db/migrations/create_carpools_table.sql && \
   psql \$DATABASE_URL -f src/db/migrations/create_carpool_members_table.sql && \
   psql \$DATABASE_URL -f src/db/migrations/add_profile_picture_to_users.sql"

echo "✅ Build and deployment complete!"
