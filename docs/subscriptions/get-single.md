# Get a single subscription

```text
GET /subscriptions/{guid}
```

This endpoint returns subscription information relating to a specific subscription for the authenticated user. It returns the following information:

:::{list-table}
:header-rows: 1

* - Field
  - Type
  - Required?
  - Description
* - `feed_url`
   - String
   - Yes
   - The URL of the podcast RSS feed
* - `guid` 
   - String<UUID>
   - Yes
   - The globally unique ID of the podcast
* - `is_subscribed`
  - Boolean
  - Yes
  - Whether the user is subscribed to the podcast or not
* - `subscription_changed`
   - Datetime
   - No
   - The date on which the `is_subscribed` field was last updated. Presented in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html)
* - `guid_changed`
   - Datetime
   - No
   - The date on which the podcast's `guid` or `new_guid` was last updated. Presented in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html)
* - `new_guid`
   - String<UUID>
   - No
   - The new GUID associated with the podcast

:::

## Parameters

## Server-side behavior

If the subscription entry contains a `new_guid`, the server must return the newest `guid` associated with the entry. For example: if a subscription has received 2 new `guid`s, the server should follow these entries and only return the last one it finds. This ensures the client has the most up-to-date entry for the subscription.

:::{mermaid}
flowchart TD
   request([The client requests information about a subscription]) --> new_guid{Is the new_guid field populated?}
   subgraph process [For each subscription]
      new_guid -->|yes| follow(The server fetches the entry containing the\n new guid entry) --> new_guid
      new_guid -->|no| return([The server returns the subscription object])
   end
:::

## Example request

::::{tab-set}
:::{tab-item} JSON
:sync: tabcode-json

```bash
curl -X 'GET' \
  '/subscriptions/968cb508-803c-493c-8ff2-9e397dadb83c' \
  -H 'accept: application/json'
```

:::
:::{tab-item} XML
:sync: tabcode-xml

```bash
curl -X 'GET' \
  '/subscriptions/968cb508-803c-493c-8ff2-9e397dadb83c' \
  -H 'accept: application/xml'
```

:::
::::

## Example 200 response

:::{tab-set-code}

```json
{
  "feed_url": "https://example.com/feed2",
  "guid": "968cb508-803c-493c-8ff2-9e397dadb83c",
  "is_subscribed": true
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<subscription>
	<feed_url>https://example.com/feed2</feed_url>
	<guid>968cb508-803c-493c-8ff2-9e397dadb83c</guid>
	<is_subscribed>true</is_subscribed>
</subscription>
```

:::

## Example 410 response

If a subscription has been [deleted](delete.md), the server must respond with a `410 (Gone)` response to inform the client.

:::{tab-set-code}

```json
{
  "code": 410,
  "message": "Subscription has been deleted"
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Error>
	<code>410</code>
	<message>Subscription has been deleted</message>
</Error>
```

:::
