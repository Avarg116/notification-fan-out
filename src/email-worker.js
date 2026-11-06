import { Worker } from "bullmq";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const worker = new Worker(
  "notifications",
  async (job) => {
    const { email, message } = job.data;

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "New notification",
      text: message,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log(`job ${job.id}: sent email ${data.id}`);
  },
  { connection: { host: "127.0.0.1", port: 6379 } },
);

worker.on("failed", (job, err) => {
  console.log(`job ${job.id}: failed - ${err.message}`);
});

console.log("email worker running");
