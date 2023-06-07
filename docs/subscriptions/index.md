# Subscriptions

:::{include} /fragments/core-endpoint-admonition.md
:::

Subscriptions represent the feeds a user has subscribed to. The object stores essential information about each subscription object and acts as an index that links other activity information together.

## Database schema

::: {list-table}
:header-rows: 1

-  -  Field
   -  Type
   -  Nullable?
   -  Description
-  -  `feed_url`
   -  String
   -  No
   -  The URL of the podcast RSS feed
-  -  `guid`
   -  String<UUID>
   -  No
   -  The globally unique ID of the podcast
-  -  `is_subscribed`
   -  Boolean
   -  No
   -  Whether the user is subscribed to the podcast or not
-  -  `subscription_changed`
   -  Datetime
   -  No
   -  The date on which the `is_subscribed` field was last updated. Presented in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html)
-  -  `guid_changed`
   -  Datetime
   -  No
   -  The date on which the podcast's `guid` or `new_guid` was last updated. Presented in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html)
-  -  `new_guid`
   -  String<UUID>
   -  Yes
   -  The new GUID associated with the podcast
-  -  `deleted`
   -  Datetime
   -  Yes
   -  The date on which data associated with the subscription was [deleted](delete.md) by the user. This field is used to determine whether a `410 (Gone)` response should be returned

:::

:::{mermaid}
classDiagram
class subscription{
String feed_url
String guid
Boolean is_subscribed
Datetime subscription_changed
Datetime guid_changed
String new_guid
Datetime deleted
}
:::

:::{admonition} Tombstoning
:class: note

As is implicit from the description of the servers-side behavior for the different calls, servers SHOULD hold all previous `guid` and `feed_url` field data with a link to the succeeding data (such that a path of values can be followed) or with a link to the most recent data. This in order to handle situations where clients submit old data. For example:
* A user finds a podcast, whose URL had changed, and adds the old URL in the app. Because the client does not have that URL in its database, it recognizes the podcast as 'new' and POSTs this old (not-current) `feed_url` to the /subscriptions endpoind. If the user is already subscribed to the podcast (with the current feed URL) this would lead to a duplicate subscription.
* A user has a device that they didn't use for a very long time. In that time, a podcaster added a GUID in their feed, leading to updated data in this field. When the client connects to the server again to pull all episode changes since the last connect and retrieves episodes with their current subscription `guid`, which it won't recognise the subscription and fail the episode status updates.
:::

## API endpoint

The subscriptions endpoint is used to synchronize subscriptions between a server and connected clients. The server is treated as the authoritative source for subscription information. Clients can query the endpoint by specifying the datetime from which they want to fetch changes to ensure they only fetch information that is relevant to them since their last sync.
