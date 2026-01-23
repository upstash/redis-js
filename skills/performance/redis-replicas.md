upstash redis has a global setup. each db has a primary and multiple replicas across the world.

all write requests have to go to the primary node. read requests can be served by any replica.

redis is eventually consistent across replicas. this means that a read request to a replica may not reflect the most recent write request to the primary. one improvement SDK has is read-your-writes consistency. when enabled, redis server makes sure that read requests are handled after the last write request from the same redis client.
