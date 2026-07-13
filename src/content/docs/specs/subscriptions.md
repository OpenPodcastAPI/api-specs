---
title: Subscription API specification
descriptions: Use the subscriptions endpoint to manage podcast subscriptions
banner:
  content: This is a core endpoint. All implementing servers and clients must support it.
---

Subscriptions represent the link between a user an a podcast feed. Users may create new subscriptions and update them to reflect changes to their subscription status.

A subscription entity belongs to a single user entity. When a user subscribes to a feed, it creates a new subscription entity containing all information about the target feed.

## Data model {#data-model}

A subscription entity contains the following properties.

| Property          | Type          | Required | Description                                                              |
|-------------------|---------------|----------|--------------------------------------------------------------------------|
| `sync_id`         | String (UUID) | Yes      | A server-generated ID used to query the entity                           |
| `guid`            | String        | Yes      | The podcast `guid` extracted from the feed                               |
| `feed_url`        | String        | Yes      | The canonical URL of the RSS feed                                        |
| `subscribed_at`   | Timestamp     | Yes      | The UTC timestamp at which the user most recently subscribed to the feed |
| `unsubscribed_at` | Timestamp     | No       | The UTC timestamp at which the user unsubscribed from the feed           |

## Sync actions {#sync-actions}

Clients may perform the following sync actions on subscription entities.
	
### Subscribe {#subscribe}

Subscribing to a feed creates a new feed entity or clears the `unsubscribed_at` field of an existing feed entity. Subscribed feeds are accessible via the server-generated `sync_id`.

To subscribe or resubscribe to a feed, the client must submit an array of action payloads to the [sync endpoint](/specs/sync) containing the following properties:

| Property        | Type                | Description                                                  |
|-----------------|---------------------|--------------------------------------------------------------|
| `type`          | String              | Must be `subscription`                                       |
| `action`        | String              | Must be `subscribe`                                          |
| `action_id`     | String (UUID)       | A client-generated UUIDv4 that identifies the action         |
| `occurred_at`   | Timestamp (RFC3339) | The UTC timestamp at which the action occurred on the client |
| `data`          | Object              | The data payload containing subscription details             |
| `data.guid`     | String              | The podcast `guid`                                           |
| `data.feed_url` | String              | The canonical URL of the feed                                |

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


#### Response {#subscribe-response}

When the server receives a payload containing `"subscribe"` actions, it must follow these rules:

1. If a subscription entity with a matching `feed_url` or `guid` exists and has no `unsubscribed_at` timestamp:
   1. Return the existing entity with a `status` of `ignored`.
1. If a subscription entity with a matching `feed_url` or `guid` exists and has an `unsubscribed_at` timestamp that is earlier than the `occurred_at` timestamp of the payload:
   1. Update the existing entity to set its `unsubscribed_at` timestamp to `null`.
   1. Update the existing entity to set its `subscribed_at` timestamp to the `occurred_at` timestamp sent in the request.
   1. Return the updated entity with a `status` of `applied`.
1. If a subscription entity with a matching `feed_url` or `guid` exists and has an `unsubscribed_at` timestamp that is later than the `occurred_at` timestamp of the payload:
   1. Return the existing entity with a `status` of `ignored`.
1. If there is no existing subscription entity, the server must create the entity and:
   1. Create a unique UUIDv4 `sync_id` for the entity.
   1. Set the `subscribed_at` timestamp to the `occurred_at` timestamp in the request body.
   1. Return the newly created entity with a `status` of `applied`.

