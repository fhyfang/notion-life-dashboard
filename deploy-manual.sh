#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Create a temporary directory for gh-pages
echo "Creating temporary directory..."
TEMP_DIR=$(mktemp -d)

# Copy dist contents to temp directory
echo "Copying build files..."
cp -r dist/* $TEMP_DIR/

# Initialize git in temp directory
cd $TEMP_DIR
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# Add remote and force push to gh-pages branch
echo "Deploying to GitHub Pages..."
git remote add origin https://github.com/fhyfang/notion-life-dashboard.git
git push -f origin main:gh-pages

# Clean up
cd -
rm -rf $TEMP_DIR

echo "Deployment complete!"
echo "Your site will be available at: https://fhyfang.github.io/notion-life-dashboard"
