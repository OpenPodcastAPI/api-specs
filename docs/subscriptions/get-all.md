# Get all subscriptions

```text
GET /subscriptions
```

This endpoint enables clients to return all subscription information relating to the authenticated user. It returns pagination information and an array of `subscriptions`:

:::{list-table} Pagination information
:header-rows: 1

* - Field
  - Type
  - Required?
  - Description
* - `total`
   - Number
   - Yes
   - The total number of objects returned by the call
* - `page` 
   - Number
   - Yes
   - The number of the page returned in the call
* - `per_page`
  - Number
  - Yes
  - The number of results returned per page
* - `has_next`
   - Boolean
   - Yes
   - Whether there is a next page of results that the client can fetch
* - `has_prev`
   - Boolean
   - Yes
   - Whether there is a previous page of results that the client can fetch

:::

:::{list-table} Subscriptions array
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

The client may add the following parameters to their call:

:::{list-table} Subscriptions array
:header-rows: 1

* - Field
  - Type
  - In
  - Required?
  - Description
* - `since`
   - DateTime
   - Query
   - No
   - The date from which the server should return objects. The server only returns entries whose `subscription_changed` or `guid_changed` fields are greater than this parameter
* - `page` 
   - Number
   - Query
   - No
   - The page of results to be returned by the server. Defaults to `1` if not present
* - `per_page`
  - Number
  - Query
  - No
  - The number of results to return in each call. Defaults to `50` if not present

:::

:::{note}
If no `since` parameter is provided, the server returns all current subscription information.
:::

## Server-side behavior

If the entry contains a `new_guid`, the server must return the newest `guid` associated with the entry. For example: if a subscription has received 2 new `guid`s, the server should follow these entries and only return the last one it finds. This ensures the client has the most up-to-date entry for the subscription.

:::{mermaid}
flowchart TD
   request([The client requests information about subscriptions]) --> new_guid{Is the new_guid field populated?}
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
  '/subscriptions?since=2022-04-23T18%3A25%3A34.511Z&page=1&per_page=5' \
  -H 'accept: application/json'
```

:::

:::{tab-item} XML
:sync: tabcode-xml

```bash
curl -X 'GET' \
  '/subscriptions?since=2022-04-23T18%3A25%3A34.511Z&page=1&per_page=5' \
  -H 'accept: application/xml'
```

:::
::::

## Example 200 response

:::{tab-set-code}

```json
{
   "total": 2,
   "page": 1,
   "per_page": 5,
   "has_next": false,
   "has_prev": false,
   "subscriptions": [
      {
         "feed_url": "https://example.com/rss1",
         "guid": "31740ac6-e39d-49cd-9179-634bcecf4143",
         "is_subscribed": true,
         "guid_changed": "2022-09-21T10:25:32.411Z",
         "new_guid": "8d1f8f09-4f50-4327-9a63-639bfb1cbd98"
      },
      {
         "feed_url": "https://example.com/rss2",
         "guid": "968cb508-803c-493c-8ff2-9e397dadb83c",
         "is_subscribed": false,
         "subscription_changed": "2022-04-24T17:53:21.573Z"
      }
   ]
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<subscriptions>
	<total>2</total>
	<page>1</page>
	<per_page>5</per_page>
	<has_next>false</has_next>
	<has_prev>false</has_prev>
	<subscription>
		<feed_url>https://example.com/rss1</feed_url>
		<guid>31740ac6-e39d-49cd-9179-634bcecf4143</guid>
		<is_subscribed>true</is_subscribed>
		<guid_changed>2022-09-21T10:25:32.411Z</guid_changed>
		<new_guid>8d1f8f09-4f50-4327-9a63-639bfb1cbd98</new_guid>
	</subscription>
	<subscription>
		<feed_url>https://example.com/rss2</feed_url>
		<guid>968cb508-803c-493c-8ff2-9e397dadb83c</guid>
		<is_subscribed>false</is_subscribed>
		<subscription_changed>2022-04-24T17:53:21.573Z</subscription_changed>
	</subscription>
</subscriptions>
```

:::
