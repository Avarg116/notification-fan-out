import { Redis } from "ioredis";

const redis = new Redis("redis://127.0.0.1:6379");

console.log(await redis.ping());

await redis.set("hello", "world");
console.log(await redis.get("hello"));

await redis.quit();
