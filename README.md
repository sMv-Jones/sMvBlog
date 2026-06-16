# sMvBlog
This an blog appliction created for as an learning project for web development

# Blog API Backend

A secure and scalable REST API for managing blog posts, user authentication, and image uploads using Azure Blob Storage.

## Features

- User Registration & Authentication
- JWT Authentication with HttpOnly Cookies
- Blog Post CRUD Operations
- Azure Blob Storage Image Uploads
- Input Validation using Express Validator
- HTML Sanitization using DOMPurify
- Rate Limiting for Authentication Routes
- Secure Password Hashing with bcrypt
- Security Headers with Helmet
- MongoDB Integration using Mongoose

---

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT (JSON Web Tokens)
- bcryptjs

### File Storage

- Azure Blob Storage
- Multer

### Security

- Helmet
- Express Rate Limit
- DOMPurify
- Express Validator

---

## Project Structure

```text
src/
├── configs/
│   ├── azureStorage.js
│   └── db.js
│
├── controllers/
│   ├── auth.js
│   └── post.js
│
├── middlewares/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── validate.js
│
├── models/
│   ├── user.js
│   └── post.js
│
├── routes/
│   ├── auth.js
│   └── post.js
│
├── utils/
│   └── helpers.js
│
├── validators/
│   ├── auth.js
│   └── post.js
│
└── server.js
```

---

# Getting Started

## Prerequisites

- Node.js v18+
- MongoDB
- Azure Storage Account

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd blog-api
```

### Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/blog

JWT_SECRET=your_super_secret_key

FRONTEND_URL=http://localhost:3000

AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string

AZURE_CONTAINER_NAME=blog-images
```

---

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

---

# API Endpoints

Base URL:

```http
/api
```

---

# Authentication

## Register User

```http
POST /api/auth/register
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Login User

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful"
}
```

---

## Logout User

```http
POST /api/auth/logout
```

### Success Response

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Get Current User

```http
GET /api/auth/me
```

### Authentication Required

### Success Response

```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

# Posts

## Get All Active Posts

```http
GET /api/posts
```

### Success Response

```json
{
  "success": true,
  "posts": []
}
```

---

## Get Single Post

```http
GET /api/posts/:slug
```

### Success Response

```json
{
  "success": true,
  "post": {}
}
```

---

## Create Post

```http
POST /api/posts
```

### Authentication Required

### Content-Type

```http
multipart/form-data
```

### Form Fields

| Field | Type | Required |
|---------|---------|---------|
| title | string | Yes |
| content | string | Yes |
| status | string | No |
| image | file | No |

### Success Response

```json
{
  "success": true,
  "post": {}
}
```

---

## Update Post

```http
PUT /api/posts/:featuredImage
```

### Authentication Required

### Success Response

```json
{
  "success": true,
  "post": {}
}
```

---

## Delete Post

```http
DELETE /api/posts/:slug
```

### Authentication Required

### Success Response

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

# Authentication Flow

1. User registers an account.
2. User logs in.
3. Server generates a JWT.
4. JWT is stored in a secure HttpOnly cookie.
5. Protected routes validate the JWT.
6. User can create, update, and delete their own posts.

---

# Security Features

### Password Security

- bcrypt hashing
- Password never stored in plain text

### Authentication Security

- JWT tokens
- HttpOnly cookies
- SameSite protection

### API Security

- Helmet security headers
- Request validation
- Rate limiting
- HTML sanitization

### Authorization

- Users can only modify their own posts
- Ownership checks on update/delete operations

---

# Azure Blob Storage

Uploaded images are stored in Azure Blob Storage.

Required environment variables:

```env
AZURE_STORAGE_CONNECTION_STRING=
AZURE_CONTAINER_NAME=
```

Images are uploaded during post creation and update.

---

# Error Handling

The application includes centralized error handling middleware for:

- Validation Errors
- Authentication Errors
- Database Errors
- File Upload Errors
- Internal Server Errors

---

# Future Improvements

- Pagination
- Search & Filtering
- Refresh Tokens
- Role-Based Access Control (RBAC)
- Swagger/OpenAPI Documentation
- Unit & Integration Tests
- Docker Support
- CI/CD Pipeline
- Logging with Pino or Winston
- Health Check Endpoint

---

# Scripts

```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

---

# License

This project is licensed under the MIT License.

---

# Author

Developed using Node.js, Express, MongoDB, and Azure Blob Storage.