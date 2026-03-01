# API Overview

This document provides a comprehensive overview of the API for the SCG service. It aggregates individual endpoint specifications into a single, agent-friendly format.

## Authentication

### Google OAuth Login

- **Method**: `GET`
- **URL**: `https://app.scg.sh/api/v1/auth/google`
- **Description**: Verifies Google ID Token and issues a service-specific JWT.
- **Access**: Public

**Response**

- **Header**: `Set-Cookie: accessToken=...`
- **Body**:
  ```json
  {
    "user": {
      "email": "user@g.skku.edu",
      "name": "User Name"
    }
  }
  ```

### Get User Info

- **Method**: `GET`
- **URL**: `https://app.scg.sh/api/v1/user`
- **Description**: Returns user information using the user token. Required for auto-login.
- **Access**: User

**Response Body**

```json
{
  "user": {
    "email": "user@g.skku.edu",
    "name": "User Name"
  }
}
```

## URL Management

### Create Short URL

- **Method**: `POST`
- **URL**: `https://app.scg.sh/api/v1/urls`
- **Description**: Shortens a source URL to a user-specified slug.
- **Access**: User

**Request Body**

```json
{
  "targetUrl": "https://original-site.com", // Required
  "slug": "my-link" // Required
}
```

**Response Body**

```json
{
  "urlId": 123,
  "shortUrl": "https://scg.sh/my-link",
  "createdAt": "2024-01-01T00:00:00"
}
```

### Get My URL List

- **Method**: `GET`
- **URL**: `https://app.scg.sh/api/v1/urls`
- **Description**: Retrieves all short URLs created by the current user.
- **Access**: User
- **Query Parameters**:
  - `page`: Number (Optional)
  - `pageSize`: Number (Optional)
  - `sortBy`: String (Optional, e.g., `created-time`, `updated-time`)

**Response Body**

```json
[
  {
    "urlId": 123,
    "slug": "my-link",
    "targetUrl": "https://original-site.com",
    "totalClicks": 10,
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

### Update URL

- **Method**: `PATCH`
- **URL**: `https://app.scg.sh/api/v1/urls/{urlId}`
- **Description**: Modifies a user-created URL.
- **Access**: User

**Request Body**

```json
{
  "targetUrl": "https://new-site.com", // Optional
  "slug": "new-slug" // Optional
}
```

**Response Body**

```json
{
  "urlId": 123,
  "shortenedUrl": "https://scg.sh/new-slug",
  "updatedAt": "2024-01-02T00:00:00"
}
```

### Delete URL

- **Method**: `DELETE`
- **URL**: `https://app.scg.sh/api/v1/urls/{urlId}`
- **Description**: Deletes a user-created URL.
- **Access**: User

**Status Codes**

- `204`: No Content
- `403`: Forbidden
- `404`: Not Found

## Statistics & Analysis

### Get Statistics

- **Method**: `GET`
- **URL**: `https://app.scg.sh/api/v1/urls/{slug}/analytics`
- **Description**: Provides statistics for a specific slug. specific slug. Includes hourly data for the last 24h and daily data for prior periods.
- **Access**: User
- **Query Parameters**:
  - `timezone`: String (Optional, default: "UTC")

**Response Body**

```json
{
  "totalClicks": 150,
  "hourlyStats": [{ "time": "2024-05-20T14:00:00", "count": 5 }],
  "dailyStats": [{ "date": "2024-05-19", "count": 20 }]
}
```

## Core / Redirection

### URL Redirect

- **Method**: `GET`
- **URL**: `https://scg.sh/{slug}`
- **Description**: 302 Redirect to the target URL and logs the click.
- **Access**: Public

**Response**

- **Status**: `302 Found`
- **Header**: `Location: {Target URL}`

### Default Redirect

- **Method**: `GET`
- **URL**: `https://scg.sh/`
- **Description**: 301 Redirect to the main app (app.scg.sh).
- **Access**: Public

**Response**

- **Status**: `301 Permanently redirect`
- **Header**: `Location: https://app.scg.sh`
