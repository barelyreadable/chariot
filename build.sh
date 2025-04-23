#!/usr/bin/env bash
set -e

docker compose down

docker compose build --pull

docker compose up -d

docker compose exec backend sh -c "\
  psql \$DATABASE_URL -f src/db/migrations/create_users_table.sql && \
  psql \$DATABASE_URL -f src/db/migrations/create_events_table.sql && \
  psql \$DATABASE_URL -f src/db/migrations/create_drivers_table.sql && \
  psql \$DATABASE_URL -f src/db/migrations/create_carpools_table.sql && \
  psql \$DATABASE_URL -f src/db/migrations/create_carpool_members_table.sql && \
  psql \$DATABASE_URL -f src/db/migrations/add_profile_picture_to_users.sql && \
  psql \$DATABASE_URL -f src/db/migrations/add_greggs_and_drinks_to_users.sql && \
  psql \$DATABASE_URL -f src/db/migrations/add_toggle_greggs_to_carpools.sql"

echo "✅ Build and deployment complete!"
