import { randomBytes } from 'crypto';
import fs from 'fs';
import path from 'path';

export const setupJWT = (projectDir) => {
    const jwtSecret = randomBytes(64).toString('hex'); // Generate a secure random JWT secret
    const envFilePath = path.join(projectDir, '.env');

    // Check if the .env file exists, and create it if it doesn't
    if (!fs.existsSync(envFilePath)) {
        fs.writeFileSync(envFilePath, `JWT_SECRET=${jwtSecret}\n`);
        console.log('Created .env file with JWT_SECRET.');
    } else {
        // Read the existing .env file content
        const envContent = fs.readFileSync(envFilePath, 'utf8');

        // Check if the JWT_SECRET is already in the .env file
        if (!envContent.includes('JWT_SECRET')) {
            fs.appendFileSync(envFilePath, `\nJWT_SECRET=${jwtSecret}\n`);
            console.log('Updated .env file to include JWT_SECRET.');
        } else {
            console.log('JWT_SECRET already exists in .env file.');
        }
    }
};
