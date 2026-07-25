# RICR Interview Task - API Documentation

Complete API reference for the Form Builder & Response Management System.

**Base URL:** `http://localhost:3000/`

---

## Quick Summary

**System Overview:**
- **Purpose:** Form Builder & Response Management System for educational feedback collection
- **Authentication:** JWT-based with HTTP-only cookies
- **User Roles:** Student, Teacher, Admin
- **Core Features:** Create forms, collect responses, view analytics, manage users (admin)

**Key Endpoints:**
| Feature | Endpoint | Method | Auth Required |
|---------|----------|--------|---------------|
| Login | `/auth/login` | POST | No |
| Create Form | `/user/create-form` | POST | Yes |
| Get Forms | `/user/get-forms` | GET | Yes |
| Fill Form | `/user/fill-form/:token` | GET | No |
| Submit Response | `/user/submit-feedback/:token` | POST | No |
| Get Responses | `/user/form/:id/responses` | GET | Yes |
| Get Teachers (Admin) | `/admin/get-teachers` | GET | Yes (Admin) |
| Approve Form (Admin) | `/admin/form/:id/approve` | PUT | Yes (Admin) |

**Common Workflow:**
1. User logs in → receives JWT token
2. Teacher creates form with fields
3. Form receives share token & QR code
4. Students fill form using token (no auth needed)
5. Teacher views responses & analytics
6. Admin can approve/manage all forms

---

## Table of Contents

- [Quick Summary](#quick-summary)
- [Authentication](#authentication)
- [Auth Endpoints](#auth-endpoints)
- [User Endpoints](#user-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Response Models](#response-models)

---

## Authentication

### JWT Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login, clients receive a token that must be included in subsequent requests.

**Token Storage:** JWT tokens are stored in HTTP-only cookies for security.

**Protected Routes:** Routes marked with `Protect` middleware require a valid JWT token. Admin routes require both `Protect` and `AdminProtect` middleware.

**Headers:**
```
Authorization: Bearer <token>
Cookie: jwt=<token>
```

---

## Auth Endpoints

### POST `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "teacher" | "admin" | "student"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## User Endpoints

All user endpoints require authentication via `Protect` middleware.

### POST `/user/create-form`

Create a new form. Only accessible by teachers/admins.

**Request Body:**
```json
{
  "title": "Student Feedback Form",
  "description": "Collect feedback from students",
  "fields": [
    {
      "label": "Name",
      "type": "text",
      "required": true
    },
    {
      "label": "Rating",
      "type": "rating",
      "required": true
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Form created successfully",
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Student Feedback Form",
    "description": "Collect feedback from students",
    "createdBy": "507f1f77bcf86cd799439012",
    "shareToken": "abc123xyz",
    "isActive": true,
    "createdAt": "2026-07-25T10:30:00Z",
    "updatedAt": "2026-07-25T10:30:00Z"
  }
}
```

---

### GET `/user/get-forms`

Retrieve all forms created by the authenticated user.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Forms retrieved successfully",
  "forms": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Student Feedback Form",
      "description": "Collect feedback from students",
      "isActive": true,
      "responseCount": 25,
      "createdAt": "2026-07-25T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalForms": 1
  }
}
```

---

### GET `/user/fill-form/:token`

Retrieve a form for filling by respondents using share token. **No authentication required**.

**URL Parameters:**
- `token` (required): Form share token

**Response (200 OK):**
```json
{
  "success": true,
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Student Feedback Form",
    "description": "Collect feedback from students",
    "fields": [
      {
        "label": "Name",
        "type": "text",
        "required": true
      }
    ]
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Form not found or is inactive"
}
```

---

### POST `/user/submit-feedback/:token`

Submit a response to a form. **No authentication required**.

**URL Parameters:**
- `token` (required): Form share token

**Request Body:**
```json
{
  "responses": {
    "name": "John Student",
    "rating": 5
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Response submitted successfully",
  "response": {
    "_id": "507f1f77bcf86cd799439013",
    "formId": "507f1f77bcf86cd799439011",
    "responses": {
      "name": "John Student",
      "rating": 5
    },
    "submittedAt": "2026-07-25T10:35:00Z"
  }
}
```

---

### PATCH `/user/toggle-form/:id`

Activate or deactivate a form.

**URL Parameters:**
- `id` (required): Form ID

**Request Body:**
```json
{
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Form status updated",
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": true
  }
}
```

---

### DELETE `/user/delete-form/:id`

Delete a form created by the user.

**URL Parameters:**
- `id` (required): Form ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Form deleted successfully"
}
```

---

### GET `/user/form/:id`

Get detailed information about a specific form.

**URL Parameters:**
- `id` (required): Form ID

**Response (200 OK):**
```json
{
  "success": true,
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Student Feedback Form",
    "description": "Collect feedback from students",
    "fields": [
      {
        "label": "Name",
        "type": "text"
      }
    ],
    "isActive": true,
    "shareToken": "abc123xyz",
    "createdAt": "2026-07-25T10:30:00Z"
  }
}
```

---

### PUT `/user/form/:id`

Update a form.

**URL Parameters:**
- `id` (required): Form ID

**Request Body:**
```json
{
  "title": "Updated Form Title",
  "description": "Updated description",
  "fields": [...]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Form updated successfully",
  "form": {...}
}
```

---

### GET `/user/form/:id/responses`

Retrieve all responses for a form.

**URL Parameters:**
- `id` (required): Form ID

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "responses": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "responses": {
        "name": "John Student",
        "rating": 5
      },
      "submittedAt": "2026-07-25T10:35:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalResponses": 1
  }
}
```

---

### GET `/user/fetch-response/:formId`

Fetch response data for analytics and visualization.

**URL Parameters:**
- `formId` (required): Form ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalResponses": 25,
    "responsesByField": {
      "rating": [5, 4, 5, 3, 4, ...],
      "feedback": ["Great class", "Good content", ...]
    },
    "analytics": {
      "averageRating": 4.2,
      "responseRate": 85
    }
  }
}
```

