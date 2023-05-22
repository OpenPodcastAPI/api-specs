# Update a subscription

:::{include} /fragments/core-action-admonition.md
:::

```text
PATCH /subscriptions/{guid}
```

This endpoint allows clients to update information about a subscription. The client can update the following information:

-  The podcast's GUID
-  The podcast's feed URL
-  An update to the subscription status for the user

This endpoint returns the following information:

:::{list-table}
:header-rows: 1

-  -  Field
   -  Type
   -  Required?
   -  Description
-  -  `new_feed_url`
   -  String
   -  No
   -  The URL of the podcast RSS feed. Only returned if the `feed_url` field was updated by the request
-  -  `is_subscribed`
   -  Boolean
   -  No
   -  Whether the user is subscribed to the podcast or not. Only returned if the `is_subscribed` field was updated by the request
-  -  `subscription_changed`
   -  Datetime
   -  No
   -  The date on which the `is_subscribed` field was last updated. Presented in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html). Only returned if the `is_subscribed` field was updated by the request
-  -  `guid_changed`
   -  Datetime
   -  No
   -  The date on which the podcast's GUID was last updated. Presented in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html). Only returned if the `guid` field was updated by the request
-  -  `new_guid`
   -  String<UUID>
   -  No
   -  The new GUID associated with the podcast. Only returned if the `guid` field was updated by the request

:::

## Parameters

The client must pass the subscription GUID in the query path and add at least one field update in the request body.

:::{list-table}
:header-rows: 1

-  -  Parameter
   -  Type
   -  In
   -  Required?
   -  Description
-  -  `guid`
   -  String
   -  Query
   -  Yes
   -  The GUID of the subscription object that needs to be updated
-  -  `new_feed_url`
   -  String
   -  Body
   -  No
   -  The URL of the new RSS feed for the subscription
-  -  `new_guid`
   -  String <UUID>
   -  Body
   -  No
   -  The new GUID of the podcast
-  -  `is_subscribed`
   -  Boolean
   -  Body
   -  No
   -  Whether the user is subscribed to the podcast or not

:::

## Server-side behavior

On receipt of a PATCH request for a subscription, the server must do the following:

1. If the subscription in the request has a `new_guid` specified in the database, follow the `new_guid` chain to find the **latest** version of the subscription
2. If the request contains a `new_feed_url` parameter:
   1. Update the subscription entry's `feed_url` field to the new value
   2. Update the subscription entry's `subscription_changed` field to the current date
3. If the request contains a `new_guid` parameter:
   1. Check if the GUID is already present in the system
   2. If the GUID is already present, update the subscription entry's `new_guid` field to point to the existing entry
   3. If the GUID isn't already present, create a new subscription entry and update the existing entry's `new_guid` field to point to the newly created entry
   4. Update the subscription entry's `guid_changed` to the current date
4. If the request contains an `is_subscribed` parameter:
   1. Update the subscription entry's `is_subscribed` to the new value
   2. Update the subscription entry's `subscription_changed` field to the current date
5. Return a summary of the changes

:::{mermaid}
flowchart TD
request([The server receives a PATCH request]) --> resolve(The server checks the <code>new_guid</code> field of the\nsubscription and resolves the latest version of the subscription)
resolve --> check{What parameters are included in the request body?}
check -->|new_feed_url| update_feed(The server updates the entry's feed_url\nto the new value)
check -->|new_guid| check_guid{Is there an entry with a matching guid?}
check -->|is_subscribed| update_sub(The server updates the entry's is_subscribed field\nto match the provided value)
update_feed --> feed_date(The server updates the entry's subscription_changed\nto the current date)
check_guid -->|yes| match_guid(The server updates the entry's new_guid field to point to\nthe existing entry)
check_guid -->|no| no_match_guid(The server creates a new subscription entry\nwith the provided guid and updates the\nentry's new_guid field to point to the newly created entry)
update_sub --> sub_date(The server updates the entry's subscription_changed\nto the current date)
feed_date & sub_date & match_guid & no_match_guid --> return([The server returns the updated subscription information])
:::

## Example request

::::{tab-set}
:::{tab-item} JSON
:sync: tabcode-json

```bash
curl --location --request PATCH '/subscriptions/2d8bb39b-8d34-48d4-b223-a0d01eb27d71' \
--header 'Content-Type: application/json' \
--data '{
    "new_feed_url": "https://example.com/rss5",
    "new_guid": "965fcecf-ce04-482b-b57c-3119b866cc61",
    "is_subscribed": false
}'
```

:::
:::{tab-item} XML
:sync: tabcode-xml

```bash
curl --location --request PATCH '/subscriptions/2d8bb39b-8d34-48d4-b223-a0d01eb27d71' \
--header 'Content-Type: application/xml' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<subscription>
	<new_feed_url>https://example.com/rss5</new_feed_url>
	<new_guid>965fcecf-ce04-482b-b57c-3119b866cc61</new_guid>
	<is_subscribed>false</is_subscribed>
</subscription>'
```

:::
::::

## Example 200 response

:::{tab-set-code}

```json
{
   "new_feed_url": "https://example.com/rss5",
   "is_subscribed": false,
   "subscription_changed": "2023-02-23T14:41:00.000Z",
   "guid_changed": "2023-02-23T14:41:00.000Z",
   "new_guid": "965fcecf-ce04-482b-b57c-3119b866cc61"
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<subscription>
	<new_feed_url>https://example.com/rss5</new_feed_url>
	<is_subscribed>false</is_subscribed>
	<subscription_changed>2023-02-23T14:41:00.000Z</subscription_changed>
	<guid_changed>2023-02-23T14:41:00.000Z</guid_changed>
	<new_guid>965fcecf-ce04-482b-b57c-3119b866cc61</new_guid>
</subscription>
```

:::
