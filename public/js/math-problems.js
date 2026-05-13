// math-problems.js — zadania matematyki klasa 8 (Zastosowania matematyki)
// Cztery kategorie:
//   - math-percent     procenty: X% z liczby, większa/mniejsza, ile było, jaki %
//   - math-finance     VAT, lokaty bankowe, ceny netto/brutto, podatki
//   - math-ratio       stosunki, proporcje, roztwory, mieszaniny
//   - math-probability prawdopodobieństwo (kostka, urna, tablica)

(function (global) {
  "use strict";
  const M = global.MathEngine;
  const E = global.CircuitEngine; // dla fmt/fmtFrac/fmtBoth
  const fmt = (x) => E.fmt(x);
  const fmtF = (x) => E.fmtFrac(x);
  const fmtB = (x) => E.fmtBoth(x);
  const fmtMon = (x) => M.fmtMoney(x);

  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function buildHint(given, unknown, formula, transformText) {
    const out = [];
    out.push("📋 Co masz dane: " + given);
    out.push("🎯 Co masz znaleźć: " + unknown);
    out.push("📐 Pasujący wzór: " + formula);
    if (transformText) out.push("✏️ Trzeba przekształcić: " + transformText);
    return out;
  }
  function buildSolution(given, unknown, formula, transformText, substitution, arithmetic, finalAnswer) {
    const out = [];
    out.push("📋 DANE: " + given);
    out.push("🎯 SZUKANE: " + unknown);
    out.push("📐 WZÓR: " + formula);
    if (transformText) out.push("✏️ PRZEKSZTAŁCAMY: " + transformText);
    out.push("🔢 PODSTAWIAMY: " + substitution);
    if (arithmetic) out.push("➗ LICZYMY: " + arithmetic);
    out.push("✅ ODPOWIEDŹ: " + finalAnswer);
    return out;
  }

  // ============= KATEGORIA 1: PROCENTY =============
  const percentStatic = [
    {
      id: "p1",
      prompt: "Oblicz 40% liczby 2¼ (czyli 2,25). Wpisz wynik jako ułamek lub liczbę dziesiętną.",
      fields: [{ label: "wynik", unit: "", value: 0.9, tol: 0.01 }],
      hint: buildHint(
        "p = 40%, x = 2¼ = 9/4 = 2,25",
        "p% z x",
        "p% z x = (p/100) · x",
        "Mnożymy: 40/100 · 9/4 = 0,4 · 2,25"
      ),
      solution: buildSolution(
        "p = 40%; x = 2¼ = 9/4 = 2,25",
        "40% z 9/4",
        "p% z x = (p/100) · x",
        null,
        "40/100 · 9/4 = 4·9 / (10·4) = 36/40",
        "= 9/10 = 0,9",
        "9/10 = 0,9"
      )
    },
    {
      id: "p2",
      prompt: "Mama wydała 18 zł w sklepie, co stanowiło 15% gotówki, którą miała w portfelu. Ile gotówki miała mama przed zakupami?",
      fields: [{ label: "gotówka", unit: "zł", value: 120, tol: 0.5 }],
      hint: buildHint(
        "część = 18 zł, p = 15% (część stanowi p% całości)",
        "całość (gotówka) w zł",
        "część = (p/100) · całość",
        "Dzielimy: całość = część · 100 / p = 18 · 100 / 15"
      ),
      solution: buildSolution(
        "część = 18 zł; p = 15%",
        "całość gotówki",
        "część = (p/100) · całość",
        "całość = część · 100 / p",
        "całość = 18 zł · 100 / 15",
        "= 1800/15 = 120",
        "120 zł"
      )
    },
    {
      id: "p3",
      prompt: "O ile złotych mniej niż 500 zł to kwota o 9% mniejsza? Podaj wartość kwoty pomniejszonej.",
      fields: [{ label: "kwota", unit: "zł", value: 455, tol: 0.5 }],
      hint: buildHint(
        "x = 500 zł, p = 9% mniej",
        "kwota o 9% mniejsza od 500",
        "wynik = x · (1 − p/100)",
        "wynik = 500 · (1 − 0,09) = 500 · 0,91"
      ),
      solution: buildSolution(
        "x = 500 zł; pomniejszamy o 9%",
        "kwota o 9% mniejsza od 500 zł",
        "wynik = x · (1 − p/100)",
        null,
        "wynik = 500 · (1 − 0,09) = 500 · 0,91",
        "= 455",
        "455 zł"
      )
    },
    {
      id: "p4",
      prompt: "Ile metrów to o 70% więcej niż 200 m?",
      fields: [{ label: "wynik", unit: "m", value: 340, tol: 0.5 }],
      hint: buildHint(
        "x = 200 m, p = 70% więcej",
        "długość o 70% większa od 200 m",
        "wynik = x · (1 + p/100)",
        "wynik = 200 · 1,70"
      ),
      solution: buildSolution(
        "x = 200 m; powiększamy o 70%",
        "długość o 70% większa od 200 m",
        "wynik = x · (1 + p/100)",
        null,
        "wynik = 200 · (1 + 0,70) = 200 · 1,70",
        "= 340",
        "340 m"
      )
    },
    {
      id: "p5",
      prompt: "O ile procent 360 kg to więcej niż 240 kg?",
      fields: [{ label: "różnica", unit: "%", value: 50, tol: 0.5 }],
      hint: buildHint(
        "a = 360 kg (większa), b = 240 kg (mniejsza)",
        "o ile procent a jest większe od b",
        "p = (a − b) / b · 100%",
        "Liczymy różnicę względem MNIEJSZEJ wartości"
      ),
      solution: buildSolution(
        "a = 360 kg; b = 240 kg",
        "o ile % a > b",
        "p = (a − b) / b · 100%",
        null,
        "p = (360 − 240) / 240 · 100% = 120/240 · 100%",
        "= 1/2 · 100% = 50%",
        "50%"
      )
    },
    {
      id: "p6",
      prompt: "O ile procent 45 osób to mniej niż 60 osób?",
      fields: [{ label: "różnica", unit: "%", value: 25, tol: 0.5 }],
      hint: buildHint(
        "a = 45 (mniejsza), b = 60 (większa, czyli ta od której liczymy)",
        "o ile procent a jest mniejsze od b",
        "p = (b − a) / b · 100%",
        "Liczymy różnicę względem WIĘKSZEJ wartości"
      ),
      solution: buildSolution(
        "a = 45 osób; b = 60 osób",
        "o ile % a < b",
        "p = (b − a) / b · 100%",
        null,
        "p = (60 − 45) / 60 · 100% = 15/60 · 100%",
        "= 1/4 · 100% = 25%",
        "25%"
      )
    },
    {
      id: "p7",
      prompt: "Rower kosztował 1400 zł. Przeceniono go o 40%. Ile kosztuje rower po przecenie?",
      fields: [{ label: "cena", unit: "zł", value: 840, tol: 0.5 }],
      hint: buildHint(
        "cena początkowa = 1400 zł, obniżka 40%",
        "cena po obniżce",
        "cena_nowa = cena · (1 − p/100)",
        "cena_nowa = 1400 · 0,60"
      ),
      solution: buildSolution(
        "cena = 1400 zł; obniżka p = 40%",
        "cena po przecenie",
        "cena_nowa = cena · (1 − p/100)",
        null,
        "cena_nowa = 1400 · (1 − 0,40) = 1400 · 0,60",
        "= 840",
        "840 zł"
      )
    },
    {
      id: "p8",
      prompt: "Cenę kurtki obniżono o 16% i obecnie wynosi ona 336 zł. Ile kosztowała kurtka przed obniżką?",
      fields: [{ label: "cena", unit: "zł", value: 400, tol: 0.5 }],
      hint: buildHint(
        "cena_po = 336 zł, obniżka 16% (czyli zostało 84% ceny)",
        "cena przed obniżką",
        "cena_po = cena · (1 − p/100)  →  cena = cena_po / (1 − p/100)",
        "cena = 336 / 0,84"
      ),
      solution: buildSolution(
        "cena_po = 336 zł; obniżka p = 16%",
        "cena przed obniżką",
        "cena_po = cena · (1 − p/100)",
        "cena = cena_po / (1 − p/100)",
        "cena = 336 zł / (1 − 0,16) = 336 / 0,84",
        "= 33600 / 84 = 400",
        "400 zł"
      )
    },
    {
      id: "p9",
      prompt: "Ile soli trzeba wsypać do 18 kg wody, aby otrzymać roztwór dziesięcioprocentowy (10%)?",
      fields: [{ label: "sól", unit: "kg", value: 2, tol: 0.05 }],
      hint: buildHint(
        "woda = 18 kg, roztwór ma być 10% (czyli sól / (sól+woda) = 10%)",
        "ile kg soli s",
        "10/100 = s / (s + 18)",
        "Z proporcji: s · 100 = 10 · (s + 18) → s · 90 = 180 → s = 2"
      ),
      solution: buildSolution(
        "woda = 18 kg; stężenie p = 10%",
        "masa soli s [kg]",
        "p/100 = s / (s + woda)",
        "s = p · woda / (100 − p)",
        "s = 10 · 18 / (100 − 10) = 180 / 90",
        "= 2",
        "2 kg soli"
      )
    },
    {
      id: "p10",
      prompt: "Mama upiekła 40 ciasteczek. Wojtek zjadł 20% wszystkich, Asia ¼ pozostałych, tata 50% pozostałych, a resztę zjadła mama. Jaki procent wszystkich ciasteczek zjadła mama?",
      fields: [{ label: "procent", unit: "%", value: 30, tol: 0.5 }],
      hint: buildHint(
        "Razem 40 ciasteczek. Sekwencyjne zjadanie",
        "% mamy ze wszystkich ciasteczek",
        "Krok po kroku: po Wojtku 80%, po Asi 80%·3/4 = 60%, po tacie 60%·1/2 = 30%",
        "Mama dostała 30% wszystkich"
      ),
      solution: buildSolution(
        "razem = 40; Wojtek 20%, Asia ¼ pozostałych, tata 50% pozostałych",
        "% mamy",
        "Krokowo: zostawiamy procent po każdym",
        "po Wojtku: 100% − 20% = 80% wszystkich.  Po Asi: 80% · (1 − 1/4) = 80% · 3/4 = 60%.  Po tacie: 60% · (1 − 1/2) = 60% · 1/2 = 30%",
        "Mama: 30% z 40 = 12 ciasteczek",
        "30% / 40 = 12/40 = 30%",
        "30% (mama zjadła 12 ciasteczek)"
      )
    },
    {
      id: "p11",
      prompt: "Jaką liczbę otrzymamy, gdy liczbę a = 50 powiększymy o 27%?",
      fields: [{ label: "wynik", unit: "", value: 63.5, tol: 0.05 }],
      hint: buildHint(
        "a = 50, powiększamy o 27%",
        "liczba o 27% większa",
        "wynik = a · (1 + p/100)",
        "wynik = 50 · 1,27"
      ),
      solution: buildSolution(
        "a = 50; powiększamy o p = 27%",
        "liczba o 27% większa",
        "wynik = a · (1 + p/100)",
        null,
        "wynik = 50 · (1 + 0,27) = 50 · 1,27",
        "= 63,5",
        "63,5"
      )
    },
    {
      id: "p12",
      prompt: "Wartość pewnej akcji wzrosła o 20%, a następnie spadła o 20%. Czy wróciła do ceny początkowej? Podaj jaki procent ceny początkowej stanowi cena po dwóch zmianach.",
      fields: [{ label: "procent", unit: "%", value: 96, tol: 0.5 }],
      hint: buildHint(
        "Wzrost 20%, potem spadek 20%",
        "% ceny początkowej",
        "cena_końcowa = cena · 1,20 · 0,80",
        "Liczymy iloczyn: 1,20 · 0,80 = 0,96 = 96%"
      ),
      solution: buildSolution(
        "cena · (+20%) · (−20%)",
        "jaki % ceny początkowej",
        "cena_końcowa = cena · (1 + p/100) · (1 − p/100)",
        null,
        "cena_końcowa = cena · 1,20 · 0,80 = cena · 0,96",
        "= 96% ceny początkowej",
        "96% — NIE wraca do początkowej (mniej o 4%)"
      )
    }
  ];

  function percentGen() {
    const t = rand(1, 6);
    if (t === 1) {
      // p% z x
      const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]); const x = pick([20, 40, 60, 80, 100, 120, 200, 240, 300, 400, 500]);
      const v = M.percentOf(p, x);
      return {
        id: `pg1-${p}-${x}`,
        prompt: `Oblicz ${p}% liczby ${x}.`,
        fields: [{ label: "wynik", unit: "", value: v, tol: 0.05 }],
        hint: buildHint(`p = ${p}%, x = ${x}`, `${p}% z ${x}`, "p% z x = (p/100) · x", "Mnożymy: p/100 razy x"),
        solution: buildSolution(`p = ${p}%; x = ${x}`, `${p}% z ${x}`, "p% z x = (p/100) · x", null,
          `${p}/100 · ${x}`, `= ${p*x}/100 = ${v}`, `${fmt(v)}`)
      };
    }
    if (t === 2) {
      // o p% większa od x
      const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 70]); const x = pick([100, 150, 200, 250, 300, 400, 500]);
      const v = M.incrPct(x, p);
      return {
        id: `pg2-${p}-${x}`,
        prompt: `Liczba o ${p}% większa od ${x} wynosi:`,
        fields: [{ label: "wynik", unit: "", value: v, tol: 0.05 }],
        hint: buildHint(`x = ${x}, powiększamy o ${p}%`, `liczba o ${p}% większa`, "wynik = x · (1 + p/100)", `wynik = ${x} · ${1+p/100}`),
        solution: buildSolution(`x = ${x}; p = ${p}%`, `liczba o ${p}% większa od ${x}`, "wynik = x · (1 + p/100)", null,
          `${x} · (1 + ${p}/100) = ${x} · ${1+p/100}`, `= ${v}`, `${fmt(v)}`)
      };
    }
    if (t === 3) {
      // o p% mniejsza od x
      const p = pick([5, 10, 15, 20, 25, 40, 50, 60]); const x = pick([100, 200, 300, 400, 500, 800, 1000]);
      const v = M.decrPct(x, p);
      return {
        id: `pg3-${p}-${x}`,
        prompt: `Liczba o ${p}% mniejsza od ${x} wynosi:`,
        fields: [{ label: "wynik", unit: "", value: v, tol: 0.05 }],
        hint: buildHint(`x = ${x}, pomniejszamy o ${p}%`, `liczba o ${p}% mniejsza`, "wynik = x · (1 − p/100)", `wynik = ${x} · ${1-p/100}`),
        solution: buildSolution(`x = ${x}; p = ${p}%`, `liczba o ${p}% mniejsza od ${x}`, "wynik = x · (1 − p/100)", null,
          `${x} · (1 − ${p}/100) = ${x} · ${1-p/100}`, `= ${v}`, `${fmt(v)}`)
      };
    }
    if (t === 4) {
      // jaki procent jest a z b
      const b = pick([20, 40, 50, 100, 200, 500]); const ratio = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.75]); const a = b * ratio; const p = a/b * 100;
      return {
        id: `pg4-${a}-${b}`,
        prompt: `Jaki procent liczby ${b} stanowi liczba ${a}?`,
        fields: [{ label: "procent", unit: "%", value: p, tol: 0.5 }],
        hint: buildHint(`a = ${a}, b = ${b}`, `p% jaki a stanowi z b`, "p = a/b · 100%", `${a}/${b} · 100%`),
        solution: buildSolution(`a = ${a}; b = ${b}`, `jaki % b stanowi a`, "p = a/b · 100%", null,
          `${a}/${b} · 100%`, `= ${a/b} · 100% = ${p}%`, `${p}%`)
      };
    }
    if (t === 5) {
      // ile było (część = p%, ile całość)
      const p = pick([5, 10, 15, 20, 25, 50]); const total = pick([100, 200, 300, 400, 600, 800]);
      const part = M.percentOf(p, total);
      return {
        id: `pg5-${p}-${total}`,
        prompt: `${fmt(part)} zł stanowi ${p}% pewnej kwoty. Jaka to kwota?`,
        fields: [{ label: "kwota", unit: "zł", value: total, tol: 0.5 }],
        hint: buildHint(`część = ${fmt(part)} zł, p = ${p}%`, `całość`, "część = (p/100) · całość", `całość = część · 100 / p = ${fmt(part)} · 100 / ${p}`),
        solution: buildSolution(`część = ${fmt(part)} zł; p = ${p}%`, `całość`, "część = (p/100) · całość", "całość = część · 100/p",
          `${fmt(part)} · 100 / ${p}`, `= ${fmt(part*100)}/${p} = ${total}`, `${total} zł`)
      };
    }
    // t == 6 — o ile procent większe/mniejsze
    const b = pick([200, 240, 300, 400, 500]); const factor = pick([1.25, 1.5, 1.75, 2.0, 0.75, 0.6, 0.5]); const a = b * factor;
    if (a > b) {
      const p = M.pctLargerThan(a, b);
      return {
        id: `pg6-${a}-${b}`,
        prompt: `O ile procent ${a} to więcej niż ${b}?`,
        fields: [{ label: "różnica", unit: "%", value: p, tol: 0.5 }],
        hint: buildHint(`a = ${a} (większa), b = ${b} (mniejsza)`, "o ile % a > b", "p = (a − b)/b · 100%", "Liczymy różnicę względem mniejszej"),
        solution: buildSolution(`a = ${a}; b = ${b}`, "o ile % a > b", "p = (a − b)/b · 100%", null,
          `(${a} − ${b})/${b} · 100%`, `= ${a-b}/${b} · 100% = ${p}%`, `${p}%`)
      };
    } else {
      const p = M.pctSmallerThan(a, b);
      return {
        id: `pg6b-${a}-${b}`,
        prompt: `O ile procent ${a} to mniej niż ${b}?`,
        fields: [{ label: "różnica", unit: "%", value: p, tol: 0.5 }],
        hint: buildHint(`a = ${a} (mniejsza), b = ${b} (większa)`, "o ile % a < b", "p = (b − a)/b · 100%", "Liczymy różnicę względem większej"),
        solution: buildSolution(`a = ${a}; b = ${b}`, "o ile % a < b", "p = (b − a)/b · 100%", null,
          `(${b} − ${a})/${b} · 100%`, `= ${b-a}/${b} · 100% = ${p}%`, `${p}%`)
      };
    }
  }

  // ============= KATEGORIA 2: FINANSE (VAT, lokaty, ceny) =============
  const financeStatic = [
    {
      id: "f1",
      prompt: "Oprocentowanie na lokacie rocznej w pewnym banku wynosi 2,5%. Wpłacono na tę lokatę 7000 zł. Jaki będzie stan konta po roku?",
      fields: [{ label: "stan", unit: "zł", value: 7175, tol: 0.5 }],
      hint: buildHint(
        "K0 = 7000 zł, oprocentowanie roczne r = 2,5%, czas 1 rok",
        "stan konta po roku",
        "K = K0 · (1 + r/100)",
        "K = 7000 · 1,025"
      ),
      solution: buildSolution(
        "K0 = 7000 zł; r = 2,5%; t = 1 rok",
        "stan konta po roku",
        "K = K0 · (1 + r/100)",
        null,
        "K = 7000 · (1 + 0,025) = 7000 · 1,025",
        "= 7175",
        "7175 zł"
      )
    },
    {
      id: "f2",
      prompt: "Na lokatę roczną oprocentowaną 3% wpłacono 2000 zł. Oprocentowanie nie zmieniło się. Jaki będzie stan konta po DWÓCH latach?",
      fields: [{ label: "stan", unit: "zł", value: 2121.80, tol: 0.5 }],
      hint: buildHint(
        "K0 = 2000 zł, r = 3%, t = 2 lata (kapitalizacja roczna)",
        "stan po 2 latach",
        "K = K0 · (1 + r/100)^t",
        "Po 1 roku: 2060. Z tej kwoty znów 3% odsetek: 2060 · 1,03 = 2121,80"
      ),
      solution: buildSolution(
        "K0 = 2000 zł; r = 3%; t = 2 lata",
        "stan po 2 latach",
        "K = K0 · (1 + r/100)^t",
        null,
        "K = 2000 · 1,03 · 1,03 = 2000 · 1,0609",
        "= 2121,80",
        "2121,80 zł"
      )
    },
    {
      id: "f3",
      prompt: "Stawka VAT przy sprzedaży roweru wynosi 23%. Cena netto roweru to 1300 zł. Ile wynosi cena brutto (z VAT)?",
      fields: [{ label: "brutto", unit: "zł", value: 1599, tol: 0.5 }],
      hint: buildHint(
        "netto = 1300 zł, VAT = 23%",
        "cena brutto (z VAT)",
        "brutto = netto · (1 + VAT/100)",
        "brutto = 1300 · 1,23"
      ),
      solution: buildSolution(
        "netto = 1300 zł; VAT = 23%",
        "cena brutto",
        "brutto = netto · (1 + VAT/100)",
        null,
        "brutto = 1300 · (1 + 0,23) = 1300 · 1,23",
        "= 1599",
        "1599 zł"
      )
    },
    {
      id: "f4",
      prompt: "Kask rowerowy w cenie brutto kosztuje 184,50 zł (VAT 23%). Oblicz cenę netto (bez VAT).",
      fields: [{ label: "netto", unit: "zł", value: 150, tol: 0.5 }],
      hint: buildHint(
        "brutto = 184,50 zł, VAT = 23%",
        "cena netto (bez VAT)",
        "brutto = netto · (1 + VAT/100)  →  netto = brutto / (1 + VAT/100)",
        "netto = 184,50 / 1,23"
      ),
      solution: buildSolution(
        "brutto = 184,50 zł; VAT = 23%",
        "cena netto",
        "brutto = netto · (1 + VAT/100)",
        "netto = brutto / (1 + VAT/100)",
        "netto = 184,50 / 1,23",
        "= 150",
        "150 zł"
      )
    },
    {
      id: "f5",
      prompt: "Oferta I: cena netto 2400 zł + 23% VAT. Oferta II: 2870 zł brutto. Która jest TAŃSZA i o ile zł?",
      fields: [
        { label: "różnica", unit: "zł", value: 82, tol: 0.5 }
      ],
      hint: buildHint(
        "Oferta I: netto 2400 zł, VAT 23%. Oferta II: brutto 2870 zł",
        "która tańsza i o ile",
        "Sprowadź obie do porównywalnej wielkości — brutto",
        "I_brutto = 2400 · 1,23 = 2952; II_brutto = 2870; różnica = 2952 − 2870"
      ),
      solution: buildSolution(
        "I: 2400 zł netto + 23% VAT;  II: 2870 zł brutto",
        "która tańsza i o ile zł",
        "Liczymy oba brutto i porównujemy",
        null,
        "I_brutto = 2400 · 1,23 = 2952 zł;  II_brutto = 2870 zł",
        "różnica = 2952 − 2870 = 82",
        "Oferta II tańsza o 82 zł"
      )
    },
    {
      id: "f6",
      prompt: "Cenę kurtki obniżono o 15% i obecnie wynosi 306 zł. Ile kosztowała kurtka przed obniżką?",
      fields: [{ label: "cena", unit: "zł", value: 360, tol: 0.5 }],
      hint: buildHint(
        "cena_po = 306 zł, obniżka 15% (czyli zostało 85% ceny)",
        "cena przed obniżką",
        "cena_po = cena · (1 − p/100)  →  cena = cena_po / (1 − p/100)",
        "cena = 306 / 0,85"
      ),
      solution: buildSolution(
        "cena_po = 306 zł; obniżka p = 15%",
        "cena przed obniżką",
        "cena_po = cena · (1 − p/100)",
        "cena = cena_po / (1 − p/100)",
        "cena = 306 / (1 − 0,15) = 306 / 0,85",
        "= 360",
        "360 zł"
      )
    },
    {
      id: "f7",
      prompt: "Pan Jan wpłacił na lokatę roczną 5000 zł i otrzymał 90 zł odsetek. Oprocentowanie zmalało o 0,5 punktu procentowego. Jakie odsetki dostanie po roku z 5000 zł teraz?",
      fields: [{ label: "odsetki", unit: "zł", value: 65, tol: 0.5 }],
      hint: buildHint(
        "Stara stawka: 5000 zł → 90 zł odsetek. Nowa stawka mniejsza o 0,5 punktu",
        "nowe odsetki",
        "Krok 1: stara stawka r1 = 90/5000 · 100% = 1,8%. Krok 2: r2 = 1,8% − 0,5% = 1,3%. Krok 3: odsetki = 5000 · 1,3/100",
        "Pamiętaj: PUNKT procentowy ≠ procent. Z 1,8% odejmujemy 0,5 punktu → 1,3%"
      ),
      solution: buildSolution(
        "K0 = 5000 zł; stare odsetki = 90 zł; nowa stawka mniejsza o 0,5 pp",
        "nowe odsetki",
        "Krok 1: r1 = odsetki/K0 · 100%.  Krok 2: r2 = r1 − 0,5 pp.  Krok 3: odsetki = K0 · r2/100",
        null,
        "r1 = 90/5000 · 100% = 1,8%;  r2 = 1,8% − 0,5% = 1,3%;  odsetki = 5000 · 1,3/100",
        "= 65",
        "65 zł"
      )
    },
    {
      id: "f8",
      prompt: "W pewnym państwie wszyscy płacą tę samą stawkę podatku. Od kwoty 7000 groszy trzeba przekazać 840 groszy. Jaki to procent dochodu?",
      fields: [{ label: "stawka", unit: "%", value: 12, tol: 0.5 }],
      hint: buildHint(
        "dochód = 7000 gr, podatek = 840 gr",
        "stawka podatku w %",
        "p = podatek/dochód · 100%",
        "p = 840/7000 · 100%"
      ),
      solution: buildSolution(
        "dochód = 7000 gr; podatek = 840 gr",
        "stawka podatku",
        "p = podatek/dochód · 100%",
        null,
        "p = 840/7000 · 100%",
        "= 0,12 · 100% = 12%",
        "12%"
      )
    },
    {
      id: "f9",
      prompt: "Wynagrodzenie BRUTTO pracownika wynosi 3700 zł. Podatek to 18% od kwoty brutto. Ile wynosi wynagrodzenie netto?",
      fields: [{ label: "netto", unit: "zł", value: 3034, tol: 0.5 }],
      hint: buildHint(
        "brutto = 3700 zł, podatek 18% z brutto",
        "wynagrodzenie netto",
        "netto = brutto − brutto · (p/100) = brutto · (1 − p/100)",
        "netto = 3700 · 0,82"
      ),
      solution: buildSolution(
        "brutto = 3700 zł; podatek p = 18%",
        "netto",
        "netto = brutto · (1 − p/100)",
        null,
        "netto = 3700 · (1 − 0,18) = 3700 · 0,82",
        "= 3034",
        "3034 zł"
      )
    },
    {
      id: "f10",
      prompt: "Cena BRUTTO słoika miodu wynosi 27,30 zł. Stawka VAT na miód to 5%. Ile wynosi cena netto?",
      fields: [{ label: "netto", unit: "zł", value: 26, tol: 0.5 }],
      hint: buildHint(
        "brutto = 27,30 zł, VAT = 5%",
        "cena netto",
        "netto = brutto / (1 + VAT/100)",
        "netto = 27,30 / 1,05"
      ),
      solution: buildSolution(
        "brutto = 27,30 zł; VAT = 5%",
        "netto",
        "netto = brutto / (1 + VAT/100)",
        null,
        "netto = 27,30 / 1,05",
        "= 26",
        "26 zł"
      )
    }
  ];

  function financeGen() {
    const t = rand(1, 4);
    if (t === 1) {
      // Lokata 1 rok
      const K = pick([1000, 2000, 3000, 4000, 5000, 8000, 10000]);
      const r = pick([1, 1.5, 2, 2.5, 3, 4, 5]);
      const v = M.depositAfter(K, r, 1);
      return {
        id: `fg1-${K}-${r}`,
        prompt: `Wpłacono ${K} zł na lokatę roczną o oprocentowaniu ${fmt(r)}%. Ile wyniesie stan konta po roku?`,
        fields: [{ label: "stan", unit: "zł", value: v, tol: 0.5 }],
        hint: buildHint(`K0 = ${K} zł; r = ${fmt(r)}%; t = 1 rok`, "K po roku", "K = K0 · (1 + r/100)", `K = ${K} · ${1+r/100}`),
        solution: buildSolution(`K0 = ${K} zł; r = ${fmt(r)}%`, "K po roku", "K = K0 · (1 + r/100)", null,
          `${K} · (1 + ${fmt(r)}/100) = ${K} · ${1+r/100}`, `= ${fmtMon(v)}`, `${fmtMon(v)} zł`)
      };
    }
    if (t === 2) {
      // VAT brutto z netto
      const netto = pick([100, 200, 500, 800, 1000, 1500, 2000, 2500]); const vat = pick([5, 8, 23]);
      const brutto = M.priceBrutto(netto, vat);
      return {
        id: `fg2-${netto}-${vat}`,
        prompt: `Cena netto towaru wynosi ${netto} zł, stawka VAT to ${vat}%. Ile wynosi cena brutto?`,
        fields: [{ label: "brutto", unit: "zł", value: brutto, tol: 0.5 }],
        hint: buildHint(`netto = ${netto} zł; VAT = ${vat}%`, "brutto", "brutto = netto · (1 + VAT/100)", `brutto = ${netto} · ${1+vat/100}`),
        solution: buildSolution(`netto = ${netto} zł; VAT = ${vat}%`, "brutto", "brutto = netto · (1 + VAT/100)", null,
          `${netto} · (1 + ${vat}/100) = ${netto} · ${1+vat/100}`, `= ${fmtMon(brutto)}`, `${fmtMon(brutto)} zł`)
      };
    }
    if (t === 3) {
      // VAT netto z brutto
      const netto = pick([100, 200, 400, 500, 1000, 2000]); const vat = pick([5, 8, 23]);
      const brutto = M.priceBrutto(netto, vat);
      return {
        id: `fg3-${brutto}-${vat}`,
        prompt: `Cena brutto wynosi ${fmtMon(brutto)} zł (VAT ${vat}%). Ile wynosi cena netto?`,
        fields: [{ label: "netto", unit: "zł", value: netto, tol: 0.5 }],
        hint: buildHint(`brutto = ${fmtMon(brutto)} zł; VAT = ${vat}%`, "netto", "brutto = netto · (1 + VAT/100)", `netto = brutto / (1 + VAT/100) = ${fmtMon(brutto)} / ${1+vat/100}`),
        solution: buildSolution(`brutto = ${fmtMon(brutto)} zł; VAT = ${vat}%`, "netto", "brutto = netto · (1 + VAT/100)", "netto = brutto / (1 + VAT/100)",
          `${fmtMon(brutto)} / ${1+vat/100}`, `= ${fmtMon(netto)}`, `${fmtMon(netto)} zł`)
      };
    }
    // t == 4: cena po obniżce
    const cena = pick([100, 200, 300, 500, 800, 1000, 1500, 2000]);
    const p = pick([5, 10, 15, 20, 25, 30, 40, 50]);
    const cenaPo = M.decrPct(cena, p);
    return {
      id: `fg4-${cena}-${p}`,
      prompt: `Towar kosztował ${cena} zł i został przeceniony o ${p}%. Ile kosztuje po przecenie?`,
      fields: [{ label: "cena", unit: "zł", value: cenaPo, tol: 0.5 }],
      hint: buildHint(`cena = ${cena} zł; obniżka ${p}%`, "cena po obniżce", "cena_po = cena · (1 − p/100)", `cena_po = ${cena} · ${1-p/100}`),
      solution: buildSolution(`cena = ${cena} zł; p = ${p}%`, "cena po obniżce", "cena_po = cena · (1 − p/100)", null,
        `${cena} · (1 − ${p}/100) = ${cena} · ${1-p/100}`, `= ${fmtMon(cenaPo)}`, `${fmtMon(cenaPo)} zł`)
    };
  }

  // ============= KATEGORIA 3: STOSUNKI / PROPORCJE / ROZTWORY =============
  const ratioStatic = [
    {
      id: "r1",
      prompt: "Tasiemkę o długości 180 cm podzielono w stosunku 1:2. Podaj długości otrzymanych części (mniejsza, większa).",
      fields: [
        { label: "mniejsza", unit: "cm", value: 60, tol: 0.5 },
        { label: "większa",  unit: "cm", value: 120, tol: 0.5 }
      ],
      hint: buildHint(
        "całkowita długość = 180 cm, stosunek 1:2 (suma części = 1 + 2 = 3)",
        "obie długości",
        "część_i = total · ratio_i / suma_ratio",
        "Liczymy 1/3 i 2/3 z 180"
      ),
      solution: buildSolution(
        "L = 180 cm; stosunek 1:2",
        "części",
        "część_i = L · ratio_i / Σratio",
        null,
        "suma = 1+2 = 3.  mniejsza = 180 · 1/3,  większa = 180 · 2/3",
        "mniejsza = 60, większa = 120",
        "60 cm i 120 cm"
      )
    },
    {
      id: "r2",
      prompt: "Płot pomalowali Antek (3 m), Bartek (5 m) i Czarek (4 m). Razem dostali 240 zł. Ile dostanie każdy proporcjonalnie do pracy? (kolejność: Antek, Bartek, Czarek)",
      fields: [
        { label: "Antek",  unit: "zł", value: 60, tol: 0.5 },
        { label: "Bartek", unit: "zł", value: 100, tol: 0.5 },
        { label: "Czarek", unit: "zł", value: 80, tol: 0.5 }
      ],
      hint: buildHint(
        "Praca w stosunku 3:5:4 (Antek:Bartek:Czarek), razem 240 zł",
        "podział",
        "część_i = total · ratio_i / Σratio",
        "Suma = 3+5+4 = 12. Każdy: 240 · ratio_i / 12 = 20 · ratio_i"
      ),
      solution: buildSolution(
        "praca = 3:5:4 m; razem = 240 zł",
        "kwota dla każdego",
        "część_i = total · ratio_i / Σratio",
        null,
        "Σ = 12.  A = 240·3/12 = 60.  B = 240·5/12 = 100.  C = 240·4/12 = 80",
        "60, 100, 80",
        "Antek 60 zł; Bartek 100 zł; Czarek 80 zł"
      )
    },
    {
      id: "r3",
      prompt: "Pewien ciężar podzielono w stosunku 2:3. Lżejsza część waży 24 kg. Ile waży druga część?",
      fields: [{ label: "druga", unit: "kg", value: 36, tol: 0.5 }],
      hint: buildHint(
        "stosunek 2:3, lżejsza = 24 kg (część 2)",
        "cięższa część (część 3)",
        "Wagi proporcjonalne: druga = lżejsza · 3/2",
        "druga = 24 · 3/2 = 36"
      ),
      solution: buildSolution(
        "stosunek 2:3; lżejsza = 24 kg",
        "cięższa część",
        "obie wagi proporcjonalne do liczb stosunku",
        "druga = lżejsza · 3 / 2",
        "druga = 24 · 3 / 2",
        "= 24 · 1,5 = 36",
        "36 kg"
      )
    },
    {
      id: "r4",
      prompt: "Liczbę 880 podzielono w stosunku 3:8. Oblicz różnicę między większą a mniejszą częścią.",
      fields: [{ label: "różnica", unit: "", value: 400, tol: 0.5 }],
      hint: buildHint(
        "total = 880, stosunek 3:8",
        "różnica większa − mniejsza",
        "Każda część: total · ratio_i / Σratio. Σ = 3+8 = 11.  Różnica: 880·8/11 − 880·3/11 = 880·5/11",
        "Najprościej: różnica = total · (większa−mniejsza)/Σ = 880 · 5/11"
      ),
      solution: buildSolution(
        "total = 880; stosunek 3:8",
        "różnica między częściami",
        "każda część = total · ratio/Σ",
        null,
        "Σ = 11.  mniejsza = 880·3/11 = 240.  większa = 880·8/11 = 640",
        "różnica = 640 − 240 = 400",
        "400"
      )
    },
    {
      id: "r5",
      prompt: "Sok i wodę zmieszano w PROPORCJI 2:3. Co to oznacza? Wybierz poprawne ilości (sok, woda).",
      fields: [
        { label: "sok",  unit: "L", value: 2, tol: 0.05 },
        { label: "woda", unit: "L", value: 3, tol: 0.05 }
      ],
      hint: buildHint(
        "Proporcja 2:3 oznacza że na 2 części soku przypadają 3 części wody",
        "konkretne ilości",
        "Najmniejsze ilości (1 część = 1 L): 2 L soku i 3 L wody",
        "Można też 4 L i 6 L (każda część = 2 L) — to też proporcja 2:3"
      ),
      solution: buildSolution(
        "proporcja 2:3 (sok:woda)",
        "konkretne ilości",
        "Stosunek 2:3 oznacza że na 2 jednostki soku przypadają 3 jednostki wody",
        null,
        "Najprościej: 2 L soku i 3 L wody (1 jednostka = 1 L)",
        "Inne poprawne: 4:6, 6:9, 10:15…",
        "2 L soku i 3 L wody (lub wielokrotności)"
      )
    },
    {
      id: "r6",
      prompt: "Ewa dolała wody do 0,5 L soku i otrzymała 0,7 L napoju. Jaki jest stosunek SOKU do WODY w napoju? Podaj jako liczby a:b w prostej postaci (a/b).",
      fields: [{ label: "stosunek (sok/woda)", unit: "", value: 5/2, tol: 0.05 }],
      hint: buildHint(
        "sok = 0,5 L, napój = 0,7 L → woda = 0,7 − 0,5 = 0,2 L",
        "stosunek sok:woda",
        "Stosunek = sok / woda",
        "0,5 / 0,2 = 5/2 (czyli 5:2)"
      ),
      solution: buildSolution(
        "sok = 0,5 L; napój = 0,7 L",
        "stosunek sok:woda",
        "Stosunek = sok / woda",
        "Najpierw woda = napój − sok",
        "woda = 0,7 − 0,5 = 0,2 L;  stosunek = 0,5 / 0,2",
        "= 5/2 (czyli 5:2)",
        "5:2 (5/2 = 2,5)"
      )
    },
    {
      id: "r7",
      prompt: "Ile soli trzeba dodać do 18 kg WODY, aby otrzymać roztwór 10-procentowy?",
      fields: [{ label: "sól", unit: "kg", value: 2, tol: 0.05 }],
      hint: buildHint(
        "woda = 18 kg, p = 10% (sól w roztworze)",
        "masa soli",
        "p% = sól/(sól+woda) · 100%  →  s = p · woda / (100 − p)",
        "s = 10 · 18 / 90"
      ),
      solution: buildSolution(
        "woda = 18 kg; p = 10%",
        "masa soli",
        "p/100 = s / (s + woda)",
        "s = p · woda / (100 − p)",
        "s = 10 · 18 / (100 − 10) = 180/90",
        "= 2",
        "2 kg soli"
      )
    },
    {
      id: "r8",
      prompt: "Trzeba przygotować 10 kg roztworu 5-procentowego. Ile wody i ile cukru należy użyć?",
      fields: [
        { label: "cukier", unit: "kg", value: 0.5, tol: 0.05 },
        { label: "woda",   unit: "kg", value: 9.5, tol: 0.05 }
      ],
      hint: buildHint(
        "całość = 10 kg, p = 5% cukru",
        "ile cukru i wody",
        "cukier = (p/100) · całość;  woda = całość − cukier",
        "cukier = 0,05 · 10 = 0,5;  woda = 10 − 0,5"
      ),
      solution: buildSolution(
        "całość = 10 kg; p = 5% cukru",
        "cukier i woda",
        "cukier = (p/100) · całość",
        null,
        "cukier = 5/100 · 10 = 0,5 kg;  woda = 10 − 0,5",
        "woda = 9,5 kg",
        "0,5 kg cukru i 9,5 kg wody"
      )
    },
    {
      id: "r9",
      prompt: "Karton soku rozlano do trzech szklanek w stosunku 2:3:5. W najmniejszej szklance jest 220 ml. Ile soku jest w pozostałych dwóch (środkowa, największa)?",
      fields: [
        { label: "środkowa", unit: "ml", value: 330, tol: 1 },
        { label: "największa", unit: "ml", value: 550, tol: 1 }
      ],
      hint: buildHint(
        "stosunek 2:3:5; najmniejsza = 220 ml = 2 części",
        "obie pozostałe",
        "1 część = 220/2 = 110 ml.  Środkowa = 3·110;  największa = 5·110",
        "Albo proporcjonalnie: środkowa/najmniejsza = 3/2"
      ),
      solution: buildSolution(
        "stosunek 2:3:5; najmniejsza = 220 ml (2 części)",
        "środkowa i największa",
        "1 część = najmniejsza / 2",
        "Każda część = 220 / 2 = 110 ml",
        "środkowa = 3 · 110;  największa = 5 · 110",
        "= 330 ml i 550 ml",
        "330 ml i 550 ml"
      )
    },
    {
      id: "r10",
      prompt: "20 litrów wody rozlano do dwóch pojemników w stosunku 2:3. Ile wody jest w każdym pojemniku (mniejszy, większy)?",
      fields: [
        { label: "mniejszy", unit: "L", value: 8, tol: 0.05 },
        { label: "większy",  unit: "L", value: 12, tol: 0.05 }
      ],
      hint: buildHint(
        "total = 20 L, stosunek 2:3",
        "obie ilości",
        "część_i = total · ratio_i / Σratio",
        "Σ = 5.  mniejszy = 20 · 2/5;  większy = 20 · 3/5"
      ),
      solution: buildSolution(
        "total = 20 L; stosunek 2:3",
        "obie ilości",
        "część_i = total · ratio_i / Σratio",
        null,
        "Σ = 2+3 = 5.  mniejszy = 20 · 2/5 = 8;  większy = 20 · 3/5 = 12",
        "= 8 L i 12 L",
        "8 L i 12 L"
      )
    }
  ];

  function ratioGen() {
    const t = rand(1, 4);
    if (t === 1) {
      // Podział total w stosunku a:b
      const a = pick([1, 2, 3, 4, 5]); const b = pick([1, 2, 3, 4, 5, 7]);
      const sum = a + b; const total = sum * pick([4, 5, 6, 8, 10, 20]);
      const r = M.ratioSplit2(total, a, b);
      return {
        id: `rg1-${total}-${a}-${b}`,
        prompt: `Podziel ${total} w stosunku ${a}:${b}. Podaj obie części (pierwszą i drugą).`,
        fields: [
          { label: `${a} cz.`, unit: "", value: r.first, tol: 0.05 },
          { label: `${b} cz.`, unit: "", value: r.second, tol: 0.05 }
        ],
        hint: buildHint(`total = ${total}, stosunek ${a}:${b}`, "obie części", "część = total · ratio/Σratio", `Σ = ${sum}; pierwsza = ${total}·${a}/${sum}; druga = ${total}·${b}/${sum}`),
        solution: buildSolution(`total = ${total}; stosunek ${a}:${b}`, "obie części", "część_i = total · ratio_i / Σratio", null,
          `Σ = ${sum}.  pierwsza = ${total}·${a}/${sum} = ${fmt(r.first)}.  druga = ${total}·${b}/${sum} = ${fmt(r.second)}`,
          `${fmt(r.first)} i ${fmt(r.second)}`,
          `${fmt(r.first)} i ${fmt(r.second)}`)
      };
    }
    if (t === 2) {
      // Druga część stosunku 2 części z znaną pierwszą
      const a = pick([2, 3, 4, 5]); const b = pick([3, 4, 5, 7, 9]);
      if (a === b) { return ratioGen(); } // unikamy 2:2
      const knownPart = a < b ? a : b; const otherPart = a < b ? b : a;
      const knownVal = pick([12, 15, 18, 24, 30]);
      const otherVal = M.ratioOtherPart(knownVal, knownPart, otherPart);
      return {
        id: `rg2-${knownVal}-${a}-${b}`,
        prompt: `Pewien ciężar podzielono w stosunku ${a}:${b}. Lżejsza część waży ${knownVal} kg. Ile waży druga część?`,
        fields: [{ label: "druga", unit: "kg", value: otherVal, tol: 0.05 }],
        hint: buildHint(`stosunek ${a}:${b}, lżejsza = ${knownVal} kg`, "cięższa", "wagi proporcjonalne", `druga = lżejsza · ${otherPart}/${knownPart} = ${knownVal} · ${otherPart}/${knownPart}`),
        solution: buildSolution(`stosunek ${a}:${b}; lżejsza = ${knownVal} kg`, "cięższa część", "wagi są proporcjonalne", "druga = lżejsza · większa_część_stosunku / mniejsza_część_stosunku",
          `${knownVal} · ${otherPart}/${knownPart}`, `= ${fmt(otherVal)}`, `${fmt(otherVal)} kg`)
      };
    }
    if (t === 3) {
      // Roztwór: ile soli do W kg wody dla p%
      const water = pick([18, 20, 30, 50, 90, 100]); const p = pick([5, 10, 20, 25]);
      const salt = M.saltForSolution(water, p);
      return {
        id: `rg3-${water}-${p}`,
        prompt: `Ile soli trzeba dodać do ${water} kg wody, aby otrzymać roztwór ${p}-procentowy?`,
        fields: [{ label: "sól", unit: "kg", value: salt, tol: 0.05 }],
        hint: buildHint(`woda = ${water} kg; p = ${p}%`, "masa soli", "p/100 = s/(s+woda)", `s = p·woda/(100−p) = ${p}·${water}/${100-p}`),
        solution: buildSolution(`woda = ${water} kg; p = ${p}%`, "masa soli", "p/100 = s / (s + woda)", "s = p · woda / (100 − p)",
          `s = ${p} · ${water} / (100 − ${p}) = ${p*water}/${100-p}`, `= ${fmt(salt)}`, `${fmt(salt)} kg`)
      };
    }
    // t == 4: Mieszanina X kg roztworu p% — ile składnika i wody
    const total = pick([1, 2, 5, 10, 20]); const p = pick([5, 10, 15, 20, 25, 50]);
    const comp = M.solutionComponents(total, p);
    return {
      id: `rg4-${total}-${p}`,
      prompt: `Trzeba przygotować ${total} kg roztworu ${p}-procentowego. Ile potrzeba składnika (cukru/soli) i ile wody?`,
      fields: [
        { label: "składnik", unit: "kg", value: comp.salt, tol: 0.05 },
        { label: "woda",     unit: "kg", value: comp.water, tol: 0.05 }
      ],
      hint: buildHint(`razem = ${total} kg; p = ${p}%`, "składnik i woda", "składnik = (p/100)·total;  woda = total − składnik", `składnik = ${p/100}·${total}`),
      solution: buildSolution(`razem = ${total} kg; p = ${p}%`, "składnik i woda", "składnik = (p/100)·total;  woda = total − składnik", null,
        `składnik = ${p}/100 · ${total} = ${fmt(comp.salt)};  woda = ${total} − ${fmt(comp.salt)} = ${fmt(comp.water)}`,
        `${fmt(comp.salt)} i ${fmt(comp.water)}`,
        `${fmt(comp.salt)} kg składnika i ${fmt(comp.water)} kg wody`)
    };
  }

  // ============= KATEGORIA 4: PRAWDOPODOBIEŃSTWO =============
  const probabilityStatic = [
    {
      id: "pr1",
      prompt: "Wojtek rzuca kostką do gry. Numerujemy poniedziałek=1 do sobota=6. Oblicz prawdopodobieństwo, że dniem sprzątania NIE BĘDZIE środa (3). Podaj wynik jako ułamek a/b.",
      fields: [{ label: "P", unit: "", value: 5/6, tol: 0.01 }],
      hint: buildHint(
        "Kostka 6 ścian (1-6). Środa = 3 (jedna)",
        "P(nie środa)",
        "P = #korzystne / #wszystkie",
        "korzystne = 5 (wszystkie oprócz 3); wszystkie = 6"
      ),
      solution: buildSolution(
        "kostka 6 ścian; środa = 3",
        "P(nie środa)",
        "P = #korzystne / #wszystkie",
        null,
        "korzystne = {1,2,4,5,6} = 5;  wszystkie = 6",
        "P = 5/6",
        "5/6 ≈ 0,833"
      )
    },
    {
      id: "pr2",
      prompt: "Jakie jest prawdopodobieństwo wyrzucenia szóstki (sobota = 6) na zwykłej kostce do gry?",
      fields: [{ label: "P", unit: "", value: 1/6, tol: 0.01 }],
      hint: buildHint(
        "kostka 6-ścienna",
        "P(6)",
        "P = #korzystne / #wszystkie",
        "korzystne = 1 (tylko jedna szóstka); wszystkie = 6"
      ),
      solution: buildSolution(
        "kostka 6 ścian",
        "P(6)",
        "P = #korzystne / #wszystkie",
        null,
        "korzystne = {6} = 1;  wszystkie = 6",
        "P = 1/6",
        "1/6 ≈ 0,167"
      )
    },
    {
      id: "pr3",
      prompt: "Jakie jest prawdopodobieństwo, że dzień sprzątania (kostka, dni 1-6) wypadnie NIE PÓŹNIEJ NIŻ W PIĄTEK (czyli 1-5)?",
      fields: [{ label: "P", unit: "", value: 5/6, tol: 0.01 }],
      hint: buildHint(
        "kostka 6 scian, dni: pon=1...sob=6. Nie pozniej niz w piatek znaczy 1,2,3,4,5",
        "P(1 do 5)",
        "P = #korzystne / #wszystkie",
        "korzystne = 5; wszystkie = 6"
      ),
      solution: buildSolution(
        "kostka 6 ścian; nie później niż w piątek = {1,2,3,4,5}",
        "P(≤5)",
        "P = #korzystne / #wszystkie",
        null,
        "korzystne = 5;  wszystkie = 6",
        "P = 5/6",
        "5/6 ≈ 0,833"
      )
    },
    {
      id: "pr4",
      prompt: "W pojemniku jest 1 biała kula, 2 czerwone i 6 czarnych (czarnych jest 3 razy więcej niż czerwonych, a czerwonych 2 razy więcej niż białych). Jakie jest prawdopodobieństwo, że wylosowana kula NIE BĘDZIE CZERWONA?",
      fields: [{ label: "P", unit: "", value: 7/9, tol: 0.01 }],
      hint: buildHint(
        "razem = 1 + 2 + 6 = 9 kul; nie czerwone = białe + czarne = 1 + 6 = 7",
        "P(nie czerwona)",
        "P = #korzystne / #wszystkie",
        "P = 7/9"
      ),
      solution: buildSolution(
        "1 biała, 2 czerwone, 6 czarnych — razem 9 kul",
        "P(nie czerwona)",
        "P = #korzystne / #wszystkie",
        null,
        "nie czerwone = 1 + 6 = 7;  wszystkich = 9",
        "P = 7/9",
        "7/9 ≈ 0,778"
      )
    },
    {
      id: "pr5",
      prompt: "Kasia rzuca kostką. Zdarzenie A: wypadną więcej niż 2 oczka. Zdarzenie B: wypadnie mniej niż 5 oczek. Oblicz P(A) + P(B). Podaj jako ułamek.",
      fields: [{ label: "P(A)+P(B)", unit: "", value: 4/3, tol: 0.01 }],
      hint: buildHint(
        "Kostka 6-ścienna. A: {3,4,5,6} (więcej niż 2). B: {1,2,3,4} (mniej niż 5)",
        "P(A) + P(B)",
        "P = #korzystne / 6 dla każdego, potem dodajemy",
        "P(A) = 4/6, P(B) = 4/6, suma = 8/6 = 4/3"
      ),
      solution: buildSolution(
        "kostka; A: >2 oczka = {3,4,5,6}; B: <5 oczek = {1,2,3,4}",
        "P(A) + P(B)",
        "P = #korzystne / 6",
        null,
        "P(A) = 4/6 = 2/3;  P(B) = 4/6 = 2/3;  suma = 4/3",
        "= 4/3 ≈ 1,33 (większa niż 1!)",
        "4/3 ≈ 1,33"
      )
    },
    {
      id: "pr6",
      prompt: "W klasach 8a, 8b, 8c jest odpowiednio: 8a → 25 osób (12 dziewcząt, 13 chłopców), 8b → 32 osoby (15 dziewcząt, 17 chłopców), 8c → 30 osób (18 dziewcząt, 12 chłopców). Łącznie 87 osób. Jakie jest prawdopodobieństwo wylosowania osoby z klasy 8c? Podaj ułamek.",
      fields: [{ label: "P", unit: "", value: 30/87, tol: 0.01 }],
      hint: buildHint(
        "razem 87 osób; klasa 8c = 30 osób",
        "P(8c)",
        "P = #korzystne / #wszystkie = 30/87",
        "Można skrócić: 30/87 = 10/29"
      ),
      solution: buildSolution(
        "razem 87 osób; 8c = 30 osób",
        "P(8c)",
        "P = #korzystne / #wszystkie",
        "Skracamy ułamek",
        "P = 30/87 = 10/29",
        "≈ 0,345",
        "30/87 = 10/29 ≈ 0,345"
      )
    },
    {
      id: "pr7",
      prompt: "Na festynie jest 120 pączków. W 3 ukryto czerwony guzik (bilet na koncert), w 5 niebieski (bilet do parku wodnego). Jakie jest prawdopodobieństwo, że pierwsza osoba kupi pączek z JAKĄKOLWIEK nagrodą?",
      fields: [{ label: "P", unit: "", value: 8/120, tol: 0.005 }],
      hint: buildHint(
        "wszystkich pączków = 120, z nagrodą = 3 + 5 = 8",
        "P(jakakolwiek nagroda)",
        "P = #z nagrodą / #wszystkich",
        "P = 8/120 — można skrócić do 1/15"
      ),
      solution: buildSolution(
        "120 pączków; z nagrodą: 3 czerwone + 5 niebieskich = 8",
        "P(nagroda)",
        "P = #korzystne / #wszystkie",
        "Skracamy",
        "P = 8/120 = 1/15",
        "≈ 0,067",
        "8/120 = 1/15 ≈ 0,067"
      )
    },
    {
      id: "pr8",
      prompt: "Z urny z 5 kulami białymi, 3 czarnymi i 2 czerwonymi losujemy jedną kulę. Jakie jest prawdopodobieństwo, że wylosujemy kulę NIE BIAŁĄ?",
      fields: [{ label: "P", unit: "", value: 5/10, tol: 0.01 }],
      hint: buildHint(
        "razem = 5 + 3 + 2 = 10; nie białe = 3 + 2 = 5",
        "P(nie biała)",
        "P = #korzystne / #wszystkie",
        "P = 5/10 = 1/2"
      ),
      solution: buildSolution(
        "5 białych, 3 czarne, 2 czerwone — razem 10",
        "P(nie biała)",
        "P = #korzystne / #wszystkie",
        null,
        "nie białe = 3 + 2 = 5;  wszystkich = 10",
        "P = 5/10 = 1/2",
        "1/2 = 0,5"
      )
    }
  ];

  function probabilityGen() {
    const t = rand(1, 3);
    if (t === 1) {
      // Kostka — wybór dnia (dni 1-6)
      const dni = ["pon","wt","śr","czw","pt","sob"];
      const idx = rand(0, 5); const day = dni[idx];
      const kind = pick(["specific", "not", "leq"]);
      if (kind === "specific") {
        return {
          id: `prg1-spec-${day}`,
          prompt: `Rzucamy kostką (dni: pon=1, wt=2, śr=3, czw=4, pt=5, sob=6). Jakie jest prawdopodobieństwo wylosowania ${day === "pon" ? "poniedziałku" : day === "wt" ? "wtorku" : day === "śr" ? "środy" : day === "czw" ? "czwartku" : day === "pt" ? "piątku" : "soboty"} (${idx+1})?`,
          fields: [{ label: "P", unit: "", value: 1/6, tol: 0.01 }],
          hint: buildHint("kostka 6-ścienna; szukany dzień ma 1 oczko z 6", "P", "P = 1/6", "Kazdy konkretny dzien ma takie samo prawdopodobienstwo"),
          solution: buildSolution("kostka; szukany dzień", "P", "P = #korzystne / #wszystkie", null,
            `korzystne = 1, wszystkie = 6`, `P = 1/6`, `1/6 ≈ 0,167`)
        };
      } else if (kind === "not") {
        return {
          id: `prg1-not-${day}`,
          prompt: `Rzucamy kostką. Jakie jest prawdopodobieństwo, że dniem NIE BĘDZIE ${day === "pon" ? "poniedziałek" : day === "wt" ? "wtorek" : day === "śr" ? "środa" : day === "czw" ? "czwartek" : day === "pt" ? "piątek" : "sobota"} (${idx+1})?`,
          fields: [{ label: "P", unit: "", value: 5/6, tol: 0.01 }],
          hint: buildHint("kostka 6-ścienna; wykluczamy 1 dzień", "P", "P = (6−1)/6 = 5/6", "Albo: P(nie X) = 1 − P(X) = 1 − 1/6 = 5/6"),
          solution: buildSolution("kostka; wykluczamy 1 dzień", "P", "P = #korzystne / #wszystkie", null,
            "korzystne = 5, wszystkie = 6", "P = 5/6", "5/6 ≈ 0,833")
        };
      } else {
        const limit = rand(2, 5); // do limit włącznie
        return {
          id: `prg1-leq-${limit}`,
          prompt: `Rzucamy kostką. Jakie jest prawdopodobieństwo wyrzucenia liczby NIE WIĘKSZEJ NIŻ ${limit}?`,
          fields: [{ label: "P", unit: "", value: limit/6, tol: 0.01 }],
          hint: buildHint(`kostka; korzystne = {1, 2, ..., ${limit}}`, `P(≤${limit})`, "P = #korzystne / #wszystkie", `P = ${limit}/6`),
          solution: buildSolution(`kostka; ≤${limit}`, "P", "P = #korzystne / #wszystkie", null,
            `korzystne = ${limit}, wszystkie = 6`, `P = ${limit}/6`, `${limit}/6 ≈ ${(limit/6).toFixed(3).replace(".",",")}`)
        };
      }
    }
    if (t === 2) {
      // Urna z kulami w kolorach
      const a = rand(2, 7); const b = rand(2, 7); const c = rand(2, 7);
      const total = a + b + c;
      const wybor = rand(1, 3);
      const labels = ["białą", "czerwoną", "zieloną"];
      const counts = [a, b, c];
      const fav = counts[wybor-1];
      return {
        id: `prg2-${a}-${b}-${c}-${wybor}`,
        prompt: `W urnie jest ${a} białych, ${b} czerwonych i ${c} zielonych kul. Jakie jest prawdopodobieństwo wylosowania kuli ${labels[wybor-1]}?`,
        fields: [{ label: "P", unit: "", value: fav/total, tol: 0.01 }],
        hint: buildHint(`razem = ${a}+${b}+${c} = ${total}; korzystne = ${fav}`, "P", "P = #korzystne / #wszystkie", `P = ${fav}/${total}`),
        solution: buildSolution(`białe ${a}, czerwone ${b}, zielone ${c}; razem ${total}`, "P", "P = #korzystne / #wszystkie", null,
          `P = ${fav}/${total}`, `≈ ${(fav/total).toFixed(3).replace(".",",")}`, `${fav}/${total}`)
      };
    }
    // t == 3: NIE konkretny kolor
    const a = rand(2, 7); const b = rand(2, 7); const c = rand(2, 7);
    const total = a + b + c;
    const wybor = rand(1, 3);
    const labels = ["białej", "czerwonej", "zielonej"];
    const counts = [a, b, c];
    const fav = total - counts[wybor-1];
    return {
      id: `prg3-${a}-${b}-${c}-${wybor}`,
      prompt: `W urnie jest ${a} białych, ${b} czerwonych i ${c} zielonych kul. Jakie jest prawdopodobieństwo wylosowania kuli NIE ${labels[wybor-1]}?`,
      fields: [{ label: "P", unit: "", value: fav/total, tol: 0.01 }],
      hint: buildHint(`razem = ${total}; nie ${labels[wybor-1]} = ${fav}`, "P", "P = #korzystne / #wszystkie", `P = ${fav}/${total}`),
      solution: buildSolution(`razem = ${total}; nie ${labels[wybor-1]} = ${fav}`, "P", "P = #korzystne / #wszystkie", null,
        `P = ${fav}/${total}`, `≈ ${(fav/total).toFixed(3).replace(".",",")}`, `${fav}/${total}`)
    };
  }

  // ============= EKSPORT =============
  global.MathProblems = {
    percentStatic, percentGen,
    financeStatic, financeGen,
    ratioStatic, ratioGen,
    probabilityStatic, probabilityGen,
    getAllStatic() {
      return {
        "math-percent": percentStatic.slice(),
        "math-finance": financeStatic.slice(),
        "math-ratio": ratioStatic.slice(),
        "math-probability": probabilityStatic.slice()
      };
    },
    generate(category) {
      if (category === "math-percent") return percentGen();
      if (category === "math-finance") return financeGen();
      if (category === "math-ratio") return ratioGen();
      if (category === "math-probability") return probabilityGen();
      throw new Error("Nieznana kategoria matematyki: " + category);
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
