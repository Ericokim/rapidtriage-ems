#!/bin/bash
# Pre-commit checks for RapidTriage EMS.

echo "Running RapidTriage pre-commit checks..."

npm run typecheck || exit 2
npm run lint || exit 2
npm run test || exit 2

echo "Pre-commit checks passed."
exit 0
