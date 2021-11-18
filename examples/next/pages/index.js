import { auth, incr } from '@upstash/redis';
import { useState } from 'react';

function HomePage({ count }) {
  const [cacheCount, setCacheCount] = useState(count);

  const incr = async () => {
    const response = await fetch('/api/incr', {
      method: 'GET',
    });
    const data = await response.json();
    setCacheCount(data.count);
  };

  return (
    <div>
      <h2>Count: {cacheCount}</h2>
      <button type="button" onClick={incr}>
        increment
      </button>
    </div>
  );
}

export async function getStaticProps() {
  auth({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    edgeUrl: process.env.UPSTASH_REDIS_EDGE_URL,
  });

  let count = 0;
  try {
    const response = await incr('nextjs');
    if (response.error) throw response.error;
    count = response.data;
  } catch (e) {
    console.log(e);
  }

  return {
    props: { count },
  };
}

export default HomePage;
