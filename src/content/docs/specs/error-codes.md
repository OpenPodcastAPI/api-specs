---
title: Error codes
description: This page lists the common HTTP status codes used across the API.
next: false
prev: false
---

This page lists the common HTTP status codes used across the API.
All error responses MUST conform to the [JSON:API error object format](https://jsonapi.org/format/#errors).

## Success status codes

### `200 OK`

The request was successfully processed.
This status is typically used for `GET`, `PATCH`, or bulk `POST` operations when resources are modified or retrieved but not newly created.

### `201 Created`

The request created a new resource.
The response will include a `Location` header with the URI of the created resource and a `data` object describing it.

## Client error status codes

### `400 Bad Request`

The request was malformed, invalid JSON, or structurally incorrect according to the JSON:API format.
This may include missing required members such as `type`, `id`, or `attributes`.

### `401 Unauthorized`

Authentication is required and has failed or was not provided.
The client **MUST** provide valid credentials to access the endpoint.

### `403 Forbidden`

The client is authenticated but does not have permission to perform the requested action.

### `404 Not Found`

The requested resource does not exist, or the URL is invalid.

### `405 Method Not Allowed`

The HTTP method used is not supported for the target endpoint.

### `409 Conflict`

The request could not be completed due to a conflict with the current state of the resource.
For example, attempting to create a resource that already exists and cannot be duplicated.

### `415 Unsupported Media Type`

The `Content-Type` of the request must be `application/vnd.api+json`.
This error is returned if the client uses an incorrect or missing media type.

### `422 Unprocessable Entity`

The request is syntactically valid, but semantically invalid or fails domain-specific validation rules.

## Server error status codes

### `500 Internal Server Error`

A generic error indicating an unexpected server-side condition.
Clients **SHOULD NOT** rely on this for predictable error handling.

---

## Error object format

All error responses **MUST** return an array of error objects using the format defined by [JSON:API](https://jsonapi.org/format/#errors).

```json
{
  "errors": [
    {
      "status": "422",
      "title": "invalid field value",
      "detail": "the provided guid is not a valid UUIDv5",
      "source": { "pointer": "/data/id" },
      "meta": {
        "provided_guid": "1234-invalid-guid"
      }
    }
  ]
}
```

### Required members

- `status`: the HTTP status code
- `title`: a short summary of the error
- `detail`: a longer human-readable explanation of the issue

### Optional members

- `source.pointer`: a JSON Pointer to the part of the request that caused the error
- `meta`: additional non-standard metadata useful for debugging or client-side handling