---

## Admin Endpoints

All admin endpoints require authentication via `Protect` and `AdminProtect` middleware.

### GET `/admin/get-teachers`

Get all teachers in the system.

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "teachers": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Teacher",
      "email": "jane@example.com",
      "formCount": 5,
      "createdAt": "2026-07-20T08:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalTeachers": 1
  }
}
```

---

### GET `/admin/teacher-forms/:teacherId`

Get all forms created by a specific teacher.

**URL Parameters:**
- `teacherId` (required): Teacher's User ID

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "forms": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Student Feedback Form",
      "createdBy": "507f1f77bcf86cd799439012",
      "isApproved": false,
      "responseCount": 15,
      "createdAt": "2026-07-25T10:30:00Z"
    }
  ]
}
```

---

### PUT `/admin/form/:id/approve`

Approve a form for use.

**URL Parameters:**
- `id` (required): Form ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Form approved successfully",
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "isApproved": true
  }
}
```

---

### DELETE `/admin/form/:id`

Delete a form (admin override).

**URL Parameters:**
- `id` (required): Form ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Form deleted successfully"
}
```

---

### GET `/admin/form/:id/responses`

Get all responses to a form (admin view).

**URL Parameters:**
- `id` (required): Form ID

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page
- `filter` (optional): Filter responses by field

**Response (200 OK):**
```json
{
  "success": true,
  "responses": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "formId": "507f1f77bcf86cd799439011",
      "responses": {...},
      "submittedAt": "2026-07-25T10:35:00Z"
    }
  ],
  "totalResponses": 25
}
```

---

### GET `/admin/form/:id`

Get form details (admin view).

**URL Parameters:**
- `id` (required): Form ID

**Response (200 OK):**
```json
{
  "success": true,
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Student Feedback Form",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Teacher",
      "email": "jane@example.com"
    },
    "isApproved": true,
    "isActive": true,
    "responseCount": 25,
    "fields": [...],
    "createdAt": "2026-07-25T10:30:00Z"
  }
}
```

---

### PUT `/admin/form/:id`

Update form (admin override).

**URL Parameters:**
- `id` (required): Form ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "isActive": true,
  "fields": [...]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Form updated successfully",
  "form": {...}
}
```

---

## Response Models

### User Object

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "teacher",
  "createdAt": "2026-07-20T08:00:00Z",
  "updatedAt": "2026-07-25T10:30:00Z"
}
```

### Form Object

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Student Feedback Form",
  "description": "Collect feedback from students",
  "createdBy": "507f1f77bcf86cd799439012",
  "fields": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "label": "Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your name"
    }
  ],
  "isActive": true,
  "isApproved": true,
  "shareToken": "abc123xyz",
  "qrCode": "data:image/png;base64,...",
  "responseCount": 25,
  "createdAt": "2026-07-25T10:30:00Z",
  "updatedAt": "2026-07-25T10:30:00Z"
}
```

### Form Response Object

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "formId": "507f1f77bcf86cd799439011",
  "responses": {
    "name": "John Student",
    "rating": 5,
    "feedback": "Great class!"
  },
  "submittedAt": "2026-07-25T10:35:00Z",
  "submittedBy": "507f1f77bcf86cd799439015"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource successfully created |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal server error |

---

## Rate Limiting

Currently, no rate limiting is implemented. Please use the API responsibly.

---

## Versioning

This is API v1.0. Future versions may include breaking changes.

---

## Support

For issues or questions about the API, please create an issue on the [GitHub repository](https://github.com/sanjana-vi20/RICR-Interview-Task).

**Last Updated:** July 2026
