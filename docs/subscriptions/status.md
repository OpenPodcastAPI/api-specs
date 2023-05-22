# Deletion status endpoint

:::{include} /fragments/core-action-admonition.md
:::

```text
GET /deletions/{id}
```

This endpoint enables clients to query the status of a [deletion](delete.md). When a client sends a `DELETE` request, the server must respond with a `deletion_id` that can be used with this endpoint to check whether a deletion has been successfully actioned.

:::{list-table} Deletion status parameters
:header-rows: 1

-  -  Parameter
   -  Type
   -  Required?
   -  Description
-  -  `deletion_id`
   -  Integer
   -  Yes
   -  The ID of the deletion object
-  -  `status`
   -  String
   -  Yes
   -  A status message indicating the status of the deletion. Available values:
      -  `SUCCESS`
      -  `FAILURE`
      -  `PENDING`
-  -  `message`
   -  String
   -  No
   -  A status message indicating the current status of the deletion, or any errors that were encountered

:::

## Parameters

The client must send the deletion's `id` in the path of the request.

## Example request

::::{tab-set}
:::{tab-item} JSON
:sync: tabcode-json

```bash
curl -X 'GET' \
  '/deletions/25' \
  -H 'accept: application/json'
```

:::
:::{tab-item} XML
:sync: tabcode-xml

```bash
curl -X 'GET' \
  '/deletions/25' \
  -H 'accept: application/xml'
```

:::
::::

## Example 200 response

The server must send a `200 (Success)` if it can fetch a status object without issue. This response must contain information about the `deletion_id` passed in the query path.

### Successful deletion

:::{tab-set-code}

```json
{
   "deletion_id": 25,
   "status": "SUCCESS",
   "message": "Subscription deleted successfully"
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<deletion>
	<deletion_id>25</deletion_id>
	<status>SUCCESS</status>
	<message>Subscription deleted successfully</message>
</deletion>
```

:::

### Pending deletion

:::{tab-set-code}

```json
{
   "deletion_id": 25,
   "status": "PENDING",
   "message": "Deletion is pending"
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<deletion>
	<deletion_id>25</deletion_id>
	<status>PENDING</status>
	<message>Deletion is pending</message>
</deletion>
```

:::

### Failed deletion

:::{tab-set-code}

```json
{
   "deletion_id": 25,
   "status": "FAILURE",
   "message": "The deletion process encountered an error and was rolled back"
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<deletion>
	<deletion_id>25</deletion_id>
	<status>FAILURE</status>
	<message>The deletion process encountered an error and was rolled back</message>
</deletion>
```

:::
