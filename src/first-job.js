import { Queue } from "bullmq";

const queue = new Queue("test-queue", {
  connection: { host: "127.0.0.1", port: 6379 },
});

const job = await queue.add("test-job", { message: "hello from bullmq" });
console.log("added job:", job.id);

console.log("waiting jobs:", await queue.getWaitingCount());

await queue.close();
