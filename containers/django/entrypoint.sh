#!/bin/sh

# Debug information
echo "=== DJANGO CONTAINER STARTUP DIAGNOSTICS ==="
echo "Current directory: $(pwd)"
echo "Directory listing:"
ls -la
echo "Python path: $PYTHONPATH"
python -c "import sys; print(\"sys.path:\", sys.path)"

# Test for Django and project imports
echo "Testing imports..."
python -c "import django; print(f\"Django version: {django.__version__}\")"
python -c "from importlib import util; print(\"soltyback package exists:\", util.find_spec(\"soltyback\") is not None)"

# Ensure correct Python path
export PYTHONPATH=$PYTHONPATH:/app

echo "⚡️ Waiting for database..."
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 1
done
echo "✅ Database is up!"

echo "⚡️ Make migrations..."
python manage.py makemigrations uprofiles
python manage.py makemigrations

echo "⚡️ Applying migrations..."
python manage.py migrate --noinput

# Check if migrations applied correctly
MIGRATION_CHECK=$(python manage.py showmigrations uprofiles | grep '\[ \]')
if [ ! -z "$MIGRATION_CHECK" ]; then
  echo "❌ Warning: Some uprofiles migrations may not have applied correctly"
  echo "$MIGRATION_CHECK"
else
  echo "✅ All uprofiles migrations applied successfully"
fi

echo "⚡️ Creating Django SuperUser..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="$DJANGO_SUPERUSER_NAME").exists():
    User.objects.create_superuser("$DJANGO_SUPERUSER_NAME", "$DJANGO_SUPERUSER_EMAIL", "$DJANGO_SUPERUSER_PASSWORD")
    print("✅ Superuser created.")
else:
    print("✅ Superuser already exists.")
EOF

echo "⚡️ Collecting static files..."
python manage.py collectstatic --no-input

echo "🚀 Starting Gunicorn with command: $@"
exec "$@"
