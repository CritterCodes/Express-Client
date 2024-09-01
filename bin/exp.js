#!/usr/bin/env node
import { generateExpressProject } from '../lib/createProject.js';
import { deleteProject } from '../lib/deleteProject.js';
import { generateRoute } from '../lib/generateRoute.js';
import { generateClass } from '../lib/generateClass.js';
import { generateMiddleware } from '../lib/generateMiddleware.js';
import { setupDatabase } from '../lib/setupDatabase.js';

const args = process.argv.slice(2);

if (args[0] === 'new' || args[0] === 'n') {
    const projectName = args[1];

    if (!projectName) {
        console.error('Please provide a project name.');
        process.exit(1);
    }

    // Generate the basic project structure
    generateExpressProject(projectName);

} else if (args[0] === 'delete' || args[0] === 'd') {
    const projectName = args[1];

    if (!projectName) {
        console.error('Please provide a project name.');
        process.exit(1);
    }

    deleteProject(projectName);
} else if (args[0] === 'generate' || args[0] === 'g') {
    const generateType = args[1];
    const name = args[2];

    switch(generateType) {
        case 'middleware':
        case 'm':
            if (!name) {
                console.error('Please provide a middleware name.');
                process.exit(1);
            }
            generateMiddleware(name);
            break;
        case 'route':
        case 'r':
            if (!name) {
                console.error('Please provide a route name.');
                process.exit(1);
            }
            generateRoute(name);
            break;
        case 'class':
        case 'c':
            if (!name) {
                console.error('Please provide a class name.');
                process.exit(1);
            }
            generateClass(name);
            break;
        default:
            console.error('Unknown generate type. Use "route", "middleware", or "class".');
            process.exit(1);
    }
} else {
    console.error('Unknown command. Use "exp new <project-name>", "exp delete <project-name>", or "exp generate <type> <name>".');
    process.exit(1);
}
