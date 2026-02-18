#!/bin/bash

# Git configuration
git config user.email "v0@vercel.com"
git config user.name "v0"

# Add changes
git add -A

# Commit changes
git commit -m "feat: hide navbar from login, signup, and dashboard routes

- Updated NavbarWrapper component with configurable noNavbarRoutes array
- Navbar now hidden from /login, /signup, and /dashboard routes
- Easy to extend with additional routes in the future"

# Push to current branch (login-and-signup-pages)
git push origin HEAD

echo "Changes pushed successfully!"
