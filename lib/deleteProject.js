import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';

export const deleteProject = (projectName) => {
    const projectDir = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectDir)) {
        execSync(`rm -rf ${projectDir}`, { stdio: 'inherit' });
        console.log(`Project ${projectName} has been deleted successfully.`);
    } else {
        console.error(`Project ${projectName} does not exist.`);
    }
};
