# Add a new subscription

:::{include} /fragments/core-action-admonition.md
:::

```text
POST /subscriptions
```

This endpoint enables clients to add new subscriptions to the system for the authenticated user. It returns an array of `success` responses for newly added subscriptions, and an array of `failure` responses for subscriptions that couldn't be added.

:::{list-table} Success response
:header-rows: 1

* - Field
   - Type
   - Required?
   - Description
* - `feed_url`
   - String
   - Yes
   - The URL of the podcast RSS feed.
* - `guid`
   - String
   - Yes
   - The globally unique ID of the podcast
* - `is_subscribed`
   - Boolean
   - Yes
   - Whether the user is subscribed to the podcast or not
* - `subscription_changed`
   - Datetime
   - Yes
   - The date on which the `is_subscribed` field was last updated. Presented in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html)

:::

:::{list-table} Failure response
:header-rows: 1

* - Field
   - Type
   - Required?
   - Description
* - `feed_url`
   - String
   - Yes
   - The URL of the podcast RSS feed
* - `message`
   - String
   - Yes
   - A message explaining why the subscription couldn't be added

:::

## Request parameters

The client must provide a list of objects containing the following parameters:

:::{list-table}
:header-rows: 1

* - Field
   - Type
   - Required?
   - Description
* - `feed_url`
   - String
   - Yes
   - The URL of the podcast RSS feed. The client must provide a protocol (for example: `http` or `https`) and preserve any parameters
* - `guid`
   - String
   - No
   - The GUID found in the podcast RSS feed

:::

:::{important}
If a client passes a `guid` this is treated as authoritative by the server. The client may pass a `guid` **only** if it is parsed from the podcast RSS feed.
:::

:::{tab-set-code}

```json
{
   "subscriptions": [
      {
         "feed_url": "https://example.com/rss1",
      },
      {
         "feed_url": "https://example.com/rss2",
      },
      {
         "feed_url": "https://example.com/rss3",
      },
      {
         "feed_url": "https://example.com/rss4",
         "guid": "2d8bb39b-8d34-48d4-b223-a0d01eb27d71"
      },
   ]
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<subscriptions>
	<subscription>
		<feed_url>https://example.com/feed1</feed_url>
	</subscription>
	<subscription>
		<feed_url>https://example.com/feed2</feed_url>
	</subscription>
	<subscription>
		<feed_url>https://example.com/feed3</feed_url>
	</subscription>
	<subscription>
		<feed_url>https://example.com/feed4</feed_url>
		<guid>2d8bb39b-8d34-48d4-b223-a0d01eb27d71</guid>
	</subscription>
</subscriptions>
```

:::

## Server-side behavior

When new feeds are posted to the server, the server must return a success response to the client immediately to acknowledge the request. To ensure that data can be returned immediately, the following flow must be followed:

1. The client sends a payload to the server
2. For each object in the payload, the server does the following:
   1. Checks if there's a `guid` entry in the payload
      * If a `guid` is present, the server stores the `guid` for later use
      * If no `guid` is present, the server generates a `guid` for later use
   2. Checks to see if there is an existing entry with the same `guid` or `feed_url`
      * If an existing entry is found, the server sets the `is_subscribed` field to `true` and updates the `subscription_changed` date to the current date
      * If no existing entry is found, the server creates a new subscription entry
3. The server returns a success payload containing the subscription information for each object in the request payload.

:::{mermaid}
flowchart TB
   post([The client posts a subscription payload]) --> process{Does the payload contain\n a GUID?}
   subgraph each [For each object]
      process -->|yes| store_guid(The server stores the GUID\nfor the feed)
      process -->|no| generate_guid(The server generates a GUID\nfor the feed)
      store_guid & generate_guid --> search_entries[[The server checks for existing\nentries with the same URL or GUID]]
      search_entries --> found{Was an existing subscription entry found?}
      found -->|yes| resubscribe(The server updates the is_subscribed field\nto true and updates the subscription_changed date\nto the current date)
      found -->|no| create(The server creates a new subscription entry)
   end
   resubscribe & create --> return([The server returns a success payload])
:::

### Subscription GUID update

If the client doesn't send a `guid` in the subscription payload, the server must create one immediately to ensure the following:

1. Each entry has an associated `guid`
2. The client receives a success response as quickly as possible

Once this is done, the server should asynchronously verify that there isn't a more authoritative GUID available. The following flow should be used:

