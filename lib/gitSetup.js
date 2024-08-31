import { execSync } from 'child_process';

export const setupGitRepo = (projectDir) => {
    execSync('git init', { cwd: projectDir, stdio: 'inherit' });
    execSync('git checkout -b main', { cwd: projectDir, stdio: 'inherit' });
    execSync('git add .', { cwd: projectDir, stdio: 'inherit' });
    execSync('git commit -m "Initial commit"', { cwd: projectDir, stdio: 'inherit' });

    console.log('Initialized a new Git repository with the main branch and made the initial commit.');
};
