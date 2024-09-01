import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const addPostgresSupport = (projectDir) => {
    const libDir = path.join(projectDir, 'lib');

    // Create the lib directory if it doesn't exist
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir, { recursive: true });
        console.log('Created lib directory.');
    }

    // Create the PostgreSQL database file
    const databaseContent = `
import { Pool } from 'pg';

class Database {
    _pool = null;

    init = (config) => {
        this._pool = new Pool({
            user: config.user,
            host: config.host,
            database: config.database,
            password: config.password,
            port: config.port,
        });
        console.log('PostgreSQL connected');
    };

    query = (text, params) => this._pool.query(text, params);

    getClient = async () => {
        const client = await this._pool.connect();
        return client;
    };
}

export const db = new Database();
    `;
    fs.writeFileSync(path.join(libDir, 'database.lib.js'), databaseContent.trim());
    console.log('Created database.lib.js for PostgreSQL.');

    // Update .env with PostgreSQL configuration
    const envFilePath = path.join(projectDir, '.env');
    const postgresEnvContent = `
PG_USER=yourusername
PG_HOST=localhost
PG_DATABASE=yourdatabase
PG_PASSWORD=yourpassword
PG_PORT=5432
    `;
    fs.appendFileSync(envFilePath, postgresEnvContent.trim());
    console.log('Inserted PostgreSQL configuration into .env file.');

    // Update app.js with PostgreSQL initialization
    const appJsPath = path.join(projectDir, 'app.js');
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');
    const postgresImport = `import { db } from './lib/database.js';\n`;
    const postgresConfig = `
const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
};

db.init(config);
    `;
    const updatedAppJsContent = appJsContent
        .replace(/(import.*;)(?![\s\S]*import.*;)/, `$1\n${postgresImport}`)
        .replace('// Middleware here', `${postgresConfig}\n// Middleware here`);

    fs.writeFileSync(appJsPath, updatedAppJsContent.trim());
    console.log('Updated app.js to include PostgreSQL initialization.');

    // Install PostgreSQL package
    execSync('npm install pg', { cwd: projectDir, stdio: 'inherit' });
    console.log('PostgreSQL support added successfully.');
};
