import { Redis } from "ioredis";

const redis = new Redis("redis://127.0.0.1:6379");

const ONE_DAY = 60 * 60 * 24;

export async function alreadySent(key) {
  return (await redis.exists(`sent:${key}`)) === 1;
}

export async function markSent(key) {
  await redis.set(`sent:${key}`, "1", "EX", ONE_DAY);
}
