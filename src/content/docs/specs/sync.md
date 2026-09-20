---
title: Synchronization endpoint
description: The Open Podcast API uses a central synchronization endpoint for sharing bulk updates between clients and the server.
banner:
  content: This is a core endpoint. All implementing servers and clients must support it.
---

The synchronization endpoint is the main entry point to the Open Podcast API. It allows clients to submit batches of updates and retrieve a paginated payload of updates made since a provided timestamp.

The synchronization endpoint exposes updates for all supported entity types in a single response payload. Each entity type may also be fetched from its dedicated endpoint.

## Batch processing {#batch-processing}

Clients may submit up to 30 actions in a batch to perform bulk changes once they come online. All actions must be contained in a `requests` array.

```txt title="Endpoint"
POST /api/v1/sync
```

### Action format {#action-format}

Each action must contain the following properties:

| Property      | Type                | Description                                                  |
|---------------|---------------------|--------------------------------------------------------------|
| `type`        | String              | The target entity type                                       |
| `action`      | String              | The action being undertaken                                  |
| `action_id`   | String (UUID)       | A client-generated UUIDv4 identifier for the action          |
| `occurred_at` | Timestamp (RFC3339) | The UTC timestamp at which the action occurred on the client |
| `data`        | Object              | The payload associated with the action                                                             |

```sh title="Example"
curl '/api/v1/sync' \
  -X 'POST' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Client-ID: cca4ad10-dc35-4572-8f11-125dc465428a'
  -d '{
	  "requests": [
		  {
			  "type": "subscription",
			  "action": "subscribe",
			  "action_id": "a651fd88-555d-4ac4-bdbb-e35846aa4da9",
			  "occurred_at": "2026-07-11T15:30:00.1Z",
			  "data": {
				  "guid": "677ea490-690e-51cb-8b43-755df6c55270",
				  "feed_url": "https://example.com/feed1"
			  }
		  },
		  {
			  "type": "susbcription",
			  "action": "subscribe",
			  "action_id": "65a57789-3578-4842-89e5-a221f177efb9",
			  "occurred_at": "2026-07-11T13:25:00.1Z",
			  "data": {
				  "guid": "a388867e-ce91-54d3-a116-114b07bb84e9",
				  "feed_url": "https://example.com/feed2"
			  }
		  }
	]
}'
```

### Response format {#response-format}

The server must respond to bulk updates with a `results` array containing the result of each requested action. Each action must contain the following properties:

