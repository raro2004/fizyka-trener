// problems.js — definicje zadań + generatory losowe
// Każde zadanie ma:
//   prompt: treść zadania
//   fields: [{label, unit, value, tol}] — co user wpisuje
//   hint:   tablica linijek pokazywanych przed sprawdzeniem (po kliknięciu „Podpowiedź")
//           Format łopatologiczny: dane / szukane / wzór / co przekształcić
//   solution: tablica linijek pokazywanych po błędzie — pełne podstawienie + wynik

(function (global) {
  "use strict";
  const E = global.CircuitEngine;

  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function fmt(x) { return E.fmt(x); }
  function fmtFrac(x) { return E.fmtFrac(x); }
  function fmtBoth(x) { return E.fmtBoth(x); }

  // Pomocnicza: zbuduj solution w stylu łopatologicznym
  // krokiSubst: tablica obiektów {wzór, podstawienie, wynik}
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
  function buildHint(given, unknown, formula, transformText) {
    const out = [];
    out.push("📋 Co masz dane: " + given);
    out.push("🎯 Co masz znaleźć: " + unknown);
    out.push("📐 Pasujący wzór: " + formula);
    if (transformText) out.push("✏️ Trzeba przekształcić: " + transformText);
    return out;
  }

  // ====== KATEGORIA 1: BASIC ======
  const basicStatic = [
    {
      id: "b1",
      prompt: "W czasie gotowania wody przez spiralę czajnika elektrycznego, przez którą płynie prąd o natężeniu 5,5 A, przepłynął ładunek równy 825 C. Ile trwało gotowanie wody?",
      fields: [{ label: "t", unit: "s", value: 150, tol: 0.5 }],
      hint: buildHint(
        "I = 5,5 A (natężenie prądu); q = 825 C (ładunek)",
        "t = ? (czas)",
        "I = q / t",
        "Mnożymy obie strony przez t i dzielimy przez I  →  t = q / I"
      ),
      solution: buildSolution(
        "I = 5,5 A; q = 825 C",
        "t = ?",
        "I = q / t",
        "t = q / I",
        "t = 825 C / 5,5 A",
        "t = 825 / 5,5",
        "t = 150 s"
      )
    },
    {
      id: "b2",
      prompt: "Jaki ładunek elektryczny przepłynie przez poprzeczny przekrój przewodnika w czasie 0,5 minuty, jeżeli natężenie prądu w tym czasie wynosi 8 A?",
      fields: [{ label: "q", unit: "C", value: 240, tol: 0.5 }],
      hint: buildHint(
        "t = 0,5 min — ⚠️ zamień na sekundy: t = 30 s; I = 8 A",
        "q = ? (ładunek w kulombach)",
        "I = q / t",
        "Mnożymy obie strony przez t  →  q = I · t"
      ),
      solution: buildSolution(
        "t = 0,5 min = 30 s; I = 8 A",
        "q = ?",
        "I = q / t",
        "q = I · t",
        "q = 8 A · 30 s",
        "q = 240",
        "q = 240 C"
      )
    },
    {
      id: "b3",
      prompt: "Jaki jest opór elektryczny żarówki latarki zasilanej baterią 4,5 V, jeżeli płynie przez nią prąd o natężeniu 400 mA?",
      fields: [{ label: "R", unit: "Ω", value: 11.25, tol: 0.05 }],
      hint: buildHint(
        "U = 4,5 V; I = 400 mA — ⚠️ zamień na ampery: I = 0,4 A",
        "R = ? (opór elektryczny)",
        "Prawo Ohma: R = U / I",
        "Wzór już rozwiązany ze względu na R, nie trzeba przekształcać"
      ),
      solution: buildSolution(
        "U = 4,5 V; I = 400 mA = 0,4 A",
        "R = ?",
        "R = U / I",
        null,
        "R = 4,5 V / 0,4 A",
        "R = 4,5 / 0,4 = 45/4",
        "R = 45/4 Ω = 11,25 Ω"
      )
    },
    {
      id: "b4",
      prompt: "W obwodzie płynie prąd o natężeniu 2 A. Oblicz, jakie napięcie panuje na końcach opornika, którego rezystancja wynosi 10 Ω.",
      fields: [{ label: "U", unit: "V", value: 20, tol: 0.05 }],
      hint: buildHint(
        "I = 2 A; R = 10 Ω",
        "U = ? (napięcie)",
        "Prawo Ohma: R = U / I",
        "Mnożymy obie strony przez I  →  U = I · R"
      ),
      solution: buildSolution(
        "I = 2 A; R = 10 Ω",
        "U = ?",
        "R = U / I",
        "U = I · R",
        "U = 2 A · 10 Ω",
        "U = 2 · 10",
        "U = 20 V"
      )
    },
    {
      id: "b5",
      prompt: "Jakie jest natężenie prądu płynącego przez grzałkę o oporze 44 Ω włączoną do sieci o napięciu 220 V?",
      fields: [{ label: "I", unit: "A", value: 5, tol: 0.05 }],
      hint: buildHint(
        "R = 44 Ω; U = 220 V",
        "I = ? (natężenie)",
        "Prawo Ohma: R = U / I",
        "Mnożymy obie strony przez I i dzielimy przez R  →  I = U / R"
      ),
      solution: buildSolution(
        "R = 44 Ω; U = 220 V",
        "I = ?",
        "R = U / I",
        "I = U / R",
        "I = 220 V / 44 Ω",
        "I = 220 / 44",
        "I = 5 A"
      )
    },
    {
      id: "b6",
      prompt: "Jakie napięcie panuje między końcami opornika o rezystancji 4 Ω, jeśli w ciągu 10 minut przepłynął przez niego ładunek 180 C?",
      fields: [{ label: "U", unit: "V", value: 1.2, tol: 0.05 }],
      hint: buildHint(
        "R = 4 Ω; t = 10 min — ⚠️ na sekundy: t = 600 s; q = 180 C",
        "U = ? (napięcie)",
        "Najpierw I = q / t, potem U = I · R (prawo Ohma)",
        "Dwa kroki: 1) policz I  2) policz U"
      ),
      solution: buildSolution(
        "R = 4 Ω; t = 10 min = 600 s; q = 180 C",
        "U = ?",
        "Krok 1: I = q / t.   Krok 2: U = I · R",
        null,
        "I = 180 C / 600 s = 0,3 A;  U = 0,3 A · 4 Ω",
        "U = 0,3 · 4",
        "U = 1,2 V"
      )
    },
    {
      id: "b7",
      prompt: "Lodówka włączona do sieci o napięciu 220 V pracowała 18 godzin. Licznik energii elektrycznej wskazał w tym czasie zużycie 2,16 kWh. Ile wynosiło średnie natężenie prądu?",
      fields: [{ label: "I", unit: "A", value: 6/11, tol: 0.01 }],
      hint: buildHint(
        "U = 220 V; t = 18 h; W = 2,16 kWh = 2160 Wh",
        "I = ? (natężenie)",
        "Energia: W = P · t,  Moc: P = U · I",
        "Najpierw P = W / t, potem I = P / U  (dwa kroki!)"
      ),
      solution: buildSolution(
        "U = 220 V; t = 18 h; W = 2,16 kWh = 2160 Wh",
        "I = ?",
        "Krok 1: P = W / t.  Krok 2: I = P / U",
        null,
        "P = 2160 Wh / 18 h = 120 W;  I = 120 W / 220 V",
        "I = 120 / 220 = 12/22 = 6/11",
        "I = 6/11 A ≈ 0,545 A"
      )
    },
    {
      id: "b8",
      prompt: "Ile energii elektrycznej (w kWh) pobiera żarówka o mocy 100 W przez całą dobę? Jakie jest natężenie prądu, jeśli napięcie sieci to 100 V?",
      fields: [
        { label: "W", unit: "kWh", value: 2.4, tol: 0.05 },
        { label: "I", unit: "A", value: 1, tol: 0.05 }
      ],
      hint: buildHint(
        "P = 100 W; t = 24 h; U = 100 V",
        "W = ? (energia w kWh) oraz I = ? (natężenie)",
        "W = P · t (energia);  I = P / U (z mocy)",
        "Pamiętaj: 1 kWh = 1000 Wh, więc Wh / 1000 = kWh"
      ),
      solution: buildSolution(
        "P = 100 W; t = 24 h; U = 100 V",
        "W = ? oraz I = ?",
        "W = P · t,  I = P / U",
        null,
        "W = 100 W · 24 h = 2400 Wh;  I = 100 W / 100 V",
        "W = 2400 / 1000 kWh;  I = 100/100",
        "W = 2,4 kWh; I = 1 A"
      )
    },
    {
      id: "b9",
      prompt: "Żelazko o mocy 2200 W dostosowane jest do napięcia sieciowego 220 V. Oblicz natężenie prądu płynącego przez żelazko.",
      fields: [{ label: "I", unit: "A", value: 10, tol: 0.05 }],
      hint: buildHint(
        "P = 2200 W; U = 220 V",
        "I = ? (natężenie)",
        "P = U · I",
        "Dzielimy obie strony przez U  →  I = P / U"
      ),
      solution: buildSolution(
        "P = 2200 W; U = 220 V",
        "I = ?",
        "P = U · I",
        "I = P / U",
        "I = 2200 W / 220 V",
        "I = 2200 / 220",
        "I = 10 A"
      )
    },
    {
      id: "b10",
      prompt: "Elektryczny piec oporowy w ciągu 20 minut pobrał z sieci energię 3,5 kWh przy natężeniu prądu 50 A. Oblicz moc i opór pieca.",
      fields: [
        { label: "P", unit: "kW", value: 10.5, tol: 0.1 },
        { label: "R", unit: "Ω", value: 4.2, tol: 0.05 }
      ],
      hint: buildHint(
        "t = 20 min — ⚠️ na godziny: t = 1/3 h; W = 3,5 kWh; I = 50 A",
        "P = ? (moc) oraz R = ? (opór)",
        "P = W / t, potem U = P / I, potem R = U / I",
        "Trzy kroki: 1) P 2) U z mocy 3) R z prawa Ohma"
      ),
      solution: buildSolution(
        "t = 20 min = 1/3 h; W = 3,5 kWh; I = 50 A",
        "P = ? oraz R = ?",
        "P = W/t;  U = P/I;  R = U/I",
        null,
        "P = 3,5 kWh / (1/3 h) = 3,5·3 = 10,5 kW = 10500 W;  U = 10500/50 = 210 V;  R = 210/50",
        "R = 210/50 = 21/5",
        "P = 10,5 kW; R = 21/5 Ω = 4,2 Ω"
      )
    },
    {
      id: "b11",
      prompt: "Silnik o mocy 1,1 kW zasilany jest napięciem 220 V. Jakie jest natężenie prądu pobieranego przez ten silnik?",
      fields: [{ label: "I", unit: "A", value: 5, tol: 0.05 }],
      hint: buildHint(
        "P = 1,1 kW — ⚠️ na waty: P = 1100 W; U = 220 V",
        "I = ? (natężenie)",
        "P = U · I",
        "I = P / U"
      ),
      solution: buildSolution(
        "P = 1,1 kW = 1100 W; U = 220 V",
        "I = ?",
        "P = U · I",
        "I = P / U",
        "I = 1100 W / 220 V",
        "I = 1100 / 220",
        "I = 5 A"
      )
    },
    {
      id: "b12",
      prompt: "Rozrusznik samochodowy zasilany z akumulatora 12 V ma moc 0,48 kW. Oblicz natężenie prądu w instalacji w chwili włączenia rozrusznika.",
      fields: [{ label: "I", unit: "A", value: 40, tol: 0.05 }],
      hint: buildHint(
        "U = 12 V; P = 0,48 kW = 480 W",
        "I = ? (natężenie)",
        "P = U · I",
        "I = P / U"
      ),
      solution: buildSolution(
        "U = 12 V; P = 0,48 kW = 480 W",
        "I = ?",
        "P = U · I",
        "I = P / U",
        "I = 480 W / 12 V",
        "I = 480 / 12",
        "I = 40 A"
      )
    },
    {
      id: "b13",
      prompt: "Opór zastępczy trzech oporników połączonych równolegle, z których dwa mają wartość 8 Ω i 16 Ω, wynosi 2 Ω. Jaką wartość ma opór trzeciego opornika?",
      fields: [{ label: "R₃", unit: "Ω", value: 3.2, tol: 0.05 }],
      hint: buildHint(
        "R₁ = 8 Ω; R₂ = 16 Ω; R_z = 2 Ω (równolegle)",
        "R₃ = ? (trzeci opornik)",
        "Równolegle: 1/R_z = 1/R₁ + 1/R₂ + 1/R₃",
        "Przenosimy 1/R₁ + 1/R₂ na lewą stronę  →  1/R₃ = 1/R_z − 1/R₁ − 1/R₂"
      ),
      solution: buildSolution(
        "R₁ = 8 Ω; R₂ = 16 Ω; R_z = 2 Ω",
        "R₃ = ?",
        "1/R_z = 1/R₁ + 1/R₂ + 1/R₃",
        "1/R₃ = 1/R_z − 1/R₁ − 1/R₂",
        "1/R₃ = 1/2 − 1/8 − 1/16 = 8/16 − 2/16 − 1/16",
        "1/R₃ = 5/16, więc R₃ = 16/5",
        "R₃ = 16/5 Ω = 3,2 Ω"
      )
    },
    {
      id: "b14",
      prompt: "Jak zmieni się opór elektryczny układu dwóch identycznych oporników połączonych równolegle, jeżeli połączymy je szeregowo? (Ile razy wzrośnie opór?)",
      fields: [{ label: "krotność", unit: "razy", value: 4, tol: 0.05 }],
      hint: buildHint(
        "Dwa identyczne oporniki o oporze R każdy",
        "Stosunek R_szereg / R_równol = ?",
        "Równolegle (2 te same): R_eq = R/2.  Szeregowo (2 te same): R_eq = 2R",
        "Dzielimy: 2R / (R/2) = 4"
      ),
      solution: buildSolution(
        "Niech opór każdego = R",
        "Ile razy wzrośnie opór po zmianie z równol. na szereg?",
        "Równolegle 2 takie same: R₍r₎ = R/2.  Szeregowo: R₍s₎ = 2R",
        "Stosunek: R₍s₎ / R₍r₎ = 2R / (R/2)",
        "= 2R · 2/R",
        "= 4",
        "Opór wzrośnie 4 razy"
      )
    }
  ];

  // Generator losowych zadań typu BASIC — z łopatologiczną solution
  function basicGen() {
    const t = rand(1, 8);
    if (t === 1) {
      const I = rand(2, 12), tt = rand(10, 600);
      const q = I * tt;
      return {
        id: "bg1-" + I + "-" + tt,
        prompt: `Przez przewodnik płynie prąd o natężeniu ${I} A przez ${tt} sekund. Jaki ładunek przepłynął przez przekrój przewodnika?`,
        fields: [{ label: "q", unit: "C", value: q, tol: 0.05 }],
        hint: buildHint(`I = ${I} A; t = ${tt} s`, "q = ?", "I = q / t", "q = I · t"),
        solution: buildSolution(`I = ${I} A; t = ${tt} s`, "q = ?", "I = q / t", "q = I · t",
          `q = ${I} A · ${tt} s`, `q = ${I} · ${tt}`, `q = ${q} C`)
      };
    }
    if (t === 2) {
      const I = rand(2, 10), tt = rand(5, 60); const q = I * tt;
      return {
        id: "bg2-" + q + "-" + tt,
        prompt: `Przez przewodnik w ciągu ${tt} s przepłynął ładunek ${q} C. Oblicz natężenie prądu.`,
        fields: [{ label: "I", unit: "A", value: I, tol: 0.05 }],
        hint: buildHint(`q = ${q} C; t = ${tt} s`, "I = ?", "I = q / t", "wzór już rozwiązany ze względu na I"),
        solution: buildSolution(`q = ${q} C; t = ${tt} s`, "I = ?", "I = q / t", null,
          `I = ${q} C / ${tt} s`, `I = ${q} / ${tt}`, `I = ${fmtFrac(I)} A`)
      };
    }
    if (t === 3) {
      const I = rand(1, 10), R = rand(2, 50); const U = I * R;
      return {
        id: "bg3-" + I + "-" + R,
        prompt: `W obwodzie płynie prąd ${I} A. Jakie napięcie panuje na końcach opornika ${R} Ω?`,
        fields: [{ label: "U", unit: "V", value: U, tol: 0.05 }],
        hint: buildHint(`I = ${I} A; R = ${R} Ω`, "U = ?", "Prawo Ohma: R = U / I", "U = I · R"),
        solution: buildSolution(`I = ${I} A; R = ${R} Ω`, "U = ?", "R = U / I", "U = I · R",
          `U = ${I} A · ${R} Ω`, `U = ${I} · ${R}`, `U = ${U} V`)
      };
    }
    if (t === 4) {
      const I = pick([1, 2, 4, 5, 10]), R = rand(4, 50); const U = I * R;
      return {
        id: "bg4-" + U + "-" + R,
        prompt: `Jakie natężenie prądu płynie przez opornik ${R} Ω podłączony do napięcia ${U} V?`,
        fields: [{ label: "I", unit: "A", value: I, tol: 0.05 }],
        hint: buildHint(`U = ${U} V; R = ${R} Ω`, "I = ?", "R = U / I", "I = U / R"),
        solution: buildSolution(`U = ${U} V; R = ${R} Ω`, "I = ?", "R = U / I", "I = U / R",
          `I = ${U} V / ${R} Ω`, `I = ${U} / ${R}`, `I = ${I} A`)
      };
    }
    if (t === 5) {
      const I = pick([1, 2, 4, 5]), R = rand(4, 30); const U = I * R;
      return {
        id: "bg5-" + U + "-" + I,
        prompt: `Przez opornik podłączony do ${U} V płynie prąd ${I} A. Oblicz opór elektryczny opornika.`,
        fields: [{ label: "R", unit: "Ω", value: R, tol: 0.05 }],
        hint: buildHint(`U = ${U} V; I = ${I} A`, "R = ?", "R = U / I", "wzór gotowy"),
        solution: buildSolution(`U = ${U} V; I = ${I} A`, "R = ?", "R = U / I", null,
          `R = ${U} V / ${I} A`, `R = ${U} / ${I}`, `R = ${R} Ω`)
      };
    }
    if (t === 6) {
      const U = pick([12, 24, 110, 220]), I = rand(1, 12); const P = U * I;
      return {
        id: "bg6-" + U + "-" + I,
        prompt: `Urządzenie podłączone do napięcia ${U} V pobiera prąd ${I} A. Jaką ma moc?`,
        fields: [{ label: "P", unit: "W", value: P, tol: 0.05 }],
        hint: buildHint(`U = ${U} V; I = ${I} A`, "P = ?", "P = U · I", "wzór gotowy"),
        solution: buildSolution(`U = ${U} V; I = ${I} A`, "P = ?", "P = U · I", null,
          `P = ${U} V · ${I} A`, `P = ${U} · ${I}`, `P = ${P} W`)
      };
    }
    if (t === 7) {
      const U = pick([12, 24, 110, 220]), I = pick([2, 5, 10]); const P = U * I;
      return {
        id: "bg7-" + P + "-" + U,
        prompt: `Urządzenie o mocy ${P} W zasilane napięciem ${U} V. Jakie natężenie prądu pobiera?`,
        fields: [{ label: "I", unit: "A", value: I, tol: 0.05 }],
        hint: buildHint(`P = ${P} W; U = ${U} V`, "I = ?", "P = U · I", "I = P / U"),
        solution: buildSolution(`P = ${P} W; U = ${U} V`, "I = ?", "P = U · I", "I = P / U",
          `I = ${P} W / ${U} V`, `I = ${P} / ${U}`, `I = ${I} A`)
      };
    }
    // t === 8: W = U·I·t (energia)
    const U = pick([110, 220]), I = rand(2, 10), tH = rand(2, 10);
    const Wkwh = (U * I * tH) / 1000;
    return {
      id: "bg8-" + U + "-" + I + "-" + tH,
      prompt: `Urządzenie pracuje ${tH} h przy napięciu ${U} V i natężeniu ${I} A. Ile energii (w kWh) zużyje?`,
      fields: [{ label: "W", unit: "kWh", value: Wkwh, tol: 0.01 }],
      hint: buildHint(
        `U = ${U} V; I = ${I} A; t = ${tH} h`, "W = ? (energia w kWh)",
        "W = U · I · t (najpierw w Wh)", "Pamiętaj: 1 kWh = 1000 Wh"
      ),
      solution: buildSolution(
        `U = ${U} V; I = ${I} A; t = ${tH} h`, "W = ?",
        "W = U · I · t", null,
        `W = ${U} V · ${I} A · ${tH} h`, `W = ${U * I * tH} Wh = ${U * I * tH}/1000 kWh`,
        `W = ${fmtFrac(Wkwh)} kWh`
      )
    };
  }

  // ====== KATEGORIA 2: RZ ======
  const rzStatic = [
    { id: "r1a", net: ["s", 3, 4, 1], expected: 8, prompt: "R₁=3 Ω, R₂=4 Ω, R₃=1 Ω połączone szeregowo." },
    { id: "r1b", net: ["p", 2, 4, 6], expected: 12/11, prompt: "R₁=2 Ω, R₂=4 Ω, R₃=6 Ω połączone równolegle." },
    { id: "r1c", net: ["p", ["s", 1, 2, 3], ["s", 4, 2]], expected: 3,
      prompt: "Dwie gałęzie równoległe: gałąź A: R₁=1 + R₂=2 + R₃=3 (szeregowo); gałąź B: R₄=4 + R₅=2 (szeregowo). Oblicz Rz." },
    { id: "r1d", net: ["s", ["p", ["s", 3, 4], 7], 1.5], expected: 5,
      prompt: "Układ: ((R₁=3 + R₂=4) równolegle z R₃=7), wszystko szeregowo z R₄=1,5." },
    { id: "r1e", net: ["s", ["p", ["s", 1, 4], 5], 1, ["p", 6, 6, 6]], expected: 5.5,
      prompt: "Układ: ((R₁=1 + R₂=4) ∥ R₃=5) — R₄=1 — (R₅=R₆=R₇=6 wszystkie równolegle)." },
    { id: "r1f", net: ["s", 1.5, ["p", ["s", ["p", 4, 2], 2/3], 2], ["p", 6, 3, 6]], expected: 4,
      prompt: "Układ złożony: R₁=1,5 — ((R₂=4 ∥ R₃=2) + R₄=2/3) ∥ R₈=2 — (R₅=6 ∥ R₆=3 ∥ R₇=6)." }
  ];

  function rzGen() {
    const niceR = [1, 2, 3, 4, 5, 6, 8, 10, 12];
    const level = rand(1, 4);
    let net;
    if (level === 1) {
      net = ["s", pick(niceR), pick(niceR)];
    } else if (level === 2) {
      const pairs = [[2,2],[3,6],[4,4],[2,6],[4,12],[6,6],[2,3],[6,3],[10,10],[8,8]];
      const p = pick(pairs); net = ["p", p[0], p[1]];
    } else if (level === 3) {
      const pairs = [[2,2],[3,6],[4,4],[6,3],[8,8]];
      const p = pick(pairs);
      net = ["s", pick(niceR), ["p", p[0], p[1]]];
    } else {
      const a = pick([2,3,4]), b = pick([2,3,4]); const sum = a + b;
      const c = pick([sum, sum*2, sum/2 || sum]);
      const d = pick([1,2,3]);
      net = ["s", ["p", ["s", a, b], c], d];
    }
    const withIds = E.assignIds(net);
    const Rz = E.Rz(withIds);
    return buildRzTask({ id: "rg-" + JSON.stringify(net), net: withIds, expected: Rz, prompt: "Układ: " + E.describeNet(withIds) });
  }

  function buildRzTask(item) {
    const withIds = E.assignIds(item.net);
    const exp = E.explainRz(withIds);
    const Rz = item.expected;
    return {
      id: item.id,
      net: withIds,
      prompt: item.prompt + " Oblicz opór zastępczy układu.",
      fields: [{ label: "R_z", unit: "Ω", value: Rz, tol: 0.02 }],
      hint: [
        "📋 Dane: oporniki w układzie szeregowo-równoległym (patrz schemat)",
        "🎯 Szukane: R_z (opór zastępczy)",
        "📐 Reguły: SZEREGOWO sumujemy (R = R₁+R₂+…); RÓWNOLEGLE sumujemy odwrotności (1/R = 1/R₁ + 1/R₂ + …)",
        "✏️ Strategia: znajdź najmniejsze grupy szeregowe lub równoległe, policz je, zastąp jednym oporem zastępczym, powtarzaj"
      ],
      solution: ["📐 ROZWIĄZANIE krok po kroku:"].concat(
        exp.steps.map(s => "   • " + s)
      ).concat([`✅ ODPOWIEDŹ: R_z = ${fmtFrac(Rz)} Ω`])
    };
  }

  // ====== KATEGORIA 3: MIXED ======
  const mixedStatic = [
    { id: "m3a", U: 12, net: ["p", 4, 12], descr: "R₁=4 Ω ∥ R₂=12 Ω" },
    { id: "m3b", U: 10, net: ["s", 1, 4], descr: "R₁=1 Ω, R₂=4 Ω szeregowo" },
    { id: "m3c", U: 32, net: ["s", 2, ["p", 8, 24]], descr: "R₁=2 Ω szeregowo z (R₂=8 Ω ∥ R₃=24 Ω)" },
    { id: "m3d", U: 24, net: ["p", ["s", 4, 8], 6], descr: "(R₁=4 + R₂=8) ∥ R₃=6" },
    { id: "m3e", U: 24, net: ["s", 2, 1, ["p", 4, 12]], descr: "R₁=2 — R₂=1 — (R₃=4 ∥ R₄=12)" },
    { id: "m3f", U: 15, net: ["s", 3, ["p", ["s", 5, 1], 3]], descr: "R₁=3 + ((R₂=5 + R₃=1) ∥ R₄=3)" },
    { id: "m3g", U: 30, net: ["s", 3, 1, ["p", ["s", 10, 8], 9]], descr: "R₁=3 — R₂=1 — ((R₃=10 + R₄=8) ∥ R₅=9)" }
  ];

  function buildMixedTask(item) {
    const withIds = E.assignIds(item.net);
    const sol = E.solve(withIds, item.U);
    const leaves = E.flattenSolution(sol);
    leaves.sort((a, b) => a.id - b.id);
    const fields = [{ label: "R_z", unit: "Ω", value: sol.R, tol: 0.05 }, { label: "I (całkowite)", unit: "A", value: sol.I, tol: 0.05 }];
    leaves.forEach(l => {
      fields.push({ label: `U${l.id}`, unit: "V", value: l.U, tol: 0.05 });
      fields.push({ label: `I${l.id}`, unit: "A", value: l.I, tol: 0.05 });
    });
    return {
      id: item.id,
      net: withIds,
      U: item.U,
      prompt: `Dany jest układ: ${item.descr}, podłączony do napięcia U = ${item.U} V. Oblicz: R_z, I całkowite, oraz U i I na każdym oporniku.`,
      fields,
      hint: [
        `📋 Dane: U = ${item.U} V; oporniki według schematu`,
        "🎯 Szukane: R_z, I (całkowite), U₁, I₁, U₂, I₂, … (na każdym oporniku)",
        "📐 Trzy kroki:",
        "   1) policz R_z (jak w zadaniach z oporu zastępczego)",
        "   2) prąd całkowity: I = U / R_z (prawo Ohma)",
        "   3) idź od źródła do liści: w gałęzi szeregowej WSZĘDZIE TEN SAM PRĄD (I=I₁=I₂=…); w gałęzi równoległej WSZĘDZIE TO SAMO NAPIĘCIE (U=U₁=U₂=…)",
        "✏️ Wskazówka: jak masz I i R, to U = I·R; jak masz U i R, to I = U/R"
      ],
      solution: E.explainMixed(withIds, item.U)
    };
  }

  function mixedGen() {
    const Uvalues = [6, 9, 12, 18, 24, 30, 36];
    const level = rand(1, 3);
    let net, U = pick(Uvalues);
    if (level === 1) {
      const a = pick([1,2,3,4]); const b = pick([2,3,4,6]);
      net = ["s", a, b];
      const Rz = a + b; U = Rz * pick([1,2,3]);
    } else if (level === 2) {
      const pairs = [[2,2],[3,6],[4,4],[2,6],[4,12],[6,6],[6,3]];
      const p = pick(pairs); net = ["p", p[0], p[1]];
      const Rz = (p[0]*p[1])/(p[0]+p[1]); U = Math.round(Rz) * pick([2,3,4,6]);
      if (!Number.isInteger(U)) U = pick(Uvalues);
    } else {
      const a = pick([1,2,3]); const pairs = [[2,2],[3,6],[4,4],[6,3]];
      const p = pick(pairs);
      net = ["s", a, ["p", p[0], p[1]]];
      const Rz = a + (p[0]*p[1])/(p[0]+p[1]);
      U = Math.round(Rz) * pick([2,3,4,6]);
    }
    const withIds = E.assignIds(net);
    return buildMixedTask({ id: "mg-" + JSON.stringify(net) + "-" + U, U, net, descr: E.describeNet(withIds) });
  }

  global.PhysicsProblems = {
    basicStatic, basicGen,
    rzStatic, rzGen, buildRzTask,
    mixedStatic, mixedGen, buildMixedTask,
    getAllStatic() {
      return {
        basic: basicStatic.slice(),
        rz: rzStatic.map(buildRzTask),
        mixed: mixedStatic.map(buildMixedTask)
      };
    },
    generate(category) {
      if (category === "basic") return basicGen();
      if (category === "rz") return rzGen();
      if (category === "mixed") return mixedGen();
      throw new Error("Nieznana kategoria: " + category);
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
