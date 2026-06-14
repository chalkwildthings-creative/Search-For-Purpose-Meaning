import React, { useState, useRef, useEffect } from "react";

// ── Logos — Find your why ──────────────────────────────────────────
// A reflection companion for young people who feel lost or in despair,
// grounded in Viktor Frankl's Logotherapy. Toward meaning, a future,
// and a way to contribute. Reflection tool, not therapy or crisis care.

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

CAREER & FUTURE (when they bring up their path, major, college, or work):
- This is Frankl's first road — meaning through what we GIVE. Lean into contribution, not just income or prestige: what problems move them, who they'd want to help, what they'd love to make or build, what they're doing when they lose track of time, what they'd do even if no one were watching.
- Resist the "find your one true passion" myth. Meaning in work is built through action and can be found in many paths; it is not a single hidden calling they must discover before they're allowed to move. Take the pressure off.
- Be honest about your limits: you do NOT have job-market data, salaries, required degrees, or "how to become X" specifics. You help them find the WHY. The HOW comes from real people and real information — say so plainly.
- Always close a future-or-career conversation with a bridge to action: one concrete, doable next step (talk to someone who does that work, shadow them for a day, try a small project, take one class, email one person), AND point them toward real humans who fill the practical gaps — a school or college counselor, a career center, a mentor, or someone already in the field.
- Direction without a next step is just a nice feeling. Gently help them carry it into the world.