| Property       | Type          | Description                                                                             |
|----------------|---------------|-----------------------------------------------------------------------------------------|
| `results`      | Array         | All affected entities in their latest state                                             |
| `[].action`    | String        | The action in the request                                                               |
| `[].action_id` | String (UUID) | The client-generated action ID                                                          |
| `[].type`      | String        | The target entity type                                                                  |
| `[].status`    | String (enum) | The [status](/specs/sync#action-statuses) of the action                                 |
| `[].reason`    | String        | The reason an update was rejected by the server. Only applies if `status` is `rejected` |
| `[].data`      | Object        | The affected [subscription entity](#data-model)                                         |

```json title="Response"
{
	"results": [
		{
			"action_id": "a651fd88-555d-4ac4-bdbb-e35846aa4da",
			"type": "subscription",
			"action": "subscribe",
			"status": "applied",
			"data": {
				"sync_id": "4648b4d7-90bf-497c-a5e7-8383d1083d76",
				"guid": "677ea490-690e-51cb-8b43-755df6c55270",
				"feed_url": "https://example.com/feed1",
				"subscribed_at": "2026-07-11T15:30:00.1Z"
			}
		},
		{
			"action_id": "65a57789-3578-4842-89e5-a221f177efb9",
			"type": "subscription",
			"action": "subscribe",
			"status": "ignored",
			"data": {
				"sync_id": "aa840671-fc3b-430b-b8f2-92e6e9c7832b",
				"guid": "a388867e-ce91-54d3-a116-114b07bb84e9",
				"feed_url": "https://example.com/feed2",
				"subscribed_at": "2026-03-15T12:06:04.1Z"
			}
		}
	]
}
```

### Unsubscribe {#unsubscribe}

Users may unsubscribe from feeds to stop them appearing in sync results by default. Unsubscribing is a non-destructive action. Servers must update the `unsubscribed_at` timestamp of the subscription entity, but must not delete the entity.

To unsubscribe from a feed, the client must submit an array of action payloads to the [sync endpoint](/specs/sync) containing the following properties:

| Property       | Type                | Description                                                  |
|----------------|---------------------|--------------------------------------------------------------|
| `type`         | String              | Must be `subscription`                                       |
| `action`       | String              | Must be `unsubscribe`                                        |
| `action_id`    | String (UUID)       | A client-generated UUIDv4 that identifies the action         |
| `occurred_at`  | Timestamp (RFC3339) | The UTC timestamp at which the action occurred on the client |
| `data`         | Object              | The data payload containing subscription details             |
| `data.sync_id` | String (UUID)       | The server-generated sync ID for the entity                  |

```sh title="Example"
curl '/api/v1/sync' \
  -X 'POST' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-token-here' \
  -H 'Client-ID: cca4ad10-dc35-4572-8f11-125dc465428a'
  -d '{
	  "requests": [
		  {
			  "type": "subscription",
			  "action": "unsubscribe",
			  "action_id": "9c0de111-fcdb-4463-9e2e-400b624e27f6",
			  "occurred_at": "2026-07-12T12:10:00.1Z",
			  "data": {
				  "sync_id": "4648b4d7-90bf-497c-a5e7-8383d1083d7"
			  }
		  },
	  ]
	}'
```

#### Response {#unsubscribe-response}

When the server receives a payload containing `"unsubscribe"` actions, it must follow these rules:

1. If no entity with a matching `sync_id` is found:
   1. Return the action payload with a `status` of `rejected` and a `reason` of `"Entity not found"`.
1. If a subscription entity with a matching `sync_id` exists and has an `unsubscribed_at` timestamp that is earlier than the `occurred_at` timestamp of the payload:
   1. Return the entity with a `status` of `ignored`.
1. If a subscription entity with a matching `sync_id` exists and has no `unsubscribed_at` timestamp:
   1. Set the `unsubscribed_at` timestamp on the entity to the `occurred_at` timestamp submitted with  the action.
   1. Return the full updated entity.

| Property       | Type          | Description                                                                             |
|----------------|---------------|-----------------------------------------------------------------------------------------|
| `results`      | Array         | All affected entities in their latest state                                             |
| `[].action`    | String        | The action in the request                                                               |
| `[].action_id` | String (UUID) | The client-generated action ID                                                          |
| `[].type`      | String        | The target entity type                                                                  |
| `[].status`    | String (enum) | The [status](/specs/sync#action-statuses) of the action                                 |
| `[].reason`    | String        | The reason an update was rejected by the server. Only applies if `status` is `rejected` |
| `[].entity`    | Object        | The affected [subscription entity](#data-model)                                         |

```json title="Response"
{
	"results": [
		{
			"type": "subscription",
			"action": "unsubscribe",
			"action_id": "9c0de111-fcdb-4463-9e2e-400b624e27f6",
			"status": "applied",
			"entity": {
				"sync_id": "4648b4d7-90bf-497c-a5e7-8383d1083d7",
				"guid": "677ea490-690e-51cb-8b43-755df6c55270",
				"feed_url": "https://example.com/feed1",
				"subscribed_at": "2026-07-11T15:30:00.1Z",
				"unsubscribed_at": "2026-07-12T12:10:00.1Z"
			}
		}
	]
}
```

### Update {#update}

Clients may update the subscription entity metadata by submitting an `update` action to the sync endpoint.

To update subscriptions, the client must submit an array of action payloads to the [sync endpoint](/specs/sync) containing the following properties:

| Property        | Type                | Description                                                  |
|-----------------|---------------------|--------------------------------------------------------------|
| `type`          | String              | Must be `subscription`                                       |
| `action`        | String              | Must be `update`                                             |
| `action_id`     | String (UUID)       | A client-generated UUIDv4 that identifies the action         |
| `occurred_at`   | Timestamp (RFC3339) | The UTC timestamp at which the action occurred on the client |
| `data`          | Object              | The data payload containing subscription details             |
| `data.sync_id`  | String (UUID)       | The server-generated sync ID for the entity                  |
| `data.guid`     | String              | The podcast feed `guid` value                                |
| `data.feed_url` | String              | The canonical URL of the subscription feed                   |

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
			  "action": "update",
			  "action_id": "aec337fe-7a9f-4d02-90ad-19d1f552c972",
			  "occurred_at": "2026-07-13T14:09:42.0Z",
			  "data": {
				  "sync_id": "4648b4d7-90bf-497c-a5e7-8383d1083d7",
				  "guid": "21dad7d6-94d7-48bc-8052-aa3384624f78",
				  "feed_url": "https://example.com/feed3"
			  }
		  },
	  ]
	}'
```

#### Response {#update-response}

When the server receives a payload containing `update` actions, it must follow these rules:

1. If no entity with a matching `sync_id` is found:
   1. Return the action payload with a `status` of `rejected` and a `reason` of `"Entity not found"`.
1. If a subscription with a matching `sync_id` exists and the last modified timestamp of the entity is later than the `occurred_at` timestamp of the payload.
   1. Return the entity with a `status` of `ignored`
1. If a subscription with a matching `sync_id` exists and the last modified timestamp of the entity is earlier than the `occurred_at` timestamp of the payload:
   1. Set the `guid` and `feed_url` fields to the values in the payload.
   1. Update the last modified timestamp and last modified by identifier.
   1. Return the updated entity payload.

```json title="Response"
{
	"results": [
		{
			"type": "subscription",
			"action": "update",
			"action_id": "aec337fe-7a9f-4d02-90ad-19d1f552c972",
			"status": "applied",
			"data": {
				"sync_id": "4648b4d7-90bf-497c-a5e7-8383d1083d7",
				"guid": "21dad7d6-94d7-48bc-8052-aa3384624f7",
				"feed_url": "https://example.com/feed3",
				"subscribed_at": "2026-07-11T15:30:00.1Z",
				"unsubscribed_at": "2026-07-12T12:10:00.1Z"
			}
		}
	]
}
```

## Get all subscriptions {#get-all}

Clients may request a [paginated](/specs/conventions#pagination) list of subscription entities from the `/api/v1/subscriptions` endpoint. The server must return only subscriptions belonging to the requesting user.

```txt title="Endpoint"
GET /api/v1/subscriptions
```

The server must return only subscriptions with no `unsubscribed_at` timestamp by default.

### Query parameters {#get-all-query-params}

The client may use the following query parameters when querying the subscriptions endpoint:

| Parameter              | Type    | In    | Description                                                |
|------------------------|---------|-------|------------------------------------------------------------|
| `include_unsubscribed` | Boolean | Query | Whether to include unsubscribed feeds. Defaults to `false` |
| `since`                | String  | Query | The pagination cursor position to query from               |
| `limit`                | Number  | Query | The number of results to return per page. Defaults to `30` |

### Example {#get-all-example}

```sh title="Example request" /(limit=.*?)\&/ /(include_unsubscribed=.*?)\'/
curl '/api/v1/subscriptions?limit=30&include_unsubscribed=true' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Client-ID: cca4ad10-dc35-4572-8f11-125dc465428a'
```

```json title="Example response"
{
	"results": [
		{
			"sync_id": "4648b4d7-90bf-497c-a5e7-8383d1083d76",
			"guid": "677ea490-690e-51cb-8b43-755df6c55270",
			"feed_url": "https://example.com/feed1",
			"subscribed_at": "2026-07-11T15:30:00.1Z"
		},
		{
			"sync_id": "aa840671-fc3b-430b-b8f2-92e6e9c7832b",
			"guid": "a388867e-ce91-54d3-a116-114b07bb84e9",
			"feed_url": "https://example.com/feed2",
			"subscribed_at": "2026-03-15T12:06:04.1Z",
			"unsubscribed_at": "2026-07-12T12:10:00.1Z"
		}
	],
	"has_next": false
}
```
## Get a single subscription {#get-one}

Clients may request a single subscription's details by querying its `sync_id`. The server must respond with the full subscription entity whether the `unsubscribed_at` timestamp is populated or not.

```txt title="Endpoint" "{sync_id}"
GET /api/v1/subscriptions/{sync_id}
```

The server must respond with a `404 Not found` if no matching subscription is found for the requesting user.

### Query parameters {#get-ony-query-params}

The following query parameters are required in all requests.

| Parameter | Type          | In   | Description                                                |
|-----------|---------------|------|------------------------------------------------------------|
| `sync_id` | String (UUID) | Path | The server-generated `sync_id` for the target subscription |

### Example {#get-one-example}

```sh title="Example" "aa840671-fc3b-430b-b8f2-92e6e9c7832b"
curl '/api/v1/subscriptions/aa840671-fc3b-430b-b8f2-92e6e9c7832b \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Client-ID: cca4ad10-dc35-4572-8f11-125dc465428a'
```

```json title="Example response"
{
	"sync_id": "aa840671-fc3b-430b-b8f2-92e6e9c7832b",
	"guid": "a388867e-ce91-54d3-a116-114b07bb84e9",
	"feed_url": "https://example.com/feed2",
	"subscribed_at": "2026-03-15T12:06:04.1Z",
	"unsubscribed_at": "2026-07-12T12:10:00.1Z"
}
```
