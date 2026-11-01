"use client";

import { useEffect, useRef, useState } from "react";

type Props = { onFinish: (height: number) => void };
type Bonus = "rocket" | "shield" | "wings" | "spring" | null;

export default function TapGame({ onFinish }: Props) {
  const [time, setTime] = useState(20);
  const [height, setHeight] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bonus, setBonus] = useState<Bonus>(null);
  const [shield, setShield] = useState(false);
  const [message, setMessage] = useState("TAPE POUR GRIMPER !");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [obstacle, setObstacle] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const bonusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heightRef = useRef(0);
  const comboRef = useRef(0);
  const shieldRef = useRef(false);
  const finishedRef = useRef(false);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
    if (bonusTimer.current) clearTimeout(bonusTimer.current);
  }, []);

  function start() {
    if (started) return;
    setStarted(true);
    timer.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          if (timer.current) clearInterval(timer.current);
          finishedRef.current = true;
          setFinished(true);
          onFinish(heightRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    scheduleObstacle();
  }

  function scheduleObstacle() {
    const delay = 1700 + Math.random() * 1900;
    bonusTimer.current = setTimeout(() => {
      if (finishedRef.current) return;
      setObstacle(true);
      setMessage("⚠️ PLATEFORME INSTABLE : ATTENDS LE SIGNAL !");
      setTimeout(() => {
        setObstacle(false);
        setMessage("TAPE POUR GRIMPER !");
        scheduleObstacle();
      }, 850);
    }, delay);
  }

  function tap() {
    if (finishedRef.current) return;
    if (!started) start();
    if (obstacle) {
      if (shieldRef.current) {
        shieldRef.current = false; setShield(false);
        setMessage("🛡️ BOUCLIER ACTIVÉ !");
      } else {
        heightRef.current = Math.max(0, heightRef.current - 8);
        comboRef.current = 0;
        setHeight(heightRef.current);
        setCombo(0);
        setMessage("💥 CHUTE DE 8 MÈTRES !");
      }
      setObstacle(false);
      return;
    }
    comboRef.current += 1;
    const multiplier = comboRef.current >= 10 ? 1.5 : comboRef.current >= 5 ? 1.2 : 1;
    const gain = bonus === "wings" ? 2 : multiplier;
    heightRef.current += gain;
    setHeight(Math.floor(heightRef.current));
    setCombo(comboRef.current);
    setMessage(comboRef.current >= 10 ? "🔥 COMBO MAX !" : "BIEN JOUÉ !");
    if (comboRef.current === 5 || comboRef.current === 10) setMessage(`🔥 COMBO x${multiplier} !`);
    if (bonus === "wings" && comboRef.current % 4 === 0) setBonus(null);

    if (Math.random() < 0.085 && !bonus) {
      const choices: Exclude<Bonus, null>[] = ["rocket", "shield", "wings", "spring"];
      const found = choices[Math.floor(Math.random() * choices.length)];
      setBonus(found);
      setMessage(({rocket:"🚀 FUSÉE COLLECTÉE !",shield:"🛡️ BOUCLIER COLLECTÉ !",wings:"🪽 AILES COLLECTÉES !",spring:"🌀 RESSORT COLLECTÉ !"})[found]);
    }
  }

  function useBonus() {
    if (!bonus || finishedRef.current) return;
    if (bonus === "rocket") {
      heightRef.current += 8; setHeight(Math.floor(heightRef.current));
      setMessage("🚀 FUSÉE : +8 MÈTRES !");
    } else if (bonus === "shield") {
      shieldRef.current = true; setShield(true);
      setMessage("🛡️ BOUCLIER ÉQUIPÉ !");
    } else if (bonus === "wings") {
      setMessage("🪽 AILES : PROCHAINS TAPS DOUBLÉS !");
    } else if (bonus === "spring") {
      heightRef.current += 4; setHeight(Math.floor(heightRef.current));
      setMessage("🌀 RESSORT : +4 MÈTRES !");
    }
    setBonus(null);
  }

  // The duck climbs while platforms scroll downward at a slower rate.
  // Both offsets follow the real score, so a fall reverses the movement smoothly.
  const climbOffset = Math.min(height * 7, 190);
  const sceneryOffset = height * 3.5;

  return <section className="game-card">
    <div className="game-hud"><div><small>ALTITUDE</small><b>{height} m</b></div><div className="timer"><small>TEMPS</small><b>{time}s</b></div><div><small>COMBO</small><b>x{combo >= 10 ? "1.5" : combo >= 5 ? "1.2" : "1"}</b></div></div>
    <div className="tower">
      <div className="cloud cloud-a">☁️</div><div className="cloud cloud-b">☁️</div>
      <div className="height-marker">ÉTAGE {Math.floor(height / 10) + 1}</div>
      <div className="tower-world" style={{ transform: `translateY(${sceneryOffset}px)` }}><div className="platform p1"></div><div className="platform p2"></div><div className="platform p3"></div><div className="platform p4"></div><div className="platform p5"></div></div>
      <div className={`duck ${obstacle ? "wobble" : ""}`} style={{ bottom: `${58 + climbOffset}px` }}>🦆<span>👑</span></div>
      <div className="tower-floor">🏰</div>
      {obstacle && <div className="warning">⚠️ ATTENDS !</div>}
    </div>
    <div className="status">{message}</div>
    <button className={`tap-button ${obstacle ? "danger" : ""}`} onPointerDown={(e) => { e.preventDefault(); tap(); }} disabled={finished}>
      {finished ? "TERMINÉ" : obstacle ? "ATTENDS LE SIGNAL" : "TAPE ICI !"}
    </button>
    <div className="bonus-row">
      <div className="bonus-slot">{bonus ? <><span>{({rocket:"🚀",shield:"🛡️",wings:"🪽",spring:"🌀"})[bonus]}</span><button onClick={useBonus}>UTILISER</button></> : <small>COLLECTE UN BONUS</small>}</div>
      <div className="bonus-slot"><span>{shield ? "🛡️" : "✨"}</span><small>{shield ? "PROTECTION ACTIVE" : "VISE LES BONUS"}</small></div>
    </div>
    {finished && <div className="end-overlay"><h2>FIN DE LA MANCHE !</h2><strong>{height} MÈTRES</strong><p>Tu peux faire mieux. Relance un run !</p><button className="primary" onClick={() => onFinish(height)}>VOIR MON SCORE</button></div>}
  </section>;
}