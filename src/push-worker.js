import { Worker } from "bullmq";

const worker = new Worker(
  "push",
  async (job) => {
    console.log(`job ${job.id}: mock push sent - ${job.data.message}`);
  },
  { connection: { host: "127.0.0.1", port: 6379 } },
);

worker.on("failed", (job, err) => {
  console.log(`job ${job.id}: attempt ${job.attemptsMade} failed - ${err.message}`);
});

console.log("push worker running");
