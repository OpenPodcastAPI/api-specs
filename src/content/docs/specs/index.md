---
title: API Specs
description: All supported API specifications
next: false
prev: false
tableOfContents: false
sidebar:
  label: Overview
  order: 1
---

:::caution[Important]
All specifications are currently 'in progress'.
Breaking changes can occur as we implement specifications and address issues.
:::

Below you can find the specifications which are already available.
We encourage all interested projects offering podcast listening and/or synchronization functionality to adopt and implement defined specifications.
We also welcome feedback on these specifications.

## Core and optional functionality

To ensure that the end-user experience is consistent across implementations, the specifications mark endpoints and features as **Core** (required) and **Optional**.

**Core**
: The feature or endpoint MUST be supported by all clients and servers.

**Optional**
: The feature or endpoint is considered to be additional functionality.
Clients and servers **MAY** optionally support any combination of these features.
Any project implementing **Optional** functionality **SHOULD** inform users about what is supported.

Which features a server supports **MUST** be exposed through a Capabilities endpoint.

## Core endpoints

- [Subscriptions endpoint](/specs/subscriptions)
- [Operations endpoint](/specs/operations)
