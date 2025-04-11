# Development Guide

This guide explains how to start the React app for testing purposes and provides additional tips to help you focus on coding.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Steps to Start the React App

### Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Google/vast-redirect-signal-inspector.git
cd vast-redirect-signal-inspector
```

### Install Dependencies

Install the required dependencies using npm or yarn:

```bash
npm install
```

Or, if you prefer yarn:

```bash
yarn install
```

### Start the Development Server

Start the React development server:

```bash
npm start
```

Or, with yarn:

```bash
yarn start
```

Alternatively, if you are working in a developer-specific environment, you can use the `start:dev` script:

```bash
npm run start:dev
```

Or, with yarn:

```bash
yarn run start:dev
```

### Access the App

Once the development server is running, you can access the app in your browser:

- For the normal version, navigate to `http://localhost:8085`.
- For the development environment, navigate to `http://localhost:8086`.

Webpack will display a clickable URL in the terminal when the server is ready.

### Additional Notes

- The development server will automatically reload the app when you make changes to the source code. There is no need to re-trigger the start command unless you add new files or install new packages.
- If you are using a `.env` file for environment variables, ensure it is properly configured before starting the app.
- The `start:dev` script is optimized for a developer environment, enabling additional debugging tools or configurations to streamline your workflow.
- Focus on coding! The hot-reloading feature ensures that your changes are reflected in real-time, allowing you to iterate quickly without manual restarts.

## Testing the Application

### Running Tests

To ensure the application works as expected, run the automated tests using the following command:

```bash
npm run test
```

Or, if you are using yarn:

```bash
yarn test
```

This will execute all the test cases and provide a summary of the results in the terminal.

### Adding and Adjusting Tests

When adding new functionality or modifying existing features, make sure to:

1. Write new test cases to cover the added functionality.
2. Adjust existing test cases if the changes affect their behavior.
3. Ensure all tests pass before committing your changes.

### Test Coverage

Test coverage is automatically calculated and displayed at the end of the test run.

This report highlights which parts of the code are covered by tests. Strive for high coverage to ensure code quality and reliability.

### Best Practices

- Write tests for both positive and negative scenarios.
- Use descriptive names for test cases to make them easy to understand.
- Regularly run tests during development to catch issues early.

By maintaining a robust test suite, you can ensure the stability and reliability of the application as it evolves.

## Feature Requests and Roadmap Alignment

Before starting work on a larger feature, it is recommended to open a feature request in the project's issue tracker. This ensures that the feature is not already planned or being worked on and helps align your efforts with the project's roadmap.

Steps to follow:

1. Check the existing issues to see if a similar feature request already exists.
2. If not, create a new feature request with a clear description of the feature, its purpose, and how it aligns with the project's goals.
3. Wait for feedback from the maintainers or collaborators to confirm whether the feature fits into the roadmap.

This process helps avoid duplication of effort and ensures that resources are used efficiently on both sides.
