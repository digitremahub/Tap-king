"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const TapGame = dynamic(() => import("../components/TapGame"), { ssr: false });

export default function Home() {
  const [best, setBest] = useState(0);
  const [last, setLast] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<"solo" | "challenge">("solo");

  useEffect(() => {
    setBest(Number(localStorage.getItem("tapking-best") || 0));
  }, []);

  function finish(height: number) {
    setLast(height);
    setBest((old) => {
      const next = Math.max(old, height);
      localStorage.setItem("tapking-best", String(next));
      return next;
    });
    setPlaying(false);
  }

  async function share() {
    const text = `J'ai atteint ${last ?? best} mètres sur TAP KING 👑 À toi de me battre !`;
    if (navigator.share) {
      try { await navigator.share({ title: "TAP KING", text, url: location.href }); } catch {}
    } else {
      await navigator.clipboard?.writeText(`${text} ${location.href}`);
      alert("Défi copié !");
    }
  }

  return <main className="shell">
    <header className="topbar">
      <a className="brand" href="/">👑 TAP KING</a>
      <div className="best-pill">RECORD <b>{best} m</b></div>
    </header>
    <section className="hero">
      <div className="eyebrow">LE DÉFI D'ASCENSION</div>
      <h1>PLUS HAUT.<br/><span>PLUS VITE.</span></h1>
      <p>Tape, récupère des bonus et évite la chute. Jusqu'où peux-tu grimper ?</p>
    </section>

    {!playing ? <section className="start-card">
      <div className="mascot" aria-label="Canard roi">🦆<span>👑</span></div>
      <div className="mode-switch">
        <button className={mode === "solo" ? "selected" : ""} onClick={() => setMode("solo")}>SOLO</button>
        <button className={mode === "challenge" ? "selected" : ""} onClick={() => setMode("challenge")}>DÉFI AMI</button>
      </div>
      <h2>{last === null ? "Prêt à décoller ?" : `Tu as grimpé ${last} mètres !`}</h2>
      <p>{mode === "solo" ? "20 secondes pour atteindre le sommet." : "Le mode duel en ligne arrive dans la prochaine version. En attendant, bats ton record !"}</p>
      <button className="primary" onClick={() => setPlaying(true)}>🚀 COMMENCER</button>
      {last !== null && <button className="share" onClick={share}>Partager mon résultat ↗</button>}
      <div className="stats"><div><b>{best}</b><small>RECORD PERSONNEL</small></div><div><b>20s</b><small>DURÉE DU RUN</small></div><div><b>4</b><small>BONUS</small></div></div>
    </section> : <TapGame onFinish={finish} />}
    <footer>VERSION PROTOTYPE 0.1 · Les scores sont enregistrés sur cet appareil.</footer>
  </main>;
}