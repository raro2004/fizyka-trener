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
      const valuesExpr = subs.map(s => fmt(s.result)).join(" + ");
      steps.push(`Łączenie szeregowe: R = ${sumExpr} = ${valuesExpr} = ${fmt(sumVal)} Ω`);
      return { steps, result: sumVal, label: fmt(sumVal) + " Ω" };
    }
    if (net.type === "p") {
      const subs = net.children.map(c => explainRz(c, indent + 1));
      const recExpr = subs.map(s => `1/${s.label}`).join(" + ");
      const recVal = subs.reduce((a, b) => a + 1 / b.result, 0);
      const result = 1 / recVal;
      const steps = subs.flatMap(s => s.steps);
      const valuesExpr = subs.map(s => `1/${fmt(s.result)}`).join(" + ");
      steps.push(`Łączenie równoległe: 1/R = ${recExpr} = ${valuesExpr} = ${fmt(recVal)}; R = ${fmt(result)} Ω`);
      return { steps, result, label: fmt(result) + " Ω" };
    }
  }

  // Wygeneruj kroki dla układu mieszanego (zadanie typu 3)
  function explainMixed(net, U) {
    const lines = [];
    lines.push(`Dane: U = ${fmt(U)} V, oporniki: ${describeNet(net)}`);
    const exp = explainRz(net);
    exp.steps.forEach(s => lines.push("• " + s));
    const Rtotal = exp.result;
    lines.push(`Opór zastępczy całego układu: R_z = ${fmt(Rtotal)} Ω`);
    const Itotal = U / Rtotal;
    lines.push(`Prąd całkowity z prawa Ohma: I = U / R_z = ${fmt(U)} / ${fmt(Rtotal)} = ${fmt(Itotal)} A`);
    const sol = solve(net, U);
    const leaves = flattenSolution(sol);
    leaves.sort((a, b) => (a.id || 0) - (b.id || 0));
    leaves.forEach(l => {
      lines.push(`R${l.id} = ${fmt(l.R)} Ω → U${l.id} = I·R = ${fmt(l.U)} V, I${l.id} = U/R = ${fmt(l.I)} A`);
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

  // Formatowanie liczb (przyjazne, bez nadmiernych zer)
  function fmt(x) {
    if (x === undefined || x === null || Number.isNaN(x)) return "?";
    const r = Math.round(x * 1000) / 1000;
    // Pokaż ułamek prosty jeśli wynik jest taki jak np. 12/11
    return Number.isInteger(r) ? String(r) : String(r).replace(".", ",");
  }

  // Czy dwie liczby są (prawie) równe
  function approxEq(a, b, eps) {
    eps = eps == null ? 0.01 : eps;
    return Math.abs(a - b) <= eps + Math.abs(b) * 0.005;
  }

  global.CircuitEngine = {
    Rz, solve, flattenSolution, explainRz, explainMixed, describeNet,
    assignIds, countLeaves, fmt, approxEq, normalize
  };
})(typeof window !== "undefined" ? window : globalThis);
