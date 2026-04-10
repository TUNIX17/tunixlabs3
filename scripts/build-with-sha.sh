#!/bin/bash
set -e
export NEXT_PUBLIC_COMMIT_SHA="$(git rev-parse HEAD)"
npm run build
