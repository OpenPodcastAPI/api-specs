---
title: Subscription API specification
descriptions: Use the subscriptions endpoint to manage podcast subscriptions
sidebar:
  label: Subscriptions
  badge:
    text: Experimental
    variant: caution
banner:
  content: This is a core endpoint. All implementing servers and clients MUST support it.
---

Subscriptions represent the relationship between a user and a podcast feed.

## 1. Introduction

Subscriptions are at the heart of the Open Podcast API. They represent which feeds a user has subscribed to, both presently and historically.

The `subscriptions` endpoint is designed to give clients a simple interface for synchronizing a user's podcast subscriptions. It aims to support:

* Offline-first operation
* Deterministic identifiers
* Idempotent operations
* Efficient incremental synchronization
* Multi-device consistency

## 2. Motivation

The Podcast 2.0 specification presents developers with stable identifiers (`podcast:guid`), which are UUIDv5 values that can be calculated from the feed URL using a standard-supplied namespace. However, the original podcast specification makes no such guarantees. This makes implementing cross-device synchronization difficult, as developers need to use unstable fields to determine which feed is being targeted.

To resolve this, the Open Podcast API makes use of the same deterministic UUID resolution outlined in the Podcast Index documentation[^1] and requires Clients to provide a calculated UUID value with every feed.

## 3. Conventions used in this document

### 3.1 Normative language 

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this document are to be interpreted as described in RFC 2119[^2].

The following terms are also used throughout this document:

Client
: Software that sends HTTP requests to a conforming server.

Server
: An implementation that exposes the endpoints defined in this specification.

User
: The authenticated principal performing requests.

Feed
: A shared resource representing a podcast feed.

Subscription: A user-owned resource containing details about a User's subscription to a Feed.

Action
: An operation performed against a subscription resource.

Cursor
: An opaque token used to resume synchronization.

### 3.2 Timestamp format

Timestamps MUST be conform to RFC 3339[^3] and be submitted in UTC.

### 3.3 Data Serialization

All request and response bodies MUST be encoded as UTF-8 JSON.

### 3.4 Identifier formats

This specification uses the following identifier formats:

* UUID version 4 for client identifiers as defined in RFC 9562[^4]
* UUID version 5 for deterministic resource identifiers as defined in RFC 9562[^4]
* Base64 encoding for cursors

## 4. Scope

This specification defines:

* Resource identifiers
* Action submission semantics
* Synchronization mechanisms
* Conflict resolution rules
* Client and server behavior

This document does not define:

* User authentication mechanisms
* Feed metadata ingestion
* Client user interface behavior

## 5. System Architecture

### 5.1 Overview

The system consists of:

* Client devices
* An HTTP API server

### 5.2 Offline Operation

Clients MAY operate without network connectivity and queue actions locally.

Queued actions MUST be transmitted to the server when connectivity is restored.

### 5.3 Synchronization Model

Synchronization is based on an append-only action log.

Clients retrieve new actions using a cursor-based incremental synchronization mechanism.

## 6. UUID calculation

Feeds are identified using **deterministic UUIDv5 identifiers** derived from podcast feed URLs. 
Clients MUST provide a valid UUIDv5 identifier for all feed objects.
This UUID value must be determined by ONE of the following methods, in order of preference:

1. Using the `podcast:guid` value of the feed's RSS file, if it is a valid UUID OR,
1. Calculating a UUIDv5 value using the normalized `feed_url`.

To calculate the UUID value, the client MUST do the following:

1. Normalize the `feed_url` by removing the scheme (for example: `https://`) and all trailing slashes (`/`).
1. Calculate the UUID using the normalized `feed_url` and the podcast namespace UUID: `ead4c236-bf58-58c6-a2c6-a6b28d128cb6`.

See the Podcast Index's `Guid` documentation for more information.[^1]

### 6.1 Example

```py
import uuid
import re

def calculate_uuid(feed_url):
    PODCAST_NAMESPACE = uuid.UUID("ead4c236-bf58-58c6-a2c6-a6b28d128cb6")
    sanitized_feed_url = re.sub(r'^[a-zA-Z]+://', '', feed_url).rstrip('/')
    return uuid.uuid5(PODCAST_NAMESPACE, sanitized_feed_url)
```

