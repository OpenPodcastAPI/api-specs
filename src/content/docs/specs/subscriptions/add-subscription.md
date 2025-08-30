---
title: Add a subscription
description: Add a subscription
sidebar:
  order: 2
banner:
  content: |
    This is a <b>core action</b>. All server implementations MUST support it.
---

Enables clients to add a new subscription to the system and register the authenticated user as a subscriber.

```http
POST /v1/subscriptions
```

## Request format

The client **MUST** provide a single resource object with:

- `type`: MUST be `"subscription"`
- `id`: MUST be the `guid` (UUIDv5) for the feed. See [`guid` calculation](/specs/subscriptions#guid-calculation)
- `attributes.feedUrl`: The podcast feed URL

```http
POST /v1/subscriptions HTTP/1.1
Content-Type: application/vnd.api+json; profile="https://openpodcastapi.org/specs/profiles/subscription"
Accept: application/vnd.api+json; profile="https://openpodcastapi.org/specs/profiles/subscription"

{
  "data": {
    "type": "subscription",
    "id": "ce510f4d-9046-5590-846e-58619ab8b353",
    "attributes": {
      "feedUrl": "https://example.com/rss1"
    }
  }
}
```

## Server behavior

- The server **MUST** create the subscription or confirm the existing record.
- The operation **MUST** be idempotent.
- The server **MUST** return a `201 Created` response with the created resource.
- If the resource already exists, the server **MAY** return a `200 OK`.

## Success response

If the subscription is created or confirmed successfully:

- HTTP Status: `201 Created`
- Headers:
  - `Content-Type: application/vnd.api+json`
  - `Location: <URI of created resource>`

The created resource **MUST** have the following `attributes`:

- `feedUrl`: the feed URL of the subscription target
- `userSubscribedAt`: the timestamp at which the user's subscription was created, in ISO 8601 format

The response **MUST** contain the following `links`.

- `self`: a link to the created resource
- `unsubscribe`:
  - `href`: a link to the created resource
  - `method`: **MUST** be `DELETE`

```http
HTTP/1.1 201 Created
Location: /v1/subscriptions/ce510f4d-9046-5590-846e-58619ab8b353
Content-Type: application/vnd.api+json; profile="https://openpodcastapi.org/specs/profiles/subscription"; ext="https://openpodcastapi.org/specs/extensions/link-method"

{
  "jsonapi": {
    "version": "1.1",
    "ext": [
      "https://openpodcastapi.org/specs/extensions/link-method"
    ],
    "profile": [
      "https://openpodcastapi.org/specs/profiles/subscription"
    ]
  },
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

## Bulk operations

Clients **MAY** use the [Atomic Operations extension](https://jsonapi.org/ext/atomic/) for batch creation or updates.
See [Add subscriptions in bulk](/specs/operations/add-subscriptions) for more information.
