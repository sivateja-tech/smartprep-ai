# SmartPrep AI — Backend

A backend platform for quiz-based assessments and coding challenges, featuring role-based authentication, automated code evaluation, Redis caching, asynchronous job processing, and performance analytics.

## Overview

SmartPrep AI provides APIs for students to practice quizzes and coding problems while enabling administrators to manage assessments and monitor platform activity. It combines secure authentication, database-backed assessment workflows, multi-language code execution, and background processing to deliver a responsive assessment experience.

## Key Features

- **Authentication & Authorization:** JWT-based authentication, bcrypt password hashing, and role-based access control (RBAC) for Admin and Student roles.
- **Quiz Management:** Create quizzes, manage questions, retrieve paginated quiz listings, and submit answers.
- **Coding Assessments:** Create coding challenges, configure test cases, execute submissions, and automatically evaluate results.
- **Multi-language Execution:** Integrate Judge0 for code compilation and execution.
- **Background Processing:** Use BullMQ to process quiz submissions and scoring asynchronously.
- **Redis Caching:** Cache paginated quiz listings to reduce database queries and improve response times.
- **Analytics:** Track quiz performance, coding submissions, topic-wise results, and leaderboard rankings.
- **Input Validation:** Validate incoming requests using Zod schemas.
- **Rate Limiting:** Protect API endpoints against excessive requests.
- **Activity Logging:** Record relevant platform activity for monitoring and analysis.
- **Health Monitoring:** Check database and Redis connectivity through a health endpoint.

## Performance Metrics

| Metric | Result |
|---|---|
| Relational database schema | 8 tables |
| REST API endpoints | 15+ |
| Authentication roles | Admin and Student |
| Paginated quiz retrieval | Improved from 88 ms to 17 ms |
| Quiz retrieval improvement | Approximately 80.7% lower latency |
| Quiz submission response | Under 40 ms in measured tests |
| Code execution | Judge0 integration for multiple languages |
| Per-test-case execution time | Approximately 100 ms in measured tests |
| Per-test-case memory usage | Approximately 17 MB in measured tests |
| Code submission rate limit | 10 requests per minute, subject to configured limiter scope |

*Performance figures reflect measured results and may vary with database size, cache state, hosting environment, network latency, and code complexity. Quiz submission acknowledgement time measures the API response, not the completion time of background scoring.*

### Performance Optimizations

**1. Redis caching**

Paginated quiz listings are cached using keys that include pagination parameters. Repeated requests can be served from Redis instead of querying PostgreSQL for the same listing, reducing measured retrieval latency from 88 ms to 17 ms.

**2. Asynchronous quiz processing**

Quiz submission is placed on a BullMQ queue backed by Redis. The API acknowledges the request while a background worker evaluates answers and persists the result. This keeps the request path lightweight; the final result may become available after the response.

**3. Rate limiting**

Rate limiting helps control excessive API usage, particularly for code execution endpoints, where each submission can consume external execution resources.

## Tech Stack

**Backend:** Node.js, Express.js  
**Database:** PostgreSQL, Prisma ORM  
**Authentication:** JWT, bcrypt, role-based access control  
**Caching & Queues:** Redis, BullMQ  
**Code Execution:** Judge0, Axios  
**Validation & Security:** Zod, express-rate-limit  
**Testing & API Tools:** Postman, automated tests where configured  
**Email:** Nodemailer, if enabled in the current configuration  
**Development Tools:** Git, GitHub, VS Code

## Architecture

```text
                 Client / Postman
                        |
                        v
                 Express.js API
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
    Authentication   Validation   Rate Limiting
     JWT + bcrypt       Zod
          |
          v
      API Routes
          |
    +-----+----------+----------------+
    |                |                |
    v                v                v
 PostgreSQL        Redis            Judge0
  via Prisma       Cache          Code Execution
    |
    v
 Quiz Attempts / Coding Results

 Quiz Submission
        |
        v
    BullMQ Queue
        |
        v
 Background Worker
        |
        v
 Score Calculation and Database Persistence
```

## Project Structure

The following is a representative structure. Adjust directory names to match your repository.

```text
smartprep-backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── services/
│   ├── jobs/
│   ├── workers/
│   ├── lib/
│   └── app.js
├── tests/
├── .env.example
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Install or configure the following:

- Node.js and npm
- PostgreSQL
- Redis
- Judge0 access, using the configured Judge0 endpoint
- Git

### 1. Clone the repository

```bash
git clone https://github.com/sivateja-tech/SmartPrep-AI.git
cd SmartPrep-AI
```

Replace the repository URL and folder name if your actual GitHub repository uses different values.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend root directory.

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME"
JWT_SECRET="replace_with_a_strong_random_secret"
REDIS_URL="redis://localhost:6379"
JUDGE0_URL="https://ce.judge0.com"
```

Add any additional environment variables required by your email configuration or other services.

**Important:** These are example variable names. Confirm that they match the variables referenced by your source code. Never commit real credentials, database URLs, or JWT secrets to GitHub.

### 4. Start PostgreSQL and Redis

Ensure PostgreSQL is running and the database referenced by `DATABASE_URL` exists.

If you use Docker for Redis:

```bash
docker run -d --name smartprep-redis -p 6379:6379 redis:7
```

If the container already exists, start it with:

