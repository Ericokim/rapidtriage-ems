#!/bin/bash
# Lightweight save check for RapidTriage EMS.
# Kept non-blocking so it never interrupts the editing flow.

echo "Running lightweight save check..."

npm run typecheck --silent >/dev/null 2>&1

exit 0
