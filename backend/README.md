# SmartPrep Backend

SmartPrep is a backend system for technical placement preparation.

It provides quizzes, coding challenges, authentication, analytics, leaderboards, and admin features.

## Features

### Authentication

- User registration and login
- JWT authentication
- Password hashing using bcrypt
- Admin and Student roles
- Protected APIs

### Quiz

- Admin can create quizzes and questions
- Students can attempt quizzes
- Automatic score and percentage calculation
- Quiz pagination

Example:

GET /api/quiz?page=1&limit=10

### Coding

- Admin can create coding questions
- Coding questions contain test cases
- Students can submit code
- Code is executed using Judge0
- Test cases are checked against expected output
- Supports compilation and runtime error handling
- Submission results are stored in PostgreSQL

### Analytics

- Quiz performance analytics
- Coding performance analytics
- Difficulty-wise coding statistics
- Admin system analytics

### Leaderboard

- Ranks students based on their quiz and coding performance

### Activity Logging

Tracks important activities such as:

- Login
- Quiz attempts
- Code submissions

### Security

- JWT authentication
- Role-based authorization
- Request validation
- Rate limiting
- Password hashing

### Email

- Sends quiz result emails to students

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Judge0
- Nodemailer
- Zod
- Express Rate Limit
- Postman

## Database

Main models:

- User
- Quiz
- QuizQuestion
- QuizAttempt
- CodingQuestion
- Submission
- ActivityLog

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

## Setup

Clone the repository:

git clone https://github.com/sivateja-tech/smartprep-ai.git

Go to the backend:

cd smartprep-ai/backend

Install dependencies:

npm install

Set up the PostgreSQL database and add the required environment variables to `.env`.

Run Prisma:

npx prisma migrate dev

npx prisma generate

Start the server:

npm run dev

Server:

http://localhost:5000

## Environment Variables

Create a `.env` file:

DATABASE_URL="your_postgresql_url"

JWT_SECRET="your_jwt_secret"

PORT=5000

JUDGE0_URL="your_judge0_url"

EMAIL_USER="your_email"

EMAIL_PASS="your_email_password"

## Testing

Postman is used to test the APIs.

### Quiz Testing

Admin Login → Create Quiz → Add Questions → Student Login → Attempt Quiz → Check Result

### Coding Testing

Admin Login → Create Coding Question → Student Login → Submit Code → Judge0 Execution → Check Result

Coding submissions can be tested with:

- Correct code
- Wrong answer
- Compilation error
- Runtime error

## Project Goal

SmartPrep was developed to practice real-world backend development concepts including REST APIs, authentication, database management, code execution, validation, security, analytics, and API design.

## Author

Developed as a backend-focused placement preparation project.
