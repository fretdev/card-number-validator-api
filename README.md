# Card Number Validator API

## Overview

A REST API that validates card numbers using the Luhn algorithm. The API accepts a card number string via a POST endpoint and returns whether the number is mathematically valid according to the Luhn checksum.

This API performs structural and algorithmic validation only. It does not verify whether a card is issued, active, associated with an account, or capable of processing transactions.

## Features

- Card number validation using the Luhn algorithm
- Support for formatted input (spaces and hyphens)
- Request body validation using Zod schemas
- Structured JSON error responses
- Centralized error handling middleware
- Unit tests for the validation logic
- Integration tests for the HTTP endpoint
- Separate TypeScript build configuration for production

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript (strict mode enabled)
- **Framework:** Express 5
- **Validation:** Zod
- **Testing:** Jest, Supertest
- **Build tooling:** TypeScript compiler, Babel (for Jest transform), tsx (development server)

## Project Structure

```
src/
├── controllers/        # HTTP request handlers
│   └── card.controller.ts
├── middlewares/         # Express middleware
│   ├── errorHandler.ts
│   └── validateRequest.ts
├── routes/             # Route definitions
│   └── card.routes.ts
├── services/           # Business logic layer
│   └── card.service.ts
├── validators/         # Validation logic
│   ├── cardValidator.ts
│   └── request.validator.ts
├── tests/
│   ├── unit/           # Unit tests for validation functions
│   └── integration/    # Integration tests for HTTP endpoints
├── app.ts              # Express application setup
└── server.ts           # Server entry point
```

**Routes** define the endpoint paths and wire up middleware and controllers. **Controllers** handle HTTP concerns: extracting data from the request and sending the response. **Services** contain the business logic, decoupled from HTTP. **Validators** are split into two responsibilities: `request.validator.ts` defines Zod schemas for request body validation, while `cardValidator.ts` implements the Luhn algorithm. **Middlewares** include a reusable Zod-based request validation middleware and a centralized error handler.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone https://github.com/fretdev/card-number-validator-api.git
cd card-number-validator-api
npm install
```

### Development

Start the development server with automatic reloading:

```bash
npm run dev
```

The server starts on `http://localhost:5000` by default. The port can be configured via the `PORT` environment variable.

### Production Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

This uses `tsconfig.build.json`, which excludes test files from the compiled output.

### Production Start

```bash
npm start
```

Runs the compiled JavaScript from the `dist/` directory.

## Testing

Tests are written with Jest and use Babel to transform TypeScript. The project includes both unit and integration tests.

### Run all tests

```bash
npm test
```

### Run unit tests only

```bash
npm run test:unit
```

Unit tests cover the `validateCardNumber` function directly, verifying the Luhn algorithm against valid numbers, invalid numbers, empty input, non-numeric characters, length boundaries, and formatted input with spaces and hyphens.

### Run integration tests only

```bash
npm run test:integration
```

Integration tests use Supertest to make HTTP requests against the Express application. They verify response status codes and body structure for valid cards, invalid cards, missing fields, non-string input, whitespace-only input, and malformed JSON.

**Current test count:** 15 unit tests, 8 integration tests (23 total).

## API Documentation

### Validate Card Number

```
POST /api/cards/validate
Content-Type: application/json
```

#### Request Body

| Field        | Type   | Required | Description                                                                            |
| ------------ | ------ | -------- | -------------------------------------------------------------------------------------- |
| `cardNumber` | string | Yes      | The card number to validate. Spaces and hyphens are accepted as formatting characters. |

#### Successful Response — Valid Card

```
HTTP 200 OK
```

```json
{
  "valid": true
}
```

#### Successful Response — Invalid Card

```
HTTP 200 OK
```

```json
{
  "valid": false
}
```

#### Validation Error — Missing or Invalid Field

```
HTTP 400 Bad Request
```

```json
{
  "message": "Invalid request",
  "errors": {
    "formErrors": [],
    "fieldErrors": {
      "cardNumber": ["Card number is required"]
    }
  }
}
```

This response is returned when:

- `cardNumber` is missing from the request body
- `cardNumber` is not a string (e.g., a number)
- `cardNumber` is empty or contains only whitespace (trimmed by the schema)

#### Malformed JSON

```
HTTP 400 Bad Request
```

```json
{
  "message": "Invalid JSON"
}
```

Returned when the request body contains syntactically invalid JSON.

#### Internal Server Error

```
HTTP 500 Internal Server Error
```

```json
{
  "message": "Internal server error"
}
```

Returned for unhandled errors.

## Validation Logic

Card numbers are validated using the **Luhn algorithm**, a checksum formula used to detect accidental errors in numeric identifiers such as credit card numbers.

The implementation performs these steps in order:

1. **Character check:** The input must contain only digits, spaces, and hyphens. Any other character causes immediate rejection.

2. **Normalization:** Spaces and hyphens are stripped from the input.

3. **Length check:** The normalized number must be between 13 and 19 digits (the standard range for card numbers).

