# SmartPrep Backend

SmartPrep is a backend system for technical placement preparation.

It provides APIs for quizzes, coding challenges, user authentication, performance tracking, leaderboards, and admin analytics.

---

## Features

### 1. Authentication

- User registration and login
- JWT authentication
- Password hashing using bcrypt
- Admin and Student roles
- Protected APIs

---

### 2. Quiz Module

Admin can:

- Create quizzes
- Add questions

Students can:

- View quizzes
- Attempt quizzes
- Submit answers
- Get score and percentage

---

### 3. Quiz Pagination

Quiz APIs support pagination.

Example:

```text
GET /api/quiz?page=1&limit=10
