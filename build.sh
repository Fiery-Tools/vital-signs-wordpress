#!/bin/bash

# This script builds assets and packages the WordPress plugin for distribution.
# It creates a zip file with all files in the root, as required.

# --- Configuration ---
PLUGIN_SLUG="wp-vital-signs"
ZIP_FILE="wp-vital-signs.zip"
RELEASE_DIR="release"
VITE_OUTPUT_DIR="build"

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Build Process ---

echo "🚀 Starting the build and packaging process for $PLUGIN_SLUG..."

# 1. Build the production assets (JS/CSS)
echo "📦 Building React assets (npm run build)..."
npm run build

# 2. Install production-only PHP dependencies
echo "📦 Installing production PHP dependencies (php composer.phar)..."
php composer.phar install --no-dev --optimize-autoloader

# 3. Clean up from previous packaging attempts
echo "🧹 Cleaning up old zip files and release directories..."
rm -rf $RELEASE_DIR $ZIP_FILE

# 4. Create the release directory structure
# NOTE: We now just create the parent release dir.
echo "📂 Creating release directory..."
mkdir -p $RELEASE_DIR

# 5. Copy only the production files into the release directory
echo "🚚 Copying production files..."
cp -r \
  $VITE_OUTPUT_DIR \
  vendor \
  languages \
  includes \
  *.php \
  readme.txt \
  $RELEASE_DIR/

# 6. Navigate into the release directory to create the zip
echo "🤐 Creating zip archive with correct structure..."
cd $RELEASE_DIR

# CRITICAL FIX: Zip all contents of the current directory ('.')
# The output path is one level up ('../') from our current location.
zip -r ../$ZIP_FILE .

# 7. Navigate back to the root and clean up
cd ..
echo "🧹 Cleaning up temporary release directory..."
rm -rf $RELEASE_DIR

echo "✅ Success! Plugin packaged successfully: $ZIP_FILE"