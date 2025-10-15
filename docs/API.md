# API Documentation

This document provides comprehensive information about the Modern Django Template API, including authentication, endpoints, data formats, and usage examples.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URLs](#base-urls)
- [Data Formats](#data-formats)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
- [WebSocket API](#websocket-api)
- [Examples](#examples)
- [SDKs and Libraries](#sdks-and-libraries)

## Overview

The API is built using Django REST Framework and follows RESTful principles. It provides JSON responses in camelCase format and supports various authentication methods.

### Features
- RESTful API design
- JWT authentication with refresh tokens
- OAuth integration (GitHub, Google, etc.)
- Comprehensive error handling
- Rate limiting and throttling
- API versioning
- Pagination for list endpoints
- Filtering and sorting
- OpenAPI/Swagger documentation

## Authentication

### JWT Authentication

The API uses JSON Web Tokens (JWT) for authentication with access and refresh tokens.

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com"
  }
}
```

#### Token Refresh
```http
POST /api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Using Tokens
Include the access token in the Authorization header:

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### OAuth Authentication

The API supports OAuth authentication with various providers.

#### GitHub OAuth
```http
GET /api/auth/github/
```

This redirects to GitHub for authorization. After successful authentication, you'll be redirected back with tokens.

## Base URLs

- **Development**: `http://localhost:8000/api/`
- **Production**: `https://api.yourdomain.com/api/`
- **API Documentation**: `/swagger/` or `/redoc/`

## Data Formats

### Request Format
- **Content-Type**: `application/json`
- **Encoding**: UTF-8
- **Date Format**: ISO 8601 (`2023-12-25T10:30:00Z`)
- **Field Names**: camelCase

### Response Format
- **Content-Type**: `application/json`
- **Encoding**: UTF-8
- **Field Names**: camelCase
- **Timestamps**: ISO 8601 format in UTC

### Pagination
List endpoints use cursor-based pagination:

```json
{
  "count": 150,
  "next": "http://localhost:8000/api/users/?cursor=xyz",
  "previous": "http://localhost:8000/api/users/?cursor=abc",
  "results": [
    // ... array of objects
  ]
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["This field is required."],
      "password": ["Password must be at least 8 characters long."]
    }
  }
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

### Error Codes

| Error Code | Description |
|------------|-------------|
| `VALIDATION_ERROR` | Request data validation failed |
| `AUTHENTICATION_ERROR` | Authentication failed |
| `PERMISSION_DENIED` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **API endpoints**: 100 requests per minute per user
- **File uploads**: 10 requests per minute per user

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login/
Login with username/email and password.

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST /api/auth/register/
Register a new user account.

**Request Body:**
```json
{
  "username": "newuser@example.com",
  "email": "newuser@example.com",
  "password": "securepassword123",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "username": "newuser@example.com",
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

#### POST /api/auth/logout/
Logout and invalidate refresh token.

**Request Body:**
```json
{
  "refresh": "jwt_refresh_token"
}
```

**Response:** `204 No Content`

### User Management Endpoints

#### GET /api/users/me/
Get current user profile.

**Headers:**
```http
Authorization: Bearer jwt_access_token
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "user@example.com",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "dateJoined": "2023-01-15T10:30:00Z",
  "lastLogin": "2023-12-25T14:20:00Z",
  "isActive": true
}
```

#### PUT /api/users/me/
Update current user profile.

**Request Body:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "user@example.com",
  "email": "user@example.com",
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "dateJoined": "2023-01-15T10:30:00Z",
  "lastLogin": "2023-12-25T14:20:00Z",
  "isActive": true
}
```

#### POST /api/users/change-password/
Change user password.

**Request Body:**
```json
{
  "oldPassword": "currentpassword",
  "newPassword": "newpassword123"
}
```

**Response:** `204 No Content`

### File Upload Endpoints

#### POST /api/files/upload/
Upload a file.

**Request:**
```http
Content-Type: multipart/form-data

file=@/path/to/file.jpg
```

**Response:** `201 Created`
```json
{
  "id": "uuid-file-id",
  "filename": "file.jpg",
  "size": 1024576,
  "contentType": "image/jpeg",
  "url": "https://yourbucket.s3.amazonaws.com/files/uuid-file-id.jpg",
  "createdAt": "2023-12-25T10:30:00Z"
}
```

#### GET /api/files/{fileId}/
Get file information.

**Response:** `200 OK`
```json
{
  "id": "uuid-file-id",
  "filename": "file.jpg",
  "size": 1024576,
  "contentType": "image/jpeg",
  "url": "https://yourbucket.s3.amazonaws.com/files/uuid-file-id.jpg",
  "createdAt": "2023-12-25T10:30:00Z"
}
```

#### DELETE /api/files/{fileId}/
Delete a file.

**Response:** `204 No Content`

### Admin Endpoints

#### GET /api/admin/users/
List all users (admin only).

**Query Parameters:**
- `page`: Page number
- `pageSize`: Number of items per page (default: 20)
- `search`: Search term
- `ordering`: Sort field (e.g., `createdAt`, `-createdAt`)

**Response:** `200 OK`
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/admin/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "user1@example.com",
      "email": "user1@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "dateJoined": "2023-01-15T10:30:00Z"
    }
  ]
}
```

## WebSocket API

The application supports real-time communication via WebSockets for certain features.

### Connection
```javascript
const socket = new WebSocket('ws://localhost:8000/ws/notifications/');

socket.onopen = function(event) {
    console.log('WebSocket connected');
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
};
```

### Message Format
```json
{
  "type": "notification",
  "data": {
    "id": "notification-id",
    "message": "You have a new message",
    "createdAt": "2023-12-25T10:30:00Z"
  }
}
```

## Examples

### JavaScript/TypeScript
```typescript
class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(username: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      this.accessToken = data.access;
      return data;
    }

    throw new Error('Login failed');
  }

  async getCurrentUser() {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.baseUrl}/users/me/`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }

    throw new Error('Failed to get user');
  }

  async uploadFile(file: File) {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/files/upload/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      return await response.json();
    }

    throw new Error('Upload failed');
  }
}

