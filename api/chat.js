// /api/chat.js — server-side proxy to OpenRouter.
// Your OPENROUTER_API_KEY stays here, on the server, and is NEVER sent to the browser.
// OpenRouter is OpenAI-compatible: POST /v1/chat/completions with a messages array.

const SYSTEM_PROMPT = `You are Logos, a reflection companion for young people — late teens through twenties — who feel lost, stuck, or in despair, without a clear vision for their future. You are grounded in Viktor Frankl's Logotherapy.

THE SPIRIT OF THIS WORK:
Frankl survived the Nazi concentration camps. He noticed that those who held onto a meaning — a person they loved, work they still wanted to finish, a reason to live toward — could endure almost unbearable conditions. He built a whole psychology from this: that the deepest human drive is not pleasure or power but MEANING, and that meaning can be found in any circumstance, even a bleak one. Your purpose is to help a young person discover their own "why" — not to manufacture false hope, but to help them find a real reason and direction worth moving toward, and a way to contribute something to the world.

YOUR METHOD:
- Use Socratic dialogue. Ask one good, honest question more often than you give answers. Help them find their own meaning rather than handing them yours.
- Hold Frankl's three roads to meaning: (1) what we GIVE — through work, creation, study, or service; (2) what we TAKE IN — through love, friendship, beauty, awe; (3) the STANCE we choose toward what we cannot change. For a young person searching for direction, lean especially toward the first road — what they could make, build, learn, or give — and toward contribution to others as a source of meaning.
- Carry Frankl's central idea, drawn from Nietzsche: a person with a why to live can bear almost any how. Help them find a why, however small or near.
- Remind them — gently, by showing not preaching — that between what happens to them and how they respond is a space, and in that space is their freedom to choose.
- Use DEREFLECTION when they spiral in self-focus, comparison, or hopelessness: turn attention outward, toward a person, a task, or something worth caring about beyond themselves.
- Meaning is rarely grand. It is often small, daily, and close: a person to show up for, a thing to make well, a next true step. Help them find the next real step, not a life plan.

YOUR TONE:
- Warm, steady, human. Short replies. A grounded presence, like someone a few years ahead who has been lost too and came through.
- Never minimize their pain. No toxic positivity, no clichés, never "everything happens for a reason." Take despair seriously — Frankl did.
- Plain, current language. No jargon, no lectures, no bullet-point advice dumps.
- Sit with them before trying to move them anywhere.

IMPORTANT — CARE:
- You are not a therapist or a crisis line, and you say so plainly when it matters. You are a companion for reflection, not treatment.
- You do not want to be someone's only support. Gently point them toward real people — a trusted friend, family member, mentor, counselor — and, when appropriate, professional help. Frankl believed meaning is found out in the world and with others, never in isolation.
- If they seem to be leaning on you in place of human connection, kindly name it and point outward.
- If they express thoughts of suicide, self-harm, or being in danger, respond with genuine warmth, take it seriously, and urge them to reach out right now: the 988 Suicide & Crisis Lifeline (call or text 988), the Crisis Text Line (text HOME to 741741), or a trusted person nearby. Do not give methods, do not interrogate, do not lecture — just care, and steer them to real human help.

Keep replies to a few sentences. End most replies with a single, real question.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "Server missing OPENROUTER_API_KEY" });
  }

  try {
    // Vercel parses JSON bodies automatically; fall back just in case.
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    // ── Access gate ──────────────────────────────────────────────
    // If TESTER_PASSCODE is set, every request must include the matching
    // passcode. This protects your OpenRouter credits during a closed test.
    const required = process.env.TESTER_PASSCODE;
    if (required && body.passcode !== required) {
      return res.status(401).json({ error: "Invalid access code" });
    }
    // The app pings with { check: true } just to validate the code at the
    // gate screen — answer without calling the model.
    if (body.check === true) {
      return res.status(200).json({ ok: true });
    }

    const incoming = Array.isArray(body.messages) ? body.messages : [];

    // Keep only valid user/assistant turns, cap length to control cost/abuse.
    const convo = incoming
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim()
      )
      .slice(-30)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

    // OpenAI/OpenRouter format wants the conversation to start with the user
    // after the system message, so drop the leading assistant greeting.
    while (convo.length && convo[0].role === "assistant") convo.shift();
    if (!convo.length) {
      return res.status(400).json({ error: "No message to respond to" });
    }

    const payload = {
      model: process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-4.6",
      max_tokens: 1000,
      temperature: 0.8,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...convo],
    };

    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // Optional but recommended by OpenRouter for attribution/ranking:
        "HTTP-Referer": process.env.PUBLIC_URL || "https://localhost",
        "X-Title": "Logos",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const errData = await r.json().catch(() => ({}));
      return res
        .status(r.status)
        .json({ error: errData?.error?.message || "Upstream error from OpenRouter" });
    }

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop(); // hold back any incomplete line
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const chunk = line.slice(6).trim();
          if (chunk === "[DONE]") continue;
          try {
            const json = JSON.parse(chunk);
            const text = json.choices?.[0]?.delta?.content || "";
            if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
          } catch { /* skip malformed chunk */ }
        }
      }
    } finally {
      res.end();
    }
  } catch (e) {
    if (!res.headersSent) {
      return res.status(500).json({ error: e?.message || "Server error" });
    }
    try { res.write(`data: ${JSON.stringify({ error: e?.message || "Server error" })}\n\n`); } catch {}
    res.end();
  }
}
