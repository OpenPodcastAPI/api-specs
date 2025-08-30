---
title: Bulk add subscriptions
description: Create multiple subscription resource in a single request
sidebar:
  order: 2
banner:
  content: |
    This is a <b>core action</b>. All server implementations MUST support it.
---

```http
POST /v1/operations
```

Creates multiple `subscription` resources.
See the [subscriptions endpoint](/specs/subscriptions) for more information.

## Request

Clients **MUST** send an array of `operations`, each specifying:

- `op`: `"add"`
- `data`: **MUST** contain a single resource object

### Example

```http
POST /api/v1/operations HTTP/1.1
Content-Type: application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"
Accept: application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"

{
  "atomic:operations": [
    {
      "op": "add",
      "data": {
        "type": "subscription",
        "id": "ce510f4d-9046-5590-846e-58619ab8b353",
        "attributes": {
          "feedUrl": "https://example.com/rss1"
        }
      }
    },
    {
      "op": "add",
      "data": {
        "type": "subscription",
        "id": "b80719b3-1485-57c0-9e55-fda2b8f7472b",
        "attributes": {
          "feedUrl": "https://example.com/rss2"
        }
      }
    }
  ]
}
```

## Server behavior

- The server **MUST** attempt to perform each operation independently.
- Operations **MUST** be executed in order.
- The response **MUST** contain a `results` array with a one-to-one mapping of the input operations.
- If any operation fails, the corresponding `results` entry **MUST** be an `error` object.
- The server **MUST** return `200 OK` regardless of partial failures.

## Success response

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.api+json;ext="https://jsonapi.org/ext/atomic" "https://openpodcastapi.org/specs/extensions/link-method"

{
   "jsonapi": {
      "version": "1.1",
      "ext": [
         "https://jsonapi.org/ext/atomic",
         "https://openpodcastapi.org/specs/extensions/link-method"
      ],
   },
   "atomic:results": [
    {
      "data": {
        "type": "subscription",
        "id": "ce510f4d-9046-5590-846e-58619ab8b353",
        "attributes": {
          "feedUrl": "https://example.com/rss1",
          "userSubscribedAt": "2025-08-24T16:00:00Z"
        },
        "links": {
          "self": "/v1/subscriptions/ce510f4d-9046-5590-846e-58619ab8b353"
        }
      }
    },
    {
      "data": {
        "type": "subscription",
        "id": "b80719b3-1485-57c0-9e55-fda2b8f7472b",
        "attributes": {
          "feedUrl": "https://example.com/rss2",
          "userSubscribedAt": "2025-08-24T16:00:00Z"
        },
        "links": {
          "self": "/v1/subscriptions/b80719b3-1485-57c0-9e55-fda2b8f7472b"
        }
      }
    }
  ]
}
```

## Mixed success response

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"

{
  "atomic:results": [
    {
      "data": {
        "type": "subscription",
        "id": "ce510f4d-9046-5590-846e-58619ab8b353",
        "attributes": {
          "feedUrl": "https://example.com/rss1",
          "userSubscribedAt": "2025-08-24T16:00:00Z"
        }
      }
    },
    {
      "errors": [
        {
          "status": "409",
          "title": "Already Subscribed",
          "detail": "User is already subscribed to this feed.",
          "source": { "pointer": "/atomic:operations/1" },
          "meta": {
            "feedUrl": "https://example.com/rss2",
            "guid": "b80719b3-1485-57c0-9e55-fda2b8f7472b"
          }
        }
      ]
    }
  ]
}
```
