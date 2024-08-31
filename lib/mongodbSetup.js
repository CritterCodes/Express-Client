import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const createMongoDBStructure = (projectDir) => {
  const libDir = path.join(projectDir, 'lib');

  // Create the lib directory
  fs.mkdirSync(libDir, { recursive: true });
  console.log('Created lib directory.');

  // Create constants.lib.js
  const constantsContent = `
export default {
  // Example collection
  // USERS_COLLECTION: 'users',
  // Add more collections here
  DEFAULT_PROJECTION: {
    _id: 0,
  },
};
    `;
  fs.writeFileSync(path.join(libDir, 'constants.lib.js'), constantsContent.trim());
  console.log('Created constants.lib.js');

  // Create database.lib.js
  const databaseContent = `
import { MongoClient } from 'mongodb';
import Constants from '../lib/constants.lib.js';

class Database {
  _instance = null;

  init = async (config) => {
    const client = new MongoClient(config.url, {
      minPoolSize: config.minPoolSize,
      maxPoolSize: config.maxPoolSize,
    });
    try {
      await client.connect();
      console.log('mongodb connected');
    } catch (err) {
      console.error(\`Error connecting to mongoDB. Error: \${err}\`);
    }
    this._instance = client.db(config.database);
  };

  getDb = () => {
    return this._instance;
  };

  // Example collection
  /*dbUsers = () => {
    return this._instance.collection(Constants.USERS_COLLECTION);
  };*/

  // Add more collections here
}

export const db = new Database();
    `;
  fs.writeFileSync(path.join(libDir, 'database.lib.js'), databaseContent.trim());
  console.log('Created database.lib.js');

  // Update app.js to include MongoDB setup
  const appJsPath = path.join(projectDir, 'app.js');
  const appJsContent = fs.readFileSync(appJsPath, 'utf8');
  const mongoDbSetup = `
import { db } from './lib/database.js';

// TODO: Environment based configs
const config = {
  url: process.env.MONGO_URL,
  database: 'process.env.DB',
  minPoolSize: 3,
  maxPoolSize: 10,
};

db.init(config);
    `;
  const updatedAppJsContent = appJsContent.replace('// Middleware here', `${mongoDbSetup}\n// Middleware here`);
  fs.writeFileSync(appJsPath, updatedAppJsContent.trim());

  // Insert MongoDB secrets into .env file
  const envFilePath = path.join(projectDir, '.env');
  const mongoDbEnvContent = `
    MONGO_URL=mongodb://localhost:27017
    DB=mydatabase
        `;
  fs.appendFileSync(envFilePath, mongoDbEnvContent.trim());
  console.log('Inserted MongoDB secrets into .env file.');


  // Install MongoDB package
  execSync('npm install mongodb', { cwd: projectDir, stdio: 'inherit' });
  console.log('MongoDB support added successfully.');
};
