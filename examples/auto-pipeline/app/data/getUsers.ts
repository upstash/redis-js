
import client from "./redis"

export async function getUsers() {
  const keys = await client.scan(0, { match: 'user:*' });

  if (keys[1].length === 0) {
    // If no keys found, insert sample data
    client.hmset('user:1', {'username': 'Adam', 'birthday': '1990-01-01'});
    client.hmset('user:2', {'username': 'Eve', 'birthday': '1980-01-05'});
    // Add more sample users as needed
  }

  const users = await Promise.all(keys[1].map(async key => {
    return client.hgetall(key) ?? {username: "default", birthday: "2000-01-01"};
  }));
  return users as {username: string, birthday: string}[]
}