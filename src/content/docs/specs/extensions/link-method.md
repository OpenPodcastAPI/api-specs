---
title: "JSON:API Extension: Link methods"
description: This extension allows link objects in JSON:API documents to explicitly declare the HTTP method supported by a link. 
prev: false
next: false
sidebar:
   label: Link methods
   order: 2
---

**Extension URI**  
: `https://openpodcastapi.org/specs/extensions/link-method`

**Status**  
: Draft

**Purpose:**  
This extension allows `link` objects in JSON:API documents to explicitly declare the HTTP method supported by a link.  

This is useful for non-`GET` actions such as `DELETE`, `PATCH`, or `POST`, especially when embedded in compound resource documents.

## Link object extension

This extension allows the use of an additional `method` member within any [link object](https://jsonapi.org/format/#document-links):

```json
{
   "links": {
      "self": "/v1/subscriptions/abc",
      "delete": {
         "href": "/v1/subscriptions/abc",
         "method": "DELETE"
      }
   }
}
```

### `method`

- **Type**: `string`
- **Required**: No
- **Allowed values**: Any valid HTTP method as defined in [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) — e.g., `GET`, `POST`, `PATCH`, `DELETE`
- **Semantics**: Indicates the HTTP method to be used when invoking the `href`.

## Usage

Clients and servers **MUST** advertise support for this extension using the `ext` parameter in the `Accept` and `Content-Type` headers, and **MAY** include the extension URI in the top-level `jsonapi.ext` array.

## Compatibility

This extension is compatible with JSON:API 1.1 and does not conflict with existing specification features.
