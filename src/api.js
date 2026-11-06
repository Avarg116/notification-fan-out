import { randomUUID } from "node:crypto";
import express from "express";
import { Queue } from "bullmq";

const app = express();
app.use(express.json());

const connection = { host: "127.0.0.1", port: 6379 };

const emailQueue = new Queue("email", { connection });
const pushQueue = new Queue("push", { connection });
const smsQueue = new Queue("sms", { connection });

app.post("/notifications", async (req, res) => {
  const { email, phone, message } = req.body ?? {};

  if (!email || !phone || !message) {
    return res.status(400).json({ error: "email, phone and message are required" });
  }

  const event = { id: randomUUID(), email, phone, message };

  await emailQueue.add("notification-requested", event);
  await pushQueue.add("notification-requested", event);
  await smsQueue.add("notification-requested", event);

  res.status(202).json({ notificationId: event.id });
});

app.listen(3000, () => {
  console.log("api running on http://localhost:3000");
});
