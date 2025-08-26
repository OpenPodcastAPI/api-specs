---
title: Pagination
---

# Pagination

Clients **MAY** paginate resource collections using the `page` query parameter object.

## Request format

The server **MUST** support pagination using the following query parameters:

| Parameter      | Type | Description                                                             |
| -------------- | ---- | ----------------------------------------------------------------------- |
| `page[number]` | int  | The page of results to return. Defaults to `1`.                         |
| `page[size]`   | int  | The number of results to return per page. Defaults to `25`, max: `100`. |

Example:

```http
GET /v1/subscriptions?page[number]=2&page[size]=50
```

## Response format

The server **MUST** include the following in paginated responses:

### `links`

The top-level `links` object **MUST** include pagination links using the following keys:

| Link key | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| `self`   | The current page's full request URI.                                   |
| `first`  | The URI for the first page of results.                                 |
| `prev`   | The URI for the previous page, or `null` if the current page is first. |
| `next`   | The URI for the next page, or `null` if the current page is last.      |
| `last`   | The URI for the last page of results.                                  |

Example:

```json
"links": {
  "self": "/v1/subscriptions?page[number]=2&page[size]=25",
  "first": "/v1/subscriptions?page[number]=1&page[size]=25",
  "prev": "/v1/subscriptions?page[number]=1&page[size]=25",
  "next": "/v1/subscriptions?page[number]=3&page[size]=25",
  "last": "/v1/subscriptions?page[number]=4&page[size]=25"
}
```

### `meta`

The top-level `meta` object **MAY** include pagination metadata:

| Field   | Type | Description                                 |
| ------- | ---- | ------------------------------------------- |
| `total` | int  | Total number of items available (optional). |

Example:

```json
"meta": {
  "total": 100
}
```

## Server behavior

- The server **SHOULD** enforce a maximum page size (e.g., 100 items).
- The server **MUST** return an empty `data` array if the page is valid but contains no items.
- The server **MAY** omit the `total` field in `meta` if computing it is expensive.

## Compatibility

This pagination model is compliant with the [JSON:API pagination specification](https://jsonapi.org/format/#fetching-pagination).
