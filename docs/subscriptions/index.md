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

## API endpoint

The subscriptions endpoint is used to synchronize subscriptions between a server and connected clients. The server is treated as the authoritative source for subscription information. Clients can query the endpoint by specifying the datetime from which they want to fetch changes to ensure they only fetch information that is relevant to them since their last sync.
