import { Worker } from "bullmq";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const worker = new Worker(
  "sms",
  async (job) => {
    const { phone, message } = job.data;

    const sms = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
      body: message,
    });

    console.log(`job ${job.id}: sent sms ${sms.sid}`);
  },
  { connection: { host: "127.0.0.1", port: 6379 } },
);

worker.on("failed", (job, err) => {
  console.log(`job ${job.id}: failed - ${err.message}`);
});

console.log("sms worker running");
