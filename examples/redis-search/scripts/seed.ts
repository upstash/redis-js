#!/usr/bin/env tsx

import { seedDatabase } from "../lib/seed";

async function main() {
  console.log("Starting seed script...\n");
  
  const result = await seedDatabase();
  
  for (const log of result.logs) {
    console.log(log);
  }
  
  process.exit(result.success ? 0 : 1);
}

main();
