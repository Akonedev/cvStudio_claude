#!/bin/sh
# ─────────────────────────────────────────────────────────────────────────────
#  CV Studio Claude — Docker Entrypoint
#  Runs Prisma DB migrations then launches Next.js
# ─────────────────────────────────────────────────────────────────────────────
set -e

echo "🚀 CV Studio Claude — Starting..."
echo "📦 Running Prisma database migrations..."

npx prisma migrate deploy || {
  echo "⚠️  Migration failed — attempting db push as fallback..."
  npx prisma db push --accept-data-loss
}

echo "✅ Database ready."
echo "🌐 Starting Next.js on port ${PORT:-3000}..."
exec node server.js
