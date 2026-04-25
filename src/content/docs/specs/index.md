---
title: API reference
description: The Open Podcast API is a standard that facilitates the synchronization of podcast data between podcast clients.
sidebar:
  order: 1
---

## 1. Overview

The Open Podcast API is a standard that facilitates the synchronization of podcast data between podcast clients.

This specification aims to provide comprehensive instructions for client and server developers looking to support the standard.


## 2. Conventions

### 2.1 Normative language 

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this document are to be interpreted as described in RFC 2119[^1].

The following terms are also used throughout the documents on this site:

Client
: Software that sends HTTP requests to a conforming server.

Server
: An implementation that exposes the endpoints defined in this specification.

User
: The authenticated principal performing requests.

Feed
: A shared resource representing a podcast feed.

Subscription
: A user-owned resource containing details about a User's subscription to a Feed.

Action
: An operation performed against a subscription resource.

Cursor
: An opaque token used to resume synchronization.

### 2.2 Timestamp format

Timestamps MUST be conform to RFC 3339[^2] and be submitted in UTC.

### 2.3 Data Serialization

All request and response bodies MUST be encoded as UTF-8 JSON.

### 2.4 Identifier formats

This specification uses the following identifier formats:

* UUID version 4 for client identifiers as defined in RFC 9562[^3]
* UUID version 5 for deterministic resource identifiers as defined in RFC 9562[^3]

### 2.5 Core and Optional endpoints

To ensure that the end-user experience is consistent across implementations, the specifications mark endpoints and features as Core (required) and Optional.

Core
: The feature or endpoint MUST be supported by all clients and servers.

Optional
: The feature or endpoint is considered to be additional functionality. Clients and servers MAY optionally support any combination of these features. Any project implementing Optional functionality SHOULD inform users about what is supported.

## 3. Core endpoints

- [Subscriptions](/specs/subscriptions)

[^1]: https://www.rfc-editor.org/rfc/rfc2119
[^2]: https://www.rfc-editor.org/rfc/rfc3339
[^3]: https://www.rfc-editor.org/rfc/rfc9562
