// Script to update backend/.env with ngrok URL
import fs from 'fs';
import path from 'path';

const ngrokUrl = 'https://a2bc04554ef3.ngrok-free.app';
const envPath = path.join(process.cwd(), 'backend', '.env');

let envContent = '';

// Read existing .env if it exists
if (fs.existsSync(envPath)) {
	envContent = fs.readFileSync(envPath, 'utf8');
}

// Check if FRONTEND_URL already exists
if (envContent.includes('FRONTEND_URL=')) {
	// Replace existing FRONTEND_URL
	envContent = envContent.replace(/FRONTEND_URL=.*/g, `FRONTEND_URL=${ngrokUrl}`);
} else {
	// Add FRONTEND_URL
	if (envContent && !envContent.endsWith('\n')) {
		envContent += '\n';
	}
	envContent += `FRONTEND_URL=${ngrokUrl}\n`;
}

// Write back to file
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ Updated backend/.env with ngrok URL');
console.log(`FRONTEND_URL=${ngrokUrl}`);




