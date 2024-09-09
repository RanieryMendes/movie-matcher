#!/bin/sh

set -e

until nc -z postgres 5432; do
  echo "Waiting for postgres to be ready..."
  sleep 2
done

echo "PostgreSQL started"
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000