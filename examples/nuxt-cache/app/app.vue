<template>
  <main>
    <h1>Nuxt cache on Upstash Redis</h1>
    <ul>
      <li><a href="/api/products/42">/api/products/42</a> (defineCachedFunction)</li>
      <li><a href="/api/stats">/api/stats</a> (defineCachedEventHandler)</li>
      <li><a href="/api/leaderboard">/api/leaderboard</a> (swr route rule)</li>
    </ul>
  </main>
</template>
