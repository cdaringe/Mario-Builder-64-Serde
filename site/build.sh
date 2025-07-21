#!/usr/bin/env bash
# Build script for Mario Builder 64 Level JSON Site
# Usage: ./build.sh
set -exuo pipefail

# Deno bundle main.ts to main.js
if ! command -v deno &>/dev/null; then
  echo "Error: Deno is not installed. Please install Deno (https://deno.land/) and try again."
  exit 1
fi

echo "Bundling main.ts to main.js..."
denoname="main.ts"
denobundle="main.js"
denodir="$(dirname "$0")"
ls -al
cd "$denodir"
deno bundle "$denoname" > "$denobundle"
echo "Bundle complete: $denobundle"

# Optionally, copy static assets (if any) here
# Example: cp -r assets/ dist/assets/
cp ../test/fixtures/abc.mb64 abc.mb64

# Print success message
echo "Build finished. Site is ready in $(pwd)"
