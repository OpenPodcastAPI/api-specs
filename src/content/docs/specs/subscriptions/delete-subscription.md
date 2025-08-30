---
title: Delete a subscription
description: Delete a subscription for the authenticated user
sidebar:
  order: 5
banner:
  content: |
    This is a <b>core action</b>. All server implementations MUST support it.
---

Enables clients to remove a subscription for the authenticated user by `guid`.

```http
DELETE /v1/subscriptions/{guid}
```

## Request format

Clients **MUST** send a `DELETE` request to the canonical URI of a subscription resource.

### Path parameters

| Parameter | Type   | Description                                                           |
| --------- | ------ | --------------------------------------------------------------------- |
| `guid`    | string | The globally unique identifier (UUIDv5) of the subscription resource. |

### Headers

Clients **MUST** include the following header:

- `Accept: application/vnd.api+json`

```http
DELETE /v1/subscriptions/ce510f4d-9046-5590-846e-58619ab8b353 HTTP/1.1
Accept: application/vnd.api+json
```

## Server behavior

- The server **MUST** remove the subscription for the authenticated user.
- The deletion **MUST NOT** affect other users subscribed to the same feed.
- The server **MUST** return a `204 No Content` if the subscription was deleted.
- If no subscription exists for the user, the server **MUST** return `404 Not Found`.
- If the `guid` is not a valid UUID, the server **MUST** return `400 Bad Request`.

## Success response

If the subscription is successfully deleted:

- HTTP Status: `204 No Content`
- The response **MUST NOT** include a body.

```http
HTTP/1.1 204 No Content
```

## Error responses

| HTTP status       | When it occurs                                         |
| ----------------- | ------------------------------------------------------ |
| `400 Bad Request` | If the provided `guid` is not a valid UUID.            |
| `404 Not Found`   | If the subscription does not exist or is inaccessible. |

See [error response format](/specs/error-codes) for more information.
