#!/usr/bin/env sh
# healthcheck.sh

# Try to hit your app’s health endpoint
if curl --fail http://localhost:3000/healthz >/dev/null 2>&1; then
  exit 0
else
  exit 1
fi
