---
title: Timestamps & modifications
description: Conventions for timestamps and tracking modifications in the Open Podcast API.
sidebar:
  order: 5
---

## Timestamps

:::caution[Important]
The synchronization protocol assumes that client clocks are reasonably accurate. Devices with significantly incorrect clocks may observe unexpected synchronization order.
:::

All actions sent to the server must include a UTC timestamp recorded by the client. These timestamps determine action order. The server compares the client-supplied timestamp with the entity's current modification timestamp. An action with a later timestamp MUST be applied. An action with an earlier timestamp MUST be ignored.

Timestamps must be submitted in the [RFC3339 format](https://www.rfc-editor.org/rfc/rfc3339). Servers must accept any fractional precision. For example:

* `2026-07-11T15:30:00Z`
* `2026-07-11T15:30:00.1Z`
* `2026-07-11T15:30:00.123456Z`

Once generated, an action's timestamp must not be modified. Retried requests must preserve the original timestamp.

Actions contained within a batch are independent. Servers must order actions solely according to their timestamps rather than the order in which they appear in the request.

An action is applied only if its timestamp is strictly later than the entity's current `last_updated` timestamp. Actions with an earlier or identical timestamp are ignored.

## Modifications

For each entity, servers must keep track of the `last_updated` timestamp and associated requesting client ID when a change is made to the entity metadata. When a client requests a sync response, any entity that has been modified by a different client must be returned.