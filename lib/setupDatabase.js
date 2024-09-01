import { createMongoDBStructure } from './addMongoDBSupport.js';
import { addPostgresSupport } from './addPostgresSupport.js';
import { setupJWT } from './setupJWT.js';

export const setupDatabase = (projectDir, choices) => {
    const { dbChoice, jwtChoice } = choices;

    if (dbChoice === 'mongo') {
        createMongoDBStructure(projectDir);
    } else if (dbChoice === 'postgres') {
        addPostgresSupport(projectDir);
    } else {
        console.error('Invalid database choice. Please select either "mongo" or "postgres".');
        process.exit(1);
    }

    if (jwtChoice === 'yes') {
        setupJWT(projectDir);
    }
};