TALENT TO IMPACT (a guided journey, when they want to use what they're good at to do some good):
Walk them through this arc gently, ONE step at a time across the conversation — never dump all the steps at once. Ask, listen, then move:
1. NAME A STRENGTH. Help them find something they're good at or drawn to. It can be ordinary — patient with little kids, good with words, fixes things, makes people laugh, notices who's left out. Everyone has one; help them see theirs.
2. FIND WHAT THEY CARE ABOUT. What problem, group, or unfairness tugs at them? Whose struggle do they notice that others walk past?
3. CONNECT THE TWO. Where could that strength meet that care? This is the heart of it — meaning lives where a talent serves something beyond the self.
4. SHAPE A SMALL PROJECT. Help them picture one concrete, doable thing: tutor a younger student, organize a drive, start a club, make something useful, help one neighbor. Small and real beats grand and vague.
5. FIND A REAL NEXT STEP. Point them to trustworthy ways to act — their school counselor or a service club, a teacher, a parent or mentor, or reputable platforms like VolunteerMatch, Idealist, or DoSomething.org, and local anchors like a library, food bank, or community center.
6. ONE COMMITMENT. Close with a single specific thing they'll do this week, and one person they'll tell.

Rules for this journey:
- Keep it INVITATIONAL, never pressuring. Doing good is an offering, not a debt; a young person's worth is never measured by output. If they're exhausted or hurting, let meaning be small and inward first.
- Do NOT invent specific local organizations, names, addresses, contacts, or events — you cannot verify them, and a wrong referral can send a young person somewhere unsafe. Suggest reputable national platforms and trusted local adults who can help them find vetted, real opportunities, and say honestly that a real person near them confirms the details.
- Whenever real-world action with other people is involved, route them through a trusted adult — a counselor, teacher, parent, or mentor.

FINDING WAYS TO DO GOOD NEAR THEM:
When a young person wants to find real places to volunteer or serve, you may offer to look for options near them.
- Ask for ONLY their city or county. Never ask for their name, age, school, street address, email, or anything else. Reassure them plainly that nothing they say is saved and the conversation is private.
- If web search results are available to you, name a few REAL local organizations that fit what they care about, each with a link, drawn ONLY from those results. Never invent organization names, addresses, missions, or contacts. Say honestly that details change, so they should confirm with the organization and a trusted adult before going.
- Always ALSO point them to trustworthy directories they can search for their own area: Idealist / VolunteerMatch (volunteermatch.org), JustServe (justserve.org), and United Way's 211 (211.org), plus local anchors like their library, food bank, or community center.
- If you have no search results, do NOT guess local names — point them to those directories and a trusted adult instead.
- Keep it tied to meaning: the goal isn't to fill hours, it's to try something that connects their gifts to something they care about and notice what it stirs in them.

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

const OPENING =
  "I'm really glad you're here. There's no wrong place to start. Maybe things feel heavy right now, or foggy, like you can't see where any of this is heading — that's okay, and it's worth talking through. We're not looking for your whole life's plan today. Just what's true for you right now. So tell me: what's been weighing on you?";

export default function App() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: OPENING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [convoMode, setConvoMode] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [showResources, setShowResources] = useState(false);
  const scrollRef = useRef(null);
  const taRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalRef = useRef("");
  const voiceOnRef = useRef(true);
  const voiceRef = useRef(null);
  const sendRef = useRef(null);
  const convoModeRef = useRef(false);
  const speakingRef = useRef(false);
  const loadingRef = useRef(false);
  const startListenRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = "auto";
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  useEffect(() => {
    voiceOnRef.current = voiceOn;
    if (!voiceOn && typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, [voiceOn]);

  // ── Set up speech-to-text (browser Web Speech API) ──────────────
  useEffect(() => {
    const SR =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setSpeechSupported(false);
      return;
    }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let interim = "";
      let finalT = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalT += t;
        else interim += t;
      }
      if (finalT) finalRef.current += finalT;
      setInput((finalRef.current + interim).trim());
    };
    rec.onend = () => {
      setListening(false);
      const text = finalRef.current.trim();
      finalRef.current = "";
      if (text) {
        sendRef.current && sendRef.current(text);
      } else if (
        convoModeRef.current &&
        !loadingRef.current &&
        !speakingRef.current
      ) {
        // In conversation mode the person just paused without speaking —
        // keep the ear open instead of ending the exchange.
        setTimeout(() => {
          if (
            convoModeRef.current &&
            !loadingRef.current &&
            !speakingRef.current
          ) {
            startListenRef.current && startListenRef.current();
          }
        }, 600);
      }
    };
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {}
    };
  }, []);

  // ── Choose the warmest natural voice the browser offers ─────────
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const en = voices.filter((v) => /^en(-|_|$)/i.test(v.lang));
      const pool = en.length ? en : voices;
      // Preference order: modern neural/natural voices first, then known
      // warm system voices, avoiding the flat default ("Microsoft David",
      // "Google US English" is fine but neural is better).
      const preferred = [
        /natural/i, /neural/i,
        /aria/i, /jenny/i, /libby/i, /sonia/i, // MS neural
        /samantha/i, /ava/i, /allison/i, /serena/i, /karen/i, /moira/i, /tessa/i, // Apple warm
        /google.*(female|en)/i,
      ];
      let chosen = null;
      for (const rx of preferred) {
        chosen = pool.find((v) => rx.test(v.name));
        if (chosen) break;
      }
      // Otherwise prefer any female-sounding / non-default voice
      if (!chosen) chosen = pool.find((v) => /female/i.test(v.name)) || pool.find((v) => v.localService === false) || pool[0];
      voiceRef.current = chosen || null;
    };
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
    return () => {
      try { window.speechSynthesis.onvoiceschanged = null; } catch {}
    };
  }, []);

  function speak(text) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      // No TTS available; in conversation mode, just reopen the mic.
      if (convoModeRef.current) startListening();
      return;
    }
    window.speechSynthesis.cancel();
    // Break into sentences so the voice pauses naturally and gently,
    // instead of reading everything in one flat, robotic stream.
    const parts =
      text.replace(/\s+/g, " ").match(/[^.!?…]+[.!?…]*/g) || [text];
    const clean = parts.map((p) => p.trim()).filter(Boolean);
    if (!clean.length) {
      if (convoModeRef.current) startListening();
      return;
    }
    speakingRef.current = true;
    setSpeaking(true);
    clean.forEach((s, i) => {
      const u = new SpeechSynthesisUtterance(s);
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = 0.88; // slower, unhurried
      u.pitch = 1.06 + (i % 2 === 0 ? 0.015 : -0.015); // warm, slight variation
      u.volume = 1.0;
      if (i === clean.length - 1) {
        u.onend = () => {
          speakingRef.current = false;
          setSpeaking(false);
          // Hands-free loop: once Logos finishes, listen again.
          if (convoModeRef.current) startListening();
        };
        u.onerror = () => {
          speakingRef.current = false;
          setSpeaking(false);
          if (convoModeRef.current) startListening();
        };
      }
      window.speechSynthesis.speak(u);
    });
  }

  function startListening() {
    if (!speechSupported || !recognitionRef.current) return;
    window.speechSynthesis?.cancel(); // don't let Logos hear itself
    finalRef.current = "";
    setInput("");
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      /* recognition already running */
    }
  }
  startListenRef.current = startListening;

  function toggleMic() {
    if (!speechSupported || !recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      return;
    }
    startListening();
  }

  function toggleConversation() {
    if (!speechSupported) return;
    if (convoMode) {
      // Stop the hands-free loop entirely.
      setConvoMode(false);
      convoModeRef.current = false;
      try { recognitionRef.current?.stop(); } catch {}
      window.speechSynthesis?.cancel();
      speakingRef.current = false;
      setSpeaking(false);
    } else {
      setConvoMode(true);
      convoModeRef.current = true;
      setVoiceOn(true); // a verbal conversation needs spoken replies
      voiceOnRef.current = true;
      startListening();
    }
  }

  async function send(override) {
    const text = (typeof override === "string" ? override : input).trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    loadingRef.current = true;
    try {
      const apiMessages = [
        { role: "user", content: SYSTEM_PROMPT + "\n\nGreet me to begin." },
        { role: "assistant", content: OPENING },
        ...next.slice(1).map((m) => ({ role: m.role, content: m.content })),
      ];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      if (!data || !Array.isArray(data.content)) {
        throw new Error(data?.error?.message || "Unexpected response");
      }
      const reply = data.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      setMessages((m) => [...m, { role: "assistant", content: reply || "…" }]);
      if (voiceOnRef.current && reply) speak(reply);
      else if (convoModeRef.current) startListening();
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Something interrupted us. (Technical detail: " +
            (e?.message || String(e)) +
            ")",
        },
      ]);
      if (convoModeRef.current) startListening();
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }
  sendRef.current = send;

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="logos-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300&display=swap');

        .logos-root {
          --ink: #2b2420;
          --ink-soft: #6b5d52;
          --paper: #f4ece1;
          --paper-2: #efe4d6;
          --ember: #c4622d;
          --ember-soft: #e0a878;
          --line: #ddccba;
          --deep: #1c1814;
          position: absolute; inset: 0;
          background:
            radial-gradient(120% 80% at 50% -10%, #faf3e8 0%, var(--paper) 55%, var(--paper-2) 100%);
          display: flex; flex-direction: column;
          font-family: 'Newsreader', Georgia, serif;
          color: var(--ink);
          overflow: hidden;
        }
        .logos-root::before {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          opacity: 0.4; mix-blend-mode: multiply; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
        }

        /* ── Welcome / intro ─────────────────────────────── */
        .intro {
          position: absolute; inset: 0; z-index: 10;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 32px 26px;
          background:
            radial-gradient(140% 90% at 50% 8%, #3a2f25 0%, #241d17 45%, var(--deep) 100%);
          color: #f3e7d6;
          animation: fade 0.7s ease both;
        }
        .intro::after {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(60% 40% at 50% 30%, rgba(224,168,120,0.18), transparent 70%);
        }
        @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
        .intro-inner { position: relative; max-width: 540px; }
        .intro-name {
          font-family: 'Fraunces', serif; font-weight: 600;
          font-size: 40px; letter-spacing: -0.01em; margin: 0 0 4px;
          color: #fbf1e3;
        }
        .intro-name .dot { color: var(--ember-soft); }
        .intro-tag {
          font-family: 'Fraunces', serif; font-style: italic; font-weight: 400;
          font-size: 17px; color: var(--ember-soft); margin: 0 0 26px;
        }
        .intro-body {
          font-size: 17px; line-height: 1.72; color: #e3d4c0;
          font-weight: 300; margin: 0 auto 14px; max-width: 460px;
        }
        .intro-body b { font-weight: 500; color: #fbf1e3; font-style: normal; }
        .intro-quote {
          font-family: 'Fraunces', serif; font-style: italic;
          font-size: 18px; line-height: 1.6; color: #f0dcc4;
          margin: 22px auto; max-width: 420px;
        }
        .intro-quote span { display: block; font-size: 12.5px; font-style: normal;
          letter-spacing: 0.08em; color: var(--ember-soft); margin-top: 10px; text-transform: uppercase; }
        .begin {
          margin-top: 26px; border: none; cursor: pointer;
          font-family: 'Fraunces', serif; font-size: 16px; font-weight: 500;
          color: #241d17; background: var(--ember-soft);
          padding: 13px 38px; border-radius: 40px;
          transition: transform .15s ease, background .15s ease;
        }
        .begin:hover { transform: translateY(-2px); background: #ecc79f; }
        .intro-note {
          margin-top: 22px; font-size: 11.5px; font-style: italic;
          color: #b29a82; line-height: 1.6; max-width: 380px; margin-left: auto; margin-right: auto;
        }
        .intro-note b { font-style: normal; font-weight: 500; color: var(--ember-soft); }

        /* ── Header ──────────────────────────────────────── */
        .logos-head {
          position: relative; z-index: 2;
          padding: 18px 24px 13px; text-align: center;
          border-bottom: 1px solid var(--line);
        }
        .logos-title {
          font-family: 'Fraunces', serif; font-weight: 500;
          font-size: 24px; letter-spacing: -0.01em; margin: 0; line-height: 1;
        }
        .logos-title .dot { color: var(--ember); }
        .logos-sub {
          margin: 6px 0 0; font-size: 13px; font-style: italic;
          color: var(--ink-soft); font-weight: 300;
        }

        .logos-scroll { position: relative; z-index: 2; flex: 1; overflow-y: auto; padding: 26px 18px 8px; }
        .logos-thread { max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .row { display: flex; animation: rise 0.5s cubic-bezier(.2,.7,.2,1) both; }
        .row.user { justify-content: flex-end; }
        @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

        .bubble { max-width: 84%; font-size: 18px; line-height: 1.6; padding: 2px 2px; }
        .bubble.assistant { color: var(--ink); }
        .bubble.user {
          background: #fff; border: 1px solid var(--line);
          border-radius: 16px 16px 4px 16px; padding: 11px 16px;
          font-size: 16.5px; color: #4a3f36; box-shadow: 0 1px 0 rgba(0,0,0,0.02);
        }
        .who {
          font-family: 'Fraunces', serif; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--ember); margin-bottom: 6px; display: block; font-weight: 500;
        }

        .think { display: flex; gap: 6px; padding: 4px 2px; }
        .think span { width: 7px; height: 7px; border-radius: 50%; background: var(--ember-soft); animation: pulse 1.3s ease-in-out infinite; }
        .think span:nth-child(2) { animation-delay: .2s; }
        .think span:nth-child(3) { animation-delay: .4s; }
        @keyframes pulse { 0%,100% { opacity: .25; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-3px); } }

        .logos-foot {
          position: relative; z-index: 2; padding: 12px 18px 16px;
          border-top: 1px solid var(--line);
          background: linear-gradient(180deg, transparent, rgba(244,236,225,0.8));
        }
        .composer {
          max-width: 640px; margin: 0 auto; display: flex; align-items: flex-end; gap: 10px;
          background: #fff; border: 1px solid var(--line); border-radius: 18px;
          padding: 8px 8px 8px 16px; box-shadow: 0 4px 24px -16px rgba(43,36,32,0.4);
        }
        .composer textarea {
          flex: 1; border: none; outline: none; resize: none; background: transparent;
          font-family: 'Newsreader', serif; font-size: 16.5px; line-height: 1.5;
          color: var(--ink); max-height: 160px; padding: 6px 0;
        }
        .composer textarea::placeholder { color: #b1a290; font-style: italic; }
        .send {
          flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; border: none; cursor: pointer;
          background: var(--ember); color: #fff; display: grid; place-items: center;
          transition: transform .15s ease, background .15s ease, opacity .15s;
        }
        .send:hover:not(:disabled) { transform: scale(1.06); background: #a9501f; }
        .send:disabled { opacity: 0.4; cursor: default; }

        .mic {
          flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid var(--line); cursor: pointer;
          background: #fff; color: var(--ink-soft); display: grid; place-items: center;
          transition: transform .15s ease, background .15s ease, color .15s ease, border-color .15s;
        }
        .mic:hover:not(:disabled) { color: var(--ember); border-color: var(--ember-soft); }
        .mic:disabled { opacity: 0.4; cursor: default; }
        .mic.on {
          background: var(--ember); color: #fff; border-color: var(--ember);
          animation: miclive 1.4s ease-in-out infinite;
        }
        @keyframes miclive {
          0%,100% { box-shadow: 0 0 0 0 rgba(196,98,45,0.45); }
          50% { box-shadow: 0 0 0 8px rgba(196,98,45,0); }
        }

        .voice-toggle {
          position: absolute; top: 16px; right: 16px;
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid var(--line); background: #fff; cursor: pointer;
          color: var(--ink-soft); display: grid; place-items: center;
          transition: color .15s, border-color .15s;
        }
        .voice-toggle:hover { color: var(--ember); border-color: var(--ember-soft); }
        .voice-toggle.on { color: var(--ember); }

        .convo-toggle {
          position: absolute; top: 14px; left: 16px;
          display: inline-flex; align-items: center; gap: 7px;
          height: 34px; padding: 0 14px 0 11px; border-radius: 40px;
          border: 1px solid var(--line); background: #fff; cursor: pointer;
          color: var(--ink-soft); font-family: 'Fraunces', serif;
          font-size: 13px; font-weight: 500;
          transition: color .15s, border-color .15s, background .15s;
        }
        .convo-toggle:hover { color: var(--ember); border-color: var(--ember-soft); }
        .convo-toggle.on {
          background: var(--ember); color: #fff; border-color: var(--ember);
          animation: miclive 1.6s ease-in-out infinite;
        }

        .talk-status {
          max-width: 640px; margin: 0 auto 10px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13.5px; color: var(--ink-soft);
          font-style: italic;
        }
        .talk-status .dot3 {
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--ink-soft); flex-shrink: 0;
        }
        .talk-status.listening .dot3 { background: var(--ember); animation: pulse 1.1s ease-in-out infinite; }
        .talk-status.speaking .dot3 { background: var(--ember); animation: pulse 0.7s ease-in-out infinite; }
        .talk-status.thinking .dot3 { background: var(--ember-soft); animation: pulse 1.4s ease-in-out infinite; }
        .talk-end {
          margin-left: auto; border: 1px solid var(--line); background: #fff;
          color: var(--ink-soft); font-family: 'Fraunces', serif; font-size: 12px;
          padding: 4px 14px; border-radius: 30px; cursor: pointer; font-style: normal;
          transition: color .15s, border-color .15s;
        }
        .talk-end:hover { color: var(--ember); border-color: var(--ember-soft); }

        .care {
          max-width: 640px; margin: 9px auto 0; text-align: center;
          font-size: 11.5px; font-style: italic; color: var(--ink-soft); line-height: 1.6;
        }
        .care b { font-style: normal; font-weight: 500; color: var(--ember); }

        .logos-scroll::-webkit-scrollbar { width: 8px; }
        .logos-scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: 8px; }

        .chips { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 2px; animation: rise 0.6s ease both; }
        .chip {
          border: 1px solid var(--line); background: #fff; cursor: pointer;
          color: var(--ink-soft); font-family: 'Newsreader', serif; font-size: 14.5px;
          padding: 9px 15px; border-radius: 30px; line-height: 1.2;
          transition: color .15s, border-color .15s, transform .12s;
        }
        .chip:hover { color: var(--ember); border-color: var(--ember-soft); transform: translateY(-1px); }

        .ways-link {
          border: none; background: none; cursor: pointer;
          font-family: 'Fraunces', serif; font-size: 12px; font-style: normal;
          color: var(--ember); letter-spacing: 0.02em;
          border-bottom: 1px dotted var(--ember-soft); padding: 0 0 1px;
        }
        .ways-link:hover { color: #a9501f; }
        .ways-overlay {
          position: absolute; inset: 0; z-index: 30;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(28,24,20,0.5); backdrop-filter: blur(3px);
          animation: fade 0.25s ease both;
        }
        .ways-card {
          position: relative; background: #fbf4ea; color: var(--ink);
          max-width: 440px; width: 100%; max-height: 82vh; overflow-y: auto;
          border-radius: 18px; padding: 26px 26px 22px;
          border: 1px solid var(--line); box-shadow: 0 30px 80px -30px rgba(28,24,20,0.6);
        }
        .ways-close {
          position: absolute; top: 12px; right: 14px; border: none; background: none;
          font-size: 26px; line-height: 1; color: var(--ink-soft); cursor: pointer;
        }
        .ways-close:hover { color: var(--ember); }
        .ways-title { font-family: 'Fraunces', serif; font-weight: 500; font-size: 22px; margin: 0 0 6px; }
        .ways-intro { font-size: 14.5px; line-height: 1.6; color: var(--ink-soft); margin: 0 0 16px; }
        .ways-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
        .ways-list li { display: flex; flex-direction: column; gap: 3px; }
        .ways-list a {
          font-family: 'Fraunces', serif; font-weight: 500; font-size: 16px;
          color: var(--ember); text-decoration: none;
        }
        .ways-list a:hover { text-decoration: underline; }
        .ways-list span { font-size: 13.5px; line-height: 1.5; color: var(--ink-soft); }
        .ways-note {
          margin: 18px 0 0; padding-top: 14px; border-top: 1px solid var(--line);
          font-size: 13px; line-height: 1.6; color: var(--ink-soft); font-style: italic;
        }
      `}</style>

      {!started && (
        <div className="intro">
          <div className="intro-inner">
            <h1 className="intro-name">Logos<span className="dot">.</span></h1>
            <p className="intro-tag">find your why</p>
            <p className="intro-body">
              In the darkest place imaginable — a Nazi concentration camp — the psychiatrist <b>Viktor Frankl</b> noticed something. The people who held onto a <b>meaning</b>, a reason to live, someone to return to, work left unfinished, were the ones who could endure almost anything.
            </p>
            <p className="intro-body">
              He came to believe our deepest need isn't comfort or success. It's <b>meaning</b> — and it can be found in any life, even one that feels lost or stuck right now.
            </p>
            <p className="intro-quote">
              “He who has a why to live can bear almost any how.”
              <span>Nietzsche — a line Frankl carried</span>
            </p>
            <p className="intro-body">
              Frankl found that we don't uncover meaning by searching inside ourselves, but by giving ourselves to something beyond us — a cause to serve, a person to love. One of the surest ways to begin is to offer your gifts to a cause you believe in. Volunteering with a group whose purpose matches your own is often where a purpose of your own first appears.
            </p>
            <p className="intro-body">
              This is a quiet place to look for your why: what's worth moving toward, and what you might give to the world. Not a plan for your whole life. Just the next true step.
            </p>
            <button className="begin" onClick={() => setStarted(true)}>Begin</button>
            <p className="intro-note">
              Logos is a reflection tool, not a therapist or crisis service. If things feel dangerous, reach out now: <b>988</b> (call or text) or text <b>HOME to 741741</b>.
            </p>
          </div>
        </div>
      )}

      <header className="logos-head">
        <h1 className="logos-title">Logos<span className="dot">.</span></h1>
        <p className="logos-sub">find your why — a meaning companion, after Viktor Frankl</p>
        <button
          className={`voice-toggle ${voiceOn ? "on" : ""}`}
          onClick={() => setVoiceOn((v) => !v)}
          aria-label={voiceOn ? "Turn off spoken replies" : "Turn on spoken replies"}
          title={voiceOn ? "Spoken replies: on" : "Spoken replies: off"}
        >
          {voiceOn ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M23 9l-6 6M17 9l6 6" />
            </svg>
          )}
        </button>
        {speechSupported && (
          <button
            className={`convo-toggle ${convoMode ? "on" : ""}`}
            onClick={toggleConversation}
            aria-label={convoMode ? "End conversation mode" : "Start talking"}
            title={convoMode ? "End hands-free conversation" : "Talk hands-free"}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h10M4 10h6M4 14h8" />
              <path d="M19 4v16M16 7v10M22 9v6" />
            </svg>
            <span>{convoMode ? "Talking" : "Talk"}</span>
          </button>
        )}
      </header>

      <div className="logos-scroll" ref={scrollRef}>
        <div className="logos-thread">
          {messages.map((m, i) => (
            <div key={i} className={`row ${m.role}`}>
              <div className={`bubble ${m.role}`}>
                {m.role === "assistant" && <span className="who">Logos</span>}
                {m.content}
              </div>
            </div>
          ))}
          {messages.length === 1 && !loading && (
            <div className="chips">
              {[
                "I feel lost about my future",
                "Help me use my talents to do some good",
                "I don't know what to study",
              ].map((c) => (
                <button key={c} className="chip" onClick={() => send(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}
          {loading && (
            <div className="row assistant">
              <div className="bubble assistant">
                <span className="who">Logos</span>
                <div className="think"><span /><span /><span /></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="logos-foot">
        {convoMode && (
          <div className={`talk-status ${listening ? "listening" : speaking ? "speaking" : loading ? "thinking" : ""}`}>
            <span className="dot3" />
            {listening
              ? "Listening — just speak"
              : loading
              ? "Thinking…"
              : speaking
              ? "Logos is speaking…"
              : "Ready"}
            <button className="talk-end" onClick={toggleConversation}>End</button>
          </div>
        )}
        <div className="composer">
          <textarea
            ref={taRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={
              listening
                ? "Listening…"
                : speaking
                ? "Speaking…"
                : "Say what's actually going on…"
            }
          />
          {speechSupported && (
            <button
              className={`mic ${listening ? "on" : ""}`}
              onClick={toggleMic}
              disabled={loading}
              aria-label={listening ? "Stop listening" : "Speak"}
              title={listening ? "Stop" : "Speak"}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
              </svg>
            </button>
          )}
          <button className="send" onClick={send} disabled={loading || !input.trim()} aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <p className="care">
          <button className="ways-link" onClick={() => setShowResources(true)}>
            Ways to do good near you
          </button>
        </p>
        <p className="care">
          Logos is a reflection tool, not a therapist or crisis service. If things feel heavy, reach out — a trusted person, the <b>988</b> Lifeline (call or text), or text <b>HOME to 741741</b>.
        </p>
      </footer>

      {showResources && (
        <div className="ways-overlay" onClick={() => setShowResources(false)}>
          <div className="ways-card" onClick={(e) => e.stopPropagation()}>
            <button className="ways-close" onClick={() => setShowResources(false)} aria-label="Close">×</button>
            <h2 className="ways-title">Ways to do good</h2>
            <p className="ways-intro">
              A few trustworthy places to start looking for real ways to help. These are national starting points — a counselor, teacher, parent, or mentor can help you find vetted options near you and confirm they are safe and real. Nothing you type here is saved.
            </p>
            <ul className="ways-list">
              <li>
                <a href="https://dosomething.org" target="_blank" rel="noopener noreferrer">DoSomething.org</a>
                <span>Built for teens and young adults — climate, mental health, justice, education. Many actions you can do from your phone, no experience needed.</span>
              </li>
              <li>
                <a href="https://www.idealist.org" target="_blank" rel="noopener noreferrer">Idealist</a>
                <span>A large, searchable database of volunteer roles by location and cause (now includes VolunteerMatch).</span>
              </li>
              <li>
                <a href="https://www.justserve.org" target="_blank" rel="noopener noreferrer">JustServe.org</a>
                <span>Find service opportunities close to where you live.</span>
              </li>
              <li>
                <a href="https://americorps.gov" target="_blank" rel="noopener noreferrer">AmeriCorps</a>
                <span>National service programs, including options for older teens and young adults.</span>
              </li>
            </ul>
            <p className="ways-note">
              Close to home, your school, library, food bank, or community center are good places to ask too. Bring a trusted adult into the plan before you go.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
