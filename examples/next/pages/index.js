import { Redis } from "@upstash/redis"
import { useState } from "react"

function HomePage({ count }) {
  const [cacheCount, setCacheCount] = useState(count)

  const incr = async () => {
    const response = await fetch("/api/incr", {
      method: "GET",
    })
    const data = await response.json()
    setCacheCount(data.count)
  }

  const decr = async () => {
    const response = await fetch("/api/decr", {
      method: "GET",
    })
    const data = await response.json()
    setCacheCount(data.count)
  }

  return (
    <div>
      <h2>Count: {cacheCount}</h2>
      <button type="button" onClick={incr}>
        increment
      </button>
      <button type="button" onClick={decr}>
        decrement
      </button>
    </div>
  )
}

export async function getStaticProps() {
  const redis = Redis.fromEnv()

  let count = 0
  count = await redis.incr("nextjs").catch((e) => {
    console.error(e)
  })

  return {
    props: { count },
  }
}

export default HomePage
