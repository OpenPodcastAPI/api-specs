---
title: Operations endpoint
description: The operations endpoint allows clients to perform multiple resource-level operations in a single, ordered request
prev: false
sidebar:
  order: 1
banner:
  content: |
    This is a <b>core endpoint</b>. All server implementations MUST support it.
---

The operations endpoint allows clients to perform multiple resource-level operations in a single, ordered request.
It follows the [JSON:API Atomic Operations extension](https://jsonapi.org/ext/atomic/) and is intended for use cases where bulk writes or tightly ordered changes are needed.

```http
POST /v1/operations
```

## Request format

Clients **MUST** send a JSON document with an `atomic:operations` key containing an array of operation objects.
Each operation object **MUST** specify:

- `op`: the operation type (e.g. `"add"`, `"update"`, `"remove"`)
- `data`: the resource object for the operation

Each operation **MUST** include a resource object with:

- `type`: the resource type (e.g. `"subscription"`)
- `id`: the resource identifier, if applicable
- `attributes`: resource attributes as appropriate for the action

### Headers

Clients **MUST** set the following headers:

- `Content-Type: application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"`
- `Accept: application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"`

### Example request

```http
POST /v1/operations HTTP/1.1
Content-Type: application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"
Accept: application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"

{
  "atomic:operations": [
    {
      "op": "add",
      "data": {
        "type": "subscription",
        "id": "b80719b3-1485-57c0-9e55-fda2b8f7472b",
        "attributes": {
          "feedUrl": "https://example.com/rss2"
        }
      }
    },
    {
      "op": "add",
      "data": {
        "type": "subscription",
        "id": "d29519a4-77ee-5e13-bb14-89fc93b993ae",
        "attributes": {
          "feedUrl": "https://example.com/rss3"
        }
      }
    }
  ]
}
```

## Server behavior

- The server **MUST** process operations in order.
- Each operation **MUST** be executed independently.
- The server **MUST** return a `200 OK` response even if one or more operations fail.
- The response **MUST** include an `atomic:results` array with the same number of elements as the input.
- Each `results` element corresponds positionally to its respective request operation.

### Success response format

For successful operations, the corresponding item in `atomic:results` **MUST** contain a `data` object.

### Error response format

If an operation fails, the corresponding item **MUST** contain an `errors` array, conforming to the [JSON:API error object](/specs/error-codes) format.

## Response headers

The server **MUST** set the following headers:

- `Content-Type: application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"`

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"
```

## Supported operations

The operations endpoint may be used for:

- [Add subscriptions in bulk](/specs/operations/add-subscriptions)

Clients **MUST** only use operations documented for this server.

## Errors

For error semantics and structure, see [error responses](/specs/error-codes).

Errors may occur for:

- Validation failures (`422`)
- Resource conflicts (`409`)
- Type mismatches (`409` or `400`)
- Invalid resource identifiers (`400`)

All errors are returned inline within the `atomic:results` array.

## See also

- [JSON:API Atomic Operations extension](https://jsonapi.org/ext/atomic/)
