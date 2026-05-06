# Playwright TypeScript Framework

A clean and scalable **API + UI Test Automation Framework** built with **Playwright + TypeScript**.

Designed for modern API testing with reusable utilities, a clean project structure, and maintainable test code.

---

## Features

- Custom Playwright fixtures with worker-scoped auth token
- Fluent builder-pattern request handler
- Token-based authentication (auto-injected)
- Custom assertions with API activity logs on failure
- Request / Response logging attached to HTML report
- JSON Schema validation with auto-generation support
- Environment-based configuration (`qa` / `staging` / `prod`)
- Playwright HTML + List reporting
- Test tagging for selective execution

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sharisroy/playwright-ts-framework.git
cd playwright-ts-framework
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

### 4. Set Up Environment Variables

Create a `.env` file in the project root for production credentials:

```env
PROD_USERNAME=your@email.com
PROD_PASSWORD=yourPassword
```

> Do not commit `.env` to version control — it is listed in `.gitignore`

### 5. Run Tests

```bash
npx playwright test
```

---

## Project Structure

```
playwright-ts-framework/
├── tests/
│   ├── api-tests/
│   │   ├── smokeTest.spec.ts          # Main framework smoke tests
│   │   ├── negativeTests.spec.ts      # Parameterized negative tests
│   │   └── basic_requests.spec.ts     # Raw Playwright examples (no framework)
│   └── ui-tests/
│       └── login.spec.js              # UI login test
│
├── utils/
│   ├── fixtures.ts                    # Custom Playwright fixtures
│   ├── request_handler.ts             # Fluent API request builder
│   ├── logger.ts                      # Request/Response in-memory logger
│   ├── schema-validator.ts            # AJV-based JSON schema validator
│   └── custom_expect.ts               # Custom assertion matchers
│
├── helpers/
│   └── createToken.ts                 # Login helper — returns auth token
│
├── request-objects/
│   └── articles/
│       └── POST-article.json          # Request payload templates
│
├── response-schemas/
│   ├── articles/
│   │   ├── GET_articles_schema.json
│   │   └── POST_article_schema.json
│   └── tags/
│       └── GET_tags_schema.json
│
├── .env                               # Production credentials (gitignored)
├── playwright.config.ts               # Playwright runner configuration
├── api-test.config.ts                 # Environment-based API config
└── package.json
```

---

## Configuration

### Environments

The framework supports three environments controlled by the `TEST_ENV` variable:

| Environment | Credentials source |
|---|---|
| `staging` (default) | `api-test.config.ts` |
| `qa` | `api-test.config.ts` |
| `prod` | `PROD_USERNAME` / `PROD_PASSWORD` env vars |

### Playwright Projects

| Project | Test directory | Notes |
|---|---|---|
| `api-smoke-tests` | `tests/api-tests/` | Matches `smoke-tests*` files |
| `api-testing` | `tests/api-tests/` | Runs after `api-smoke-tests` |
| `ui-tests` | `tests/ui-tests/` | Runs on Chromium |

---

## Writing Tests

### Basic API Test

```ts
import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom_expect';

test('Get Articles', { tag: ['@smoke', '@articles', '@read'] }, async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);

    expect(response.articles.length).shouldEqual(10);
    await expect(response).shouldMatchSchema('articles', 'GET_articles');
});
```

### Request Builder Reference

| Method | Purpose |
|---|---|
| `.url(url)` | Override the default base URL |
| `.path(path)` | Set the endpoint path |
| `.params(obj)` | Append query parameters |
| `.headers(obj)` | Merge extra request headers |
| `.body(obj)` | Set the request body |
| `.clearAuth()` | Remove the Authorization header |

```ts
api
  .url('https://other-service.com/api')
  .path('/articles')
  .params({ limit: 10, offset: 0 })
  .headers({ 'X-Custom': 'value' })
  .body(payload)
  .clearAuth()
  .getRequest(200);
```

### HTTP Methods

```ts
api.path('/endpoint').getRequest(200);
api.path('/endpoint').body(payload).postRequest(201);
api.path('/endpoint').body(payload).putRequest(200);
api.path('/endpoint').deleteRequest(204);
```

### Custom Assertions

```ts
expect(value).shouldEqual(expected);
expect(value).shouldBeLessThanOrEqual(expected);
await expect(response).shouldMatchSchema('articles', 'GET_articles');
```

All custom matchers append the recent API request/response log to failure messages.

---

## Schema Validation

Validate response bodies against saved JSON schemas using [AJV](https://ajv.js.org/).

### Step 1 — Generate the schema (first run only)

Pass `true` as the third argument to auto-generate a schema from the live response:

```ts
await expect(response).shouldMatchSchema('articles', 'GET_articles', true);
```

This writes the schema to `response-schemas/articles/GET_articles_schema.json`.

### Step 2 — Validate on every subsequent run

Remove the `true` flag once the schema file exists:

```ts
await expect(response).shouldMatchSchema('articles', 'GET_articles');
```

---

## Test Tags

Tags enable selective test execution in CI pipelines and local runs.

| Tag | Meaning |
|---|---|
| `@smoke` | Fast sanity checks — run before every deployment |
| `@regression` | Full regression coverage |
| `@articles` | Article-related endpoints |
| `@tags` | Tags endpoint |
| `@read` | Read-only (GET) tests |
| `@crud` | Create / Update / Delete tests |

### Adding Tags to a Test

```ts
test('Get Articles', { tag: ['@smoke', '@articles', '@read'] }, async ({ api }) => {
    // ...
});
```

---

## Test Execution Commands

```bash
# Run all tests
npx playwright test

# Run a specific project
npx playwright test --project api-smoke-tests
npx playwright test --project api-testing
npx playwright test --project ui-tests

# Run a specific file
npx playwright test tests/api-tests/smokeTest.spec.ts

# Run a single test by name
npx playwright test -g "Get Articles"

# Run only previously failed tests
npx playwright test --last-failed

# Filter by tag
npx playwright test --grep @smoke
npx playwright test --grep @read
npx playwright test --grep @regression
npx playwright test --grep @articles

# Exclude a tag
npx playwright test --grep-invert @crud

# Combine tags (AND logic)
npx playwright test --grep "(?=.*@smoke)(?=.*@articles)"

# Run against a specific environment
TEST_ENV=staging npx playwright test
TEST_ENV=prod npx playwright test

# Run against production with inline credentials
PROD_USERNAME=user@email.com PROD_PASSWORD=secret TEST_ENV=prod npx playwright test
```

---

## Reports

### HTML Report

```bash
npx playwright show-report
```

### Allure Report

```bash
npx allure serve allure-results
```

---

## Request / Response Logging

Every test step automatically attaches request and response details to the HTML report:

- Method + URL
- Request headers and body
- Response status code, headers, and body

On assertion failure, the full API activity log is printed inline in the error message — no need to open the report to diagnose the issue.

---

## Best Practices

- **Keep tests independent** — each test should set up and tear down its own data
- **Use unique test data** — add timestamps or UUIDs to avoid "must be unique" conflicts across runs
- **Validate everything** — status code, response body fields, and schema
- **Never hardcode credentials** — use environment variables, especially for production
- **Tag every test** — lets CI pipelines run only what is needed at each pipeline stage

---

## Author

**Haris Chandra Roy**

GitHub: [sharisroy](https://github.com/sharisroy)

---

If you find this project useful, give it a star on GitHub.
