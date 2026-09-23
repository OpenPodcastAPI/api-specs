---
title: Responses
description: Conventions for responses returned by the Open Podcast API.
sidebar:
  order: 7
---

## Response codes

The Open Podcast API uses the following HTTP response codes:

* `200`: operation completed successfully.
* `400`: the client sent an invalid request.
* `401`: the client attempted to request a resource without authentication.
* `403`: the client requested access to a resource it does not have permission to interact with.
* `404`: the client attempted to access a non-existent resource.
* `500`: the server encountered an error while performing a request.

## Pagination

All bulk `GET` requests must be paginated using a stable offset value. For the sync endpoint, this value must be a UTC timestamp in the RFC3339 format. For bulk entity endpoints, the entity ID or another stable incremental value should be used. The server must respond with navigation links in each response to point clients to the next and previous pages of results.