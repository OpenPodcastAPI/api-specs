---
title: Authentication
description: The Open Podcast API uses Bearer authentication for all protected endpoints.
---

The Open Podcast API uses a bearer token authentication model based on a simplified OAuth 2.0-style login flow.

Clients authenticate with a username and password to obtain an access token and a refresh token. The access token is used to authorize API requests. When the access token expires, the client should use the refresh token to obtain a new access token. If the refresh token has expired, the user must authenticate again.

## Authentication flow {#authentication-flow}

1. The client submits the user's credentials to the `/auth/login` endpoint.
1. The server validates the credentials and returns:
   * An access token
   * The access token expiration offset (in seconds)
   * A refresh token
   * The refresh token expiration time
   * The endpoint used to refresh the access token
1. The client includes the access token in the `Authorization` header for all authenticated requests.
1. When the access token expires, the client requests a new access token using the refresh token.
1. If the refresh token has expired or is no longer valid, the client must authenticate again using the `/auth/login` endpoint.

## Login {#login}

```txt title="Endpoint"
POST /auth/login
```

### Request {#login-request}

```sh
curl '/auth/login' \
  -X 'POST' \
  -H 'Content-Type: application/json' \
  -H 'Client-ID: cca4ad10-dc35-4572-8f11-125dc465428a'
  -d '{
	  "username": "user@example.com",
	  "password": "your-password"
  }'
```

#### Successful response {#login-success-response}

```json title="HTTP 200 OK"
{
	"access_token": "<access_token>",
	"expires_in": 3600,
	"refresh_token": "<refresh_token>",
	"refresh_expires": "2026-07-11T15:30:00Z",
	"refresh_endpoint": "/auth/refresh"
}
```

#### Response fields {#login-success-response-fields}

| Field              | Description                                  |
|--------------------|----------------------------------------------|
| `access_token`     | Token used to authenticate API requests      |
| `expires_in`       | Lifetime of the access token in seconds      |
| `refresh_token`    | Token used to obtain a new access token      |
| `refresh_expires`  | UTC timestamp when the refresh token expires |
| `refresh_endpoint` | Endpoint used to refresh the access token    |

## Refreshing an access token {#refreshing-access-token}

When the access token expires, the client should request a new one before making additional API calls.

```txt title="Endpoint"
POST /auth/refresh
```

### Request {#refresh-request}

```sh
curl '/auth/refresh' \
  -X 'POST' \
  -H 'Content-Type: application/json' \
  -H 'Client-ID: cca4ad10-dc35-4572-8f11-125dc465428a'
  -d '{
	  "refresh_token": "<refresh_token>"
  }'
```

```json title="Successful response"
{
  "access_token": "<new_access_token>",
  "expires_in": 3600
}
```

If the refresh token is expired or invalid, the server must return an `401 Unauthorized` error. The client must then authenticate again using the `/auth/login` endpoint.

## Using the Access Token {#use-access-token}

All authenticated requests must include the access token in the `Authorization` header using the Bearer authentication scheme.

### Example {#use-token-example}

```sh title="Example request"
curl '/api/v1/sync \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Client-ID: cca4ad10-dc35-4572-8f11-125dc465428a'
```

## Token Lifecycle {#token-lifecycle}

| State                                   | Client Action                                       |
|-----------------------------------------|-----------------------------------------------------|
| Access token is valid                   | Continue using the access token.                    |
| Access token has expired                | Request a new access token using the refresh token. |
| Refresh token has expired or is invalid | Authenticate again using the `/login` endpoint.     |


## Error Responses {#error-responses}

| HTTP Status                 | Description                                                                  |
|-----------------------------|------------------------------------------------------------------------------|
| `400 Bad Request`           | Request is malformed or required fields are missing.                         |
| `401 Unauthorized`          | Credentials or tokens are invalid or expired.                                |
| `403 Forbidden`             | The authenticated user is not authorized to perform the requested operation. |
| `500 Internal Server Error` | An unexpected server error occurred.                                         |

## Security Considerations {#security-considerations}

* Always use HTTPS to protect credentials and tokens in transit.
* Store access and refresh tokens securely.
* Never expose tokens in URLs or log files.
* Send the access token only in the Authorization header.
* Treat refresh tokens as sensitive credentials and protect them accordingly.
