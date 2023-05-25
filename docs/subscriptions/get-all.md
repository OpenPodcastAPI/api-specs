# Get all subscriptions

:::{include} /fragments/core-action-admonition.md
:::

```text
GET /subscriptions
```

This endpoint enables clients to return all subscription information relating to the authenticated user. It returns pagination information and an array of `subscriptions`:

:::{list-table} Pagination information
:header-rows: 1

-  -  Field
   -  Type
   -  Required?
   -  Description
-  -  `total`
   -  Number
   -  Yes
   -  The total number of objects returned by the call
-  -  `page`
   -  Number
   -  Yes
   -  The number of the page returned in the call
-  -  `per_page`
   -  Number
   -  Yes
   -  The number of results returned per page
-  -  `next`
   -  String
   -  No
   -  The URL for the next page of results
-  -  `previous`
   -  String
   -  No
   -  The URL for the previous page of results

:::

:::{list-table} Subscriptions array
:header-rows: 1

-  -  Field
   -  Type
   -  Required?
   -  Description
-  -  `feed_url`
   -  String
   -  Yes
   -  The URL of the podcast RSS feed
-  -  `guid`
   -  String<UUID>
   -  Yes
   -  The globally unique ID of the podcast
-  -  `is_subscribed`
   -  Boolean
   -  Yes
   -  Whether the user is subscribed to the podcast or not
-  -  `subscription_changed`
   -  Datetime
   -  No
   -  The date on which details relating to the subscription last changed. Presented in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html)
-  -  `guid_changed`
   -  Datetime
   -  No
   -  The date on which the podcast's `guid` or `new_guid` was last updated. Presented in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html)
-  -  `new_guid`
   -  String<UUID>
   -  No
   -  The new GUID associated with the podcast
-  -  `deleted`
   -  Datetime
   -  No
   -  The date on which the subscription was deleted. Only returned if the field is not `NULL`

:::

## Parameters

The client may add the following parameters to their call:

:::{list-table} Subscriptions array
:header-rows: 1

-  -  Field
   -  Type
   -  In
   -  Required?
   -  Description
-  -  `since`
   -  DateTime
   -  Query
   -  No
   -  The date from which the server should return objects. The server only returns entries whose `subscription_changed`, `guid_changed`, or `deleted` fields are greater than this parameter. Expected in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html)
-  -  `page`
   -  Number
   -  Query
   -  No
   -  The page of results to be returned by the server. Defaults to `1` if not present
-  -  `per_page`
   -  Number
   -  Query
   -  No
   -  The number of results to return in each call. Defaults to `50` if not present

:::

:::{note}
If no `since` parameter is provided, the server returns all current subscription information.
:::

## Server-side behavior

If the entry contains a `new_guid`, the server must return the newest `guid` associated with the entry in the response's `new_guid` field. For example: if a subscription has received 2 new `guid`s, the server should return:

-  The subscription's `guid` as it was at the date passed in the `since` parameter, or the original entry's `guid` if no `since` parameter is passed
-  The subscription's latest `guid` in the `new_guid` field

This ensures the client has the most up-to-date entry for the subscription.

:::{mermaid}
flowchart TD
request([The client requests information about subscriptions]) --> new_guid{Is the <code>new_guid</code> field populated?}
subgraph process [For each subscription]
new_guid -->|yes| follow(The server fetches the entry containing the\n new <code>guid</code> entry) --> new_guid
new_guid -->|no| return([The server returns the <code>guid</code> entry from the\n<code>since</code> date and adds the latest\nGUID in the <code>new_guid</code> field])
end
:::

## Client behavior

The client should update its local subscription data to match the information returned in the response. On receipt of a deleted subscription, the client should present the user with the option to remove their local data or [send their local data to the server](add-new.md) to reinstate the subscription details.

### Resolution example

This example demonstrates how the server resolves a `new_guid` field for a subscription that has received three GUIDs. Here is how the data is represented in the database:

:::{list-table}
:header-rows: 1

-  -  `feed_url`
   -  `guid`
   -  `is_subscribed`
   -  `subscription_changed`
   -  `guid_changed`
   -  `new_guid`
