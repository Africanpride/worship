import { execSync } from 'child_process';

// Configure git
execSync('git config user.email "v0@vercel.com"');
execSync('git config user.name "v0"');

// Add changes
execSync('git add -A');

// Commit changes
execSync(`git commit -m "feat: hide navbar from login, signup, and dashboard routes

- Updated NavbarWrapper component with configurable noNavbarRoutes array
- Navbar now hidden from /login, /signup, and /dashboard routes
- Easy to extend with additional routes in the future"`);

// Push to current branch
execSync('git push origin HEAD');

console.log('Changes committed and pushed successfully!');
