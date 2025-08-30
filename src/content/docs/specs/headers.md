---
title: Headers
description: The headers in this document apply to all requests made to the Open Podcast API
prev: false
next: false
---

The Open Podcast API follows [JSON:API media type requirements](https://jsonapi.org/format/#content-negotiation-servers).
The following headers apply to all requests and responses:

### Request headers

| Header         | Value                      | Description                                                                   |
| -------------- | -------------------------- | ----------------------------------------------------------------------------- |
| `Content-Type` | `application/vnd.api+json` | **MUST** be used when sending data to the server.                             |
| `Accept`       | `application/vnd.api+json` | **MUST** be used to indicate the client expects JSON:API-compliant responses. |

### Response headers

| Header         | Value                      | Description                                                                   |
| -------------- | -------------------------- | ----------------------------------------------------------------------------- |
| `Content-Type` | `application/vnd.api+json` | **MUST** be present in all JSON:API responses.                                |
| `Location`     | URI of created resource    | **MUST** be included in `201 Created` responses to identify the new resource. |
