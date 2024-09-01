import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer'; // Import inquirer
import { createMongoDBStructure } from './addMongoDBSupport.js';
import { addPostgresSupport } from './addPostgresSupport.js';
import { setupJWT } from './setupJWT.js';

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

    // Create project structure
    directories.forEach((dir) => {
        const dirPath = path.join(projectDir, dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    });

    // Create app.js
    const appJsContent = `
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Middleware here

// Routes here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
    `;
    fs.writeFileSync(path.join(projectDir, 'app.js'), appJsContent.trim());
    console.log('Created app.js');

    // Initialize npm and install Express
    execSync('npm init -y', { cwd: projectDir, stdio: 'inherit' });
    execSync('npm install express cors', { cwd: projectDir, stdio: 'inherit' });
    console.log('Initialized npm and installed dependencies.');

    // Use inquirer to prompt the user for database choice
    const { dbChoice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'dbChoice',
            message: 'Would you like to use MongoDB or PostgreSQL?',
            choices: ['MongoDB', 'PostgreSQL'],
        },
    ]);

    if (dbChoice === 'MongoDB') {
        createMongoDBStructure(projectDir);
    } else if (dbChoice === 'PostgreSQL') {
        addPostgresSupport(projectDir);
    }

    // Prompt for JWT secret generation
    const { jwtChoice } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'jwtChoice',
            message: 'Do you want to generate a JWT secret?',
            default: true,
        },
    ]);

    if (jwtChoice) {
        setupJWT(projectDir);
    }
};
