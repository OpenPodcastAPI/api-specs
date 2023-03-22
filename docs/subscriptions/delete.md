# Delete a subscription

:::{include} /fragments/core-action-admonition.md
:::

```text
DELETE /subscriptions/{guid}
```

This endpoint allows clients to mark a feed as deleted. This prevents the server from updating the feed in the background and prevents the server from returning any information, such as playback positions, related to the given associated feed.

## Server-side behavior

:::{important}
The server must enact all cascade deletions using ACID transactions. If the deletion process fails at any point in the transaction, **all** transactions must be rolled back to maintain integrity.
:::

To ensure that `DELETE` requests are handled asynchronously, the server must respond to deletion requests immediately with a `202 (Accepted)` status containing a `deletion_id`. This ID must correspond to a status object on the server containing details of the deletion process. The client must be able to [query the status of a deletion](status.md) to check its progress.

:::{list-table} Deletion status parameters
:header-rows: 1

* - Parameter
   - Type
   - Required?
   - Description
* - `id`
   - Integer
   - Yes
   - The ID of the deletion object
* - `success`
   - Boolean
   - Yes
   - Whether or not the deletion was completed successfully
* - `complete`
   - Boolean
   - Yes
   - Whether or not the deletion process has finished
* - `message`
   - String
   - No
   - A status message indicating the current status of the deletion, or any errors that were encountered

:::

The following flow must be followed:

1. The client sends a `DELETE` request for a subscription object
2. The server creates a new deletion status object and returns the `deletion_id` in a `202 (Accepted)` response
3. The server attempts to perform a cascade delete on all related items
   1. If a failure occurs at any point in the process, all transactions are rolled back and the status object is updated to show the following:
      * `complete`: Must be true
      * `success`: Must be `false`
      * `message`: Should be updated to contain a meaningful error message
   2. If all deletions are successful, the status object is updated to show the following:
      * `complete`: Must be true
      * `success`: Must be `true`
      * `message`: Should be updated to contain a success message

If the client attempts to [fetch a deleted subscription](get-single.md), the server must respond with a `410 (Gone)` status code to indicate the object and its associated data have been deleted.

:::{mermaid}
sequenceDiagram
   Client ->> Web server: DELETE request
   Web server ->> Server: Forward request
   Server -->> Web server: deletion_id
   Web server -->> Client: 202 with deletion_id
   par Server to Database
      Server ->> Database: Cascade delete
      Database ->> Server: Report status
   end
   Client ->> Web server: GET status
   Web server ->> Server: Forward request
   Server -->> Client: Deletion status
   Client ->> Web server: GET deleted resource
   Web server ->> Server: Forward request
   Server --> Client: 410 (Gone)
:::

## Example request

```bash
curl --location --request DELETE \
   '/subscriptions/2d8bb39b-8d34-48d4-b223-a0d01eb27d71'
```

## Example 202 response

:::{tab-set-code}

```json
{
  "deletion_id": 25,
  "message": "Deletion request was received and will be processed"
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Success>
   <deletion_id>25</deletion_id>
   <message>Deletion request was received and will be processed</message>
</Success>
```

:::
