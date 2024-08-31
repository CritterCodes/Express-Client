import fs from 'fs';
import path from 'path';

export const createGitignore = (projectDir) => {
    const gitignoreContent = `
# Node.js
node_modules/
npm-debug.log
.env
.DS_Store
    `;
    fs.writeFileSync(path.join(projectDir, '.gitignore'), gitignoreContent.trim());
    console.log('Created .gitignore');
};
