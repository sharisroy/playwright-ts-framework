# Playwright TypeScript Framework

A clean and scalable **API Test Automation Framework** built with **Playwright + TypeScript**.

This framework is designed for modern API testing with reusable utilities, clean project structure, and maintainable test code.

It includes:

* Custom fixtures
* Reusable request handler
* Token-based authentication
* Custom assertions
* Request / Response logging
* Schema validation
* Environment-based configuration
* Playwright HTML reporting

---

# Quick Start

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

## 4. Run All Tests

```bash
npx playwright test
```

## 5. Open HTML Report

```bash
npx playwright show-report
```

---

# Project Structure

```bash
playwright-ts-framework/
│── tests/
│   ├── smokeTest.spec.ts          # Main reusable API tests
│   └── basic_requests.spec.ts     # Basic API examples
│
│── utils/
│   ├── fixtures.ts                # Custom fixtures
│   ├── request_handler.ts         # Reusable API methods
│   ├── logger.ts                  # Request/Response logs
│   ├── schema-validator.ts        # Schema validator
│   └── coustom_expect.ts          # Custom assertions
│
│── helpers/
│   └── createToken.ts             # Auto auth token
│
│── response-schemas/              # JSON schema files
│
│── playwright.config.ts
│── api-test.config.ts
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

Example:

```ts
await api
  .path('/articles')
  .params({ limit: 10 })
  .getRequest(200);
```

---

## Schema Validation

Validate API responses using JSON Schema.

### Install Packages

```bash
npm install ajv --save-dev
npm i genson-js --save-dev
```

### Example Usage

```ts
await expect(response).shouldMatchSchema('articles', 'GET_articles', true);
await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_article', true);
await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_article');
```

### Important Note

* Use `true` only when generating schema for the first time.
* After schema file is created, remove `true`.

### Example

```ts
await expect(response).shouldMatchSchema('articles', 'GET_articles');
```

---

## Request / Response Logging

If any test fails, logs include:

* URL
* Headers
* Body
* Response
* Status Code

This makes debugging faster and easier.

---

# Test Execution Commands

## Run All Tests

```bash
npx playwright test
```

## Run Specific Project

```bash
npx playwright test --project smoke-tests
```

## Run Specific File

```bash
npx playwright test tests/smokeTest.spec.ts
```

## Run Single Test

```bash
npx playwright test -g "Get Articles"
```

## Run Failed Tests

```bash
npx playwright test --last-failed
```

## Run by Environment

```bash
TEST_ENV=staging npx playwright test
```

---

# HTML Reports

After execution:

```bash
npx playwright show-report
```

---

# Best Practices

## Keep Tests Independent

Each test should run separately.

## Reuse Common Methods

Avoid duplicate code.

## Validate Everything

Always verify:

* Status code
* Response body
* Schema

## Use Environments

Do not hardcode credentials.

---

# Future Improvements

You can extend this framework with:

* UI Automation
* Database Validation
* CI/CD Integration
* Allure Reports
* Parallel Execution
* Data Driven Testing

---

# Notes

This project is beginner-friendly and suitable for learning:

* Playwright API Testing
* TypeScript Framework Design
* Scalable Automation Framework
* Schema Validation

---

# Author

**Haris Chandra Roy**

GitHub: https://github.com/sharisroy

---

# Support

If you find this project useful, give it a ⭐ on GitHub.
