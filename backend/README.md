# SmartPrep Backend

SmartPrep is a backend system for technical placement preparation.

It provides REST APIs for quizzes, coding challenges, authentication, performance analytics, leaderboards, admin analytics, activity tracking, request validation, rate limiting, email notifications, and real code execution.

---

## Features

### 1. Authentication and Authorization

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API endpoints
- Role-based access control
- Admin and Student roles

---

### 2. Quiz Module

Admins can:

- Create quizzes
- Add quiz questions
- Configure correct answers

Students can:

- View available quizzes
- Attempt quizzes
- Submit answers
- Receive scores
- Receive percentages

---

### 3. Quiz Pagination

Quiz listing supports pagination.

Example:

```text
GET /api/quiz?page=1&limit=10
