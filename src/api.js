import express from "express";
import { Queue } from "bullmq";

const app = express();
app.use(express.json());

const queue = new Queue("notifications", {
  connection: { host: "127.0.0.1", port: 6379 },
});

app.post("/notifications", async (req, res) => {
  const { email, message } = req.body ?? {};

  if (!email || !message) {
    return res.status(400).json({ error: "email and message are required" });
  }

  const job = await queue.add("notification-requested", { email, message });

  res.status(202).json({ jobId: job.id });
});

app.listen(3000, () => {
  console.log("api running on http://localhost:3000");
});
