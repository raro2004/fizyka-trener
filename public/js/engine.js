// engine.js — silnik obliczeń obwodów elektrycznych
// Reprezentacja sieci: liść = liczba (Ω) lub obiekt {id, R}
//                      węzeł = {type: "s"|"p", children: [...]}
// Pomocnicze: ["s", a, b, ...] / ["p", a, b, ...] są zamieniane na obiekty.

(function (global) {
  "use strict";

  function isLeaf(n) {
    return typeof n === "number" || (n && typeof n === "object" && "R" in n && !n.children);
  }
  function leafR(n) { return typeof n === "number" ? n : n.R; }
  function leafId(n) { return typeof n === "number" ? null : n.id; }

  // Normalizacja: zamienia tablice na obiekty {type, children}
  function normalize(net) {
    if (Array.isArray(net)) {
      const t = net[0];
      if (t !== "s" && t !== "p") throw new Error("Nieznany typ: " + t);
      return { type: t, children: net.slice(1).map(normalize) };
    }
    return net;
  }

  // Oblicz Rz
  function Rz(net) {
    net = normalize(net);
    if (isLeaf(net)) return leafR(net);
    if (net.type === "s") {
      return net.children.reduce((s, c) => s + Rz(c), 0);
    }
    if (net.type === "p") {
      const sum = net.children.reduce((s, c) => s + 1 / Rz(c), 0);
      return 1 / sum;
    }
    throw new Error("Zły węzeł");
  }

  // Rozwiąż obwód: dla zadanego napięcia U na zaciskach całej sieci,
  // zwróć drzewo z {U, I, R} dla każdego elementu.
  function solve(net, U) {
    net = normalize(net);
    const Rtotal = Rz(net);
    const I = U / Rtotal;
    return _solveNode(net, U, I);
  }
  function _solveNode(net, U, I) {
    if (isLeaf(net)) {
      return { type: "leaf", id: leafId(net), R: leafR(net), U, I };
    }
    if (net.type === "s") {
      // Każdy element ma to samo I (= I wpadające), ale różne U
      const children = net.children.map(c => {
        const Rc = Rz(c);
        const Uc = I * Rc;
        return _solveNode(c, Uc, I);
      });
      return { type: "s", U, I, R: Rz(net), children };
    }
    if (net.type === "p") {
      // Każdy element ma to samo U, ale różne I
      const children = net.children.map(c => {
        const Rc = Rz(c);
        const Ic = U / Rc;
        return _solveNode(c, U, Ic);
      });
      return { type: "p", U, I, R: Rz(net), children };
    }
  }

  // Spłaszcz wyniki do tablicy {id, R, U, I} dla każdego liścia
  function flattenSolution(sol, out) {
    out = out || [];
    if (sol.type === "leaf") {
      out.push({ id: sol.id, R: sol.R, U: sol.U, I: sol.I });
    } else {
      sol.children.forEach(c => flattenSolution(c, out));
    }
    return out;
  }

  // Wygeneruj kroki rozwiązania (tekst po polsku) dla obliczenia Rz
  function explainRz(net, indent) {
    net = normalize(net);
    indent = indent || 0;
    const pad = "  ".repeat(indent);
    if (isLeaf(net)) {
      const id = leafId(net);
      const label = id ? `R${id}` : `R`;
      return { steps: [], result: leafR(net), label };
    }
    if (net.type === "s") {
      const subs = net.children.map(c => explainRz(c, indent + 1));
      const sumExpr = subs.map(s => s.label).join(" + ");
      const sumVal = subs.reduce((a, b) => a + b.result, 0);
      const label = `(${sumExpr})`;
      const steps = subs.flatMap(s => s.steps);
      const valuesExpr = subs.map(s => fmtFrac(s.result)).join(" + ");
      steps.push(`Szeregowo (oporniki dodajemy): R = ${sumExpr} = ${valuesExpr} = ${fmtFrac(sumVal)} Ω`);
      return { steps, result: sumVal, label: fmtFrac(sumVal) + " Ω" };
    }
    if (net.type === "p") {
      const subs = net.children.map(c => explainRz(c, indent + 1));
      const recExpr = subs.map(s => `1/${s.label}`).join(" + ");
      const recVal = subs.reduce((a, b) => a + 1 / b.result, 0);
      const result = 1 / recVal;
      const steps = subs.flatMap(s => s.steps);
      const valuesExpr = subs.map(s => `1/${fmtFrac(s.result)}`).join(" + ");
      steps.push(`Równolegle (sumujemy odwrotności): 1/R = ${recExpr} = ${valuesExpr} = ${fmtFrac(recVal)}, więc R = ${fmtFrac(result)} Ω`);
      return { steps, result, label: fmtFrac(result) + " Ω" };
    }
  }

  // Wygeneruj kroki dla układu mieszanego (zadanie typu 3) — łopatologicznie
  function explainMixed(net, U) {
    const lines = [];
    lines.push(`📋 DANE: napięcie U = ${fmt(U)} V; oporniki: ${describeNet(net)}`);
    lines.push(`🎯 SZUKANE: opór zastępczy R_z, prąd całkowity I oraz U i I na każdym oporniku.`);
    lines.push(`📐 KROK 1 — liczymy R_z (opór zastępczy całego układu):`);
    const exp = explainRz(net);
    exp.steps.forEach(s => lines.push("   • " + s));
    const Rtotal = exp.result;
    lines.push(`   ⇒ R_z = ${fmtFrac(Rtotal)} Ω`);
    const Itotal = U / Rtotal;
    lines.push(`📐 KROK 2 — prąd całkowity z prawa Ohma. Wzór: I = U / R_z`);
    lines.push(`   Podstawiamy: I = ${fmt(U)} V / ${fmtFrac(Rtotal)} Ω = ${fmtFrac(Itotal)} A`);
    lines.push(`📐 KROK 3 — U i I na każdym oporniku:`);
    lines.push(`   Reguła: w gałęzi szeregowej wszędzie ten sam prąd (I=I₁=I₂=…); w gałęzi równoległej wszędzie to samo napięcie (U=U₁=U₂=…).`);
    const sol = solve(net, U);
    const leaves = flattenSolution(sol);
    leaves.sort((a, b) => (a.id || 0) - (b.id || 0));
    leaves.forEach(l => {
      lines.push(`   R${l.id} = ${fmtFrac(l.R)} Ω: U${l.id} = I·R = ${fmtFrac(l.I)}·${fmtFrac(l.R)} = ${fmtFrac(l.U)} V, I${l.id} = U/R = ${fmtFrac(l.U)}/${fmtFrac(l.R)} = ${fmtFrac(l.I)} A`);
    });
    return lines;
  }

  // Krótki opis topologii
  function describeNet(net) {
    net = normalize(net);
    if (isLeaf(net)) {
      const id = leafId(net);
      return id ? `R${id}=${fmt(leafR(net))}Ω` : `${fmt(leafR(net))}Ω`;
    }
    const inner = net.children.map(describeNet).join(net.type === "s" ? " — " : " ‖ ");
    return `(${inner})`;
  }

  // Liczy ile liści w sieci
  function countLeaves(net) {
    net = normalize(net);
    if (isLeaf(net)) return 1;
    return net.children.reduce((s, c) => s + countLeaves(c), 0);
  }

  // Nadaj kolejne ID liściom (R1, R2, ...)
  function assignIds(net, startAt) {
    net = normalize(net);
    let i = startAt || 1;
    function walk(n) {
      if (isLeaf(n)) {
        if (typeof n === "number") return { id: i++, R: n };
        return { id: n.id || i++, R: n.R };
      }
      return { type: n.type, children: n.children.map(walk) };
    }
    return walk(net);
  }

  // Konwersja na ułamek prosty (jeśli ma sens, mianownik ≤ 50)
  function toFraction(x, maxDen) {
    maxDen = maxDen || 50;
    if (typeof x !== "number" || isNaN(x) || !isFinite(x)) return null;
    if (Number.isInteger(x)) return { num: x, den: 1 };
    const sign = Math.sign(x);
    const abs = Math.abs(x);
    for (let d = 2; d <= maxDen; d++) {
      const n = abs * d;
      if (Math.abs(n - Math.round(n)) < 1e-7) {
        let num = Math.round(n);
        // skróć ułamek
        const g = gcd(num, d);
        return { num: sign * (num / g), den: d / g };
      }
    }
    return null;
  }
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

  // Formatowanie liczb dziesiętne (np. 1,09)
  function fmt(x) {
    if (x === undefined || x === null || Number.isNaN(x)) return "?";
    const r = Math.round(x * 1000) / 1000;
    return Number.isInteger(r) ? String(r) : String(r).replace(".", ",");
  }
  // Formatowanie preferujące ułamek (np. 12/11)
  function fmtFrac(x) {
    const f = toFraction(x);
    if (f && f.den !== 1) return `${f.num}/${f.den}`;
    return fmt(x);
  }
  // Pokazuje oba: "12/11 ≈ 1,09" — tylko gdy ułamek nie jest oczywisty
  function fmtBoth(x) {
    const f = toFraction(x);
    if (!f) return fmt(x);
    if (f.den === 1) return fmt(x);  // liczba całkowita
    // jeśli wynik ma "ładną" reprezentację dziesiętną (≤ 2 cyfry po przecinku)
    const r = Math.round(x * 100) / 100;
    if (Math.abs(r - x) < 1e-7 && f.den <= 4) {
      // np. 1,5 = 3/2 — wystarczy pokazać dziesiętne
      return fmt(x);
    }
    return `${f.num}/${f.den} ≈ ${fmt(x)}`;
  }

  // Czy dwie liczby są (prawie) równe
  function approxEq(a, b, eps) {
    eps = eps == null ? 0.01 : eps;
    return Math.abs(a - b) <= eps + Math.abs(b) * 0.005;
  }

  global.CircuitEngine = {
    Rz, solve, flattenSolution, explainRz, explainMixed, describeNet,
    assignIds, countLeaves, fmt, fmtFrac, fmtBoth, toFraction, approxEq, normalize
  };
})(typeof window !== "undefined" ? window : globalThis);
