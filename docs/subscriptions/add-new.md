# Add a new subscription

```text
POST /subscriptions
```

This endpoint enables clients to add new subscriptions to the system for the authenticated user. It returns the following information:

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
   - The date on which the `is_subscribed` field was last updated. Presented in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html).

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
   - The URL of the podcast RSS feed
* - `guid`
   - String
   - No
   - The GUID found in the podcast RSS feed

:::

:::{important}
If a client passes a `guid` this is treated as authoritative by the server. The client must pass a `guid` only if it is parsed from the podcast RSS feed.
:::

```json
{
   "subscriptions": [
      {
         "feed_url": "https://example.com/rss1",
         "guid": ""
      },
      {
         "feed_url": "https://example.com/rss2",
         "guid": ""
      },
      {
         "feed_url": "https://example.com/rss3",
         "guid": ""
      },
      {
         "feed_url": "https://example.com/rss4",
         "guid": "2d8bb39b-8d34-48d4-b223-a0d01eb27d71"
      },
   ]
}
```

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

1. The server checks for a more authoritative GUID using the following methods (in order)
   1. Fetch and parse the RSS feed to search for a `guid` field
   2. If the server admin has enabled Podcast Index support, send the RSS feed URL to the [`/podcast/byfeedurl` endpoint](https://podcastindex-org.github.io/docs-api/#get-/podcasts/byfeedurl) and check the response for a `podcastGuid` entry
2. If a more authoritative `guid` is found, the server must update the subscription entry as follows:
   1. Create a new subscription entry with the new `guid`
   2. Update the `new_guid` field in the existing entry to point to the new `guid`
   3. Update the `guid_changed` field in the existing entry to the current date

:::{mermaid}
flowchart TD
   subgraph authority [For each empty GUID]
      fetch(The server fetches the RSS feed and\nparses it) --> rss_guid{Does the RSS field contain a GUID?}
      rss_guid -->|no| podcast_index{Has the server admin enabled Podcast Index\nsupport?}
      podcast_index -->|yes| fetch_response(The server sends the RSS feed URL\nto the /podcast/byfeedurl endpoint)
      fetch_response --> pi_guid{Does the response contain a `podcastGuid` entry?}
      pi_guid & podcast_index -->|no| keep([The server keeps the generated GUID])
      pi_guid & rss_guid -->|yes| create(The server creates a new subscription\nentry with the new GUID)
      create --> update([The server updates the existing entry's\nnew_guid and guid_changed fields])
   end
   subgraph initial [Initial server response]
      payload([The server receives a payload with an empty guid field]) --> generate(The server generates a new GUID and returns it)
   end
:::

## Example request

```bash
curl --location '/subscriptions' \
--header 'Content-Type: application/json' \
--data '{
   "subscriptions": [
      {
         "feed_url": "https://example.com/rss1",
         "guid": ""
      },
      {
         "feed_url": "https://example.com/rss2",
         "guid": ""
      },
      {
         "feed_url": "https://example.com/rss3",
         "guid": ""
      },
      {
         "feed_url": "https://example.com/rss4",
         "guid": "2d8bb39b-8d34-48d4-b223-a0d01eb27d71"
      },
   ]
}'
```

## Example 200 response

```json
{
   "subscriptions": [
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
      },
      {
         "feed_url": "https://example.com/rss4",
         "guid": "2d8bb39b-8d34-48d4-b223-a0d01eb27d71",
         "is_subscribed": true,
         "subscription_changed": "2023-02-23T14:00:00.000Z"
      },
   ]
}
```
