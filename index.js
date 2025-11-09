import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 動作チェック用
app.get("/", (req, res) => {
  res.send("LINE Webhook is running!");
});

// Webhook受信
app.post("/api/line/webhook", async (req, res) => {
  try {
    const events = req.body.events ?? [];

    for (const e of events) {
      if (e.type === "message" && e.message.type === "text") {
        const msg = e.message.text;
        const replyToken = e.replyToken;

        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            replyToken,
            messages: [{ type: "text", text: `受け取りました: ${msg}` }],
          }),
        });
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("Error");
  }
});

export default app;
