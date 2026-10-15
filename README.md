# SmartPrep AI — Backend

A backend platform for quiz-based learning and coding assessments, built with Node.js, Express.js, PostgreSQL, Prisma ORM, Redis, BullMQ, Judge0, and the Google Gemini API.

SmartPrep AI enables students to practice quizzes and coding problems while providing administrators with assessment management, performance analytics, and platform monitoring capabilities.

## Key Features

- **Authentication & Authorization:** JWT authentication, bcrypt password hashing, and role-based access control (RBAC) for Admin and Student roles.
- **Quiz Management:** Create quizzes, manage questions, retrieve paginated quizzes, and submit answers.
- **AI-Powered Question Generation:** Integrate the Google Gemini API to generate quiz and practice questions.
- **Coding Assessments:** Create coding challenges, configure test cases, submit code, and evaluate solutions automatically.
- **Multi-language Code Execution:** Integrate Judge0 to compile and execute code in supported programming languages.
- **Asynchronous Processing:** Use BullMQ and Redis to process quiz submissions and scoring in the background.
- **Redis Caching:** Cache paginated quiz listings to reduce database queries and improve response latency.
- **Performance Analytics:** Track quiz attempts, topic-wise performance, coding submissions, and leaderboard rankings.
- **Request Validation:** Validate incoming request payloads with Zod.
- **Rate Limiting:** Restrict excessive API requests to protect application resources.
- **Activity Logging:** Track relevant user and platform activities.
- **Health Monitoring:** Check PostgreSQL and Redis connectivity.

## Performance Metrics

| Metric | Result |
|---|---|
| Relational database schema | 8 tables |
| REST API endpoints | 15+ |
| User roles | 2 — Admin and Student |
| Paginated quiz retrieval | Reduced from 88 ms to 17 ms |
| Quiz retrieval latency reduction | Approximately 80.7% |
| Quiz submission API response | Under 40 ms in measured tests |
| Code execution | Judge0 integration for multiple languages |
| Per-test-case execution time | Approximately 100 ms in measured tests |
| Per-test-case memory usage | Approximately 17 MB in measured tests |
| Code submission rate limit | 10 requests per minute, according to configured limiter scope |

*Performance measurements depend on the environment, workload, cache state, network latency, and test-case complexity. The quiz submission response time measures the initial API acknowledgement, not completion of background scoring.*

### Performance Optimizations

**Redis caching:** Cached paginated quiz listings reduced measured retrieval latency from 88 ms to 17 ms.

**Asynchronous quiz processing:** BullMQ moves scoring and persistence work into a background worker, keeping the submission API responsive.

**Rate limiting:** Limits excessive code-submission requests and helps control resource consumption.

## Tech Stack

**Backend:** Node.js, Express.js  
**Database:** PostgreSQL, Prisma ORM  
**Authentication:** JWT, bcrypt, RBAC  
**AI Integration:** Google Gemini API  
**Caching & Job Queues:** Redis, BullMQ  
**Code Execution:** Judge0, Axios  
**Validation & Security:** Zod, express-rate-limit  
**API Testing:** Postman  
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
       Authentication  Validation   Rate Limiting
        JWT + bcrypt      Zod
             |
             v
          API Routes
             |
      +------+------+-------------------+
      |             |                   |
      v             v                   v
  PostgreSQL      Redis               External APIs
   via Prisma     Caching              |         |
      |                                v         v
      v                             Gemini     Judge0
 Quiz Attempts                   AI Questions  Code Execution
 Coding Results
      ^
      |
  BullMQ Worker
      ^
      |
  Redis-backed Queue
      |
      v
 Quiz Submission and Background Scoring
```

## Project Structure

The following is a representative structure. Adjust it to match the actual folders and filenames in your repository.

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

- Node.js and npm
- PostgreSQL
- Redis
- Google Gemini API key
- Judge0 API endpoint or service access
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sivateja-tech/SmartPrep-AI.git
cd SmartPrep-AI
```

Replace the repository URL and directory name if your actual GitHub repository differs.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME"
JWT_SECRET="replace_with_a_strong_random_secret"
REDIS_URL="redis://localhost:6379"
GEMINI_API_KEY="your_gemini_api_key"
JUDGE0_URL="https://ce.judge0.com"
```

Add any additional variables required by your implementation, such as email configuration.

**Important:** Use the exact environment-variable names expected by your source code. Keep your `.env` file out of GitHub, and never expose API keys, database credentials, or JWT secrets in public repositories.

### 4. Start PostgreSQL and Redis

Ensure PostgreSQL is running and the database specified by `DATABASE_URL` exists.

To start Redis using Docker:

```bash
docker run -d --name smartprep-redis -p 6379:6379 redis:7
```

If the container already exists:

```bash
docker start smartprep-redis
```

### 5. Generate Prisma Client and Apply Migrations

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply existing migrations:

```bash
npx prisma migrate deploy
```

For local development where you manage migrations, use:

```bash
npx prisma migrate dev
```

Choose the migration command appropriate to your environment.

### 6. Start the Backend

If your `package.json` defines a development script:

```bash
npm run dev
```

Otherwise, use the start script defined by your project:

```bash
npm start
```

The API will be available at the configured host and port, for example `http://localhost:5000`.

