---
title: Client IDs
description: Conventions for identifying clients that interact with the Open Podcast API.
sidebar:
  order: 4
---

Each client must generate and persist a [UUIDv4](https://www.rfc-editor.org/rfc/rfc9562.html#name-uuid-version-4) value that uniquely identifies that client installation or instance. Client IDs identify a client installation rather than a user or device.

Include this value with every API request using the `Client-ID` header.

```txt
Client-ID: 550e8400-e29b-41d4-a716-446655440000
```

:::note 
The client ID is used only to identify the source of synchronized changes. It is not an authentication credential and can be freely regenerated if the client state is reset.
:::

## Requirements

* Generate the ID once, when the client is first initialized.
* The ID must be a valid UUID version 4 (random UUID).
* Persist the ID and reuse it for all future requests.
* Do not generate a new ID for each request.
* Each independent client installation or instance should have its own unique ID.

## Purpose

The server uses the client ID to identify the origin of changes. Endpoints that return updates can exclude changes created by the requesting client, allowing clients to synchronize only updates originating from other clients.