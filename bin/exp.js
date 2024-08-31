#!/usr/bin/env node
import { generateExpressProject } from '../lib/createProject.js';
import { deleteProject } from '../lib/deleteProject.js';
import { generateRoute } from '../lib/generateRoute.js';

const args = process.argv.slice(2);

if (args[0] === 'new' || args[0] === 'n') {
    const projectName = args[1];

    if (!projectName) {
        console.error('Please provide a project name.');
        process.exit(1);
    }

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
    const routeName = args[2];

    switch(generateType) {
        case 'route':
        case 'r':
            if (!routeName) {
                console.error('Please provide a route name.');
                process.exit(1);
            }
            generateRoute(routeName);
            break;
        default:
            console.error('Unknown generate type. Use "route".');
            process.exit(1);
    }


} else {
    console.error('Unknown command. Use "exp new <project-name>", "exp delete <project-name>", or "exp generate route <route-name>".');
    process.exit(1);
}