Start the BullMQ worker separately if it is not launched automatically by the application.

## API Documentation

The following table describes representative endpoints. Verify the exact paths and HTTP methods against your Express route files before publishing.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Authenticate a user | Public |
| POST | `/api/quiz/create` | Create a quiz | Admin |
| POST | `/api/quiz/:quizId/add-question` | Add a quiz question | Admin |
| GET | `/api/quiz` | Retrieve paginated quizzes | Authenticated |
| GET | `/api/quiz/:quizId` | Retrieve quiz details | Authenticated |
| POST | `/api/quiz/submit` | Submit a quiz | Student |
| GET | `/api/quiz/analytics` | Retrieve quiz analytics | Authenticated |
| POST | `/api/coding/create` | Create a coding challenge | Admin |
| GET | `/api/coding` | List coding challenges | Authenticated |
| GET | `/api/coding/:id` | Retrieve a coding challenge | Authenticated |
| POST | `/api/coding/submit` | Execute and evaluate code | Student |
| GET | `/api/coding/analytics` | Retrieve coding analytics | Authenticated |
| GET | `/api/leaderboard` | Retrieve leaderboard data | Authenticated |
| GET | `/api/health` | Check service health | As configured |

Gemini-powered question generation may use an additional endpoint. Add its exact route once confirmed in your implementation.

## Authentication and Authorization

Protected endpoints require a JWT access token.

Include the token in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The authentication middleware verifies the token and identifies the current user. Role-based authorization restricts administrative operations to users with the appropriate role.

Passwords are hashed using bcrypt rather than stored as plain text.

## AI-Powered Question Generation

The Google Gemini API is integrated to generate quiz and practice questions.

The general workflow is:

1. The client requests quiz or practice question generation.
2. The backend validates the request.
3. The backend sends a suitable prompt to the Gemini API.
4. The generated content is processed by the backend.
5. The resulting questions are returned to the client or stored, depending on the implemented workflow.

Generated questions should be validated before being stored or used in assessments. AI-generated content may contain inaccuracies, so review is important for assessment quality.

## Redis Caching

Redis caches paginated quiz listings to reduce repeated database reads.

A cache key can include pagination parameters, such as:

```text
quizzes:page:1:limit:10
```

When a matching cache entry exists, the backend can return the cached response. Otherwise, it queries PostgreSQL, constructs the response, and stores the result in Redis with a configured expiration time.

Cache invalidation should be handled when quiz data changes.

## Asynchronous Processing with BullMQ

Quiz submissions are added to a BullMQ queue backed by Redis.

The workflow is:

1. Receive the quiz submission.
2. Add a job to the queue.
3. Return an acknowledgement to the client.
4. Process the job in a background worker.
5. Calculate the score and persist the attempt.
6. Make the result available through the application's result-retrieval workflow.

The initial acknowledgement does not guarantee that scoring has completed. A result endpoint, job-status mechanism, or polling workflow can be used to retrieve the final result.

## Coding Assessments with Judge0

Judge0 provides the code execution environment for supported programming languages.

The workflow is:

1. Receive source code and the selected language.
2. Validate the submission and enforce rate limits.
3. Send the code and test-case input to Judge0.
4. Collect compilation and execution results.
5. Compare actual output with expected output.
6. Calculate test-case results and persist the submission.
7. Expose results through the appropriate API.

Execution time and memory consumption vary according to the submitted program and test cases.

## Request Validation and Rate Limiting

**Zod validation:** Validates incoming payloads against defined schemas and returns structured errors for invalid requests.

**Rate limiting:** Restricts excessive requests to protect API availability and external execution resources. The configured limits and their scope depend on the middleware applied to each route.

## Health Monitoring

A health endpoint can check whether PostgreSQL and Redis are reachable.

Example:

```http
GET /api/health
```

The response depends on your implementation and may report database connectivity, Redis connectivity, and process uptime.

## Testing

Use Postman and your automated test suite to verify the following:

- User registration and login.
- JWT authentication and role-based access.
- Admin-only quiz and coding-challenge creation.
- Pagination with different page and limit values.
- Redis cache hits and misses.
- Gemini question generation and invalid-input handling.
- Quiz submission and background worker processing.
- Coding submissions with passing and failing test cases.
- Rate limiting when the configured threshold is exceeded.
- Analytics and leaderboard calculations.
- Health checks when PostgreSQL and Redis are running.

For reproducible performance measurements, record the environment, dataset size, number of requests, concurrency, and cache state.

## Performance Results

Paginated quiz retrieval improved from 88 ms to 17 ms.

**Latency reduction = ((88 − 17) / 88) × 100 = 80.7%**

Quiz submissions returned an acknowledgement in under 40 ms in measured tests while scoring continued asynchronously. This measures API responsiveness rather than total job completion time.

## Future Improvements

- Document all routes with Swagger/OpenAPI.
- Expand automated integration and load testing.
- Add queue retries, failure handling, and job-status tracking.
- Improve cache invalidation and cache observability.
- Add structured logging and centralized error handling.
- Add CI checks and deployment automation.
- Improve validation and quality checks for AI-generated questions.

## Author

**Venkata Siva Teja**

GitHub:https://github.com/sivateja-tech

---

If you find this project useful, consider giving the repository a ⭐ on GitHub.
