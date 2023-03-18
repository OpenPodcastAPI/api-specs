# Subscriptions endpoint

The subscriptions endpoint is used to synchronize subscriptions between a server and connected clients. The server is treated as the authoritative source for subscription information. Clients can query the endpoint by specifying the datetime from which they want to fetch changes to ensure they only fetch information that is relevant to them since their last sync.
