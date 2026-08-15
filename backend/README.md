# SmartPrep Backend

SmartPrep is a backend system for technical placement preparation.

It provides REST APIs for quizzes, coding challenges, authentication, performance analytics, leaderboards, admin analytics, activity logging, request validation, rate limiting, email notifications, and real code execution.

## Features

### Authentication and Authorization

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API endpoints
- Role-based access control
- Admin and Student roles

### Quiz Module

Admins can:

- Create quizzes
- Add quiz questions
- Configure correct answers

Students can:

- View available quizzes
- Attempt quizzes
- Submit answers
- Receive scores and percentages

### Quiz Pagination

Quiz listing supports pagination.

Example:

GET /api/quiz?page=1&limit=10

Pagination prevents the API from loading a large number of records at once.

### Coding Module

Admins can:

- Create coding questions
- Set difficulty
- Add test cases

Students can:

- View coding questions
- View individual coding questions
- Submit source code
- View execution results

### Real Code Execution

Coding submissions are executed using Judge0.

The system actually compiles and executes submitted code instead of checking the source code for expected answers.

Execution flow:

Student Code
    |
    v
SmartPrep Backend
    |
    v
Get Test Cases
    |
    v
Judge0
    |
    v
Compile Code
    |
    v
Execute Code
    |
    v
Get Actual Output
    |
    v
Compare With Expected Output
    |
    v
Calculate Score
    |
    v
Save Submission

The system handles:

- Accepted
- Wrong Answer
- Compilation Error
- Runtime Error
- Execution failures

### Coding Analytics

Students can view their coding performance.

Analytics include:

- Total submissions
- Average score
- Average percentage
- Difficulty-wise performance
- Attempts by difficulty

Example:

GET /api/coding/analytics

### Leaderboard

Students are ranked based on their performance.

The leaderboard can consider:

- Quiz performance
- Coding performance
- Combined performance

Example:

GET /api/leaderboard

### Admin Analytics

Admins can view system-level statistics.

Examples:

- Total users
- Total quizzes
- Total attempts
- Overall performance
- Coding activity

Example:

GET /api/admin/system-analytics

### Activity Logging

Important user activities are recorded for tracking and auditing.

Examples:

- User login
- Quiz attempts
- Code submissions

Activity information is stored in PostgreSQL.

### Rate Limiting

Rate limiting protects APIs from excessive requests.

Coding submissions have a separate rate limit because each submission can trigger a Judge0 code execution.

### Request Validation

Incoming requests are validated before reaching the controllers.

Validation is used for:

- Coding question creation
- Code submissions
- Question IDs
- Pagination parameters
- Other API inputs

Invalid requests return a 400 Bad Request response.

### Email Notifications

Students can receive quiz result emails after completing a quiz.

Example:

Hello Siva,

Your quiz result:

Score: 8/10
Percentage: 80%

Keep practicing!

- SmartPrep Team

### Health Check

A health endpoint is provided to check whether the backend is available.

Example:

GET /api/health

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- JWT
- bcrypt

### Code Execution

- Judge0

### Email

- Nodemailer

### Validation

- Zod

### Security

- Express Rate Limit
- JWT Authentication
- Role-Based Access Control

### API Testing

- Postman

## Database Models

The main database models are:

- User
- Quiz
- QuizQuestion
- QuizAttempt
- CodingQuestion
- Submission
- ActivityLog

### User

Stores user account information and role.

### Quiz

Stores quiz information.

### QuizQuestion

Stores questions belonging to quizzes.

### QuizAttempt

Stores student quiz attempts and results.

### CodingQuestion

Stores coding problems and their test cases.

### Submission

Stores student coding submissions and execution results.

### ActivityLog

Stores important user activities.

## API Endpoints

### Authentication

POST /api/auth/register
POST /api/auth/login

### Quiz

POST /api/quiz/create
POST /api/quiz/:quizId/add-question
GET /api/quiz
GET /api/quiz/:quizId
POST /api/quiz/submit
GET /api/quiz/analytics

### Quiz Pagination

GET /api/quiz?page=1&limit=10

### Coding

POST /api/coding/create
GET /api/coding
GET /api/coding/:id
POST /api/coding/submit
GET /api/coding/analytics

### Leaderboard

GET /api/leaderboard

### Admin

