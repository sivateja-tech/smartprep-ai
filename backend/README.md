# SmartPrep Backend

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Redis](https://img.shields.io/badge/Redis-Caching-red)

SmartPrep Backend is a scalable REST API designed for technical preparation through quizzes and coding challenges.
It includes performance analytics, leaderboard ranking, and Redis-based caching for optimized performance.

---

# Architecture

Client (Frontend / Postman)
│
▼
Express.js Server
│
┌──────┴────────┐
▼               ▼
PostgreSQL     Redis
(Database)     (Cache)

The backend follows a layered architecture:

* Routes → API endpoints
* Controllers → Business logic
* Middleware → Auth & security
* Prisma → Database access
* Redis → Performance caching

---

# Tech Stack

Backend

* Node.js
* Express.js

Database

* PostgreSQL

ORM

* Prisma ORM

Caching

* Redis

Authentication

* JWT (JSON Web Token)
* bcrypt

---

# Key Features

## Authentication & Authorization

* User registration & login
* JWT-based authentication
* Role-based access (Admin / Student)

---

## Quiz Module

Admin:

* Create quizzes
* Add questions

Student:

* View quizzes
* Attempt quizzes
* Get score & percentage

---

## Quiz Analytics

* Total attempts
* Performance percentage
* Topic-based statistics

---

## Coding Module

Admin:

* Create coding problems with test cases

Student:

* View problems
* Submit code

Evaluation:

* Test case-based checking
* Score + percentage calculation

---

## Coding Analytics

* Total submissions
* Average accuracy
* Difficulty-wise performance

---

## Leaderboard System

* Ranks users based on:

  * Quiz performance
  * Coding performance
* Combined score ranking

---

## Admin Analytics

System-wide insights:

* Total users
* Total quizzes
* Total attempts
* Average performance

---

## Pagination

Efficient data handling:

GET /api/quiz?page=1&limit=10

Prevents large dataset overload.

---

## Rate Limiting

Protects API from abuse:

* Limits number of requests per minute
* Prevents spam & DDoS

---

## Activity Logging

Tracks user actions:

* Login activity
* Quiz attempts
* Code submissions

Stored in database for auditing.

---

## Redis Caching (Performance Optimization)

Caching implemented for:

GET /api/quiz

Flow:

Request
↓
Check Redis
↓
If cached → return instantly
Else → fetch from DB → store in cache

Cache expiry:

```id="v4n0zp"
60 seconds
```

---

## Cache Invalidation

When data changes:

* Create quiz
* Add question

Cache is cleared:

```id="4qutbn"
redis.flushAll()
```

Ensures fresh data is always served.

---

# Project Structure

backend
src
controllers
authController.js
quizController.js
codingController.js
leaderboardController.js
adminController.js

routes
authRoutes.js
quizRoutes.js
codingRoutes.js
leaderboardRoutes.js
adminRoutes.js

middleware
authMiddleware.js
authorize.js

lib
prisma.js
redis.js

utils
activityLogger.js

prisma
schema.prisma

server.js

---

# Database Models

User
Quiz
QuizQuestion
QuizAttempt
CodingQuestion
Submission
ActivityLog

---

# API Overview

## Authentication

POST /api/auth/register
POST /api/auth/login

---

## Quiz

POST /api/quiz/create
POST /api/quiz/:quizId/add-question
GET /api/quiz
GET /api/quiz/:quizId
POST /api/quiz/submit
GET /api/quiz/analytics

---

## Coding

POST /api/coding/create
GET /api/coding
GET /api/coding/:id
POST /api/coding/submit
GET /api/coding/analytics

---

## Leaderboard

GET /api/leaderboard

---

## Admin

GET /api/admin/system-analytics

---

# Environment Variables

Create `.env` file:

DATABASE_URL="postgresql://user:password@localhost:5432/smartprep-ai"

JWT_SECRET="your_secret_key"

PORT=5000

---

# Installation

Clone repository:

git clone https://github.com/sivateja-tech/smartprep-ai/

Go to backend:

cd smartprep/backend

Install dependencies:

npm install

---

# Database Setup

Run migrations:

npx prisma migrate dev

Generate client:

npx prisma generate

---

# Running Server

npm run dev

Server runs at:

http://localhost:5000

---

# Redis Setup

Run Redis (Docker recommended):

```id="k8srsg"
docker run -p 6379:6379 redis
```

---

# Future Improvements

* Background job queue (BullMQ)
* Email notifications
* Redis advanced caching strategies
* Code execution sandbox
* Bookmark system

---

# Author

Developed as a backend-focused project to practice scalable API design, database modeling, caching, and system optimization.