| Property    | Type          | Description                                                                             |
|-------------|---------------|-----------------------------------------------------------------------------------------|
| `type`      | String        | Must be `subscription`                                                                  |
| `action`    | String        | The action performed in the request object                                              |
| `action_id` | String (UUID) | The client-generated action ID                                                          |
| `status`    | String (enum) | The [status](#action-statuses) of the action                                            |
| `reason`    | String        | The reason an update was rejected by the server. Only applies if `status` is `rejected` |
| `data`      | Object        | The affected entity data                                                                |

```json title="Example"
{
	"results": [
		{
			"type": "subscription",
			"action": "unsubscribe",
			"action_id": "aec337fe-7a9f-4d02-90ad-19d1f552c972",
			"status": "applied",
			"data": {
				"sync_id": "4648b4d7-90bf-497c-a5e7-8383d1083d7",
				"guid": "21dad7d6-94d7-48bc-8052-aa3384624f7",
				"feed_url": "https://example.com/feed3",
				"subscribed_at": "2026-07-11T15:30:00.1Z",
				"unsubscrbed_at": "2026-07-12T12:10:00.1Z"
			}
		}
	]
}
```

### Action statuses {#action-statuses}

The following statuses may be returned for each action:

| Status     | Description                                                                          |
|------------|--------------------------------------------------------------------------------------|
| `applied`  | The server validated and applied the action                                          |
| `ignored`  | The action was not applied due to the action occurring before the most recent update |
| `rejected` | The action was not applied due to the request not being valid                        |

## Sync requests {#sync-requests}

Clients may request a bulk synchronization of data from the synchronization endpoint. The server must respond with a [paginated list](/specs/convention#pagination) of entities belonging to the requesting user.

```txt title="Endpoint"
GET /api/v1/sync
```

### Parameters {#sync-parameters}

The client should use the following query parameters to limit the response from the endpoint:

| Parameter     | Type                | In    | Description                                                                   |
|---------------|---------------------|-------|-------------------------------------------------------------------------------|
| `since`       | Timestamp (RFC3339) | Query | Limits results to entities updated since the provided UTC timestamp           |
| `limit`       | Number              | Query | The number of results to include per-page. Defaults to `50`                   |
| `include`     | Array (String)      | Query | A list of entities to include. Defaults to `all`                              |
| `include_own` | Boolean             | Query | Whether to include updates made by the requesting client. Defaults to `false` |


```sh title="Example" /(since=.*?)\&/ /(limit=.*?)\&/ /(include=.*?)\&/ /(include_own=.*?)\'/
curl '/api/v1/sync?since=2026-07-11T15:30:00.1Z&limit=2&include=subscriptions&include_own=false' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-token-here' \
  -H 'Client-ID: cca4ad10-dc35-4572-8f11-125dc465428a'
```

### Response {#sync-response}

The server must respond with a `"results"` array containing a chronological list of all updates made since the `since` timestamp provided, or all updates if no `since` parameter is provided.

#### Pagination {#sync-pagination}

The response must contain [pagination properties](/specs/conventions#pagination) to instruct clients on how to navigate the response.

| Property         | Type         | Required | Description                                                        |
|------------------|--------------|----------|--------------------------------------------------------------------|
| `has_more`       | Boolean      | Yes      | Whether there are more pages of results                            |
| `next_since`     | String (URL) | No       | The URL to the next page of results, if more results are available |
| `previous_since` | String (URL) | No       | The URL to the previous page of results, if applicable             |

The `next_since` and `previous_since` must provide a full URL to a page of resources. The `since` values must be calculated as follows:

* `next_since`: The `last_updated` timestamp of the latest update in the current response. Clients use this value in their next sync request to fetch any changes that occurred after the latest item they have processed.
* `previous_since`: The `last_updated` timestamp of the oldest update in the current response. Clients may use this value to retrieve the preceding page of results when paging backwards.

:::note
Navigation links must provide an updated `since` parameter and must preserve all other parameters present in the original request.
:::

#### Result properties {#sync-result-properties}

Each response object must include the following properties:

| Property       | Type                | Description                                            |
|----------------|---------------------|--------------------------------------------------------|
| `type`         | String              | The entity type                                        |
| `last_updated` | Timestamp (RFC3339) | The UTC timestamp at which the entity was last updated |
| `data`         | Object              | The canonical representation of the entity             |

#### Example {#sync-example}

```json title="Example response" /(since=.*?)\&/ /(limit=.*?)\&/ /(include=.*?)\&/ /(include_own=.*?)\'/
{
	"results": [
		{
			"type": "subscription",
			"last_updated": "2026-07-11T15:30:00.1Z",
			"data": {
				"sync_id": "4648b4d7-90bf-497c-a5e7-8383d1083d76",
				"guid": "677ea490-690e-51cb-8b43-755df6c55270",
				"feed_url": "https://example.com/feed1",
				"subscribed_at": "2026-07-11T15:30:00.1Z"
			}
		},
		{
			"type": "subscription",
			"last_updated": "2026-07-12T12:10:00.1Z",
			"data": {
				"sync_id": "aa840671-fc3b-430b-b8f2-92e6e9c7832b",
				"guid": "a388867e-ce91-54d3-a116-114b07bb84e9",
				"feed_url": "https://example.com/feed2",
				"subscribed_at": "2026-03-15T12:06:04.1Z",
				"unsubscribed_at": "2026-07-12T12:10:00.1Z"
			}
		}
	],
	"has_next": true,
	"next_since": "/api/v1/sync?since=2026-07-12T12:10:00.1Z&limit=2&include=subscriptions&include_own=false"
}
```