GET /api/admin/system-analytics

### Health

GET /api/health

## Project Structure

backend/
|
├── src/
│   |
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   ├── codingController.js
│   │   ├── leaderboardController.js
│   │   ├── adminController.js
│   │   └── healthController.js
│   |
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── codingRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   ├── adminRoutes.js
│   │   └── healthRoutes.js
│   |
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   └── rateLimiter.js
│   |
│   ├── validators/
│   │   └── codingValidators.js
│   |
│   ├── utils/
│   │   ├── activityLogger.js
│   │   └── codeExecutor.js
│   |
│   └── lib/
│       └── prisma.js
|
├── prisma/
│   └── schema.prisma
|
├── server.js
├── package.json
├── .env
└── README.md

## Environment Variables

Create a .env file inside the backend directory.

DATABASE_URL="your_postgresql_database_url"

JWT_SECRET="your_jwt_secret"

PORT=5000

JUDGE0_URL="your_judge0_url"

EMAIL_USER="your_email"

EMAIL_PASS="your_email_password"

Do not commit the .env file to GitHub.

Add the following to .gitignore:

.env
node_modules/

## Installation

### 1. Clone the Repository

git clone https://github.com/sivateja-tech/smartprep-ai.git

### 2. Go to the Backend

cd smartprep-ai/backend

### 3. Install Dependencies

npm install

## Database Setup

Run Prisma migrations:

npx prisma migrate dev

Generate Prisma Client:

npx prisma generate

## Running the Backend

Start the development server:

npm run dev

The server runs at:

http://localhost:5000

## Testing

Postman can be used to test the REST APIs.

### Authentication Testing

Register User
    |
    v
Login
    |
    v
Receive JWT
    |
    v
Use JWT for Protected APIs

### Quiz Testing

Admin Login
    |
    v
Create Quiz
    |
    v
Add Questions
    |
    v
Student Login
    |
    v
View Quiz
    |
    v
Submit Quiz
    |
    v
Check Result

### Coding Testing

Admin Login
    |
    v
Create Coding Question
    |
    v
Student Login
    |
    v
Get Coding Question
    |
    v
Submit Code
    |
    v
Judge0 Executes Code
    |
    v
Compare Test Case Results
    |
    v
Save Submission
    |
    v
Check Coding Analytics

### Coding Test Cases

Correct Code
    |
    v
Accepted

Wrong Code
    |
    v
Wrong Answer

Invalid Code
    |
    v
Compilation Error

Code With Runtime Problem
    |
    v
Runtime Error

## Error Handling

The backend uses standard HTTP status codes.

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 429 Too Many Requests
- 500 Internal Server Error

Coding execution errors are returned as execution results instead of crashing the API.

Examples:

- Accepted
- Wrong Answer
- Compilation Error
- Runtime Error

## Security

The backend includes:

- JWT authentication
- Password hashing using bcrypt
- Role-based authorization
- Protected routes
- Request validation
- Rate limiting
- Environment variables for secrets
- External code execution through Judge0

## Backend Architecture

The backend follows a layered architecture:

Client
  |
  v
Routes
  |
  v
Middleware
  |
  +-- Authentication
  +-- Authorization
  +-- Validation
  +-- Rate Limiting
  |
  v
Controllers
  |
  v
Business Logic
  |
  +-- Prisma
  |     |
  |     v
  |  PostgreSQL
  |
  +-- Judge0
  |
  +-- Email Service

This structure keeps routing, security, business logic, database access, and external services separated.

## Future Improvements

Possible future improvements include:

- More coding languages
- Better coding test-case management
- Submission history APIs
- Bookmark and saved problems
- Advanced performance dashboards
- More detailed leaderboard statistics
- Automated API testing
- Production monitoring
- CI/CD deployment

## Project Goal

The main goal of SmartPrep is to provide a backend platform where students can practice technical placement assessments through quizzes and coding problems.

The project demonstrates practical backend concepts including:

- REST API development
- Authentication and authorization
- PostgreSQL database design
- Prisma ORM
- Pagination
- Rate limiting
- Request validation
- Email notifications
- Real code execution
- Performance analytics
- Leaderboard systems
- Activity logging

## Author

Developed as a backend-focused project to demonstrate practical backend development, API design, database management, security, code execution, and performance analytics.
