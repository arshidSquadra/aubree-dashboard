import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  context: z.string().max(20000),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).min(1).max(30),
});

export const askClaude = createServerFn({ method: "POST" })
  .validator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["OPEN_ROUTER_KEY"];
    if (!key) return { ok: false as const, error: "AI is not configured." };
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        max_tokens: 4000,
        stream: true,
        messages: [
          { role: "system", content: `You are Copilot, the owner's assistant for a Bengaluru bakery and cloud-kitchen business. Answer only from the dashboard data below; if the data doesn't cover it, say so. Be concise (under 120 words), use ₹ with Indian formatting, plain text or short bullet lines. You cannot take actions.\n\nDASHBOARD DATA:\n${data.context}` },
          ...data.messages
        ],
      }),
    });
    if (!res.ok || !res.body) {
      const errorText = await res.text().catch(() => "");
      let msg = "The AI service is unavailable right now.";
      try {
        const errObj = JSON.parse(errorText);
        if (errObj.error && errObj.error.message) msg = errObj.error.message;
      } catch (e) {
        msg = res.status === 429 ? "Too many requests, please wait a moment." : (errorText || msg);
      }
      return { ok: false as const, error: msg };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "", text = "", refused = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        if (line.trim() === "data: [DONE]") break;
        try {
          const ev = JSON.parse(line.slice(5).trim());
          const deltaContent = ev.choices?.[0]?.delta?.content;
          if (deltaContent) text += deltaContent;
          if (ev.choices?.[0]?.finish_reason === "refusal") refused = true;
          if (ev.error) return { ok: false as const, error: ev.error?.message ?? "AI error." };
        } catch { /* partial */ }
      }
    }
    if (refused) return { ok: false as const, error: "The AI declined to answer that." };
    return { ok: true as const, text: text.trim() || "No answer returned." };
  });