// Usage
const client = new ApiClient('http://localhost:8000/api');

async function example() {
  try {
    await client.login('user@example.com', 'password');
    const user = await client.getCurrentUser();
    console.log('Current user:', user);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Python
```python
import requests
from typing import Optional, Dict, Any

class ApiClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.access_token: Optional[str] = None
        self.session = requests.Session()

    def login(self, username: str, password: str) -> Dict[str, Any]:
        """Login and store access token"""
        response = self.session.post(
            f"{self.base_url}/auth/login/",
            json={"username": username, "password": password}
        )
        response.raise_for_status()
        
        data = response.json()
        self.access_token = data['access']
        self.session.headers.update({
            'Authorization': f'Bearer {self.access_token}'
        })
        return data

    def get_current_user(self) -> Dict[str, Any]:
        """Get current user profile"""
        response = self.session.get(f"{self.base_url}/users/me/")
        response.raise_for_status()
        return response.json()

    def upload_file(self, file_path: str) -> Dict[str, Any]:
        """Upload a file"""
        with open(file_path, 'rb') as f:
            response = self.session.post(
                f"{self.base_url}/files/upload/",
                files={'file': f}
            )
        response.raise_for_status()
        return response.json()

# Usage
client = ApiClient('http://localhost:8000/api')

try:
    client.login('user@example.com', 'password')
    user = client.get_current_user()
    print(f"Current user: {user['firstName']} {user['lastName']}")
except requests.RequestException as e:
    print(f"API error: {e}")
```

## SDKs and Libraries

### Official SDKs
- **JavaScript/TypeScript**: Available as npm package
- **Python**: Available as pip package
- **Mobile**: React Native support

### Community Libraries
- **OpenAPI Generator**: Generate clients from OpenAPI spec
- **Swagger Codegen**: Generate clients in various languages

### OpenAPI Specification
The complete OpenAPI specification is available at:
- **Swagger UI**: `http://localhost:8000/swagger/`
- **ReDoc**: `http://localhost:8000/redoc/`
- **OpenAPI JSON**: `http://localhost:8000/api/schema/`

## Versioning

The API uses URL versioning:
- **v1**: `/api/v1/` (current)
- **v2**: `/api/v2/` (future)

Backward compatibility is maintained for at least 12 months after a new version is released.

## Support and Resources

- **API Documentation**: Available at `/swagger/` and `/redoc/`
- **GitHub Issues**: Report bugs and request features
- **Community Forum**: Ask questions and share solutions
- **Status Page**: Check API status and planned maintenance

## Changelog

### v1.0.0 (Current)
- Initial API release
- JWT authentication
- User management
- File upload/download
- Admin endpoints
- WebSocket support