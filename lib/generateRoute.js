import fs from 'fs';
import path from 'path';

export const generateRoute = (routeName) => {
    const projectDir = process.cwd();
    const capitalizedRouteName = routeName.charAt(0).toUpperCase() + routeName.slice(1);

    // Check if MongoDB is being used by looking for database.lib.js
    const isUsingMongoDB = fs.existsSync(path.join(projectDir, 'lib/database.lib.js'));

    // Create the route file
    const routeFilePath = path.join(projectDir, `routes/${routeName}.route.js`);
    const routeFileContent = `
import { Router } from 'express';
import { 
// Your controller exports
// ex: getUser
} from '../controllers/${routeName}.controller.js'

export default ${routeName}Route = Router();

/* example
${routeName}Route.get('/${routeName}', getUser);
*/`;
    fs.writeFileSync(routeFilePath, routeFileContent.trim());
    console.log(`Created ${routeFilePath}`);

    // Create the controller file
    const controllerFilePath = path.join(projectDir, `controllers/${routeName}.controller.js`);
    const controllerFileContent = `
import ${capitalizedRouteName}Coordinator from '../coordinators/${routeName}.coordinator.js';

/* example function

export const getUser = async (userID) => await ${capitalizedRouteName}Coordinator.getUser(userID);
*/`;
    fs.writeFileSync(controllerFilePath, controllerFileContent.trim());
    console.log(`Created ${controllerFilePath}`);

    // Create the coordinator file
    const coordinatorFilePath = path.join(projectDir, `coordinators/${routeName}.coordinator.js`);
    const coordinatorFileContent = `
import ${capitalizedRouteName}Model from '../models/${routeName}.model.js';

export default class ${capitalizedRouteName}Coordinator {

    /* example 
    static getUser = async (userID) => await ${capitalizedRouteName}Model.getUser(userID);
    */
}`;
    fs.writeFileSync(coordinatorFilePath, coordinatorFileContent.trim());
    console.log(`Created ${coordinatorFilePath}`);

    // Create the model file
    const modelFilePath = path.join(projectDir, `models/${routeName}.model.js`);

    // Include MongoDB imports only if using MongoDB
    const modelFileContent = isUsingMongoDB
        ? `
// if using mongodb
import { db } from '../lib/database.lib.js';
import Constants from '../lib/constants.lib.js';

export default class ${capitalizedRouteName}Model {

    /* example
    static getUser = async (userID) => await db.dbUser().findOne({ userID }, { projection: Constants.DEFAULT_PROJECTION });
    */
}`
        : `export default class ${capitalizedRouteName}Model {

    /* example
    static getUser = async (userID) => {
        // Your code here
    };
    */
}`;

    fs.writeFileSync(modelFilePath, modelFileContent.trim());
    console.log(`Created ${modelFilePath}`);
};
