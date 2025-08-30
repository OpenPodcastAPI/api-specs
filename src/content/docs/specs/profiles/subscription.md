---
title: "Profile: Subscription Resource"
description: A profile for the Open Podcast API subscription resource
prev: false
next: false
sidebar:
   label: Subscription
   order: 1
---

**Profile URI**  
: `https://openpodcastapi.org/specs/profiles/subscription`

**Applies to**  
: Resources of type `subscription`.

**Version**  
1.0.0

## Resource Type

```json
"type": "subscription"
```

## Attributes

| Name               | Type   | Required | Description                                    |
| ------------------ | ------ | -------- | ---------------------------------------------- |
| `feedUrl`          | string | Yes      | The original feed URL the user subscribed to   |
| `userSubscribedAt` | string | Yes      | ISO 8601 timestamp of when the user subscribed |

## Links

| Name          | Description                                           | Required | Extra                                            |
| ------------- | ----------------------------------------------------- | -------- | ------------------------------------------------ |
| `self`        | Canonical link to this subscription resource          | Yes      | —                                                |
| `unsubscribe` | Link to remove the subscription from the user account | Yes      | **MUST** support `DELETE` method (via extension) |

> Note: This profile uses the [Link Method Extension](/specs/extensions/link-method)

## Relationships

None.

## Extensions

| Extension Name | URI                                                       | Description                       |
| -------------- | --------------------------------------------------------- | --------------------------------- |
| Link Method    | `https://openpodcastapi.org/specs/extensions/link-method` | Supports `method` in link objects |

## Conventions

- All field names use `camelCase`
- All timestamps are in UTC ISO 8601 format
- Idempotent resource creation is assumed unless stated otherwise

## Usage

Servers that include this resource **SHOULD** declare this profile in the `profile` parameter:

```http
Content-Type: application/vnd.api+json; profile="https://openpodcastapi.org/specs/profiles/subscription"
```

Clients MAY use this profile URI in the `Accept` header to negotiate support.

```http
Accept: application/vnd.api+json; profile="https://openpodcastapi.org/specs/profiles/subscription"
```
