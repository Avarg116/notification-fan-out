import { Worker } from "bullmq";
import { alreadySent, markSent } from "./idempotency.js";

const worker = new Worker(
  "push",
  async (job) => {
    const { id, message } = job.data;
    const key = `${id}-push`;

    if (await alreadySent(key)) {
      console.log(`job ${job.id}: already sent, skipping`);
      return;
    }

    console.log(`job ${job.id}: mock push sent - ${message}`);
    await markSent(key);
  },
  { connection: { host: "127.0.0.1", port: 6379 } },
);

worker.on("failed", (job, err) => {
  console.log(`job ${job.id}: attempt ${job.attemptsMade} failed - ${err.message}`);
});

console.log("push worker running");
