import { Worker } from "bullmq";
import twilio from "twilio";
import { alreadySent, markSent } from "./idempotency.js";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const worker = new Worker(
  "sms",
  async (job) => {
    const { id, phone, message } = job.data;
    const key = `${id}-sms`;

    if (await alreadySent(key)) {
      console.log(`job ${job.id}: already sent, skipping`);
      return;
    }

    const sms = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
      body: message,
    });

    await markSent(key);
    console.log(`job ${job.id}: sent sms ${sms.sid}`);
  },
  { connection: { host: "127.0.0.1", port: 6379 } },
);

worker.on("failed", (job, err) => {
  console.log(`job ${job.id}: attempt ${job.attemptsMade} failed - ${err.message}`);
});

console.log("sms worker running");
