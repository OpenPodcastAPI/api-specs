---
title: Synchronization model
description: Conventions for synchronizing data between Open Podcast API clients and servers.
sidebar:
  order: 2
---

The Open Podcast API follows a batch synchronization model through a [synchronization endpoint](/specs/sync). Updates are processed in bulk using action names and entity types as discriminators. To reduce the risk of performance degradation while facilitating bulk updates from clients, updates are limited to 30 actions per request.

## Client behavior

Synchronization of data is based on client timestamps. These are considered authoritative. When a user performs an action on a client, the client must record the UTC timestamp of the action and send it with the corresponding update action.

The client may send multiple bulk requests in sequence, starting from the earliest recorded timestamp. Requests are expected to be sent in chronological order.

## Server behavior

The server modifies state based on a last-write-wins model where the action with the latest timestamp always applies.

The server must disregard any actions with a timestamp earlier than the current modification timestamp as stale. The server must always return the current canonical state of the requested entity whether the action was applied or not.

Clients may request information from a given offset timestamp to fetch all relevant updates that have occurred since their last sync. Servers must respond only with entities that have been updated since the offset timestamp. The [client ID](../client-ids) of the client that made the most recent change to an entity must be preserved and only updates not made by the requesting client should be returned.

In addition to the central sync endpoint, all entities must be made available for retrieval from domain-specific endpoints. Servers must provide bulk and single-item endpoints for each entity type.
