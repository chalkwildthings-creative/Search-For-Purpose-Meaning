import React, { useState, useRef, useEffect } from "react";

// ── Logos — Find your why ──────────────────────────────────────────
// A reflection companion for young people who feel lost or in despair,
// grounded in Viktor Frankl's Logotherapy. Toward meaning, a future,
// and a way to contribute. Reflection tool, not therapy or crisis care.

// The system prompt lives server-side in /api/chat.js so it stays out of the browser bundle.


const OPENING =
  "I'm really glad you're here. There's no wrong place to start. Maybe things feel heavy right now, or foggy, like you can't see where any of this is heading — that's okay, and it's worth talking through. We're not looking for your whole life's plan today. Just what's true for you right now. So tell me: what's been weighing on you?";

export default function App() {
  const [started, setStarted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [gateError, setGateError] = useState("");
  const passcodeRef = useRef("");
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, passcode: passcodeRef.current }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Unexpected response");
      }

      // Always consume as SSE stream
      let fullText = "";
      let isFirst = true;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let parsed;
          try { parsed = JSON.parse(line.slice(6)); } catch { continue; }
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.text) {
            fullText += parsed.text;
            if (isFirst) {
              isFirst = false;
              setMessages((m) => [...m, { role: "assistant", content: fullText }]);
            } else {
              setMessages((m) => {
                const updated = [...m];
                updated[updated.length - 1] = { role: "assistant", content: fullText };
                return updated;
              });
            }
          }
        }
      }
      const reply = fullText.trim();
      if (voiceOnRef.current && reply) speak(reply);
      else if (convoModeRef.current) startListening();
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Something interrupted us. (" + (e?.message || String(e)) + ")",
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

  async function submitCode() {
    const c = code.trim();
    if (!c || checking) return;
    setChecking(true);
    setGateError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ check: true, passcode: c }),
      });
      if (res.ok) {
        passcodeRef.current = c;
        setUnlocked(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setGateError(data?.error || "That code didn't work. Try again.");
      }
    } catch {
      setGateError("Couldn't reach the server. Try again in a moment.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="logos-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300&family=Inter:wght@400;500;600&display=swap');

        .logos-root {
          --ink: #2b2420;
          --ink-soft: #6b5d52;
          --paper: #f4ece1;
          --paper-2: #efe4d6;
          --ember: #c4622d;
          --ember-soft: #e0a878;
          --line: #ddccba;
          --deep: #1c1814;
          --sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --radius: 14px;
          --radius-pill: 999px;
          position: absolute; inset: 0;
          background:
            radial-gradient(120% 80% at 50% -10%, #faf3e8 0%, var(--paper) 55%, var(--paper-2) 100%);
          display: flex; flex-direction: column;
          font-family: 'Newsreader', Georgia, serif;
          color: var(--ink);
          overflow: hidden;
        }
        .logos-root *:focus-visible {
          outline: 2px solid var(--ember);
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .logos-root *, .logos-root *::before, .logos-root *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
        .logos-root::before {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          opacity: 0.4; mix-blend-mode: multiply; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
        }

        /* ── Gate ────────────────────────────────────────── */
        .gate {
          position: absolute; inset: 0; z-index: 20;
          display: flex; align-items: center; justify-content: center;
          text-align: center; padding: 32px 26px;
          background: radial-gradient(140% 90% at 50% 8%, #3a2f25 0%, #241d17 45%, var(--deep) 100%);
          color: #f3e7d6; animation: fade 0.6s ease both;
        }
        .gate-inner { position: relative; max-width: 380px; width: 100%; }
        .gate-msg {
          font-size: 15px; line-height: 1.6; color: #e3d4c0; font-weight: 300;
          margin: 4px auto 20px; max-width: 320px;
        }
        .gate-input {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.06); border: 1px solid #5a4a3a;
          border-radius: var(--radius); padding: 13px 16px; color: #fbf1e3;
          font-family: 'Newsreader', serif; font-size: 16px; text-align: center;
          letter-spacing: 0.04em; outline: none; transition: border-color .15s;
        }
        .gate-input:focus { border-color: var(--ember-soft); }
        .gate-input::placeholder { color: #97836c; }
        .gate-error { color: #e88a5a; font-size: 13px; margin: 12px 0 0; font-style: italic; }
        .gate .begin { margin-top: 18px; }
        .gate .begin:disabled { opacity: 0.45; cursor: default; transform: none; }

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
        .intro-quote span { display: block; font-family: var(--sans); font-size: 11.5px; font-style: normal;
          letter-spacing: 0.08em; color: var(--ember-soft); margin-top: 10px; text-transform: uppercase; }
        .begin {
          margin-top: 26px; border: none; cursor: pointer;
          font-family: 'Fraunces', serif; font-size: 16px; font-weight: 500;
          color: #241d17; background: var(--ember-soft);
          padding: 13px 38px; border-radius: var(--radius-pill);
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
          border-radius: var(--radius) var(--radius) 4px var(--radius); padding: 11px 16px;
          font-size: 16.5px; color: #4a3f36; box-shadow: 0 1px 0 rgba(0,0,0,0.02);
        }
        .who {
          font-family: var(--sans); font-size: 11px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--ember); margin-bottom: 6px; display: block; font-weight: 600;
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
          background: #fff; border: 1px solid var(--line); border-radius: var(--radius);
          padding: 8px 8px 8px 16px; box-shadow: 0 4px 24px -16px rgba(43,36,32,0.4);
        }
        .composer textarea {
          flex: 1; border: none; outline: none; resize: none; background: transparent;
          font-family: 'Newsreader', serif; font-size: 16.5px; line-height: 1.5;
          color: var(--ink); max-height: 160px; padding: 6px 0;
        }
        .composer textarea::placeholder { color: #b1a290; font-style: italic; }
        .send {
          flex-shrink: 0; width: 40px; height: 40px; border-radius: var(--radius-pill); border: none; cursor: pointer;
          background: var(--ember); color: #fff; display: grid; place-items: center;
          transition: transform .15s ease, background .15s ease, opacity .15s;
        }
        .send:hover:not(:disabled) { transform: scale(1.06); background: #a9501f; }
        .send:disabled { opacity: 0.4; cursor: default; }

        .mic {
          flex-shrink: 0; width: 40px; height: 40px; border-radius: var(--radius-pill);
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
          width: 34px; height: 34px; border-radius: var(--radius-pill);
          border: 1px solid var(--line); background: #fff; cursor: pointer;
          color: var(--ink-soft); display: grid; place-items: center;
          transition: color .15s, border-color .15s;
        }
        .voice-toggle:hover { color: var(--ember); border-color: var(--ember-soft); }
        .voice-toggle.on { color: var(--ember); }

        .convo-toggle {
          position: absolute; top: 14px; left: 16px;
          display: inline-flex; align-items: center; gap: 7px;
          height: 34px; padding: 0 14px 0 11px; border-radius: var(--radius-pill);
          border: 1px solid var(--line); background: #fff; cursor: pointer;
          color: var(--ink-soft); font-family: var(--sans);
          font-size: 13px; font-weight: 600;
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
          font-family: var(--sans); font-size: 13px; color: var(--ink-soft);
          font-style: normal;
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
          color: var(--ink-soft); font-family: var(--sans); font-size: 12px; font-weight: 500;
          padding: 4px 14px; border-radius: var(--radius-pill); cursor: pointer; font-style: normal;
          transition: color .15s, border-color .15s;
        }
        .talk-end:hover { color: var(--ember); border-color: var(--ember-soft); }

        .care {
          max-width: 640px; margin: 9px auto 0; text-align: center;
          font-size: 11.5px; font-style: italic; color: var(--ink-soft); line-height: 1.6;
        }
        .care b { font-style: normal; font-weight: 500; color: var(--ember); }

        .logos-scroll::-webkit-scrollbar { width: 8px; }
        .logos-scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: var(--radius-pill); }
      `}</style>

      {!unlocked && (
        <div className="gate">
          <div className="gate-inner">
            <h1 className="intro-name">Logos<span className="dot">.</span></h1>
            <p className="intro-tag">find your why</p>
            <p className="gate-msg">This is a private test. Enter your access code to continue.</p>
            <input
              className="gate-input"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitCode()}
              placeholder="Access code"
              autoFocus
            />
            {gateError && <p className="gate-error">{gateError}</p>}
            <button className="begin" onClick={submitCode} disabled={checking || !code.trim()}>
              {checking ? "Checking…" : "Enter"}
            </button>
            <p className="intro-note">
              Logos is a reflection tool, not a therapist or crisis service. If things feel dangerous, reach out now: <b>988</b> (call or text) or text <b>HOME to 741741</b>.
            </p>
          </div>
        </div>
      )}

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
          {loading && messages[messages.length - 1]?.role !== "assistant" && (
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
          Logos is a reflection tool, not a therapist or crisis service. If things feel heavy, reach out — a trusted person, the <b>988</b> Lifeline (call or text), or text <b>HOME to 741741</b>.
        </p>
      </footer>
    </div>
  );
}