Running the above example with the feed URL `"https://podnews.net/rss/"` will yield `9b024349-ccf0-5f69-a609-6b82873eab3c`.

## 7. Subscription status

Subscriptions are considered valid even if the User has unsubscribed from the feed. Unsubscribing is a **non-destructive** action that leaves the subscription entry intact.

A User is "subscribed" to a Feed when they:

1. Have a Subscription entry for the Feed AND
1. The `unsubscribed_at` timestamp is null.

Clients may submit an `update` to a Subscription with a null `unsubscribed_at` timestamp to resubscribe a user to a feed.

## 7. Resource models

### 7.1 Feed

A Feed represents a shared logical resource corresponding to a podcast RSS feed. Feeds are uniquely identified by a deterministic UUID derived from the normalized feed URL and a podcast namespace UUID.

A Feed resource MAY exist independently of any Subscriptions but MAY also be created implicitly when a Subscription is submitted.

#### Fields

| Field        | Type             | Required | Description                                             |
| ------------ | ---------------- | -------- | ------------------------------------------------------- |
| `uuid`       | UUID             | Yes      | Deterministic identifier for the feed                   |
| `feed_url`   | string           | Yes      | The RSS feed's canonical URL used to calculate the UUID |
| `created_at` | string (RFC3339) | Yes      | Server-authoritative creation timestamp                 |
| `updated_at` | string (RFC3339) | Yes      | Server-authoritative update timestamp                   |

### 8.2 Subscription

A Subscription represents a user's subscription to a given Feed.

Each User MAY have **at most one Subscription per Feed**.

A Subscription is uniquely identified by the tuple:

```txt
(user, feed_uuid)
```

Clients do not directly access Subscription identifiers. Subscriptions are accessed via the Feed resource.

#### Fields

| Field             | Type             | Required | Description                                                                                      |
| ----------------- | ---------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `subscribed_at`   | string (RFC3339) | Yes      | Client-provided subscription timestamp, if submitted. Implicitly created by the server if absent |
| `unsubscribed_at` | string (RFC3339) | No       | Client-provided unsubscription timestamp, if submitted.                                          |
| `created_at`      | string (RFC3339) | Yes      | Server-authoritative creation timestamp                                                          |
| `updated_at`      | string (RFC3339) | Yes      | Server-authoritative update timestamp                                                            |

Normative rule: `created_at` and `updated_at` are managed by the server. Clients MAY supply `subscribed_at` and `unsubscribed_at` in requests but it doesn't override the server’s canonical timestamps.

## 8. Client action submission

### 8.1 Endpoint

```http
POST /api/v1/subscriptions
```

Clients use this endpoint to submit subscription actions.

### 8.2 Purpose

This endpoint supports the submission of `actions` for Subscriptions. Each `action` MUST reference a Feed.

### 8.3 Supported actions

Each object in a request payload MUST reference an `action`. The supported actions for this endpoint are:

`create`
: Create a new subscription for the authenticated User and the referenced Feed

`update`
: Update the subscription details for an authenticated User and a referenced Feed

### 8.4 Response statuses

Each handled item in a POST request to this endpoint MUST be returned in the response. To inform the Client, each object MUST contain a `status` field matching the following enumerable values:

`created`
: The subscription was created successfully

`updated`
: The subscription was updated successfully

`conflict`
: A subscription for the requesting User to the provided Feed exists already

`duplicate`
: The payload object is a duplicate of another update in the same payload

