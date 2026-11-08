import { Worker } from "bullmq";
import { Resend } from "resend";
import { alreadySent, markSent } from "./idempotency.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const worker = new Worker(
  "email",
  async (job) => {
    const { id, email, message } = job.data;
    const key = `${id}-email`;

    if (await alreadySent(key)) {
      console.log(`job ${job.id}: already sent, skipping`);
      return;
    }

    const { data, error } = await resend.emails.send(
      {
        from: "onboarding@resend.dev",
        to: email,
        subject: "New notification",
        text: message,
      },
      { idempotencyKey: key },
    );

    if (error) {
      throw new Error(error.message);
    }

    await markSent(key);
    console.log(`job ${job.id}: sent email ${data.id}`);
  },
  { connection: { host: "127.0.0.1", port: 6379 } },
);

worker.on("failed", (job, err) => {
  console.log(`job ${job.id}: attempt ${job.attemptsMade} failed - ${err.message}`);
});

console.log("email worker running");
