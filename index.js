app.post("/api/line/webhook", async (req, res) => {
  try {
    const events = req.body.events;
    for (const e of events) {
      if (e.type === "message" && e.message.type === "text") {
        const msg = e.message.text.trim();
        const replyToken = e.replyToken;
        let replyText = "お問い合わせありがとうございます！";

        if (/サポート|問い合わせ/i.test(msg)) {
          replyText = "メッセージありがとうございます！\n申し訳ありませんが、このアカウントでは個別のお問い合わせを受け付けておりません。\n次の配信までお待ちください😊";
        } else if (/今日の運勢/i.test(msg)) {
          replyText = "🔮今日の運勢：最高の1日になる予感です！✨";
        } else if (/方位/i.test(msg)) {
          replyText = "📍方位ナビはこちら→ https://example.com/houi";
        }

        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            replyToken,
            messages: [{ type: "text", text: replyText }],
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
