---
title: Conventions
description: This document outlines the design conventions and constraints that guide all specifications.
---

This document outlines the design conventions and constraints that guide all specifications.
It exists to ensure a consistent, evolvable API surface and reduce the need for breaking changes in the future.

Follow these conventions when contributing to the specs or implementing them in clients and servers.

## Keywords

The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “NOT RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in [BCP 14](https://tools.ietf.org/html/bcp14), [RFC2119](https://www.rfc-editor.org/rfc/rfc2119.html), and [RFC8174](https://www.rfc-editor.org/rfc/rfc8174.html) when, and only when, they appear in all capitals, as shown here.

## Core and optional functionality

To ensure the end-user experience is consistent across implementations, the specifications mark endpoints and features as **Core** or **Optional**.

- **Core**: The feature or endpoint **MUST** be supported by all compliant clients and servers.
- **Optional**: The feature or endpoint is not required.
  Clients and servers **MAY** support any combination of these features.
  Projects that support optional functionality **SHOULD** clearly document what is implemented.

## Compatibility principles

To support long-term stability and avoid major versioning breaks, the specification follows a **"never remove, only add"** philosophy.

All contributors and implementers **MUST** adhere to the following principles.

### 1. Consistent member naming

All member names in attributes, relationships, and metadata **MUST** use `camelCase`.

This applies to request and response payloads, query parameters, and link names.

This consistency ensures easier tooling and cognitive alignment across the API surface.

### 2. Non-breaking changes only

Once a field, endpoint, behavior, or value is published, it **MUST NOT** be removed or changed in a way that breaks compatibility.

Instead, features **MAY** be deprecated and replaced by new alternatives.

Deprecated elements **SHOULD** be clearly marked in documentation, and usage discouraged, but support **MUST** continue indefinitely unless explicitly sunset through a documented deprecation policy.

### 3. Favor composition over monoliths

APIs **SHOULD** favor granular, relational resource design over large, monolithic endpoints.

Data **SHOULD** be decomposed into smaller resources, connected via relationships, `included[]`, and links.

This allows independent evolution of parts of the data model without requiring large-scale rewrites.

It also enables clients to fetch only the data they need, improving performance and flexibility.

## General design rules

- All endpoints **MUST** comply with [JSON:API 1.1](https://jsonapi.org/format/1.1/), unless stated otherwise.
- All requests and responses **MUST** use the `application/vnd.api+json` media type.
- All APIs **MUST** include a top-level `jsonapi` object with version metadata.
- Implementers **SHOULD** support the use of `profile` to advertise supported profiles and behaviors.
- APIs **SHOULD** expose a `/capabilities` endpoint that allows clients to discover supported spec versions, core features, optional modules, and extensions.

## Future-proofing

When designing a new endpoint or field:

- Ask whether removing or changing it later would break existing clients.
- Prefer optional fields and loose contracts over strict, hardcoded structures.
- Use profile-based design to scope and document behaviors.
- Add metadata (e.g. `meta.status = "deprecated"`) rather than removing structures.
- Document assumptions, fallback behaviors, and extensibility points.