1. The server fetches and parses the RSS feed to search for a [`guid` field in the `podcast` namespace](https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md#guid).
2. If a more authoritative `guid` is found, the server must update the subscription entry as follows:
   1. Create a new subscription entry with the new `guid`
   2. Update the `new_guid` field in the existing entry to point to the new `guid`
   3. Update the `guid_changed` field in the existing entry to the current date

:::{mermaid}
flowchart TD
   subgraph authority [For each empty GUID]
      fetch(The server fetches the RSS feed and\nparses it) --> rss_guid{Does the RSS field contain a GUID?}
      rss_guid -->|no| keep([The server keeps the generated GUID])
      rss_guid -->|yes| create(The server creates a new subscription\nentry with the new GUID)
      create --> update([The server updates the existing entry's\n<code>new_guid</code> and <code>guid_changed</code> fields])
   end
   subgraph initial [Initial server response]
      payload([The server receives a payload with an empty guid field]) --> generate(The server generates a new GUID and returns it)
   end
:::

## Example request

::::{tab-set}
:::{tab-item} JSON
:sync: tabcode-json

```bash
curl --location '/subscriptions' \
--header 'Content-Type: application/json' \
--data '{
  "subscriptions": [
    {
      "feed_url": "https://example.com/feed1"
    },
    {
      "feed_url": "https://example.com/feed2"
    },
    {
      "feed_url": "https://example.com/feed3"
    },
    {
      "feed_url": "example.com/feed4",
      "guid": "2d8bb39b-8d34-48d4-b223-a0d01eb27d71"
    }
  ]
}'
```

:::
:::{tab-item} XML
:sync: tabcode-xml

```bash
curl --location '/subscriptions' \
--header 'Content-Type: application/xml' \
--data '<?xml version="1.0" encoding="UTF-8"?>
<subscriptions>
	<subscription>
		<feed_url>https://example.com/feed1</feed_url>
	</subscription>
	<subscription>
		<feed_url>https://example.com/feed2</feed_url>
	</subscription>
	<subscription>
		<feed_url>https://example.com/feed3</feed_url>
	</subscription>
	<subscription>
		<feed_url>example.com/feed4</feed_url>
		<guid>2d8bb39b-8d34-48d4-b223-a0d01eb27d71</guid>
	</subscription>
</subscriptions>'
```

:::
::::

## Example 200 response

:::{tab-set-code}

```json
{
  "success": [
    {
      "feed_url": "https://example.com/rss1",
      "guid": "8d1f8f09-4f50-4327-9a63-639bfb1cbd98",
      "is_subscribed": true,
      "subscription_changed": "2023-02-23T14:00:00.000Z"
    },
    {
      "feed_url": "https://example.com/rss2",
      "guid": "968cb508-803c-493c-8ff2-9e397dadb83c",
      "is_subscribed": true,
      "subscription_changed": "2023-02-23T14:00:00.000Z"
    },
    {
      "feed_url": "https://example.com/rss3",
      "guid": "e672c1f4-230d-4ab4-99d3-390a9f835ec1",
      "is_subscribed": true,
      "subscription_changed": "2023-02-23T14:00:00.000Z"
    }
  ],
  "failure": [
    {
      "feed_url": "example.com/rss4",
      "message": "No protocol present"
    }
  ]
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<subscriptions>
	<success>
		<feed_url>https://example.com/rss1</feed_url>
		<guid>8d1f8f09-4f50-4327-9a63-639bfb1cbd98</guid>
		<is_subscribed>true</is_subscribed>
		<subscription_changed>2023-02-23T14:00:00.000Z</subscription_changed>
	</success>
	<success>
		<feed_url>https://example.com/rss2</feed_url>
		<guid>968cb508-803c-493c-8ff2-9e397dadb83c</guid>
		<is_subscribed>true</is_subscribed>
		<subscription_changed>2023-02-23T14:00:00.000Z</subscription_changed>
	</success>
	<success>
		<feed_url>https://example.com/rss3</feed_url>
		<guid>e672c1f4-230d-4ab4-99d3-390a9f835ec1</guid>
		<is_subscribed>true</is_subscribed>
		<subscription_changed>2023-02-23T14:00:00.000Z</subscription_changed>
	</success>
	<failure>
		<feed_url>example.com/rss4</feed_url>
		<message>No protocol present</message>
	</failure>
</subscriptions>
```

:::
