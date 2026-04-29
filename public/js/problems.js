// problems.js — definicje zadań + generatory losowe
// Trzy kategorie:
//  1) "basic"  — wzory U=IR, q=It, P=UI, W=UIt
//  2) "rz"     — opór zastępczy
//  3) "mixed"  — układy mieszane: U i I na każdym oporniku

(function (global) {
  "use strict";
  const E = global.CircuitEngine;

  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function fmt(x) { return E.fmt(x); }

  // ====== KATEGORIA 1: BASIC ======
  // Każde zadanie ma: id, prompt, fields[{label, unit, value, tolerance}], solution[lines]

  const basicStatic = [
    {
      id: "b1",
      prompt: "W czasie gotowania wody przez spiralę czajnika elektrycznego, przez którą płynie prąd o natężeniu 5,5 A, przepłynął ładunek równy 825 C. Ile trwało gotowanie wody?",
      fields: [{ label: "t", unit: "s", value: 150, tol: 0.5 }],
      solution: [
        "Dane: I = 5,5 A; q = 825 C",
        "Wzór: I = q / t  →  t = q / I",
        "Podstawienie: t = 825 / 5,5 = 150 s"
      ]
    },
    {
      id: "b2",
      prompt: "Jaki ładunek elektryczny przepłynie przez poprzeczny przekrój przewodnika w czasie 0,5 minuty, jeżeli natężenie prądu w tym czasie wynosi 8 A?",
      fields: [{ label: "q", unit: "C", value: 240, tol: 0.5 }],
      solution: [
        "Dane: t = 0,5 min = 30 s; I = 8 A",
        "Wzór: q = I · t",
        "Podstawienie: q = 8 · 30 = 240 C"
      ]
    },
    {
      id: "b3",
      prompt: "Jaki jest opór elektryczny żarówki latarki zasilanej baterią 4,5 V, jeżeli płynie przez nią prąd o natężeniu 400 mA?",
      fields: [{ label: "R", unit: "Ω", value: 11.25, tol: 0.05 }],
      solution: [
        "Dane: U = 4,5 V; I = 400 mA = 0,4 A",
        "Wzór: R = U / I",
        "Podstawienie: R = 4,5 / 0,4 = 11,25 Ω"
      ]
    },
    {
      id: "b4",
      prompt: "W obwodzie płynie prąd o natężeniu 2 A. Oblicz, jakie napięcie panuje na końcach opornika, którego rezystancja wynosi 10 Ω.",
      fields: [{ label: "U", unit: "V", value: 20, tol: 0.05 }],
      solution: [
        "Dane: I = 2 A; R = 10 Ω",
        "Wzór: U = I · R",
        "Podstawienie: U = 2 · 10 = 20 V"
      ]
    },
    {
      id: "b5",
      prompt: "Jakie jest natężenie prądu płynącego przez grzałkę o oporze 44 Ω włączoną do sieci o napięciu 220 V?",
      fields: [{ label: "I", unit: "A", value: 5, tol: 0.05 }],
      solution: [
        "Dane: R = 44 Ω; U = 220 V",
        "Wzór: I = U / R",
        "Podstawienie: I = 220 / 44 = 5 A"
      ]
    },
    {
      id: "b6",
      prompt: "Jakie napięcie panuje między końcami opornika o rezystancji 4 Ω, jeśli w ciągu 10 minut przepłynął przez niego ładunek 180 C?",
      fields: [{ label: "U", unit: "V", value: 1.2, tol: 0.05 }],
      solution: [
        "Dane: R = 4 Ω; t = 10 min = 600 s; q = 180 C",
        "Najpierw I: I = q / t = 180 / 600 = 0,3 A",
        "Potem U: U = I · R = 0,3 · 4 = 1,2 V"
      ]
    },
    {
      id: "b7",
      prompt: "Lodówka włączona do sieci o napięciu 220 V pracowała 18 godzin. Licznik energii elektrycznej wskazał w tym czasie zużycie 2,16 kWh. Ile wynosiło średnie natężenie prądu?",
      fields: [{ label: "I", unit: "A", value: 6/11, tol: 0.01 }],
      solution: [
        "Dane: U = 220 V; t = 18 h; W = 2,16 kWh = 2160 Wh",
        "Wzór: P = W / t = 2160 / 18 = 120 W",
        "Z P = U·I  →  I = P / U = 120 / 220 = 6/11 ≈ 0,545 A"
      ]
    },
    {
      id: "b8",
      prompt: "Ile energii elektrycznej pobiera żarówka o mocy 100 W przez całą dobę? Jakie jest natężenie prądu, jeśli napięcie sieci to 100 V?",
      fields: [
        { label: "W", unit: "kWh", value: 2.4, tol: 0.05 },
        { label: "I", unit: "A", value: 1, tol: 0.05 }
      ],
      solution: [
        "Dane: P = 100 W; t = 24 h; U = 100 V",
        "W = P · t = 100 · 24 = 2400 Wh = 2,4 kWh",
        "I = P / U = 100 / 100 = 1 A"
      ]
    },
    {
      id: "b9",
      prompt: "Żelazko o mocy 2200 W dostosowane jest do napięcia sieciowego 220 V. Oblicz natężenie prądu płynącego przez żelazko.",
      fields: [{ label: "I", unit: "A", value: 10, tol: 0.05 }],
      solution: [
        "Dane: P = 2200 W; U = 220 V",
        "Wzór: I = P / U",
        "Podstawienie: I = 2200 / 220 = 10 A"
      ]
    },
    {
      id: "b10",
      prompt: "Elektryczny piec oporowy w ciągu 20 minut pobrał z sieci energię 3,5 kWh przy natężeniu prądu 50 A. Oblicz moc i opór pieca.",
      fields: [
        { label: "P", unit: "kW", value: 10.5, tol: 0.1 },
        { label: "R", unit: "Ω", value: 4.2, tol: 0.05 }
      ],
      solution: [
        "Dane: t = 20 min = 1/3 h; W = 3,5 kWh; I = 50 A",
        "P = W / t = 3,5 / (1/3) = 10,5 kW = 10500 W",
        "Z P = U·I → U = P / I = 10500 / 50 = 210 V",
        "R = U / I = 210 / 50 = 4,2 Ω"
      ]
    },
    {
      id: "b11",
      prompt: "Silnik o mocy 1,1 kW zasilany jest napięciem 220 V. Jakie jest natężenie prądu pobieranego przez ten silnik?",
      fields: [{ label: "I", unit: "A", value: 5, tol: 0.05 }],
      solution: [
        "Dane: P = 1,1 kW = 1100 W; U = 220 V",
        "Wzór: I = P / U",
        "Podstawienie: I = 1100 / 220 = 5 A"
      ]
    },
    {
      id: "b12",
      prompt: "Rozrusznik samochodowy zasilany z akumulatora 12 V ma moc 0,48 kW. Oblicz natężenie prądu w instalacji w chwili włączenia rozrusznika.",
      fields: [{ label: "I", unit: "A", value: 40, tol: 0.05 }],
      solution: [
        "Dane: U = 12 V; P = 0,48 kW = 480 W",
        "Wzór: I = P / U",
        "Podstawienie: I = 480 / 12 = 40 A"
      ]
    },
    {
      id: "b13",
      prompt: "Opór zastępczy trzech oporników połączonych równolegle, z których dwa mają wartość 8 Ω i 16 Ω, wynosi 2 Ω. Jaką wartość ma opór trzeciego opornika?",
      fields: [{ label: "R₃", unit: "Ω", value: 3.2, tol: 0.05 }],
      solution: [
        "Dane: R₁ = 8 Ω, R₂ = 16 Ω, R_z = 2 Ω",
        "Wzór: 1/R_z = 1/R₁ + 1/R₂ + 1/R₃",
        "1/2 = 1/8 + 1/16 + 1/R₃",
        "1/R₃ = 1/2 − 1/8 − 1/16 = 8/16 − 2/16 − 1/16 = 5/16",
        "R₃ = 16/5 = 3,2 Ω"
      ]
    },
    {
      id: "b14",
      prompt: "Jak zmieni się opór elektryczny układu dwóch identycznych oporników połączonych równolegle, jeżeli połączymy je szeregowo?",
      fields: [{ label: "krotność", unit: "razy", value: 4, tol: 0.05 }],
      solution: [
        "Niech opór każdego = R.",
        "Równolegle: R_eq = R/2",
        "Szeregowo: R_eq = 2R",
        "Stosunek: 2R / (R/2) = 4 → opór wzrośnie 4 razy"
      ]
    }
  ];

  // Generator losowych zadań typu BASIC — 8 wariantów wzorów
  function basicGen() {
    const t = rand(1, 8);
    if (t === 1) {
      // q = I·t  → szukaj q
      const I = rand(2, 12), tt = rand(10, 600);
      const q = I * tt;
      return {
        id: "bg1-" + I + "-" + tt,
        prompt: `Przez przewodnik płynie prąd o natężeniu ${I} A przez ${tt} sekund. Jaki ładunek przepłynął przez przekrój?`,
        fields: [{ label: "q", unit: "C", value: q, tol: 0.05 }],
        solution: [
          `Dane: I = ${I} A; t = ${tt} s`,
          `Wzór: q = I · t`,
          `Podstawienie: q = ${I} · ${tt} = ${q} C`
        ]
      };
    }
    if (t === 2) {
      // I = q/t
      const I = rand(2, 10), tt = rand(5, 60); const q = I * tt;
      return {
        id: "bg2-" + q + "-" + tt,
        prompt: `Przez przewodnik w ciągu ${tt} s przepłynął ładunek ${q} C. Oblicz natężenie prądu.`,
        fields: [{ label: "I", unit: "A", value: I, tol: 0.05 }],
        solution: [
          `Dane: q = ${q} C; t = ${tt} s`,
          `Wzór: I = q / t`,
          `Podstawienie: I = ${q} / ${tt} = ${I} A`
        ]
      };
    }
    if (t === 3) {
      // U = I·R
      const I = rand(1, 10), R = rand(2, 50); const U = I * R;
      return {
        id: "bg3-" + I + "-" + R,
        prompt: `W obwodzie płynie prąd ${I} A. Jakie napięcie panuje na końcach opornika ${R} Ω?`,
        fields: [{ label: "U", unit: "V", value: U, tol: 0.05 }],
        solution: [
          `Dane: I = ${I} A; R = ${R} Ω`,
          `Wzór (prawo Ohma): U = I · R`,
          `Podstawienie: U = ${I} · ${R} = ${U} V`
        ]
      };
    }
    if (t === 4) {
      // I = U/R
      const I = pick([1, 2, 4, 5, 10]), R = rand(4, 50); const U = I * R;
      return {
        id: "bg4-" + U + "-" + R,
        prompt: `Jakie natężenie prądu płynie przez opornik ${R} Ω podłączony do napięcia ${U} V?`,
        fields: [{ label: "I", unit: "A", value: I, tol: 0.05 }],
        solution: [
          `Dane: U = ${U} V; R = ${R} Ω`,
          `Wzór: I = U / R`,
          `Podstawienie: I = ${U} / ${R} = ${I} A`
        ]
      };
    }
    if (t === 5) {
      // R = U/I
      const I = pick([1, 2, 4, 5]), R = rand(4, 30); const U = I * R;
      return {
        id: "bg5-" + U + "-" + I,
        prompt: `Przez opornik podłączony do ${U} V płynie prąd ${I} A. Oblicz opór elektryczny opornika.`,
        fields: [{ label: "R", unit: "Ω", value: R, tol: 0.05 }],
        solution: [
          `Dane: U = ${U} V; I = ${I} A`,
          `Wzór: R = U / I`,
          `Podstawienie: R = ${U} / ${I} = ${R} Ω`
        ]
      };
    }
    if (t === 6) {
      // P = U·I
      const U = pick([12, 24, 110, 220]), I = rand(1, 12); const P = U * I;
      return {
        id: "bg6-" + U + "-" + I,
        prompt: `Urządzenie podłączone do napięcia ${U} V pobiera prąd ${I} A. Jaką ma moc?`,
        fields: [{ label: "P", unit: "W", value: P, tol: 0.05 }],
        solution: [
          `Dane: U = ${U} V; I = ${I} A`,
          `Wzór: P = U · I`,
          `Podstawienie: P = ${U} · ${I} = ${P} W`
        ]
      };
    }
    if (t === 7) {
      // I = P/U
      const U = pick([12, 24, 110, 220]), I = pick([2, 5, 10]); const P = U * I;
      return {
        id: "bg7-" + P + "-" + U,
        prompt: `Urządzenie o mocy ${P} W zasilane napięciem ${U} V. Jakie natężenie prądu pobiera?`,
        fields: [{ label: "I", unit: "A", value: I, tol: 0.05 }],
        solution: [
          `Dane: P = ${P} W; U = ${U} V`,
          `Wzór: I = P / U`,
          `Podstawienie: I = ${P} / ${U} = ${I} A`
        ]
      };
    }
    // t === 8: W = U·I·t (energia)
    const U = pick([110, 220]), I = rand(2, 10), tH = rand(2, 10);
    const Wkwh = (U * I * tH) / 1000;
    return {
      id: "bg8-" + U + "-" + I + "-" + tH,
      prompt: `Urządzenie pracuje ${tH} h przy napięciu ${U} V i natężeniu ${I} A. Ile energii (w kWh) zużyje?`,
      fields: [{ label: "W", unit: "kWh", value: Wkwh, tol: 0.01 }],
      solution: [
        `Dane: U = ${U} V; I = ${I} A; t = ${tH} h`,
        `Wzór: W = U · I · t`,
        `Wynik w Wh: W = ${U} · ${I} · ${tH} = ${U * I * tH} Wh`,
        `W kWh: ${Wkwh} kWh`
      ]
    };
  }

  // ====== KATEGORIA 2: RZ (opór zastępczy) ======
  // Wpisane oryginalne zadania z PDF (te które łatwo zapisać):
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

  // Generator losowych obwodów Rz — różne poziomy złożoności (2-4 oporniki, mieszane)
  function rzGen() {
    const niceR = [1, 2, 3, 4, 5, 6, 8, 10, 12];
    const level = rand(1, 4);
    let net;
    if (level === 1) {
      // 2 oporniki szeregowo
      net = ["s", pick(niceR), pick(niceR)];
    } else if (level === 2) {
      // 2 oporniki równolegle (z ładnym wynikiem)
      const pairs = [[2,2],[3,6],[4,4],[2,6],[4,12],[6,6],[2,3],[6,3],[10,10],[8,8]];
      const p = pick(pairs); net = ["p", p[0], p[1]];
    } else if (level === 3) {
      // 3 oporniki: jeden + (drugi ∥ trzeci)
      const pairs = [[2,2],[3,6],[4,4],[6,3],[8,8]];
      const p = pick(pairs);
      net = ["s", pick(niceR), ["p", p[0], p[1]]];
    } else {
      // 4 oporniki: (a+b) ∥ c, +d
      const a = pick([2,3,4]), b = pick([2,3,4]); const sum = a + b;
      // Pick c that divides nicely
      const c = pick([sum, sum*2, sum/2 || sum]);
      const d = pick([1,2,3]);
      net = ["s", ["p", ["s", a, b], c], d];
    }
    const withIds = E.assignIds(net);
    const Rz = E.Rz(withIds);
    const exp = E.explainRz(withIds);
    return {
      id: "rg-" + JSON.stringify(net),
      net: withIds,
      prompt: "Oblicz opór zastępczy układu: " + E.describeNet(withIds),
      fields: [{ label: "R_z", unit: "Ω", value: Rz, tol: 0.02 }],
      solution: exp.steps.concat([`Wynik: R_z = ${E.fmt(Rz)} Ω`])
    };
  }

  // Buduje zadanie Rz z gotowej topologii (ze statycznych)
  function buildRzTask(item) {
    const withIds = E.assignIds(item.net);
    const exp = E.explainRz(withIds);
    return {
      id: item.id,
      net: withIds,
      prompt: item.prompt + " Oblicz opór zastępczy układu.",
      fields: [{ label: "R_z", unit: "Ω", value: item.expected, tol: 0.02 }],
      solution: exp.steps.concat([`Wynik: R_z = ${E.fmt(item.expected)} Ω`])
    };
  }

  // ====== KATEGORIA 3: MIXED (układy mieszane) ======
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
      solution: E.explainMixed(withIds, item.U)
    };
  }

  function mixedGen() {
    const Uvalues = [6, 9, 12, 18, 24, 30, 36];
    const level = rand(1, 3);
    let net, U = pick(Uvalues);
    if (level === 1) {
      // Szeregowy 2 oporniki
      const a = pick([1,2,3,4]); const b = pick([2,3,4,6]);
      net = ["s", a, b];
      // dobieramy U tak, żeby I było całkowite jeśli się da
      const Rz = a + b; U = Rz * pick([1,2,3]);
    } else if (level === 2) {
      // Równolegle dwa
      const pairs = [[2,2],[3,6],[4,4],[2,6],[4,12],[6,6],[6,3]];
      const p = pick(pairs); net = ["p", p[0], p[1]];
      const Rz = (p[0]*p[1])/(p[0]+p[1]); U = Math.round(Rz) * pick([2,3,4,6]);
      if (!Number.isInteger(U)) U = pick(Uvalues);
    } else {
      // Mieszane: a + (b||c)
      const a = pick([1,2,3]); const pairs = [[2,2],[3,6],[4,4],[6,3]];
      const p = pick(pairs);
      net = ["s", a, ["p", p[0], p[1]]];
      const Rz = a + (p[0]*p[1])/(p[0]+p[1]);
      U = Math.round(Rz) * pick([2,3,4,6]);
    }
    const withIds = E.assignIds(net);
    return buildMixedTask({ id: "mg-" + JSON.stringify(net) + "-" + U, U, net, descr: E.describeNet(withIds) });
  }

  // ====== EKSPORT ======
  global.PhysicsProblems = {
    basicStatic, basicGen,
    rzStatic, rzGen, buildRzTask,
    mixedStatic, mixedGen, buildMixedTask,
    // Buduje gotowe zadania ze statycznych
    getAllStatic() {
      return {
        basic: basicStatic.slice(),
        rz: rzStatic.map(buildRzTask),
        mixed: mixedStatic.map(buildMixedTask)
      };
    },
    // Generuje N nowych losowych zadań danej kategorii
    generate(category) {
      if (category === "basic") return basicGen();
      if (category === "rz") return rzGen();
      if (category === "mixed") return mixedGen();
      throw new Error("Nieznana kategoria: " + category);
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
