# Express CLI Tool

`express-cli` is a command-line tool designed to quickly scaffold an Express.js project with pre-configured directory structures, middleware, and database support. This tool simplifies the process of setting up new Express projects by automating many of the repetitive tasks associated with initial project setup.

## Features

- **Project Initialization:** Quickly create a new Express project with a standardized structure.
- **Database Support:** Choose between MongoDB and PostgreSQL for database integration.
- **JWT Secret Generation:** Automatically generate a JWT secret and include it in the `.env` file.
- **Route Generation:** Easily generate routes with associated controller, coordinator, and model files.
- **Middleware Generation:** Create predefined or custom middleware for your project.
- **Project Deletion:** Quickly delete a project directory and its contents.

## Installation

To install the `express-cli` tool globally, run:

```bash
npm install -g @crittercodes/express-cli
```

## Usage

### Initialize a New Project
To create a new Express project, run:

```bash
exp new <project-name>
```
This will create a new project with the specified name and prompt you to choose between MongoDB and PostgreSQL. It will also ask if you want to generate a JWT secret.

###  Generate a New Route

To generate a new route along with its associated files, run:

```bash
exp generate route <route-name>
```

This will create:

```javascript
routes/<route-name>.route.js
controllers/<route-name>.controller.js
coordinators/<route-name>.coordinator.js
models/<route-name>.model.js
```

### Generate a New Middleware

To generate a new middleware, run:

```bash
exp generate middleware <middleware-name>
```

You can generate predefined middlewares like auth, admin, logger, or rateLimit, or create a custom middleware.

### Generate a New Class

To generate a new class, run:

```bash
exp generate class <class-name>
```

This will create a new class file in the classes directory with a constructor and an example method.

### Delete a Project

To delete an entire project directory, run:

```bash
exp delete <project-name>
```

## Project Structure

When you create a new project, the following structure will be generated:

```go
Copy code
<project-name>/
│
├── classes/
├── controllers/
├── coordinators/
├── middleware/
├── models/
├── routes/
├── app.js
└── package.json
```

## Example Workflow

### Create a new project:

```bash
exp new my-express-app
```

### Generate a new route:

```bash
exp generate route user
```

### Add middleware:

```bash
exp generate middleware auth
```

### Delete the project if needed:

```bash
exp delete my-express-app
```

Contributing
Contributions are welcome! If you have any ideas, suggestions, or bugs to report, please open an issue or submit a pull request on GitHub.

License
This project is licensed under the MIT License.

### Notes:

- **Features**: Describes the key functionalities of your CLI tool.
- **Installation**: Provides the command to globally install your CLI tool.
- **Usage**: Details how to use the various commands provided by your CLI tool.
- **Project Structure**: Illustrates the structure of a generated project.
- **Example Workflow**: Walks the user through an example of how they might use the tool.
- **Contributing**: Encourages others to contribute to the project.
- **License**: Specifies the licensing of the project.

You can expand on this or modify it as needed based on your specific requirements and the feedback you receive from users.