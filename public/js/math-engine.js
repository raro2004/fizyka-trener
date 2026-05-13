// math-engine.js — funkcje matematyczne (procenty, VAT, lokaty, roztwory, stosunki, prawdopodobieństwo)

(function (global) {
  "use strict";

  // ===== Procenty =====
  function percentOf(p, x) { return p * x / 100; }                  // p% z x
  function incrPct(x, p)   { return x * (1 + p / 100); }            // x powiększone o p%
  function decrPct(x, p)   { return x * (1 - p / 100); }            // x pomniejszone o p%
  function percentOfWhole(part, whole) { return part / whole * 100; } // jaki procent jest part z whole
  // Ile było przed: x = part / (p/100). Np. 18 zł to 15% gotówki -> gotówka = 18/0.15 = 120 zł
  function valueFromPart(part, p) { return part / p * 100; }
  // O ile procent A jest większe niż B
  function pctLargerThan(a, b) { return (a - b) / b * 100; }
  // O ile procent A jest mniejsze niż B
  function pctSmallerThan(a, b) { return (b - a) / b * 100; }

  // ===== VAT =====
  // brutto = netto * (1 + vat/100)
  function priceBrutto(netto, vatPct) { return netto * (1 + vatPct / 100); }
  function priceNetto(brutto, vatPct) { return brutto / (1 + vatPct / 100); }
  function vatAmount(netto, vatPct) { return netto * vatPct / 100; }

  // ===== Lokata bankowa (kapitalizacja roczna, oprocentowanie roczne) =====
  // Po N latach: K = K0 * (1 + r/100)^N
  function depositAfter(initial, ratePct, years) {
    return initial * Math.pow(1 + ratePct / 100, years);
  }
  // Same odsetki = stan końcowy − początkowy
  function depositInterest(initial, ratePct, years) {
    return depositAfter(initial, ratePct, years) - initial;
  }

  // ===== Roztwory =====
  // p% roztwór = sól / (sól + woda) * 100
  // Ile soli trzeba dodać do `water` (kg wody), żeby otrzymać `pct`% roztworu:
  //   pct/100 = s / (s + water)  =>  s = pct * water / (100 - pct)
  function saltForSolution(waterMass, pct) {
    return pct * waterMass / (100 - pct);
  }
  // Składowe roztworu o masie `total` kg i stężeniu `pct`%:
  //   sól = pct/100 * total ; woda = total - sól
  function solutionComponents(total, pct) {
    const salt = total * pct / 100;
    return { salt, water: total - salt };
  }

  // ===== Stosunki / proporcje =====
  // Podział `total` w stosunku a:b
  function ratioSplit2(total, a, b) {
    const sum = a + b;
    return { first: total * a / sum, second: total * b / sum };
  }
  // a:b:c
  function ratioSplit3(total, a, b, c) {
    const sum = a + b + c;
    return { first: total * a / sum, second: total * b / sum, third: total * c / sum };
  }
  // Wagi N części w stosunku a:b:c... ze znaną częścią o danej wartości
  // np. lżejsza ma 24 kg w stosunku 2:3 -> druga to 24 * 3/2 = 36 kg
  function ratioOtherPart(knownValue, knownRatio, otherRatio) {
    return knownValue * otherRatio / knownRatio;
  }

  // ===== Prawdopodobieństwo =====
  // P(zdarzenia) = #korzystne / #wszystkie
  function probability(favorable, total) { return favorable / total; }

  // ===== Pomocnicze =====
  // ułamek zwykły (najprostszy) z liczby (jeśli możliwe)
  function toFractionMath(x, maxDen) {
    return (global.CircuitEngine && global.CircuitEngine.toFraction)
      ? global.CircuitEngine.toFraction(x, maxDen)
      : null;
  }
  function fmt(x)     { return global.CircuitEngine ? global.CircuitEngine.fmt(x)     : String(x); }
  function fmtFrac(x) { return global.CircuitEngine ? global.CircuitEngine.fmtFrac(x) : fmt(x); }
  function fmtBoth(x) { return global.CircuitEngine ? global.CircuitEngine.fmtBoth(x) : fmt(x); }

  // Kwota PLN z 2 miejscami dla "ł" -> ", "
  function fmtMoney(x) {
    const r = Math.round(x * 100) / 100;
    return r.toFixed(2).replace(".", ",");
  }

  global.MathEngine = {
    percentOf, incrPct, decrPct, percentOfWhole, valueFromPart,
    pctLargerThan, pctSmallerThan,
    priceBrutto, priceNetto, vatAmount,
    depositAfter, depositInterest,
    saltForSolution, solutionComponents,
    ratioSplit2, ratioSplit3, ratioOtherPart,
    probability,
    fmt, fmtFrac, fmtBoth, fmtMoney
  };
})(typeof window !== "undefined" ? window : globalThis);
