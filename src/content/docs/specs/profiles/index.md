---
title: JSON:API profiles
description: JSON:API profiles used by the Open Podcast API
next: false
prev: false
sidebar:
   label: Overview
   order: 1
---

The JSON:API enables developers to define common usage patterns with [profiles](https://jsonapi.org/extensions/#profiles).
These extensions **SHOULD** be specified and linked in each relevant request and response.

> Profiles... are a way to standardize common usages of the base specification that are simple to implement using only the parts of the specification that are reserved for implementations.

To simplify development and enhance the discoverability of data in the API, all resources **MUST** be specified as profiles.

Client and server developers **SHOULD** agree upon and understand each profile.

## Open Podcast API profiles

- [Subscriptions](/specs/profiles/subscription)
