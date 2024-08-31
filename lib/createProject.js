import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { askQuestion } from './askQuestion.js';
import { createMongoDBStructure } from './mongodbSetup.js';
import { createGitignore } from './createGitignore.js';
import { setupGitRepo } from './gitSetup.js';

export const generateExpressProject = async (projectName) => {
    const projectDir = path.join(process.cwd(), projectName);
    const directories = [
        'classes',
        'controllers',
        'coordinators',
        'middleware',
        'models',
        'routes',
    ];

    // Create the base project directory
    fs.mkdirSync(projectDir, { recursive: true });

    // Create the subdirectories
    directories.forEach((dir) => {
        fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
        console.log(`Created directory: ${dir}`);
    });

    // Create app.js with Express server setup
    const appJsContent = `
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors({
  origin: '*'
}));

// Middleware here
// Routes here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});

export default app;
    `;
    fs.writeFileSync(path.join(projectDir, 'app.js'), appJsContent.trim());
    fs.openSync(path.join(projectDir, '.env'), 'w');

    console.log('Created app.js');

    // Create .gitignore
    createGitignore(projectDir);

    // Initialize npm and install dependencies
    execSync('npm init -y', { cwd: projectDir, stdio: 'inherit' });
    execSync('npm install express dotenv cors', { cwd: projectDir, stdio: 'inherit' });

    console.log('Initialized npm and installed dependencies.');

    // Ask the user if they want to add MongoDB support
    const useMongoDB = await askQuestion('Would you like to use MongoDB? (yes/no): ');

    if (useMongoDB.toLowerCase() === 'yes') {
        createMongoDBStructure(projectDir);
    }

    // Initialize Git repository
    setupGitRepo(projectDir);

    console.log(`Project ${projectName} created successfully with Express installed.`);
};
