"use server"
import client from "../data/redis"
import { getEvents } from "../data/getEvents";
import { getUsers } from "../data/getUsers";

const DataComponent = async () => {


  const [ users, events ] = await Promise.all([
    getUsers(),
    getEvents()
  ])

  // @ts-ignore pipelineCounter is accessible but not available in the type
  const counter = client.pipelineCounter

  return (
    <div>

      <div>
        <h2>Users</h2>
        <ul>
          {users.map(user =>
            <li key={user.username}>
              <strong>{user.username}</strong> - {user.birthday}
            </li>
          )}
        </ul>
      </div>

      <div>
        <h2>Events</h2>
        <ul>
          {events.map(event =>
            <li key={event.name}>
              <strong>{event.name}</strong> - {event.date}
            </li>
          )}
        </ul>
      </div>

      <div>
        <h2>Number of Pipelines Called:</h2> {counter}
      </div>
    </div>
  );
};

export default DataComponent;