-  -  https://example.com/rss1
   -  64c1593b-5a1e-4e89-b8a3-d91501065e80
   -  true
   -  2022-03-21T18:45:35.513Z
   -  2022-03-21T19:00:00.000Z
   -  daac3ce5-7b16-4cf0-8294-86ad71944a64
-  -  https://example.com/rss1
   -  daac3ce5-7b16-4cf0-8294-86ad71944a64
   -  true
   -  2022-03-21T18:45:35.513Z
   -  2022-12-23T10:24:14.670Z
   -  36a47c4c-4aa3-428a-8132-3712a8422002
-  -  https://example.com/rss1
   -  36a47c4c-4aa3-428a-8132-3712a8422002
   -  true
   -  2022-03-21T18:45:35.513Z
   -  2022-12-23T10:24:14.670Z
   -

:::

#### Scenario 1

In this scenario, the client requests all subscriptions and **doesn't** pass a `since` parameter. This means the server passes the **original** GUID in the `guid` field, and the **latest** GUID in the `new_guid`field.

::::{tab-set}

:::{tab-item} JSON
:sync: tabcode-json

```bash
curl -X 'GET' \
  '/subscriptions?page=1&per_page=5' \
  -H 'accept: application/json'
```

:::

:::{tab-item} XML
:sync: tabcode-xml

```bash
curl -X 'GET' \
  '/subscriptions?page=1&per_page=5' \
  -H 'accept: application/xml'
```

:::
::::

:::{tab-set-code}

```json
{
   "total": 1,
   "page": 1,
   "per_page": 5,
   "subscriptions": [
      {
         "feed_url": "https://example.com/rss1",
         "guid": "64c1593b-5a1e-4e89-b8a3-d91501065e80",
         "is_subscribed": true,
         "guid_changed": "2022-12-23T10:24:14.670Z",
         "new_guid": "36a47c4c-4aa3-428a-8132-3712a8422002"
      }
   ]
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<subscriptions>
	<total>1</total>
	<page>1</page>
	<per_page>5</per_page>
	<subscription>
		<feed_url>https://example.com/rss1</feed_url>
		<guid>64c1593b-5a1e-4e89-b8a3-d91501065e80</guid>
		<is_subscribed>true</is_subscribed>
		<guid_changed>2022-12-23T10:24:14.670Z</guid_changed>
		<new_guid>36a47c4c-4aa3-428a-8132-3712a8422002</new_guid>
	</subscription>
</subscriptions>
```

:::

#### Scenario 2

In this scenario, the client requests all subscriptions and specifies a `since` date of `2022-05-30T00:00:00.000Z`. Since the first GUID change occurred before this date, and the second GUID change occurred after this date, the server responds with the **second** GUID in the `guid` field, and the **latest** GUID in the `new_guid` field.

::::{tab-set}

:::{tab-item} JSON
:sync: tabcode-json

```bash
curl -X 'GET' \
  '/subscriptions?since=2022-05-30T00%3A00%3A00.000Z&page=1&per_page=5' \
  -H 'accept: application/json'
```

:::

:::{tab-item} XML
:sync: tabcode-xml

```bash
curl -X 'GET' \
  '/subscriptions?since=2022-05-30T00%3A00%3A00.000Z&page=1&per_page=5' \
  -H 'accept: application/xml'
```

:::
::::

:::{tab-set-code}

```json
{
   "total": 1,
   "page": 1,
   "per_page": 5,
   "subscriptions": [
      {
         "feed_url": "https://example.com/rss1",
         "guid": "daac3ce5-7b16-4cf0-8294-86ad71944a64",
         "is_subscribed": true,
         "guid_changed": "2022-12-23T10:24:14.670Z",
         "new_guid": "36a47c4c-4aa3-428a-8132-3712a8422002"
      }
   ]
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<subscriptions>
	<total>1</total>
	<page>1</page>
	<per_page>5</per_page>
	<subscription>
		<feed_url>https://example.com/rss1</feed_url>
		<guid>daac3ce5-7b16-4cf0-8294-86ad71944a64</guid>
		<is_subscribed>true</is_subscribed>
		<guid_changed>2022-12-23T10:24:14.670Z</guid_changed>
		<new_guid>36a47c4c-4aa3-428a-8132-3712a8422002</new_guid>
	</subscription>
</subscriptions>
```

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
