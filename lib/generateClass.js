import fs from 'fs';
import path from 'path';

export const generateClass = (className) => {
    const projectDir = process.cwd();
    const capitalizedClassName = className.charAt(0).toUpperCase() + className.slice(1);

    // Ensure the classes directory exists
    const classesDir = path.join(projectDir, 'classes');
    if (!fs.existsSync(classesDir)) {
        fs.mkdirSync(classesDir, { recursive: true });
        console.log(`Created directory: ${classesDir}`);
    }

    // Generate class file content
    const classFilePath = path.join(classesDir, `${className}.class.js`);

    const classFileContent = `
import { v4 as uuidv4 } from 'uuid';

export default class ${capitalizedClassName} {
    constructor() {
        this.${className}ID = uuidv4();

    }

    update${capitalizedClassName}(data) {
        for (let key in data) {
            if (this.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
        this.updatedAt = new Date();
    }
}
    `;

    // Write the class file
    fs.writeFileSync(classFilePath, classFileContent.trim());
    console.log(`Created ${classFilePath}`);
};