4. **Luhn checksum:** Starting from the rightmost digit and moving left:
   - Every second digit (from the right) is doubled.
   - If doubling produces a value greater than 9, subtract 9.
   - All digits are summed.
   - The number is valid if the total is evenly divisible by 10.

The Luhn algorithm detects most single-digit transcription errors and adjacent digit transpositions. It does not verify that a card number is issued by a financial institution, is currently active, or has available funds.

## Request Validation and Error Handling

### Request Validation

Request body validation is handled by a reusable middleware (`validateRequest`) that accepts a Zod schema. The card validation endpoint uses a schema that requires `cardNumber` to be a non-empty string (after trimming whitespace).

When validation fails, the middleware responds with HTTP 400 and a structured error object produced by Zod's `flatten()` method, which separates field-level errors from form-level errors.

On successful validation, the parsed and trimmed data replaces `req.body` before the request reaches the controller.

### Error Handling

A centralized error handler middleware is registered after all routes. It handles two cases:

- **JSON parse errors:** When `express.json()` encounters malformed JSON, it throws a `SyntaxError` with a `status` of 400. The error handler catches this and returns `{ "message": "Invalid JSON" }`.
- **Unhandled errors:** All other errors are logged to the console and result in a 500 response with `{ "message": "Internal server error" }`.

## Design Decisions

**Express over NestJS:** Express provides a minimal foundation without framework-imposed conventions, allowing the application structure to be defined explicitly. For a single-endpoint API, Express avoids the overhead of NestJS's module and dependency injection system.

**TypeScript with strict mode:** The `strict: true` compiler option is enabled as required by the assessment. Additional strictness flags are configured, including `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noUnusedLocals`, and `noUnusedParameters`.

**Layered architecture (routes → middleware → controllers → services → validators):** Separating the application into layers gives each component a single responsibility. Request validation happens in middleware before the controller is reached. The controller handles HTTP concerns. The service layer wraps the validation result in a response structure. The validator contains only the Luhn algorithm. This separation makes individual components testable in isolation and allows them to change independently.

**Zod for request validation:** Zod provides schema-based validation with TypeScript type inference. Using a validation middleware that accepts a Zod schema keeps request validation declarative and separate from business logic. The `safeParse` method avoids throwing exceptions, allowing validation failures to be handled explicitly with structured error responses.

**Separate request and card validation:** Request validation (is `cardNumber` present and a string?) is a different concern from card number validation (does the number pass the Luhn check?). Separating them means a missing field returns a 400 validation error with field-specific messages, while a present but invalid card number returns a 200 with `{ "valid": false }`. This distinction provides clear, predictable responses: 400 means the request was malformed, 200 means the request was processed and the result is in the body.

**HTTP status code choices:** A valid request with an invalid card number returns 200 rather than 422 or 400 because the server successfully processed the request and determined the validation result. The `valid` field in the response body communicates the outcome. 400 is reserved for requests that cannot be processed due to missing or malformed input.

**Jest with Babel transform:** Jest is configured with `babel-jest` and `@babel/preset-typescript` to transform TypeScript files during testing. This avoids running the TypeScript compiler during tests, resulting in faster test execution. A `moduleNameMapper` is configured to strip `.js` extensions from imports, resolving the ESM-style import paths used in the TypeScript source.

**Unit and integration tests:** Unit tests validate the Luhn algorithm function directly, covering valid numbers, invalid numbers, edge cases (empty strings, non-numeric characters, boundary lengths), and formatted input. Integration tests verify the full HTTP request/response cycle, including middleware behavior, status codes, and response body structure. Together they verify correctness at both the function level and the API level.

**Separate TypeScript configurations:** The base `tsconfig.json` defines shared compiler options. `tsconfig.build.json` extends it to exclude test files and restrict type definitions to Node.js types only, producing a clean production build. A separate test-scoped `tsconfig.json` inside `src/tests/` adds Jest type definitions for the IDE without affecting the build.

## Deployment

The API is deployed on Vercel:

**https://card-number-validator-api.vercel.app**
**https://card-number-validator-api.vercel.app/api/cards/validate**

## Example Usage

Using a test card number from the project's test fixtures:

```bash
curl -X POST https://card-number-validator-api.vercel.app/api/cards/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4012888888881881"}'
```

```json
{
  "valid": true
}
```

## API Behavior Summary

| Scenario                           | Status | Response                                 |
| ---------------------------------- | ------ | ---------------------------------------- |
| Valid card number                  | 200    | `{ "valid": true }`                      |
| Invalid card number (fails Luhn)   | 200    | `{ "valid": false }`                     |
| Missing `cardNumber` field         | 400    | Validation error with field details      |
| `cardNumber` is not a string       | 400    | Validation error with field details      |
| `cardNumber` is empty / whitespace | 400    | Validation error with field details      |
| Malformed JSON body                | 400    | `{ "message": "Invalid JSON" }`          |
| Unhandled server error             | 500    | `{ "message": "Internal server error" }` |

## Limitations

- The API validates card numbers using the Luhn algorithm only. It does not verify whether a card number is issued by a financial institution, belongs to a specific card network, is currently active, or can process transactions.
- There is no rate limiting on the endpoint.
- There is no authentication or authorization.