`invalid_action`
: The payload object referenced an invalid [action](#83-supported-actions)

`malformed_feed_uuid`
: The UUID value in the Feed payload is malformed

`malformed_feed_url`
: The URL in the Feed payload is not a valid URI value

`transient_server_error`
: The Server could not perform the update due to a transient issue such as database connection issues

### 8.5 Request format

Requests sent to this endpoint MUST conform to the following:

1. All requests MUST be submitted as an array of objects, with at least one and at most 30 items.
1. Each item in the array MUST include all required fields.

Servers MUST immediately reject any invalid payload with a `400` response.

| Field                         | Type                     | Required | Description                                                                        |
| ----------------------------- | ------------------------ | -------- | ---------------------------------------------------------------------------------- |
| `data`                        | array                    | Yes      | The array of data submitted to the server                                          |
| `data.uuid`                   | UUID                     | Yes      | The Client-generated UUIDv4 identifier for the action                              |
| `data[].action`               | string                   | Yes      | The [supported action](#83-supported-actions) being taken against the subscription |
| `data[].feed`                 | object                   | Yes      | Details about the Feed that the subscription targets                               |
| `data[].feed.uuid`            | UUID                     | Yes      | The calculated UUIDv5 identifier for the Feed                                      |
| `data[].feed.feed_url`        | string                   | Yes      | The canonical URL of the feed RSS file                                             |
| `data[].data`                 | object                   | Yes      | The data object containing subscription information with **at least one** value    |
| `data[].data.subscribed_at`   | string (RFC3339)         | No       | The timestamp at which the subscription was created                                |
| `data[].data.unsubscribed_at` | string (RFC3339) or null | No       | The timestamp at which the user unsubscribed from the feed                         |


### 8.6 Response format

If all fields in the request payload are valid, the Server MUST respond with a `202` status and return a payload with an object corresponding to each `action` submitted.

| Field                                   | Type             | Required | Description                                                             |
| --------------------------------------- | ---------------- | -------- | ----------------------------------------------------------------------- |
| `data`                                  | array            | Yes      | The array of response objects                                           |
| `data.uuid`                             | UUID             | Yes      | The Client-generated UUIDv4 identifier for the action                   |
| `data.status`                           | string           | Yes      | The Server-authoritative [response status](#84-response-statuses)       |
| `data.received`                         | string (RFC3339) | Yes      | The Server-authoritative timestamp at which the request was received    |
| `data[].feed`                           | object           | No       | The referenced Feed item for the action                                 |
| `data[].feed.uuid`                      | UUID             | Yes      | The calculated UUIDv5 identifier for the feed                           |
| `data[].feed.feed_url`                  | string           | Yes      | The canonical URL of the feed RSS file                                  |
| `data[].feed.created_at`                | string (RFC3339) | Yes      | The Server-authoritative creation timestamp for the Feed entity         |
| `data[].feed.updated_at`                | string (RFC3339) | No       | The Server-authoritative last update timestamp for the Feed entity      |
| `data[].subscription`                   | object           | No       | The Subscription entity                                                 |
| `data[].subscription.subscribed_at`     | string (RFC3339) | No       | The timestamp at which the User subscribed to the Feed                  |
| `data[].subscription.unsubscribed_at`   | string (RFC3339) | No       | The timestamp at which the User subscribed to the Feed                  |
| `data[].subscription.created_at`        | string (RFC3339) | Yes      | The Server-authoritative creation timestamp for the Subscription entity |
| `data[].subscription.updated_at`        | string (RFC3339) | Yes      | The Server-authoritative update timestamp for the Subscription entity   |

### 8.7 Client behavior

The Client MUST follow these rules when submitting a request to this endpoint:

1. The Client MUST NOT submit more than 30 items in a single payload.
1. The Client MUST generate a random UUID for each action in the payload.
1. The Client MUST await a response from the Server before submitting a new request.
1. The Client SHOULD inform the User of any failures that were received in the response.
1. The Client MAY retry items that failed with a status of `transient_server_error`.
1. The Client MUST NOT retry items that failed with a status of `invalid_action`.
1. The Client MUST NOT retry items that failed with a status of `malformed_uuid`.
1. The Client MUST NOT retry items that failed with a status of `malformed_feed_url`.
1. The Client MAY use the `updated_at` timestamp of the Subscription to communicate to a user when the subscription was made active again.

### 8.8 Server behavior

The Server MUST keep all action requests in a centralized append-only log format. The Server MAY compact this data to retain only the latest action of a given type.

The Server MUST update the materialized view of updated entities and return their data in response to updates.

The Server MUST follow these rules when processing a request to this endpoint:

1. The Server MUST respond with a `400` error if the payload doesn't contain all required fields.
1. The Server MUST respond with a `400` error if the payload contains **more than 30** or **fewer than 1** items.
1. The Server MUST NOT attempt to process any action that fails validation.
1. The Server MUST process all objects in the response and return a corresponding object in the response.
1. The Server MUST discard any duplicate object from the payload and process only one version of the `action`.
1. The Server MUST create a corresponding object for all submitted `actions` and respond with an array matching the length of the submission.
1. The Server MUST implicitly create a Feed for all actions that reference a non-extant Feed.

For each Feed:

1. The Server MUST generate a `created_at` timestamp recording the date and time at which the Feed was added to the system.
1. The Server MUST generate an `updated_at` timestamp recording the date and time at which the Feed was last modified.

For each Subscription:

1. The Server MUST generate a `created_at` timestamp recording the date and time at which the Subscription was added to the system.
1. The Server MUST generate an `updated_at` timestamp recording the date and time at which the Subscription was last modified.
1. The Server SHOULD generate a `subscribed_at` timestamp matching the `created_at` timestamp if no `subscribed_at` field is received in the creation payload.
1. The Server MUST NOT add an `unsubscribed_at` timestamp unless one is sent by the Client.

### 8.9 Example

```jsonc title="Request"
{
   "data": [
      // Subscribe to a feed
      {
         "uuid": "329e6b8f-a540-4c6e-9ba0-2996e0352736",
         "action": "create",
         "feed": {
            "uuid": "2fa174b5-2cd8-5c07-b086-fc60045fd9bf",
            "feed_url": "https://example.com/feed1.rss/"
         },
         "data": {
            "subscribed_at": "2026-03-16T05:20:48.000Z"
         }
      },

      // Resubscribe to a feed
      {
         "uuid": "987f1cad-807f-4c00-88aa-277fd470697a",
         "action": "update",
         "feed": {
            "uuid": "34a12041-bdcd-5a3a-be5e-657315db7c44",
            "feed_url": "https://example.com/feed2.rss/"
         },
         "data": {
            "unsubscribed_at": null
         }
      },

      // Unsubscribe from a feed
      {
         "uuid": "4dcf3a4a-42dd-4658-88f6-c71887a04bb8",
         "action": "update",
         "feed": {
            "uuid": "fc4ed290-4621-54fe-b5b4-a001343aeed7",
            "feed_url": "https://example.com/feed3.rss/"
         },
         "data": {
            "unsubscribed_at": "2026-03-16T05:21:48.000Z"
         }
      },

      // Invalid action
      {
         "uuid": "100c7e48-085f-4906-a91e-40c3c4b1a73e",
         "action": "unsupported",
         "feed": {
            "uuid": "4790ba1b-1d4e-5f24-886e-7359eb98d52d",
            "feed_url": "https://example.com/feed4.rss/"
         },
         "data": {
            "subscribed_at": "2026-03-16T06:00:02.000Z",
         }
      },

      // Invalid feed UUID
      {
         "uuid": "4c92e4d0-ba1a-497c-83d8-b0c469d4e1be",
         "action": "create",
         "feed": {
            "uuid": "not-a-uuid",
            "feed_url": "https://example.com/feed5.rss/"
         },
         "data": {
            "subscribed_at": "2026-03-16T06:05:02.000Z"
         }
      }
   ]
}
```

```jsonc title="Response"
{
   "data": [
      {
         "uuid": "4790ba1b-1d4e-5f24-886e-7359eb98d52d",
         "status": "created",
         "received": "2026-03-16T06:05:02:000Z",
         "feed": {
            "uuid": "2fa174b5-2cd8-5c07-b086-fc60045fd9bf",
            "feed_url": "https://example.com/feed1.rss/",
            "created_at": "2026-03-16T06:05:02.000Z",
            "updated_at": "2026-03-16T06:05:02.000Z"
         },
         "subscription": {
            "subscribed_at": "2026-03-16T05:20:48.000Z",
            "created_at": "2026-03-16T06:05:02.000Z",
            "updated_at": "2026-03-16T06:05:02.000Z"
         }
      },
      {
         "uuid": "987f1cad-807f-4c00-88aa-277fd470697a",
         "status": "updated",
         "received": "2026-03-16T06:05:02:000Z",
         "feed": {
            "uuid": "34a12041-bdcd-5a3a-be5e-657315db7c44",
            "feed_url": "https://example.com/feed2.rss/",
            "created_at": "2026-03-15T03:05:01:000Z",
            "updated_at": "2026-03-15T03:05:01:000Z"
         },
         "subscription": {
            "subscribed_at": "2026-03-15T03:05:01:000Z",
            "created_at": "2026-03-15T03:05:01:000Z",
            "updated_at": "2026-03-16T06:05:02:000Z"
         }
      },
      {
         "uuid": "4dcf3a4a-42dd-4658-88f6-c71887a04bb8",
         "status": "updated",
         "received": "2026-03-16T06:05:02:000Z",
         "feed": {
            "uuid": "fc4ed290-4621-54fe-b5b4-a001343aeed7",
            "feed_url": "https://example.com/feed3.rss/",
            "created_at": "2026-03-15T03:05:01:000Z",
            "updated_at": "2026-03-15T03:05:01:000Z"
         },
         "subscription": {
            "subscribed_at": "2026-03-15T03:05:01:000Z",
            "unsubscribed_at": "2026-03-16T05:21:48.000Z",
            "created_at": "2026-03-15T03:05:01:000Z",
            "updated_at": "2026-03-16T06:05:02:000Z"
         }
      },
      {
         "uuid": "100c7e48-085f-4906-a91e-40c3c4b1a73e",
         "status": "invalid_action",
         "received": "2026-03-16T06:05:02:000Z",
      },
      {
         "uuid": "100c7e48-085f-4906-a91e-40c3c4b1a73e",
         "status": "malformed_feed_uuid",
         "received": "2026-03-16T06:05:02:000Z",
      }
   ]
}
```

## 9. Synchronization

### 9.1 Endpoint

```http /[\\?\&](.*?)\=/
GET /api/v1/subscriptions?cursor={cursor}&page_size=30&direction={direction}&include_errors=false
```

Clients use this endpoint to request actions that have been submitted to the server since the provided `cursor`.

### 9.2 Purpose

This endpoint returns a list of valid and applied actions taken on an authenticated principal's Subscriptions. Clients may use this endpoint to fetch a list of updates to Subscriptions since they last came online.

### 9.3 Request parameters

| Parameter        | Type    | In    | Required | Description                                                                          |
| ---------------- | ------  | ----- | -------- | ------------------------------------------------------------------------------------ | 
| `cursor`         | string  | Query | No       | The Base64-encoded cursor to query from                                              |
| `page_size`      | number  | Query | No       | The number of results to return per-page                                             |
| `direction`      | string  | Query | No       | The direction in which to search for results. `ascending` (default) or `descending`. | 
| `include_errors` | boolean | Query | No       | Whether to include invalid actions (default `false`)                                 |

### 9.4 Response format

The Server MUST respond to valid requests with a `200` status.

| Field                                   | Type             | Required | Description                                                             |
| --------------------------------------- | ---------------- | -------- | ----------------------------------------------------------------------- |
| `next_cursor`                           | string           | No       | The Base64-encoded cursor for the next page of results                  |
| `prev_cursor`                           | string           | Yes      | The Base64-encoded cursor for the current page of results               |
| `has_next`                              | boolean          | No       | Whether there are more results for the given request                    |
| `data`                                  | array            | Yes      | The array of response objects                                           |
| `data.uuid`                             | UUID             | Yes      | The Client-generated UUIDv4 identifier for the action                   |
| `data.status`                           | string           | Yes      | The Server-authoritative [response status](#84-response-statuses)       |
| `data.received`                         | string (RFC3339) | Yes      | The Server-authoritative timestamp at which the request was received    |
| `data[].feed`                           | object           | No       | The referenced Feed item for the action                                 |
| `data[].feed.uuid`                      | UUID             | Yes      | The calculated UUIDv5 identifier for the feed                           |
| `data[].feed.feed_url`                  | string           | Yes      | The canonical URL of the feed RSS file                                  |
| `data[].feed.created_at`                | string (RFC3339) | Yes      | The Server-authoritative creation timestamp for the Feed entity         |
| `data[].feed.updated_at`                | string (RFC3339) | No       | The Server-authoritative last update timestamp for the Feed entity      |
| `data[].subscription`                   | object           | No       | The Subscription entity                                                 |
| `data[].subscription.subscribed_at`     | string (RFC3339) | No       | The timestamp at which the User subscribed to the Feed                  |
| `data[].subscription.unsubscribed_at`   | string (RFC3339) | No       | The timestamp at which the User subscribed to the Feed                  |
| `data[].subscription.created_at`        | string (RFC3339) | Yes      | The Server-authoritative creation timestamp for the Subscription entity |
| `data[].subscription.updated_at`        | string (RFC3339) | Yes      | The Server-authoritative update timestamp for the Subscription entity   |

### 9.5 Client behavior

1. The Client MAY provide any combination of supported query parameters, or none.
1. The Client SHOULD compare results in the response against its internal state to resolve the latest state of the User's Subscriptions.

### 9.6 Server behavior

1. The Server MUST discard invalid query parameters and use default parameters.
1. The Server MUST calculate and encode a cursor value for the given request using the provided parameters, or default parameters.
1. The Server MUST NOT return any actions that were not applied due to errors, unless the `include_errors` parameter is `true`.
1. The Server MAY use any method to calculate a cursor provided it meets the following criteria:
   1. The cursor MUST contain **at least one** ordered parameter. For example, `received` timestamp or incremental database IDs.
   1. The cursor MUST NOT contain any sensitive data.
   1. The cursor MUST be Base64-encoded.
1. The Server MUST return actions relating to the authenticated principal only. The Server MUST NOT return any actions associated with other users.
1. The Server SHOULD set sensible default values for any parameters whose default is not explicitly stated in this document.
1. The Server MUST return **at most** the number of results specified in the `page_size` parameter.

### 9.7 Example

```sh
curl -X GET "https://opa-server.test/api/v1/subscriptions?page_size=50"
```

```jsonc title="Response"
{
   "data": [
      {
         "uuid": "4790ba1b-1d4e-5f24-886e-7359eb98d52d",
         "status": "created",
         "received": "2026-03-16T06:05:02:000Z",
         "feed": {
            "uuid": "2fa174b5-2cd8-5c07-b086-fc60045fd9bf",
            "feed_url": "https://example.com/feed1.rss/",
            "created_at": "2026-03-16T06:05:02.000Z",
            "updated_at": "2026-03-16T06:05:02.000Z"
         },
         "subscription": {
            "subscribed_at": "2026-03-16T05:20:48.000Z",
            "created_at": "2026-03-16T06:05:02.000Z",
            "updated_at": "2026-03-16T06:05:02.000Z"
         }
      },
      {
         "uuid": "987f1cad-807f-4c00-88aa-277fd470697a",
         "status": "updated",
         "received": "2026-03-16T06:05:02:000Z",
         "feed": {
            "uuid": "34a12041-bdcd-5a3a-be5e-657315db7c44",
            "feed_url": "https://example.com/feed2.rss/",
            "created_at": "2026-03-15T03:05:01:000Z",
            "updated_at": "2026-03-15T03:05:01:000Z"
         },
         "subscription": {
            "subscribed_at": "2026-03-15T03:05:01:000Z",
            "created_at": "2026-03-15T03:05:01:000Z",
            "updated_at": "2026-03-16T06:05:02:000Z"
         }
      },
      {
         "uuid": "4dcf3a4a-42dd-4658-88f6-c71887a04bb8",
         "status": "updated",
         "received": "2026-03-16T06:05:02:000Z",
         "feed": {
            "uuid": "fc4ed290-4621-54fe-b5b4-a001343aeed7",
            "feed_url": "https://example.com/feed3.rss/",
            "created_at": "2026-03-15T03:05:01:000Z",
            "updated_at": "2026-03-15T03:05:01:000Z"
         },
         "subscription": {
            "subscribed_at": "2026-03-15T03:05:01:000Z",
            "unsubscribed_at": "2026-03-16T05:21:48.000Z",
            "created_at": "2026-03-15T03:05:01:000Z",
            "updated_at": "2026-03-16T06:05:02:000Z"
         }
      },
      {
         "uuid": "100c7e48-085f-4906-a91e-40c3c4b1a73e",
         "status": "invalid_action",
         "received": "2026-03-16T06:05:02:000Z",
      },
      {
         "uuid": "100c7e48-085f-4906-a91e-40c3c4b1a73e",
         "status": "malformed_feed_uuid",
         "received": "2026-03-16T06:05:02:000Z",
      }
   ],
   "prev_cursor": "aWQ9MXxwYWdlX3NpemU9MzA=",
   "has_next": false
}
```

[^1]: https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/tags/guid.md
[^2]: https://www.rfc-editor.org/rfc/rfc2119
[^3]: https://www.rfc-editor.org/rfc/rfc3339
[^4]: https://www.rfc-editor.org/rfc/rfc9562