```bash
docker start smartprep-redis
```

### 5. Run Prisma migrations

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply existing migrations:

```bash
npx prisma migrate deploy
```

For local development, if you are creating and managing migrations, use:

```bash
npx prisma migrate dev
```

Use the migration command appropriate for your environment; do not run both commands indiscriminately.

### 6. Start the backend

Use the development script defined in your `package.json`, for example:

```bash
npm run dev
```

Alternatively, if your project uses a different start script:

```bash
npm start
```

The API will be available at the configured host and port, such as `http://localhost:5000`.

Start the BullMQ worker separately if it is not automatically launched by the application.

## API Documentation

The following endpoints illustrate the core API functionality. Confirm the exact paths and HTTP methods against your Express route files.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Authenticate a user | Public |
| POST | `/api/quiz/create` | Create a quiz | Admin |
| POST | `/api/quiz/:quizId/add-question` | Add a question | Admin |
| GET | `/api/quiz` | Retrieve paginated quizzes | Authenticated |
| GET | `/api/quiz/:quizId` | Retrieve quiz details | Authenticated |
| POST | `/api/quiz/submit` | Submit a quiz for processing | Student |
| GET | `/api/quiz/analytics` | Retrieve quiz analytics | Authenticated |
| POST | `/api/coding/create` | Create a coding challenge | Admin |
| GET | `/api/coding` | List coding challenges | Authenticated |
| GET | `/api/coding/:id` | Retrieve a coding challenge | Authenticated |
| POST | `/api/coding/submit` | Execute and evaluate code | Student |
| GET | `/api/coding/analytics` | Retrieve coding analytics | Authenticated |
| GET | `/api/leaderboard` | Retrieve leaderboard data | Authenticated |
| GET | `/api/health` | Check service health | As configured |

Your project may also contain additional administrative or analytics routes.

### Authentication

Protected endpoints use a JWT access token. After signing in, include the token in the request headers:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The authentication middleware verifies the token and identifies the current user. Authorization middleware checks the user's role before allowing access to role-restricted endpoints.

### Pagination

Quiz listings support pagination to limit the number of records returned per request.

Example:

```http
GET /api/quiz?page=1&limit=10
```

The actual parameter names depend on your implementation. Redis cache keys should distinguish pagination parameters so that different pages and limits do not return the same cached response.

### Quiz Submission and Background Processing

Quiz submissions are added to a BullMQ queue for background processing. The API can return an acknowledgement before the worker finishes calculating and storing the score.

Clients that need the final result should use the result-retrieval endpoint or polling mechanism implemented by the application. A successful submission acknowledgement does not necessarily mean scoring has finished.

### Coding Assessment Workflow

1. An administrator creates a coding challenge and its test cases.
2. A student submits code and selects a supported programming language.
3. The backend sends the code and test-case input to Judge0.
4. The backend evaluates execution results against expected outputs.
5. The submission result and relevant performance information are stored and made available through the application's result or analytics endpoints.

Execution time and memory consumption depend on the submitted program, test cases, and execution environment.

## Security

The backend uses several security controls:

- JWT-based authentication for protected routes.
- bcrypt for password hashing.
- Role-based authorization for administrative operations.
- Zod validation for request payloads.
- Rate limiting to restrict excessive requests.
- Environment variables for sensitive configuration.

Keep dependencies updated, validate user input on the server, and ensure secrets are excluded from version control.

## Testing

Use Postman or your automated test suite to verify the following workflows:

1. Register a student and sign in.
2. Verify that protected endpoints reject missing or invalid JWTs.
3. Verify that only administrators can create quizzes and coding challenges.
4. Retrieve quizzes with different pagination parameters.
5. Repeat a quiz-list request and verify cache behavior where exposed.
6. Submit a quiz and verify that the background worker processes it.
7. Submit coding solutions with both passing and failing test cases.
8. Verify rate limiting by sending requests above the configured threshold.
9. Check the health endpoint while PostgreSQL and Redis are available.
10. Verify that analytics and leaderboard responses reflect persisted results.

For reproducible performance metrics, document the test environment, dataset size, number of requests, concurrency, and whether the Redis cache was warm or cold.

## Performance Results

The following values summarize the measured optimizations:

| Operation | Before / Baseline | After / Measured |
|---|---:|---:|
| Paginated quiz retrieval | 88 ms | 17 ms |
| Quiz submission API response | Depends on synchronous work | Under 40 ms with queued processing |

The quiz retrieval latency reduction is approximately 80.7%, calculated as:

**Improvement (%) = ((88 − 17) / 88) × 100 = 80.7%**

Quiz submission latency and background processing completion time are different measurements. The under-40-ms figure refers to the API response acknowledgement, not the total time required to finish scoring.

## Future Improvements

- Add dedicated API documentation using Swagger/OpenAPI.
- Add integration tests for authentication, quiz submission, and code execution.
- Introduce structured logging and centralized error handling.
- Add queue retry policies, failure handling, and job-status tracking.
- Add cache invalidation when quizzes are created or updated.
- Improve monitoring with request-latency and queue-processing metrics.
- Add deployment automation and CI checks.

## Author

**Siva Teja**

GitHub: https://github.com/sivateja-tech

---

If you find this project useful, consider giving the repository a ⭐ on GitHub.
