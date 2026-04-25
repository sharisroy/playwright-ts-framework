# Playwright TypeScript Framework

A clean and scalable **API Test Automation Framework** built with **Playwright + TypeScript**.

This project demonstrates how to build reusable API test utilities using:

* Custom fixtures
* Request handler wrapper
* Token-based authentication
* Custom assertions
* Logging for requests/responses
* Environment-based configuration
* Organized test execution with Playwright projects

# Project Structure

```bash
playwright-ts-framework/
│── tests/
│   ├── smokeTest.spec.ts          # Main reusable API tests
│   └── basic_requests.spec.ts     # Basic Playwright API examples
│
│── utils/
│   ├── fixtures.ts                # Custom test fixtures
│   ├── request_handler.ts         # Reusable API request methods
│   ├── logger.ts                  # Request/Response logs
│   └── coustom_expect.ts          # Custom assertions
│
│── helpers/
│   └── createToken.ts             # Auto-generate auth token
│
│── playwright.config.ts           # Playwright config
│── api-test.config.ts             # Environment config
│── package.json
│── README.md
```

---

# Features
## Reusable Request Handler

Supports:

* GET
* POST
* PUT
* DELETE

---

## Request / Response Logging

If any test fails, logs include:

* URL
* Headers
* Body
* Response
* Status Code

Very helpful for debugging.

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/sharisroy/playwright-ts-framework.git
cd playwright-ts-framework
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Install Playwright Browsers

```bash
npx playwright install
```

---

# Configuration

Update file:

```ts
api-test.config.ts
```

Example:

```ts
const config = {
  apiBaseUrl: 'https://your-api-url.com',
  userEmail: 'your@email.com',
  userPassword: 'yourPassword'
};
```

---

# How to Run Tests

## Run All Tests

```bash
npx playwright test
```

Runs all test files.

## Run Specific Project

```bash
npx playwright test --project api-testing
```

Available projects:

* api-testing
* smoke-tests

## Run Specific Test File

```bash
npx playwright test tests/smokeTest.spec.ts
```

## Run Single Test by Name

```bash
npx playwright test -g "Get Articles"
```

## Run Failed Tests Only

```bash
npx playwright test --last-failed
```

## Run by Environment

```bash
TEST_ENV=staging npx playwright test
```

Example:

```bash
TEST_ENV=qa npx playwright test
```

---


# Reports

After execution:

```bash
npx playwright show-report
```

HTML report will open in browser.

---

# Best Practices

## Keep Tests Independent

Each test should run separately.

## Use Reusable Methods

Avoid duplicate request code.

## Validate Status Codes

Always check expected response code.

## Use Environment Variables

Do not hardcode production credentials.

---

# Useful Commands

```bash
# Format code (Mac)
Option + Shift + F

# Run smoke tests
npx playwright test --project smoke-tests

# Run API tests
npx playwright test --project api-testing
```

---

# Future Improvements

You can extend this framework with:

* UI Automation
* Database Validation
* CI/CD Integration
* Allure Reports
* Parallel Execution
* Data Driven Testing
* Schema Validation

---

# Notes

This framework is beginner-friendly and suitable for learning:

* Playwright API Testing
* TypeScript Framework Design
* Reusable Automation Structure

---

# Author

**Haris Chandra Roy**

GitHub: https://github.com/sharisroy

---

# If You Like This Project

Give it a ⭐ on GitHub
