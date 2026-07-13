---
title: Conventions
description: All endpoints in the Open Podcast API follow the conventions outlined in this document.
---

The following conventions are used for all endpoints in the Open Podcast API specification.

## Content type {#content-type}

All endpoints covered by the Open Podcast API require a `Content-Type` header to request JSON information from the server.

```txt
Content-Type: application/json
```

## Client IDs {#client-ids}

Each client must generate and persist a [UUIDv4](https://www.rfc-editor.org/rfc/rfc9562.html#name-uuid-version-4) value that uniquely identifies that client installation or instance. Client IDs identify a client installation rather than a user or device.

Include this value with every API request using the `Client-ID` header.

```txt
Client-ID: 550e8400-e29b-41d4-a716-446655440000
```

:::note 
The client ID is used only to identify the source of synchronized changes. It is not an authentication credential and can be freely regenerated if the client state is reset.
:::

### Requirements {#client-id-requirements}

* Generate the ID once, when the client is first initialized.
* The ID must be a valid UUID version 4 (random UUID).
* Persist the ID and reuse it for all future requests.
* Do not generate a new ID for each request.
* Each independent client installation or instance should have its own unique ID.

### Purpose {#client-id-purpose}

The server uses the client ID to identify the origin of changes. Endpoints that return updates can exclude changes created by the requesting client, allowing clients to synchronize only updates originating from other clients.

## Timestamps {#timestamps}

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

## Synchronization model {#sync-model}

The Open Podcast API follows a batch synchronization model through a [synchronization endpoint](/specs/sync). Updates are processed in bulk using action names and entity types as discriminators. To reduce the risk of performance degradation while facilitating bulk updates from clients, updates are limited to 30 actions per request.

### Client behavior {#client-sync-behavior}

Synchronization of data is based on client timestamps. These are considered authoritative. When a user performs an action on a client, the client must record the UTC timestamp of the action and send it with the corresponding update action.

The client may send multiple bulk requests in sequence, starting from the earliest recorded timestamp. Requests are expected to be sent in chronological order.

### Server behavior {#server-sync-behavior}

The server modifies state based on a last-write-wins model where the action with the latest timestamp always applies.

The server must disregard any actions with a timestamp earlier than the current modification timestamp as stale. The server must always return the current canonical state of the requested entity whether the action was applied or not.

Clients may request information from a given offset timestamp to fetch all relevant updates that have occurred since their last sync. Servers must respond only with entities that have been updated since the offset timestamp. The [client ID](#client-ids) of the client that made the most recent change to an entity must be preserved and only updates not made by the requesting client should be returned.

In addition to the central sync endpoint, all entities must be made available for retrieval from domain-specific endpoints. Servers must provide bulk and single-item endpoints for each entity type.

## Pagination {#pagination}

All bulk `GET` requests must be paginated using a stable offset value. For the sync endpoint, this value must be a UTC timestamp in the RFC3339 format. For bulk entity endpoints, the entity ID or another stable incremental value should be used. The server must respond with navigation links in each response to point clients to the next and previous pages of results.

## Modifications {#modifications}

For each entity, servers must keep track of the `last_updated` timestamp and associated requesting client ID when a change is made to the entity metadata. When a client requests a sync response, any entity that has been modified by a different client must be returned.

## Response codes {#response-codes}

The Open Podcast API uses the following HTTP response codes:

* `200`: operation completed successfully.
* `400`: the client sent an invalid request.
* `401`: the client attempted to request a resource without authentication.
* `403`: the client requested access to a resource it does not have permission to interact with.
* `404`: the client attempted to access a non-existent resource.
* `500`: the server encountered an error while performing a request.

## Core and optional functionality  {#core-and-optional-functionality}

To ensure that the end-user experience is consistent across implementations, the specifications mark endpoints and features as Core (required) and Optional.

* Core: The feature or endpoint MUST be supported by all clients and servers.
* Optional: The feature or endpoint is considered to be additional functionality.

Clients and servers may optionally support any combination of these features. Any project implementing Optional functionality should inform users about what is supported.
