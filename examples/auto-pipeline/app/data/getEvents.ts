
import client from "./redis"

export async function getEvents() {
  const keys = await client.scan(0, { match: 'event:*' });

  if (keys[1].length === 0) {
    // If no keys found, insert sample data
    client.hmset('event:1', {'name': 'Sample Event 1', 'date': '2024-05-13'});
    client.hmset('event:2', {'name': 'Sample Event 2', 'date': '2024-05-14'});
    // Add more sample events as needed
  }

  const events = await Promise.all(keys[1].map(async key => {
    return client.hgetall(key) ?? {name: "default", date: "2000-01-01"};
  }));
  return events as {name: string, date: string}[]
};
