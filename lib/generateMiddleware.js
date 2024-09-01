import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

export const generateMiddleware = (middlewareName) => {
    const projectDir = process.cwd();
    const middlewareDir = path.join(projectDir, 'middleware');

    if (!fs.existsSync(middlewareDir)) {
        fs.mkdirSync(middlewareDir, { recursive: true });
        console.log(`Created directory: ${middlewareDir}`);
    }

    let middlewareContent = '';
    let imports = '';

    switch (middlewareName) {
        case 'auth':
            imports = `import jwt from 'jsonwebtoken';`;
            middlewareContent = `
export const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required.' });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user information to the request object
        req.user = decodedToken;

        next(); // Token is valid, proceed to the next middleware or route handler
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};
 `;
            break;
        case 'admin':
            imports = `import jwt from 'jsonwebtoken';`;
            middlewareContent = `
export const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required.' });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token has the isAdmin flag set to true
        if (!decodedToken.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: You do not have admin access.' });
        }
        next(); // Token is valid, user is an admin, proceed to the next middleware or route handler
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};
            `;
            break;
        case 'logger':
            middlewareContent = `
export default function logger(req, res, next) {
    console.log(\`\${req.method} \${req.url}\`);
    next();
}
            `;
            break;
        case 'rateLimit':
            middlewareContent = `
export default function rateLimit(req, res, next) {
    const ip = req.ip;
    const currentTime = Date.now();
    const windowSize = 60000; // 1 minute
    const maxRequests = 100;

    if (!req.rateLimit) req.rateLimit = {};
    const requests = req.rateLimit[ip] || [];

    req.rateLimit[ip] = requests.filter(timestamp => currentTime - timestamp < windowSize);

    if (req.rateLimit[ip].length >= maxRequests) {
        return res.status(429).send('Too many requests');
    }

    req.rateLimit[ip].push(currentTime);
    next();
}
            `;
            break;
        default:
            middlewareContent = `
export default function ${middlewareName}(req, res, next) {
    // Your middleware logic here
    next();
}
            `;
            break;
    }

    // Combine imports and middleware content
    const fileContent = `${imports}\n${middlewareContent}`.trim();

    // Write the middleware file
    const middlewareFilePath = path.join(middlewareDir, `${middlewareName}.middleware.js`);
    fs.writeFileSync(middlewareFilePath, fileContent);
    console.log(`Created middleware: ${middlewareFilePath}`);

    // Update app.js to include the new middleware import
    const appJsPath = path.join(projectDir, 'app.js');
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');
    const middlewareImport = `import ${middlewareName} from './middleware/${middlewareName}.middleware.js';\n`;

    const updatedAppJsContent = appJsContent.replace(/(import.*;)(?![\s\S]*import.*;)/, `$1\n${middlewareImport}`);

    fs.writeFileSync(appJsPath, updatedAppJsContent.trim());
    console.log(`Updated app.js to include the ${middlewareName} middleware.`);

    if (middlewareName === 'auth' || middlewareName === 'admin') {
        // Generate a JWT secret if it doesn't exist and add it to the .env file
        const envFilePath = path.join(projectDir, '.env');
        const jwtSecret = randomBytes(64).toString('hex'); // Generate a secure random JWT secret

        if (!fs.existsSync(envFilePath)) {
            fs.writeFileSync(envFilePath, `JWT_SECRET=${jwtSecret}\n`);
            console.log('Created .env file with JWT_SECRET.');
        } else {
            const envContent = fs.readFileSync(envFilePath, 'utf8');
            if (!envContent.includes('JWT_SECRET')) {
                fs.appendFileSync(envFilePath, `\nJWT_SECRET=${jwtSecret}\n`);
                console.log('Updated .env file to include JWT_SECRET.');
            }
        }
    }
};
