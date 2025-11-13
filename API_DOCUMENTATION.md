# MoodyMe API Documentation

## Table of Contents
- [Authentication APIs](#authentication-apis)
- [User Management APIs](#user-management-apis)
- [Content Management APIs](#content-management-apis)
- [Banner Management APIs](#banner-management-apis)
- [Admin APIs](#admin-apis)

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most admin endpoints require Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Authentication APIs

### 1. Sign Up (Register New User)

**Endpoint:** `POST /auth/signup`

**Description:** Register a new user account

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- `firstName`: Minimum 2 characters
- `lastName`: Minimum 2 characters
- `email`: Valid email format
- `password`: Minimum 8 characters

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clx1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isActive": true,
    "role": "USER",
    "createdAt": "2025-11-13T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Validation failed
- `409`: User already exists
- `500`: Internal server error

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive access token

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clx1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isActive": true,
    "role": "USER",
    "createdAt": "2025-11-13T10:30:00.000Z",
    "updatedAt": "2025-11-13T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Validation failed
- `401`: Invalid email or password
- `403`: Account deactivated
- `500`: Internal server error

---

### 3. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Description:** Request password reset link via email

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "If an account exists with this email, you will receive a password reset link."
}
```

**Note:** Returns the same response regardless of whether the email exists (security measure to prevent email enumeration)

**Error Responses:**
- `400`: Validation failed
- `500`: Internal server error

---

### 4. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Description:** Reset password using token from email

**Request Body:**
```json
{
  "token": "abc123def456ghi789",
  "password": "NewSecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Error Responses:**
- `400`: Invalid or expired token / Validation failed / Token already used
- `500`: Internal server error

---

## Content Management APIs (Public)

### 5. Get Content

**Endpoint:** `GET /content`

**Description:** Get all active content or specific content type

**Query Parameters:**
- `type` (optional): `ABOUT_US`, `HELP_SUPPORT`, or `PRIVACY_POLICY`

**Examples:**
```
GET /content
GET /content?type=ABOUT_US
GET /content?type=HELP_SUPPORT
GET /content?type=PRIVACY_POLICY
```

**Success Response (200):**
```json
{
  "contents": [
    {
      "id": "clx1234567890",
      "type": "ABOUT_US",
      "title": "About MoodyMe",
      "content": "MoodyMe is an innovative mobile application...",
      "isActive": true,
      "createdAt": "2025-11-13T10:30:00.000Z",
      "updatedAt": "2025-11-13T10:30:00.000Z"
    }
  ]
}
```

---

## Admin APIs

All admin endpoints require authentication with an ADMIN role.

### 6. Get Dashboard Statistics

**Endpoint:** `GET /admin/stats`

**Description:** Get dashboard statistics and recent users

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "stats": {
    "totalUsers": 150,
    "activeUsers": 142,
    "inactiveUsers": 8,
    "totalBanners": 5,
    "activeBanners": 3,
    "contentCount": 3
  },
  "recentUsers": [
    {
      "id": "clx1234567890",
      "email": "user@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "createdAt": "2025-11-13T10:30:00.000Z",
      "isActive": true
    }
  ]
}
```

---

### 7. Get All Users (Admin)

**Endpoint:** `GET /admin/users`

**Description:** Get paginated list of users with search and filter

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Results per page
- `search` (optional): Search by name or email
- `isActive` (optional): Filter by active status (true/false)

**Example:**
```
GET /admin/users?page=1&limit=10&search=john&isActive=true
```

**Success Response (200):**
```json
{
  "users": [
    {
      "id": "clx1234567890",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "role": "USER",
      "createdAt": "2025-11-13T10:30:00.000Z",
      "updatedAt": "2025-11-13T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

---

### 8. Get Single User (Admin)

**Endpoint:** `GET /admin/users/:id`

**Description:** Get specific user details

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": "clx1234567890",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "role": "USER",
    "createdAt": "2025-11-13T10:30:00.000Z",
    "updatedAt": "2025-11-13T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Forbidden (not admin)
- `404`: User not found
- `500`: Internal server error

---

### 9. Update User (Admin)

**Endpoint:** `PUT /admin/users/:id`

**Description:** Update user information and status

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "isActive": false
}
```

**Success Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "clx1234567890",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": false,
    "role": "USER",
    "createdAt": "2025-11-13T10:30:00.000Z",
    "updatedAt": "2025-11-13T12:00:00.000Z"
  }
}
```

---

### 10. Delete User (Admin)

**Endpoint:** `DELETE /admin/users/:id`

**Description:** Delete a user permanently

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400`: Cannot delete own account
- `401`: Unauthorized
- `403`: Forbidden
- `500`: Internal server error

---

### 11. Get All Content (Admin)

**Endpoint:** `GET /admin/content`

**Description:** Get all content (including inactive)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `type` (optional): Filter by content type

**Success Response (200):**
```json
{
  "contents": [
    {
      "id": "clx1234567890",
      "type": "ABOUT_US",
      "title": "About MoodyMe",
      "content": "Full content here...",
      "isActive": true,
      "createdAt": "2025-11-13T10:30:00.000Z",
      "updatedAt": "2025-11-13T10:30:00.000Z"
    }
  ]
}
```

---

### 12. Create Content (Admin)

**Endpoint:** `POST /admin/content`

**Description:** Create new content page

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "ABOUT_US",
  "title": "About MoodyMe",
  "content": "MoodyMe is an innovative mobile application designed to help users track their mood and emotions...",
  "isActive": true
}
```

**Success Response (201):**
```json
{
  "message": "Content created successfully",
  "content": {
    "id": "clx1234567890",
    "type": "ABOUT_US",
    "title": "About MoodyMe",
    "content": "MoodyMe is an innovative mobile application...",
    "isActive": true,
    "createdAt": "2025-11-13T10:30:00.000Z",
    "updatedAt": "2025-11-13T10:30:00.000Z"
  }
}
```

---

### 13. Update Content (Admin)

**Endpoint:** `PUT /admin/content/:id`

**Description:** Update existing content

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "ABOUT_US",
  "title": "About MoodyMe - Updated",
  "content": "Updated content...",
  "isActive": true
}
```

**Success Response (200):**
```json
{
  "message": "Content updated successfully",
  "content": {
    "id": "clx1234567890",
    "type": "ABOUT_US",
    "title": "About MoodyMe - Updated",
    "content": "Updated content...",
    "isActive": true,
    "createdAt": "2025-11-13T10:30:00.000Z",
    "updatedAt": "2025-11-13T12:00:00.000Z"
  }
}
```

---

### 14. Delete Content (Admin)

**Endpoint:** `DELETE /admin/content/:id`

**Description:** Delete content page

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "message": "Content deleted successfully"
}
```

---

### 15. Get All Banners (Admin)

**Endpoint:** `GET /admin/banners`

**Description:** Get all banners ordered by display order

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "banners": [
    {
      "id": "clx1234567890",
      "title": "Summer Sale",
      "subtitle": "Get 50% off on premium features",
      "imageUrl": "https://example.com/banner.jpg",
      "link": "https://example.com/sale",
      "order": 0,
      "isActive": true,
      "createdAt": "2025-11-13T10:30:00.000Z",
      "updatedAt": "2025-11-13T10:30:00.000Z"
    }
  ]
}
```

---

### 16. Create Banner (Admin)

**Endpoint:** `POST /admin/banners`

**Description:** Create new promotional banner

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Summer Sale",
  "subtitle": "Get 50% off on premium features",
  "imageUrl": "https://example.com/banner.jpg",
  "link": "https://example.com/sale",
  "order": 0,
  "isActive": true
}
```

**Success Response (201):**
```json
{
  "message": "Banner created successfully",
  "banner": {
    "id": "clx1234567890",
    "title": "Summer Sale",
    "subtitle": "Get 50% off on premium features",
    "imageUrl": "https://example.com/banner.jpg",
    "link": "https://example.com/sale",
    "order": 0,
    "isActive": true,
    "createdAt": "2025-11-13T10:30:00.000Z",
    "updatedAt": "2025-11-13T10:30:00.000Z"
  }
}
```

---

### 17. Update Banner (Admin)

**Endpoint:** `PUT /admin/banners/:id`

**Description:** Update existing banner

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Summer Sale - Updated",
  "subtitle": "Get 60% off on premium features",
  "imageUrl": "https://example.com/new-banner.jpg",
  "link": "https://example.com/sale",
  "order": 1,
  "isActive": true
}
```

**Success Response (200):**
```json
{
  "message": "Banner updated successfully",
  "banner": {
    "id": "clx1234567890",
    "title": "Summer Sale - Updated",
    "subtitle": "Get 60% off on premium features",
    "imageUrl": "https://example.com/new-banner.jpg",
    "link": "https://example.com/sale",
    "order": 1,
    "isActive": true,
    "createdAt": "2025-11-13T10:30:00.000Z",
    "updatedAt": "2025-11-13T12:00:00.000Z"
  }
}
```

---

### 18. Delete Banner (Admin)

**Endpoint:** `DELETE /admin/banners/:id`

**Description:** Delete banner

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "message": "Banner deleted successfully"
}
```

---

## Error Response Format

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message description",
  "details": [] // Optional: validation errors
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

---

## Mobile App Integration Guide

### 1. User Registration Flow

```javascript
// Example: Mobile app signup
const response = await fetch('https://your-api.com/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});

const data = await response.json();
// Store token for future requests
localStorage.setItem('token', data.token);
```

### 2. User Login Flow

```javascript
// Example: Mobile app login
const response = await fetch('https://your-api.com/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});

const data = await response.json();
if (response.ok) {
  // Store token and user data
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}
```

### 3. Fetch Content Pages

```javascript
// Example: Fetch About Us page
const response = await fetch('https://your-api.com/api/content?type=ABOUT_US');
const data = await response.json();
// Display content in the app
const aboutContent = data.contents[0];
```

### 4. Password Reset Flow

```javascript
// Step 1: Request reset
const response = await fetch('https://your-api.com/api/auth/forgot-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com'
  })
});

// Step 2: User receives email with token
// Step 3: Reset password
const resetResponse = await fetch('https://your-api.com/api/auth/reset-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: 'token-from-email',
    password: 'NewSecurePass123'
  })
});
```

---

## Environment Variables

Create a `.env` file in your project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/moodemy?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Email Configuration (Resend)
RESEND_API_KEY="re_your_api_key"
FROM_EMAIL="noreply@yourdomain.com"

# Admin Credentials
ADMIN_EMAIL="admin@moodemy.com"
ADMIN_PASSWORD="Admin@123"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# App URL
APP_URL="http://localhost:3000"
```

---

## Setup Instructions

1. **Install Dependencies:**
```bash
npm install
```

2. **Setup Database:**
```bash
npx prisma generate
npx prisma db push
```

3. **Create Admin User (Optional):**
```bash
npx prisma studio
# Manually create an admin user or use the signup endpoint and update role to ADMIN
```

4. **Run Development Server:**
```bash
npm run dev
```

5. **Access Admin Dashboard:**
```
http://localhost:3000/admin
```

---

## Support

For questions or issues, contact the development team or open an issue in the project repository.
