# 🚀 SmartPrep Backend

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Redis](https://img.shields.io/badge/Redis-Caching-red)
![BullMQ](https://img.shields.io/badge/BullMQ-Queue-orange)

SmartPrep Backend is a **scalable REST API** for technical interview preparation, enabling quiz practice, coding challenges, performance analytics, and real-time system optimization using caching and background processing.

---

# 🧠 Architecture

Client (Frontend / Postman)
│
▼
Express.js Server
│
┌──────┴───────────────┐
▼                      ▼
PostgreSQL           Redis
(Database)     (Cache + Queue)

---

# 🛠 Tech Stack

Backend

* Node.js
* Express.js

Database

* PostgreSQL

ORM

* Prisma ORM

Caching

* Redis

Queue System

* BullMQ

Authentication

* JWT (JSON Web Token)
* bcrypt

Email Service

* Nodemailer

---

# ✨ Key Features

## 🔐 Authentication & Authorization

* User registration & login
* JWT-based authentication
* Role-based access control (Admin / Student)

---

## 📝 Quiz Module

Admin:

* Create quizzes
* Add questions

Student:

* View quizzes
* Attempt quizzes
* Get score & percentage

---

## 💻 Coding Module

Admin:

* Create coding questions with test cases

Student:

* View coding problems
* Submit solutions

Evaluation:

* Test case-based scoring
* Automatic result calculation

---

## 📊 Analytics

### Quiz Analytics

* Total attempts
* Performance percentage
* Topic-wise tracking

### Coding Analytics

* Submission tracking
* Average accuracy
* Difficulty breakdown

---

## 🏆 Leaderboard

* Ranks users based on:

  * Quiz performance
  * Coding performance
* Combined scoring system

---

## 🧑‍💼 Admin Dashboard

Provides system-wide insights:

* Total users
* Total quizzes
* Total submissions
* Average performance

---

## ⚡ Performance Optimization

### Pagination

Efficient data retrieval:

GET /api/quiz?page=1&limit=10

---

### Rate Limiting

* Prevents API abuse
* Limits excessive requests

---

### Redis Caching

Used for:

* Quiz listing API
* Reduces database load

Flow:

Request → Check Redis → Return cache OR fetch DB → Store cache

Cache expiry: 60 seconds

---

### Cache Invalidation

Cache is cleared when:

* New quiz is created
* Questions are updated

---

## 📜 Activity Logging

Tracks user actions:

* Login activity
* Quiz attempts
* Code submissions

Stored in database for auditing.

---

## ⚙️ Background Job Processing (BullMQ)

* Handles quiz submission asynchronously
* Improves API response time

Flow:

User submits quiz
↓
Job added to Redis queue
↓
Worker processes job
↓
Score calculated & saved

---

## 📧 Email Notifications

* Sent after quiz submission
* Implemented using Nodemailer
* Runs inside background worker

---

## ❤️ Health Monitoring API

GET /api/health

Checks:

* Database connection
* Redis connection
* Server uptime

---

# 📁 Project Structure

backend
src
controllers
authController.js
quizController.js
codingController.js
leaderboardController.js
adminController.js
healthController.js

routes
authRoutes.js
quizRoutes.js
codingRoutes.js
leaderboardRoutes.js
adminRoutes.js
healthRoutes.js

middleware
authMiddleware.js
authorize.js

lib
prisma.js
redis.js

queues
quizQueue.js

workers
quizWorker.js

utils
activityLogger.js
sendEmail.js

prisma
schema.prisma

server.js

---

# 🗄 Database Models

* User
* Quiz
* QuizQuestion
* QuizAttempt
* CodingQuestion
* Submission
* ActivityLog

---

# 🌐 API Endpoints

## Auth

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

## Health

GET /api/health

---

# ⚙️ Environment Variables

Create `.env` file:

DATABASE_URL="postgresql://user:password@localhost:5432/smartprep"

JWT_SECRET="your_secret_key"

PORT=5000

EMAIL_USER=[your_email@gmail.com](mailto:your_email@gmail.com)
EMAIL_PASS=your_app_password

---

# 🛠 Installation

Clone repository:

git clone https://github.com/yourusername/smartprep.git

Navigate:

cd smartprep/backend

Install dependencies:

npm install

---

# 🗄 Database Setup

Run migration:

npx prisma migrate dev

Generate client:

npx prisma generate

---

# ▶️ Running the Backend

npm run dev

Server runs at:

http://localhost:5000

---

# 🔴 Redis Setup

Run Redis (Docker):

```bash
docker run -p 6379:6379 redis
```

---

# 👷 Run Worker

```bash
node src/workers/quizWorker.js
```

---

# 🧪 Test Credentials

Admin:
email: [admin@test.com](mailto:admin@test.com)
password: 123456

Student:
email: [siva@test.com](mailto:student@test.com)
password: 123456

---

# 🚀 Future Improvements

* Real code execution sandbox
* WebSocket-based live leaderboard
* Advanced caching strategies
* Email templates with HTML
* Microservices architecture

---

# 👨‍💻 Author

Developed as a backend-focused project demonstrating scalable API design, caching, asynchronous processing, and system optimization.
