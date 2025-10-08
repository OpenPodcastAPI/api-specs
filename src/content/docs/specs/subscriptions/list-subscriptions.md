---
title: List subscriptions
description: List all subscriptions for a user
sidebar:
  order: 3
banner:
  content: |
    This is a <b>core action</b>. All server implementations MUST support it.
---

Retrieves a paginated list of podcast subscriptions associated with the authenticated user.

```http
GET /v1/subscriptions
```

## Request format

This endpoint supports optional query parameters for pagination:

| Parameter      | Description                                                           |
| -------------- | --------------------------------------------------------------------- |
| `page[number]` | The page of results to return (default: `1`).                         |
| `page[size]`   | The number of results to return per page (default: `25`, max: `100`). |

```http
GET /v1/subscriptions?page[number]=1&page[size]=2 HTTP/1.1
Accept: application/vnd.api+json
```

## Server behavior

- The server **MUST** return only subscriptions that belong to the authenticated user.
- The server **MUST** return pagination metadata and pagination links.
- The server **MUST** return an empty array if the user has no subscriptions.
- The server **SHOULD** support `page[size]` values between 1 and 100.

## Success response

- HTTP Status: `200 OK`
- Content-Type: `application/vnd.api+json`

Each subscription resource in the response **MUST** include:

- `type`: `"subscription"`
- `id`: the globally unique `guid`
- `attributes.feedUrl`: the feed URL
- `attributes.userSubscribedAt`: the timestamp of when the user subscribed in ISO 8601 format
- `links.self`: link to the subscription resource
- `links.unsubscribe`: a `DELETE`-able link to unsubscribe from the feed

The top-level `links` object **MUST** include pagination links:

- `self`: the current request URI
- `first`: the first page of results
- `prev`: the previous page, if one exists
- `next`: the next page, if one exists
- `last`: the last page of results

The top-level `meta` object **MAY** include total count metadata.

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.api+json

{
  "jsonapi": { "version": "1.1" },
  "data": [
    {
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
    },
    {
      "type": "subscription",
      "id": "b80719b3-1485-57c0-9e55-fda2b8f7472b",
      "attributes": {
        "feedUrl": "https://example.com/rss2",
        "userSubscribedAt": "2025-08-24T16:00:00Z"
      },
      "links": {
        "self": "/v1/subscriptions/b80719b3-1485-57c0-9e55-fda2b8f7472b",
        "unsubscribe": {
          "href": "/v1/subscriptions/b80719b3-1485-57c0-9e55-fda2b8f7472b",
          "method": "DELETE"
        }
      }
    }
  ],
  "links": {
    "self": "/v1/subscriptions?page[number]=1&page[size]=2",
    "first": "/v1/subscriptions?page[number]=1&page[size]=2",
    "prev": null,
    "next": "/v1/subscriptions?page[number]=2&page[size]=2",
    "last": "/v1/subscriptions?page[number]=5&page[size]=2"
  },
  "meta": {
    "total": 10
  }
}
```
