---
title: API reference
description: The Open Podcast API is a standard that facilitates the synchronization of podcast data between podcast clients.
sidebar:
  order: 1
---

## 1. Overview

The Open Podcast API is a standard that facilitates the synchronization of podcast data between podcast clients.

This specification aims to provide comprehensive instructions for client and server developers looking to support the standard.

## 2. Definitions

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

### 2.1 Core and Optional endpoints

To ensure that the end-user experience is consistent across implementations, the specifications mark endpoints and features as Core (required) and Optional.

Core
: The feature or endpoint MUST be supported by all clients and servers.

Optional
: The feature or endpoint is considered to be additional functionality. Clients and servers MAY optionally support any combination of these features. Any project implementing Optional functionality SHOULD inform users about what is supported.


## 3. Core endpoints

- [Subscriptions](./subscriptions)

