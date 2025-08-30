---
title: Get a single subscription
description: Get a single subscription for a user
sidebar:
  order: 4
banner:
  content: |
    This is a <b>core action</b>. All server implementations MUST support it.
---

Enables clients to fetch a single subscription resource by its globally unique `guid`.

```http
GET /v1/subscriptions/{guid}
```

## Request format

Clients **MUST** send a `GET` request to the canonical URI of a subscription resource, using the `guid` as the identifier.

### Path parameters

| Parameter | Type   | Description                                                           |
| --------- | ------ | --------------------------------------------------------------------- |
| `guid`    | string | The globally unique identifier (UUIDv5) of the subscription resource. |

### Headers

Clients **MUST** include the following headers:

- `Accept: application/vnd.api+json`

```http
GET /v1/subscriptions/ce510f4d-9046-5590-846e-58619ab8b353 HTTP/1.1
Accept: application/vnd.api+json
```

## Server behavior

- The server **MUST** return a `200 OK` response with the subscription resource if it exists and is associated with the authenticated user.
- If the subscription does not exist, the server **MUST** return a `404 Not Found` error object.
- The server **MUST** validate that the `guid` is a valid UUID format. If it is not, the server **MUST** return a `400 Bad Request`.

## Success response

If the subscription is found and accessible to the current user:

- HTTP Status: `200 OK`
- Headers:
  - `Content-Type: application/vnd.api+json`

The response body **MUST** include:

- A top-level `data` object containing the `subscription` resource.
- A `links.self` pointing to the resource.
- A `links.unsubscribe` pointing to the same resource with `method: DELETE`.

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.api+json

{
  "jsonapi": { "version": "1.1" },
  "data": {
    "type": "subscription",
    "id": "ce510f4d-9046-5590-846e-58619ab8b353",
    "attributes": {
      "feedUrl": "https://example.com/rss1",
      "userSubscribedAt": "2025-08-24T16:00:00Z"
    },
    "links": {
      "self": "/v1/subscriptions/ce510f4d-9046-5590-846e-58619ab8b353",
      "unsubscribe": {
        "href": "/v1/subscriptions/ce510f4d-9046-5590-846e-58619ab8b353",
        "method": "DELETE"
      }
    }
  }
}
```

## Error responses

| HTTP status       | When it occurs                                         |
| ----------------- | ------------------------------------------------------ |
| `400 Bad Request` | If the provided `guid` is not a valid UUID.            |
| `404 Not Found`   | If the subscription does not exist or is inaccessible. |

See [error response format](/specs/error-codes) for more information.
