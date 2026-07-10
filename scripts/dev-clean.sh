#!/usr/bin/env bash
# Free the Metro (8081) and API (4000) ports before starting the dev stack so a
# leftover server from a previous run never blocks `npm run dev` in the
# non-interactive concurrently session (Expo would otherwise prompt for a new
# port and fail). Safe to run when nothing is listening.
set -u

for port in 8081 4000; do
  pids=$(lsof -ti "tcp:${port}" 2>/dev/null || true)
  if [ -n "${pids}" ]; then
    echo "dev-clean: freeing port ${port} (pids: ${pids})"
    kill "${pids}" 2>/dev/null || true
    sleep 1
    still=$(lsof -ti "tcp:${port}" 2>/dev/null || true)
    [ -n "${still}" ] && kill -9 ${still} 2>/dev/null || true
  fi
done

exit 0
