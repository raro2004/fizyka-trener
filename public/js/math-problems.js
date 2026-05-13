// math-problems.js — zadania matematyki klasa 8 (Zastosowania matematyki)
// Podpowiedzi i rozwiązania pisane prostym językiem dla ucznia słabego z matematyki.

(function (global) {
  "use strict";
  const M = global.MathEngine;
  const E = global.CircuitEngine;
  const fmt = (x) => E.fmt(x);
  const fmtF = (x) => E.fmtFrac(x);
  const fmtMon = (x) => M.fmtMoney(x);

  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // === PROSTSZY FORMAT podpowiedzi i rozwiązań ===
  // hint: intuicja (jak to rozumieć) + numerowane kroki "co zrobić"
  function hint(intuition, steps) {
    const out = [];
    out.push("🤔 SPÓJRZ NA TO TAK:");
    out.push("   " + intuition);
    out.push(" ");
    out.push("🛠️ JAK POLICZYĆ — krok po kroku:");
    steps.forEach((s, i) => out.push(`   ${i+1}. ${s}`));
    return out;
  }
  // solution: dane, szukane, numerowane kroki z konkretnymi liczbami, odpowiedź
  function sol(given, unknown, steps, finalAnswer) {
    const out = [];
    out.push("📋 Co wiemy: " + given);
    out.push("❓ Co szukamy: " + unknown);
    out.push(" ");
    steps.forEach((s, i) => out.push(`📍 KROK ${i+1}: ${s}`));
    out.push(" ");
    out.push("✅ ODPOWIEDŹ: " + finalAnswer);
    return out;
  }

  // ============= KATEGORIA 1: PROCENTY =============
  const percentStatic = [
    {
      id: "p1",
      prompt: "Oblicz 40% liczby 2¼ (czyli 2,25). Wpisz wynik jako ułamek lub liczbę dziesiętną.",
      fields: [{ label: "wynik", unit: "", value: 0.9, tol: 0.01 }],
      hint: hint(
        "'X procent z czegoś' = trzeba znaleźć część tej liczby. Np. 40% z 100 zł = 40 zł.",
        [
          "Zamień procent na ułamek: 40% = 40/100 = 0,4",
          "Pomnóż 0,4 razy liczbę (2,25)",
          "Wynik: 0,4 · 2,25 = ?"
        ]
      ),
      solution: sol(
        "liczba = 2¼ = 2,25",
        "40% tej liczby",
        [
          "Zamieniam 40% na ułamek dziesiętny: 40% = 40/100 = 0,4",
          "Mnożę: 0,4 · 2,25 = 0,9 (albo: 9/10)"
        ],
        "0,9 (= 9/10)"
      )
    },
    {
      id: "p2",
      prompt: "Mama wydała 18 zł w sklepie, co stanowiło 15% gotówki, którą miała w portfelu. Ile gotówki miała mama przed zakupami?",
      fields: [{ label: "gotówka", unit: "zł", value: 120, tol: 0.5 }],
      hint: hint(
        "Wiemy że MAŁA część (15%) to 18 zł. Trzeba znaleźć CAŁOŚĆ (100%). Sztuczka: najpierw policzyć 1%, potem 100%.",
        [
          "Skoro 15% to 18 zł, to 1% to 15 razy mniej.",
          "Policz: 1% = 18 ÷ 15 = ?",
          "Całość to 100%, czyli 100 razy więcej niż 1%.",
          "Pomnóż wynik z punktu 2 razy 100."
        ]
      ),
      solution: sol(
        "15% gotówki = 18 zł",
        "ile gotówki mama miała (100%)",
        [
          "Liczę ile to 1% gotówki: 18 zł ÷ 15 = 1,20 zł",
          "Liczę 100% (czyli całość): 1,20 zł · 100 = 120 zł"
        ],
        "Mama miała 120 zł"
      )
    },
    {
      id: "p3",
      prompt: "Ile kosztuje coś, co jest o 9% tańsze niż 500 zł?",
      fields: [{ label: "kwota", unit: "zł", value: 455, tol: 0.5 }],
      hint: hint(
        "'O 9% mniej' = odejmujemy 9% od ceny. Trzeba policzyć ile to jest 9% z 500 zł, a potem odjąć.",
        [
          "Policz 9% z 500 zł (zamień 9% na 0,09 i pomnóż razy 500).",
          "Odejmij to od 500 zł."
        ]
      ),
      solution: sol(
        "cena = 500 zł; obniżka 9%",
        "cena po obniżce",
        [
          "Liczę 9% z 500: 0,09 · 500 = 45 zł",
          "Odejmuję od ceny: 500 − 45 = 455 zł"
        ],
        "455 zł"
      )
    },
    {
      id: "p4",
      prompt: "Ile metrów to o 70% więcej niż 200 m?",
      fields: [{ label: "wynik", unit: "m", value: 340, tol: 0.5 }],
      hint: hint(
        "'O 70% więcej' = dodajemy 70% do liczby. Najpierw policz ile to jest 70% z 200, potem DODAJ.",
        [
          "Zamień 70% na ułamek: 70% = 0,7",
          "Pomnóż: 0,7 · 200 = ? (to ile dodajemy)",
          "Dodaj do 200 m."
        ]
      ),
      solution: sol(
        "200 m, dodajemy 70%",
        "ile metrów po powiększeniu",
        [
          "Liczę 70% z 200 m: 0,7 · 200 = 140 m",
          "Dodaję do 200: 200 + 140 = 340 m"
        ],
        "340 m"
      )
    },
    {
      id: "p5",
      prompt: "O ile procent 360 kg to więcej niż 240 kg?",
      fields: [{ label: "różnica", unit: "%", value: 50, tol: 0.5 }],
      hint: hint(
        "Pytanie 'o ile procent więcej' — porównujemy dwie liczby. Liczymy o ile się różnią, a potem sprawdzamy ile to procent MNIEJSZEJ (od której zaczynaliśmy).",
        [
          "Policz różnicę: 360 − 240 = ?",
          "Podziel tę różnicę przez MNIEJSZĄ liczbę (240).",
          "Pomnóż wynik razy 100, żeby zamienić na %."
        ]
      ),
      solution: sol(
        "porównujemy 360 kg i 240 kg",
        "o ile % 360 > 240",
        [
          "Liczę różnicę: 360 − 240 = 120 kg",
          "Dzielę różnicę przez mniejszą (240): 120 ÷ 240 = 0,5",
          "Zamieniam na %: 0,5 · 100% = 50%"
        ],
        "50% (360 jest o połowę większe od 240)"
      )
    },
    {
      id: "p6",
      prompt: "O ile procent 45 osób to mniej niż 60 osób?",
      fields: [{ label: "różnica", unit: "%", value: 25, tol: 0.5 }],
      hint: hint(
        "'O ile procent mniej' — porównujemy. Liczymy różnicę, a potem ile to procent WIĘKSZEJ liczby (od której zaczynaliśmy).",
        [
          "Policz różnicę: 60 − 45 = ?",
          "Podziel różnicę przez WIĘKSZĄ liczbę (60).",
          "Pomnóż razy 100, żeby było %."
        ]
      ),
      solution: sol(
        "porównujemy 45 i 60",
        "o ile % 45 < 60",
        [
          "Różnica: 60 − 45 = 15",
          "Dzielę przez większą (60): 15 ÷ 60 = 0,25",
          "Zamieniam na %: 0,25 · 100% = 25%"
        ],
        "25% (45 osób to ¼ mniej niż 60)"
      )
    },
    {
      id: "p7",
      prompt: "Rower kosztował 1400 zł. Przeceniono go o 40%. Ile kosztuje rower po przecenie?",
      fields: [{ label: "cena", unit: "zł", value: 840, tol: 0.5 }],
      hint: hint(
        "Cena spada o 40%. Najpierw policz ILE PIENIĘDZY to jest 40% z 1400 zł, a potem ODEJMIJ od ceny.",
        [
          "Zamień 40% na 0,4.",
          "Pomnóż 0,4 · 1400 = ? (to ile odpada)",
          "Odejmij od 1400 zł."
        ]
      ),
      solution: sol(
        "cena = 1400 zł; obniżka 40%",
        "cena po przecenie",
        [
          "40% z 1400: 0,4 · 1400 = 560 zł (tyle odpada)",
          "Nowa cena: 1400 − 560 = 840 zł"
        ],
        "840 zł"
      )
    },
    {
      id: "p8",
      prompt: "Cenę kurtki obniżono o 16% i teraz wynosi 336 zł. Ile kosztowała kurtka PRZED obniżką?",
      fields: [{ label: "cena", unit: "zł", value: 400, tol: 0.5 }],
      hint: hint(
        "Cena spadła o 16%, więc to co zostało to 100% − 16% = 84% starej ceny. Czyli 336 zł = 84% starej ceny. Trzeba znaleźć całość (100%).",
        [
          "Stara cena to 100%. Po obniżce zostało 100% − 16% = 84%.",
          "Czyli 84% starej ceny = 336 zł.",
          "Policz 1% starej ceny: 336 ÷ 84 = ?",
          "Pomnóż razy 100 żeby dostać 100% (całą starą cenę)."
        ]
      ),
      solution: sol(
        "cena po obniżce = 336 zł; obniżka 16%",
        "cena przed obniżką",
        [
          "Zostało 100% − 16% = 84% starej ceny",
          "Czyli 84% starej ceny = 336 zł",
          "1% starej ceny: 336 ÷ 84 = 4 zł",
          "100% starej ceny: 4 · 100 = 400 zł"
        ],
        "Stara cena to 400 zł"
      )
    },
    {
      id: "p9",
      prompt: "Ile soli trzeba wsypać do 18 kg wody, aby otrzymać roztwór 10-procentowy?",
      fields: [{ label: "sól", unit: "kg", value: 2, tol: 0.05 }],
      hint: hint(
        "10% roztwór = sól stanowi 10% całości (sól + woda). Czyli na 10 kg roztworu jest 1 kg soli i 9 kg wody — proporcja sól:woda = 1:9.",
        [
          "Proporcja sól:woda = 1:9 (1 kg soli na każde 9 kg wody).",
          "Mamy 18 kg wody — to jest 9 razy 2.",
          "Soli będzie 1 razy 2 = 2 kg."
        ]
      ),
      solution: sol(
        "woda = 18 kg; roztwór ma być 10% (sól w roztworze)",
        "ile kg soli",
        [
          "Roztwór 10% to znaczy: na 100 g roztworu jest 10 g soli i 90 g wody.",
          "Proporcja: sól / woda = 10/90 = 1/9",
          "Mamy 18 kg wody, więc soli: 18 ÷ 9 = 2 kg"
        ],
        "2 kg soli"
      )
    },
    {
      id: "p10",
      prompt: "Mama upiekła 40 ciasteczek. Wojtek zjadł 20% wszystkich, Asia ¼ pozostałych, tata 50% pozostałych, a resztę zjadła mama. Jaki procent wszystkich ciasteczek zjadła mama?",
      fields: [{ label: "procent", unit: "%", value: 30, tol: 0.5 }],
      hint: hint(
        "Każdy bierze ze stosu który ZOSTAŁ po poprzedniku. Liczmy ile zostało po każdym po kolei.",
        [
          "Wojtek: zjadł 20%, ZOSTAŁO 80% wszystkich.",
          "Asia: zjadła ¼ z tego, co zostało (z 80%). ¼ z 80% = 20%. ZOSTAŁO 80% − 20% = 60%.",
          "Tata: zjadł 50% z tego, co zostało (60%). 50% z 60% = 30%. ZOSTAŁO 30%.",
          "Mama dostała resztę = 30% wszystkich."
        ]
      ),
      solution: sol(
        "40 ciasteczek; kolejno: Wojtek 20%, Asia ¼ pozostałych, tata 50% pozostałych",
        "% mamy",
        [
          "Po Wojtku: zostało 100% − 20% = 80% (czyli 32 ciasteczka z 40)",
          "Asia zjadła ¼ z 32 = 8 ciasteczek. Zostało 32 − 8 = 24 (to 60% wszystkich)",
          "Tata zjadł 50% z 24 = 12. Zostało 24 − 12 = 12 ciasteczek (to 30% wszystkich)",
          "Mama dostała 12 ciasteczek = 30% wszystkich"
        ],
        "30% (mama zjadła 12 ciasteczek)"
      )
    },
    {
      id: "p11",
      prompt: "Jaką liczbę otrzymamy, gdy liczbę 50 powiększymy o 27%?",
      fields: [{ label: "wynik", unit: "", value: 63.5, tol: 0.05 }],
      hint: hint(
        "Powiększyć o 27% = dodać 27% do liczby. Policz 27% z 50 i dodaj.",
        [
          "Zamień 27% na 0,27.",
          "Pomnóż: 0,27 · 50 = ? (tyle dodajemy)",
          "Dodaj do 50."
        ]
      ),
      solution: sol(
        "50; powiększamy o 27%",
        "nowa liczba",
        [
          "27% z 50: 0,27 · 50 = 13,5",
          "Dodaję do 50: 50 + 13,5 = 63,5"
        ],
        "63,5"
      )
    },
    {
      id: "p12",
      prompt: "Cena akcji wzrosła o 20%, a potem spadła o 20%. Jaki procent ceny POCZĄTKOWEJ stanowi cena końcowa?",
      fields: [{ label: "procent", unit: "%", value: 96, tol: 0.5 }],
      hint: hint(
        "Uwaga PUŁAPKA! Wzrost 20% i spadek 20% NIE dają 0%! Po wzroście kwota jest WIĘKSZA, więc 20% z większej kwoty to więcej pieniędzy niż 20% z mniejszej. Najlepiej policzyć na przykładowej kwocie 100 zł.",
        [
          "Przyjmij że cena = 100 zł.",
          "Po wzroście o 20%: 100 + 20% z 100 = 100 + 20 = 120 zł.",
          "Spadek o 20% liczymy z 120 zł: 20% z 120 = 24 zł.",
          "Cena końcowa: 120 − 24 = 96 zł.",
          "96 zł to 96% z 100 zł (początkowej)."
        ]
      ),
      solution: sol(
        "wzrost 20%, potem spadek 20%",
        "jaki % ceny początkowej",
        [
          "Załóżmy że cena = 100 zł",
          "Po wzroście o 20%: 100 + 20 = 120 zł",
          "Spadek o 20% od 120: 20% z 120 = 24 zł. Nowa cena: 120 − 24 = 96 zł",
          "96 zł to 96% ze 100 zł — cena spadła łącznie o 4%"
        ],
        "96% — NIE wraca do początkowej (jest o 4% mniej)"
      )
    }
  ];

  function percentGen() {
    const t = rand(1, 6);
    if (t === 1) {
      const p = pick([10, 20, 25, 30, 40, 50, 60, 75]); const x = pick([20, 40, 60, 80, 100, 200, 300, 400, 500]);
      const v = M.percentOf(p, x);
      return {
        id: `pg1-${p}-${x}`,
        prompt: `Oblicz ${p}% liczby ${x}.`,
        fields: [{ label: "wynik", unit: "", value: v, tol: 0.05 }],
        hint: hint(
          `Pytanie '${p}% z ${x}' oznacza znaleźć część tej liczby.`,
          [`Zamień ${p}% na ułamek dziesiętny: ${p}% = ${p/100}`, `Pomnóż: ${p/100} · ${x} = ?`]
        ),
        solution: sol(
          `liczba = ${x}`,
          `${p}% tej liczby`,
          [`Zamieniam ${p}% na ${p/100}`, `Mnożę: ${p/100} · ${x} = ${v}`],
          `${fmt(v)}`
        )
      };
    }
    if (t === 2) {
      const p = pick([10, 15, 20, 25, 30, 40, 50]); const x = pick([100, 150, 200, 300, 400, 500]);
      const v = M.incrPct(x, p);
      const dodatek = M.percentOf(p, x);
      return {
        id: `pg2-${p}-${x}`,
        prompt: `Ile to jest liczba o ${p}% większa od ${x}?`,
        fields: [{ label: "wynik", unit: "", value: v, tol: 0.05 }],
        hint: hint(
          `'O ${p}% większa' = dodajemy ${p}% do liczby. Policz ${p}% z ${x} i dodaj.`,
          [`Policz ${p}% z ${x} (czyli ${p/100} · ${x})`, `Dodaj do ${x}`]
        ),
        solution: sol(
          `${x}, dodajemy ${p}%`,
          `nowa liczba`,
          [`${p}% z ${x}: ${p/100} · ${x} = ${dodatek}`, `Dodaję do ${x}: ${x} + ${dodatek} = ${v}`],
          `${fmt(v)}`
        )
      };
    }
    if (t === 3) {
      const p = pick([10, 15, 20, 25, 30, 40, 50]); const x = pick([100, 200, 300, 500, 800, 1000]);
      const v = M.decrPct(x, p);
      const ujemka = M.percentOf(p, x);
      return {
        id: `pg3-${p}-${x}`,
        prompt: `Ile to jest liczba o ${p}% mniejsza od ${x}?`,
        fields: [{ label: "wynik", unit: "", value: v, tol: 0.05 }],
        hint: hint(
          `'O ${p}% mniejsza' = odejmujemy ${p}% od liczby. Policz ${p}% z ${x} i odejmij.`,
          [`Policz ${p}% z ${x}: ${p/100} · ${x}`, `Odejmij od ${x}`]
        ),
        solution: sol(
          `${x}, odejmujemy ${p}%`,
          `nowa liczba`,
          [`${p}% z ${x}: ${p/100} · ${x} = ${ujemka}`, `Odejmuję od ${x}: ${x} − ${ujemka} = ${v}`],
          `${fmt(v)}`
        )
      };
    }
    if (t === 4) {
      const b = pick([20, 40, 50, 100, 200, 500]); const ratio = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.75]); const a = b * ratio; const p = a/b * 100;
      return {
        id: `pg4-${a}-${b}`,
        prompt: `Jaki procent liczby ${b} stanowi liczba ${a}?`,
        fields: [{ label: "procent", unit: "%", value: p, tol: 0.5 }],
        hint: hint(
          `Pytanie 'jaki procent A stanowi z B' — sprawdzamy jaka część to A z B.`,
          [`Podziel: ${a} ÷ ${b} = ?`, `Pomnóż wynik razy 100 (żeby zamienić ułamek na %)`]
        ),
        solution: sol(
          `${a} i ${b}`,
          `jaki % z ${b} stanowi ${a}`,
          [`Dzielę: ${a} ÷ ${b} = ${a/b}`, `Zamieniam na %: ${a/b} · 100% = ${p}%`],
          `${p}%`
        )
      };
    }
    if (t === 5) {
      const p = pick([5, 10, 15, 20, 25, 50]); const total = pick([100, 200, 300, 400, 600, 800]);
      const part = M.percentOf(p, total);
      return {
        id: `pg5-${p}-${total}`,
        prompt: `${fmt(part)} zł stanowi ${p}% pewnej kwoty. Jaka to kwota?`,
        fields: [{ label: "kwota", unit: "zł", value: total, tol: 0.5 }],
        hint: hint(
          `Wiemy że MAŁA część (${p}%) to ${fmt(part)} zł. Trzeba znaleźć CAŁOŚĆ (100%).`,
          [`Policz 1% kwoty: ${fmt(part)} ÷ ${p} = ?`, `Pomnóż razy 100 żeby dostać 100% (całość)`]
        ),
        solution: sol(
          `${fmt(part)} zł = ${p}% kwoty`,
          `całość kwoty`,
          [`1% kwoty: ${fmt(part)} ÷ ${p} = ${fmt(part/p)} zł`, `100% kwoty: ${fmt(part/p)} · 100 = ${total} zł`],
          `${total} zł`
        )
      };
    }
    const b = pick([200, 240, 300, 400, 500]); const factor = pick([1.25, 1.5, 1.75, 2.0, 0.75, 0.6, 0.5]); const a = b * factor;
    if (a > b) {
      const p = M.pctLargerThan(a, b);
      return {
        id: `pg6-${a}-${b}`,
        prompt: `O ile procent ${fmt(a)} to więcej niż ${b}?`,
        fields: [{ label: "różnica", unit: "%", value: p, tol: 0.5 }],
        hint: hint(
          `Porównujemy ${fmt(a)} i ${b}. Mniejsza to ${b} — od niej liczymy procent.`,
          [`Policz różnicę: ${fmt(a)} − ${b} = ?`, `Podziel różnicę przez MNIEJSZĄ liczbę (${b})`, `Pomnóż razy 100% żeby dostać %`]
        ),
        solution: sol(
          `porównujemy ${fmt(a)} i ${b}`,
          `o ile % ${fmt(a)} > ${b}`,
          [`Różnica: ${fmt(a)} − ${b} = ${fmt(a-b)}`, `Dzielę przez mniejszą (${b}): ${fmt(a-b)} ÷ ${b} = ${fmt((a-b)/b)}`, `Zamieniam na %: ${fmt((a-b)/b)} · 100% = ${p}%`],
          `${p}%`
        )
      };
    } else {
      const p = M.pctSmallerThan(a, b);
      return {
        id: `pg6b-${a}-${b}`,
        prompt: `O ile procent ${fmt(a)} to mniej niż ${b}?`,
        fields: [{ label: "różnica", unit: "%", value: p, tol: 0.5 }],
        hint: hint(
          `Porównujemy ${fmt(a)} i ${b}. Większa to ${b} — od niej liczymy procent.`,
          [`Policz różnicę: ${b} − ${fmt(a)} = ?`, `Podziel przez WIĘKSZĄ liczbę (${b})`, `Pomnóż razy 100%`]
        ),
        solution: sol(
          `porównujemy ${fmt(a)} i ${b}`,
          `o ile % ${fmt(a)} < ${b}`,
          [`Różnica: ${b} − ${fmt(a)} = ${fmt(b-a)}`, `Dzielę przez większą (${b}): ${fmt(b-a)} ÷ ${b} = ${fmt((b-a)/b)}`, `Zamieniam na %: ${fmt((b-a)/b)} · 100% = ${p}%`],
          `${p}%`
        )
      };
    }
  }

  // ============= KATEGORIA 2: FINANSE =============
  const financeStatic = [
    {
      id: "f1",
      prompt: "Oprocentowanie lokaty rocznej wynosi 2,5%. Wpłacono 7000 zł. Jaki będzie stan konta po roku?",
      fields: [{ label: "stan", unit: "zł", value: 7175, tol: 0.5 }],
      hint: hint(
        "Bank dolicza 2,5% od włożonej kwoty po roku. Wystarczy policzyć 2,5% z 7000 zł i dodać do 7000.",
        [
          "Policz 2,5% z 7000 zł (zamień 2,5% na 0,025 i pomnóż)",
          "Dodaj wynik do 7000 zł"
        ]
      ),
      solution: sol(
        "7000 zł na 2,5% rocznie, t = 1 rok",
        "stan konta po roku",
        [
          "2,5% z 7000: 0,025 · 7000 = 175 zł (to są odsetki)",
          "Stan konta: 7000 + 175 = 7175 zł"
        ],
        "7175 zł"
      )
    },
    {
      id: "f2",
      prompt: "Wpłacono 2000 zł na lokatę o oprocentowaniu 3% rocznie. Po DWÓCH latach stan konta wyniesie?",
      fields: [{ label: "stan", unit: "zł", value: 2121.80, tol: 0.5 }],
      hint: hint(
        "Po pierwszym roku bank doda 3% odsetek do 2000 zł. W drugim roku dolicza 3% NIE od początkowej kwoty, ale od już większej (z odsetkami z pierwszego roku).",
        [
          "Policz 3% z 2000 zł: 0,03 · 2000 = 60 zł. Po 1. roku: 2000 + 60 = 2060 zł.",
          "W drugim roku liczymy 3% z 2060 zł: 0,03 · 2060 = 61,80 zł.",
          "Po 2. roku: 2060 + 61,80 = 2121,80 zł."
        ]
      ),
      solution: sol(
        "2000 zł na 3% rocznie, 2 lata",
        "stan po 2 latach",
        [
          "Po 1. roku: 3% z 2000 = 60 zł odsetek. Stan: 2000 + 60 = 2060 zł",
          "Po 2. roku: 3% z 2060 = 61,80 zł odsetek. Stan: 2060 + 61,80 = 2121,80 zł"
        ],
        "2121,80 zł"
      )
    },
    {
      id: "f3",
      prompt: "Rower ma cenę netto 1300 zł. Stawka VAT to 23%. Ile wynosi cena brutto (z VAT)?",
      fields: [{ label: "brutto", unit: "zł", value: 1599, tol: 0.5 }],
      hint: hint(
        "VAT to podatek doliczany do ceny. Cena brutto = cena netto + VAT. Trzeba policzyć 23% z 1300 zł i dodać.",
        [
          "Policz 23% z 1300 zł: 0,23 · 1300 = ? (to jest VAT)",
          "Dodaj VAT do ceny netto: 1300 + VAT = ?"
        ]
      ),
      solution: sol(
        "cena netto = 1300 zł; VAT = 23%",
        "cena brutto",
        [
          "23% z 1300: 0,23 · 1300 = 299 zł (to jest podatek VAT)",
          "Brutto = netto + VAT = 1300 + 299 = 1599 zł"
        ],
        "1599 zł"
      )
    },
    {
      id: "f4",
      prompt: "Kask rowerowy w cenie brutto kosztuje 184,50 zł (VAT 23%). Oblicz cenę netto.",
      fields: [{ label: "netto", unit: "zł", value: 150, tol: 0.5 }],
      hint: hint(
        "Cena brutto = netto + 23% VAT. Czyli brutto = netto · 1,23 (bo 100% netto + 23% to 123% = 1,23 razy netto). Żeby znaleźć netto, dzielimy brutto przez 1,23.",
        [
          "Cena brutto to 123% ceny netto (100% + 23% VAT).",
          "Podziel brutto przez 1,23: 184,50 ÷ 1,23 = ?"
        ]
      ),
      solution: sol(
        "brutto = 184,50 zł; VAT = 23%",
        "cena netto",
        [
          "Brutto jest 1,23 razy większe niż netto (netto + 23% = 123% netto)",
          "Netto = brutto ÷ 1,23 = 184,50 ÷ 1,23 = 150 zł"
        ],
        "150 zł"
      )
    },
    {
      id: "f5",
      prompt: "Oferta I: cena netto 2400 zł + 23% VAT. Oferta II: 2870 zł brutto. Która jest TAŃSZA i o ile zł?",
      fields: [{ label: "różnica", unit: "zł", value: 82, tol: 0.5 }],
      hint: hint(
        "Żeby porównać oferty, trzeba mieć obie w tej samej formie. Najprościej zamienić ofertę I na brutto (dodać VAT) i porównać.",
        [
          "Policz brutto oferty I: 2400 zł + 23% VAT.",
          "23% z 2400 = 0,23 · 2400 = 552 zł. Brutto I = 2400 + 552 = 2952 zł.",
          "Porównaj: oferta II to 2870 zł. Różnica = 2952 − 2870."
        ]
      ),
      solution: sol(
        "I: 2400 netto + 23% VAT; II: 2870 brutto",
        "która tańsza i o ile",
        [
          "Brutto I: 23% z 2400 = 552. Brutto I = 2400 + 552 = 2952 zł",
          "Porównuję: I = 2952 zł, II = 2870 zł",
          "Różnica: 2952 − 2870 = 82 zł — II jest tańsza"
        ],
        "Oferta II tańsza o 82 zł"
      )
    },
    {
      id: "f6",
      prompt: "Cenę kurtki obniżono o 15% i teraz wynosi 306 zł. Ile kosztowała kurtka PRZED obniżką?",
      fields: [{ label: "cena", unit: "zł", value: 360, tol: 0.5 }],
      hint: hint(
        "Po obniżce o 15% zostało 100% − 15% = 85% starej ceny. Czyli 306 zł to 85% starej ceny.",
        [
          "85% starej ceny = 306 zł.",
          "1% starej ceny: 306 ÷ 85 = ?",
          "100% (cała stara cena): wynik · 100."
        ]
      ),
      solution: sol(
        "cena po obniżce = 306 zł; obniżka 15%",
        "cena przed obniżką",
        [
          "Po obniżce zostało 100% − 15% = 85%. Czyli 85% starej ceny = 306 zł",
          "1% starej ceny: 306 ÷ 85 = 3,60 zł",
          "100% starej ceny: 3,60 · 100 = 360 zł"
        ],
        "360 zł (przed obniżką)"
      )
    },
    {
      id: "f7",
      prompt: "Pan Jan wpłacił na lokatę 5000 zł i dostał 90 zł odsetek. W tym roku oprocentowanie zmalało o 0,5 punktu procentowego. Jakie odsetki dostanie od 5000 zł teraz?",
      fields: [{ label: "odsetki", unit: "zł", value: 65, tol: 0.5 }],
      hint: hint(
        "Najpierw policz jakie było stare oprocentowanie z 90 zł odsetek od 5000 zł. Potem odejmij 0,5 (UWAGA: punkty procentowe odejmuje się BEZPOŚREDNIO od procentu — z 1,8% odjąć 0,5 daje 1,3%). Potem nowe odsetki.",
        [
          "Stare oprocentowanie: ile procent z 5000 zł to 90? 90 ÷ 5000 = 0,018 = 1,8%.",
          "Nowe oprocentowanie: 1,8% − 0,5 punktu = 1,3%.",
          "Nowe odsetki: 1,3% z 5000 zł = 0,013 · 5000 = 65 zł."
        ]
      ),
      solution: sol(
        "5000 zł, stare odsetki = 90 zł; nowa stawka mniejsza o 0,5 punktu",
        "nowe odsetki",
        [
          "Stara stawka: 90 ÷ 5000 = 0,018 = 1,8%",
          "Nowa stawka: 1,8% − 0,5% = 1,3% (odejmujemy punkty procentowe BEZPOŚREDNIO)",
          "Nowe odsetki: 1,3% z 5000 = 0,013 · 5000 = 65 zł"
        ],
        "65 zł"
      )
    },
    {
      id: "f8",
      prompt: "Od kwoty 7000 groszy trzeba przekazać do skarbu państwa 840 groszy podatku. Jaki to procent dochodów?",
      fields: [{ label: "stawka", unit: "%", value: 12, tol: 0.5 }],
      hint: hint(
        "Pytamy: jakim procentem 7000 jest 840. Czyli najpierw 840 ÷ 7000, a potem razy 100%.",
        [
          "Podziel: 840 ÷ 7000 = ?",
          "Pomnóż wynik razy 100%."
        ]
      ),
      solution: sol(
        "dochód = 7000 gr; podatek = 840 gr",
        "stawka podatku",
        [
          "Dzielę: 840 ÷ 7000 = 0,12",
          "Zamieniam na %: 0,12 · 100% = 12%"
        ],
        "12%"
      )
    },
    {
      id: "f9",
      prompt: "Wynagrodzenie BRUTTO pracownika to 3700 zł. Podatek wynosi 18% kwoty brutto. Ile to wynagrodzenie NETTO?",
      fields: [{ label: "netto", unit: "zł", value: 3034, tol: 0.5 }],
      hint: hint(
        "Netto = brutto − podatek. Trzeba policzyć ile to 18% z 3700 zł (podatek) i odjąć.",
        [
          "Policz 18% z 3700: 0,18 · 3700 = ? (to podatek)",
          "Odejmij podatek od brutto: 3700 − podatek"
        ]
      ),
      solution: sol(
        "brutto = 3700 zł; podatek = 18%",
        "netto",
        [
          "18% z 3700: 0,18 · 3700 = 666 zł (to podatek)",
          "Netto = brutto − podatek = 3700 − 666 = 3034 zł"
        ],
        "3034 zł"
      )
    },
    {
      id: "f10",
      prompt: "Cena BRUTTO słoika miodu wynosi 27,30 zł. Stawka VAT na miód to 5%. Ile wynosi cena netto?",
      fields: [{ label: "netto", unit: "zł", value: 26, tol: 0.5 }],
      hint: hint(
        "Brutto = 105% netto (100% netto + 5% VAT). Żeby znaleźć netto, dzielimy brutto przez 1,05.",
        [
          "Brutto jest 1,05 razy większe niż netto.",
          "Netto = 27,30 ÷ 1,05 = ?"
        ]
      ),
      solution: sol(
        "brutto = 27,30 zł; VAT = 5%",
        "netto",
        [
          "Brutto jest 105% (czyli 1,05 raza) netto",
          "Netto = 27,30 ÷ 1,05 = 26 zł"
        ],
        "26 zł"
      )
    }
  ];

  function financeGen() {
    const t = rand(1, 4);
    if (t === 1) {
      const K = pick([1000, 2000, 3000, 5000, 8000, 10000]);
      const r = pick([1, 1.5, 2, 2.5, 3, 4, 5]);
      const odsetki = M.percentOf(r, K);
      const v = K + odsetki;
      return {
        id: `fg1-${K}-${r}`,
        prompt: `Wpłacono ${K} zł na lokatę roczną o oprocentowaniu ${fmt(r)}%. Ile będzie na koncie po roku?`,
        fields: [{ label: "stan", unit: "zł", value: v, tol: 0.5 }],
        hint: hint(
          `Bank doda ${fmt(r)}% odsetek do włożonej kwoty.`,
          [`Policz ${fmt(r)}% z ${K} zł (zamień ${fmt(r)}% na ${r/100} i pomnóż)`, `Dodaj odsetki do ${K} zł`]
        ),
        solution: sol(
          `${K} zł na ${fmt(r)}% rocznie`,
          `stan po roku`,
          [`${fmt(r)}% z ${K}: ${r/100} · ${K} = ${fmt(odsetki)} zł odsetek`, `Stan: ${K} + ${fmt(odsetki)} = ${fmt(v)} zł`],
          `${fmtMon(v)} zł`
        )
      };
    }
    if (t === 2) {
      const netto = pick([100, 200, 500, 800, 1000, 1500, 2000]); const vat = pick([5, 8, 23]);
      const vatKwota = M.vatAmount(netto, vat);
      const brutto = netto + vatKwota;
      return {
        id: `fg2-${netto}-${vat}`,
        prompt: `Cena netto = ${netto} zł, VAT = ${vat}%. Oblicz cenę brutto.`,
        fields: [{ label: "brutto", unit: "zł", value: brutto, tol: 0.5 }],
        hint: hint(
          `Brutto = netto + VAT. Trzeba policzyć ${vat}% z ${netto} zł i dodać.`,
          [`Policz ${vat}% z ${netto}: ${vat/100} · ${netto} = ?`, `Dodaj VAT do ${netto} zł`]
        ),
        solution: sol(
          `netto = ${netto} zł; VAT = ${vat}%`,
          `brutto`,
          [`${vat}% z ${netto}: ${vat/100} · ${netto} = ${fmt(vatKwota)} zł (VAT)`, `Brutto = ${netto} + ${fmt(vatKwota)} = ${fmt(brutto)} zł`],
          `${fmtMon(brutto)} zł`
        )
      };
    }
    if (t === 3) {
      const netto = pick([100, 200, 400, 500, 1000, 2000]); const vat = pick([5, 8, 23]);
      const brutto = netto + M.vatAmount(netto, vat);
      return {
        id: `fg3-${brutto}-${vat}`,
        prompt: `Cena brutto = ${fmtMon(brutto)} zł (VAT ${vat}%). Oblicz cenę netto.`,
        fields: [{ label: "netto", unit: "zł", value: netto, tol: 0.5 }],
        hint: hint(
          `Brutto jest większe od netto o ${vat}% (to VAT). Czyli brutto = ${1+vat/100} razy netto.`,
          [`Podziel brutto przez ${1+vat/100}: ${fmtMon(brutto)} ÷ ${1+vat/100} = ?`]
        ),
        solution: sol(
          `brutto = ${fmtMon(brutto)} zł; VAT = ${vat}%`,
          `netto`,
          [`Brutto to ${100+vat}% (czyli ${1+vat/100} raza) netto`, `Netto = ${fmtMon(brutto)} ÷ ${1+vat/100} = ${fmtMon(netto)} zł`],
          `${fmtMon(netto)} zł`
        )
      };
    }
    const cena = pick([100, 200, 300, 500, 800, 1000, 1500, 2000]);
    const p = pick([10, 15, 20, 25, 30, 40, 50]);
    const obnizka = M.percentOf(p, cena);
    const cenaPo = cena - obnizka;
    return {
      id: `fg4-${cena}-${p}`,
      prompt: `Towar kosztował ${cena} zł i został przeceniony o ${p}%. Ile kosztuje teraz?`,
      fields: [{ label: "cena", unit: "zł", value: cenaPo, tol: 0.5 }],
      hint: hint(
        `Cena spada o ${p}%. Policz ile zł to ${p}% z ${cena} i odejmij.`,
        [`Policz ${p}% z ${cena}: ${p/100} · ${cena} = ? (tyle odpada)`, `Odejmij od ${cena} zł`]
      ),
      solution: sol(
        `cena = ${cena} zł; obniżka ${p}%`,
        `nowa cena`,
        [`${p}% z ${cena}: ${p/100} · ${cena} = ${fmt(obnizka)} zł (tyle odpada)`, `Nowa cena: ${cena} − ${fmt(obnizka)} = ${fmt(cenaPo)} zł`],
        `${fmtMon(cenaPo)} zł`
      )
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
      hint: hint(
        "Stosunek 1:2 znaczy że dzielimy na CZĘŚCI — pierwszą i drugą, gdzie druga jest 2 razy dłuższa. Razem to 1+2 = 3 części. Trzeba znaleźć ile to 1 część.",
        [
          "Suma części: 1 + 2 = 3.",
          "1 część = 180 ÷ 3 = 60 cm.",
          "Mniejsza (1 część) = 60 cm. Większa (2 części) = 120 cm."
        ]
      ),
      solution: sol(
        "tasiemka 180 cm; stosunek 1:2",
        "obie długości",
        [
          "Razem to 1 + 2 = 3 części",
          "1 część: 180 ÷ 3 = 60 cm",
          "Mniejsza = 1 część = 60 cm. Większa = 2 części = 2 · 60 = 120 cm"
        ],
        "60 cm i 120 cm"
      )
    },
    {
      id: "r2",
      prompt: "Płot pomalowali Antek (3 m), Bartek (5 m) i Czarek (4 m). Razem dostali 240 zł. Ile dostanie każdy proporcjonalnie do pracy? (Antek, Bartek, Czarek)",
      fields: [
        { label: "Antek",  unit: "zł", value: 60, tol: 0.5 },
        { label: "Bartek", unit: "zł", value: 100, tol: 0.5 },
        { label: "Czarek", unit: "zł", value: 80, tol: 0.5 }
      ],
      hint: hint(
        "Praca w stosunku 3:5:4. Razem to 3+5+4 = 12 części. Trzeba znaleźć ile zł = 1 część, potem każdy dostaje swoją liczbę części.",
        [
          "Suma metrów: 3 + 5 + 4 = 12 m (to 12 części).",
          "1 część (1 m pracy) = 240 ÷ 12 = 20 zł.",
          "Antek (3 m) = 3 · 20 = 60 zł. Bartek (5 m) = 5 · 20 = 100 zł. Czarek (4 m) = 4 · 20 = 80 zł."
        ]
      ),
      solution: sol(
        "Antek 3 m, Bartek 5 m, Czarek 4 m; razem 240 zł",
        "kwota dla każdego",
        [
          "Razem pracy: 3 + 5 + 4 = 12 m",
          "1 m pracy: 240 ÷ 12 = 20 zł",
          "Antek: 3 · 20 = 60. Bartek: 5 · 20 = 100. Czarek: 4 · 20 = 80"
        ],
        "Antek 60 zł, Bartek 100 zł, Czarek 80 zł"
      )
    },
    {
      id: "r3",
      prompt: "Ciężar podzielono w stosunku 2:3. Lżejsza część waży 24 kg. Ile waży druga?",
      fields: [{ label: "druga", unit: "kg", value: 36, tol: 0.5 }],
      hint: hint(
        "Stosunek 2:3 znaczy: na każde 2 kg lżejszej przypadają 3 kg cięższej. Skoro lżejsza waży 24 kg (= 12 razy po 2 kg), to cięższa będzie miała 12 razy po 3 kg.",
        [
          "1 część stosunku: 24 ÷ 2 = 12 kg.",
          "Cięższa to 3 części: 3 · 12 = 36 kg."
        ]
      ),
      solution: sol(
        "stosunek 2:3; lżejsza = 24 kg",
        "cięższa część",
        [
          "Lżejsza ma 2 części stosunku = 24 kg, więc 1 część = 24 ÷ 2 = 12 kg",
          "Cięższa to 3 części: 3 · 12 = 36 kg"
        ],
        "36 kg"
      )
    },
    {
      id: "r4",
      prompt: "Liczbę 880 podzielono w stosunku 3:8. Oblicz różnicę między większą a mniejszą częścią.",
      fields: [{ label: "różnica", unit: "", value: 400, tol: 0.5 }],
      hint: hint(
        "Stosunek 3:8 = 3 części + 8 części = 11 części razem. Trzeba znaleźć obie, potem odjąć.",
        [
          "Razem części: 3 + 8 = 11.",
          "1 część: 880 ÷ 11 = 80.",
          "Mniejsza = 3 · 80 = 240. Większa = 8 · 80 = 640.",
          "Różnica = 640 − 240 = 400."
        ]
      ),
      solution: sol(
        "880 podzielone w stosunku 3:8",
        "różnica między częściami",
        [
          "Razem: 3 + 8 = 11 części",
          "1 część: 880 ÷ 11 = 80",
          "Mniejsza: 3 · 80 = 240. Większa: 8 · 80 = 640",
          "Różnica: 640 − 240 = 400"
        ],
        "400"
      )
    },
    {
      id: "r5",
      prompt: "Sok i wodę zmieszano w PROPORCJI 2:3. Co to znaczy? Wybierz ilości (sok, woda).",
      fields: [
        { label: "sok",  unit: "L", value: 2, tol: 0.05 },
        { label: "woda", unit: "L", value: 3, tol: 0.05 }
      ],
      hint: hint(
        "Proporcja 2:3 znaczy: na każde 2 jednostki soku przypadają 3 jednostki wody. Najprościej wziąć 2 L soku i 3 L wody.",
        [
          "Najprostsze rozumienie: 2 części soku i 3 części wody.",
          "Jeśli 1 część = 1 L, to: 2 L soku i 3 L wody."
        ]
      ),
      solution: sol(
        "proporcja 2:3 (sok:woda)",
        "konkretne ilości",
        [
          "Proporcja 2:3 to: 2 jednostki soku na każde 3 jednostki wody",
          "Najprościej (1 jednostka = 1 L): 2 L soku i 3 L wody",
          "Inne poprawne: 4 L i 6 L, 6 L i 9 L (te same proporcje)"
        ],
        "2 L soku i 3 L wody (lub wielokrotności)"
      )
    },
    {
      id: "r6",
      prompt: "Ewa dolała wody do 0,5 L soku i otrzymała 0,7 L napoju. Jaki jest stosunek SOKU do WODY w napoju? Podaj liczbę dziesiętną (sok/woda).",
      fields: [{ label: "stosunek sok/woda", unit: "", value: 5/2, tol: 0.05 }],
      hint: hint(
        "Najpierw musisz wiedzieć ile wody dolała. Jeśli napój ma 0,7 L a był 0,5 L soku, to wody jest 0,7 − 0,5. Potem stosunek = sok podzielić przez wodę.",
        [
          "Policz ile dolała wody: 0,7 − 0,5 = ?",
          "Stosunek sok/woda = 0,5 podzielić przez to co policzyłeś."
        ]
      ),
      solution: sol(
        "sok = 0,5 L; napój = 0,7 L",
        "stosunek sok:woda",
        [
          "Ile wody dolała: 0,7 − 0,5 = 0,2 L wody",
          "Stosunek: sok/woda = 0,5 / 0,2 = 2,5 = 5/2",
          "Czyli 5:2 — na 5 L soku przypadają 2 L wody"
        ],
        "5:2 (czyli 2,5)"
      )
    },
    {
      id: "r7",
      prompt: "Ile soli trzeba dodać do 18 kg WODY, aby otrzymać roztwór 10-procentowy?",
      fields: [{ label: "sól", unit: "kg", value: 2, tol: 0.05 }],
      hint: hint(
        "10% roztwór znaczy że sól stanowi 10% całego roztworu (sól + woda). Czyli na 10 jednostek roztworu jest 1 jednostka soli i 9 jednostek wody. Proporcja sól:woda = 1:9.",
        [
          "Proporcja sól:woda = 1:9 (1 kg soli na 9 kg wody).",
          "Skoro mamy 18 kg wody = 2 razy więcej niż 9, to soli będzie 2 razy więcej niż 1 kg.",
          "Sól = 2 kg."
        ]
      ),
      solution: sol(
        "woda = 18 kg; roztwór 10% (sól w roztworze)",
        "masa soli",
        [
          "10% roztwór = 1 część soli + 9 części wody (proporcja sól:woda = 1:9)",
          "Mamy 18 kg wody = 9 · 2, więc soli będzie 1 · 2 = 2 kg"
        ],
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
      hint: hint(
        "Cały roztwór ma być 10 kg i 5% to ma być cukier. Czyli najpierw liczymy ile to jest 5% z 10 kg, a reszta to woda.",
        [
          "Policz 5% z 10 kg: 0,05 · 10 = ? (to cukier)",
          "Woda = 10 kg − cukier"
        ]
      ),
      solution: sol(
        "razem = 10 kg; cukier ma być 5%",
        "ile cukru i wody",
        [
          "5% z 10 kg: 0,05 · 10 = 0,5 kg cukru",
          "Woda = 10 − 0,5 = 9,5 kg"
        ],
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
      hint: hint(
        "Najmniejsza szklanka to 2 części (najmniejsza liczba w stosunku). Trzeba znaleźć ile to 1 część, potem pomnożyć przez 3 i 5.",
        [
          "Najmniejsza = 2 części = 220 ml, więc 1 część = 220 ÷ 2 = 110 ml.",
          "Środkowa = 3 części = 3 · 110 = 330 ml.",
          "Największa = 5 części = 5 · 110 = 550 ml."
        ]
      ),
      solution: sol(
        "stosunek 2:3:5; najmniejsza = 220 ml",
        "środkowa i największa",
        [
          "Najmniejsza ma 2 części = 220 ml, więc 1 część = 220 ÷ 2 = 110 ml",
          "Środkowa (3 części): 3 · 110 = 330 ml",
          "Największa (5 części): 5 · 110 = 550 ml"
        ],
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
      hint: hint(
        "Stosunek 2:3 to razem 2+3 = 5 części. Znajdź ile to jest 1 część, potem pomnóż.",
        [
          "Razem: 2 + 3 = 5 części.",
          "1 część = 20 ÷ 5 = 4 L.",
          "Mniejszy (2 części) = 2 · 4 = 8 L. Większy (3 części) = 3 · 4 = 12 L."
        ]
      ),
      solution: sol(
        "20 L; stosunek 2:3",
        "obie ilości",
        [
          "Razem: 2 + 3 = 5 części",
          "1 część: 20 ÷ 5 = 4 L",
          "Mniejszy: 2 · 4 = 8 L. Większy: 3 · 4 = 12 L"
        ],
        "8 L i 12 L"
      )
    }
  ];

  function ratioGen() {
    const t = rand(1, 4);
    if (t === 1) {
      const a = pick([1, 2, 3, 4]); const b = pick([2, 3, 4, 5, 7]);
      const sum = a + b; const total = sum * pick([4, 5, 6, 8, 10, 20]);
      const r = M.ratioSplit2(total, a, b);
      const part = total / sum;
      return {
        id: `rg1-${total}-${a}-${b}`,
        prompt: `Podziel ${total} w stosunku ${a}:${b}. Podaj obie części.`,
        fields: [
          { label: `${a} cz.`, unit: "", value: r.first, tol: 0.05 },
          { label: `${b} cz.`, unit: "", value: r.second, tol: 0.05 }
        ],
        hint: hint(
          `Stosunek ${a}:${b} znaczy razem ${a+b} części. Znajdź ile to 1 część, potem pomnóż.`,
          [`Razem: ${a} + ${b} = ${sum} części`, `1 część: ${total} ÷ ${sum} = ${fmt(part)}`, `Pierwsza: ${a} · ${fmt(part)}. Druga: ${b} · ${fmt(part)}.`]
        ),
        solution: sol(
          `${total} podzielone w stosunku ${a}:${b}`,
          `obie części`,
          [`Razem: ${a} + ${b} = ${sum} części`, `1 część: ${total} ÷ ${sum} = ${fmt(part)}`, `Pierwsza: ${a} · ${fmt(part)} = ${fmt(r.first)}. Druga: ${b} · ${fmt(part)} = ${fmt(r.second)}.`],
          `${fmt(r.first)} i ${fmt(r.second)}`
        )
      };
    }
    if (t === 2) {
      const a = pick([2, 3, 4, 5]); const b = pick([3, 4, 5, 7, 9]);
      if (a === b) return ratioGen();
      const knownPart = a < b ? a : b; const otherPart = a < b ? b : a;
      const knownVal = pick([12, 15, 18, 24, 30]);
      const otherVal = M.ratioOtherPart(knownVal, knownPart, otherPart);
      const onePart = knownVal / knownPart;
      return {
        id: `rg2-${knownVal}-${a}-${b}`,
        prompt: `Ciężar podzielono w stosunku ${a}:${b}. Lżejsza część waży ${knownVal} kg. Ile waży druga?`,
        fields: [{ label: "druga", unit: "kg", value: otherVal, tol: 0.05 }],
        hint: hint(
          `Lżejsza ma ${knownPart} części stosunku = ${knownVal} kg. Znajdź ile to 1 część, potem pomnóż przez ${otherPart} (cięższa).`,
          [`1 część: ${knownVal} ÷ ${knownPart} = ${fmt(onePart)} kg`, `Cięższa (${otherPart} części): ${otherPart} · ${fmt(onePart)} = ${fmt(otherVal)} kg`]
        ),
        solution: sol(
          `stosunek ${a}:${b}; lżejsza = ${knownVal} kg`,
          `cięższa`,
          [`Lżejsza ma ${knownPart} części = ${knownVal} kg, więc 1 część = ${knownVal} ÷ ${knownPart} = ${fmt(onePart)} kg`, `Cięższa (${otherPart} części): ${otherPart} · ${fmt(onePart)} = ${fmt(otherVal)} kg`],
          `${fmt(otherVal)} kg`
        )
      };
    }
    if (t === 3) {
      const water = pick([18, 27, 36, 45, 50, 90]); const p = pick([10, 20, 25]);
      const salt = M.saltForSolution(water, p);
      return {
        id: `rg3-${water}-${p}`,
        prompt: `Ile soli trzeba dodać do ${water} kg wody, aby otrzymać roztwór ${p}-procentowy?`,
        fields: [{ label: "sól", unit: "kg", value: salt, tol: 0.05 }],
        hint: hint(
          `${p}% roztwór = sól stanowi ${p}% całości. Czyli sól:woda = ${p}:${100-p}.`,
          [`Proporcja sól:woda = ${p}:${100-p}`, `Skoro wody jest ${water} kg, to soli będzie ${water} ÷ ${100-p} · ${p}`]
        ),
        solution: sol(
          `woda = ${water} kg; p = ${p}%`,
          `masa soli`,
          [`${p}% roztwór: na ${100-p} kg wody przypada ${p} kg soli (proporcja ${p}:${100-p})`, `Soli: (${water}/${100-p}) · ${p} = ${fmt(salt)} kg`],
          `${fmt(salt)} kg`
        )
      };
    }
    const total = pick([5, 10, 20]); const p = pick([5, 10, 15, 20, 25]);
    const comp = M.solutionComponents(total, p);
    return {
      id: `rg4-${total}-${p}`,
      prompt: `Trzeba przygotować ${total} kg roztworu ${p}-procentowego. Ile potrzeba składnika i ile wody?`,
      fields: [
        { label: "składnik", unit: "kg", value: comp.salt, tol: 0.05 },
        { label: "woda",     unit: "kg", value: comp.water, tol: 0.05 }
      ],
      hint: hint(
        `Cały roztwór = ${total} kg, składnik = ${p}% całości. Reszta to woda.`,
        [`Policz ${p}% z ${total}: ${p/100} · ${total} = ? (składnik)`, `Woda = ${total} − składnik`]
      ),
      solution: sol(
        `razem = ${total} kg; p = ${p}% składnika`,
        `składnik i woda`,
        [`${p}% z ${total} kg: ${p/100} · ${total} = ${fmt(comp.salt)} kg (składnik)`, `Woda: ${total} − ${fmt(comp.salt)} = ${fmt(comp.water)} kg`],
        `${fmt(comp.salt)} kg składnika i ${fmt(comp.water)} kg wody`
      )
    };
  }

  // ============= KATEGORIA 4: PRAWDOPODOBIEŃSTWO =============
  const probabilityStatic = [
    {
      id: "pr1",
      prompt: "Wojtek rzuca kostką (dni: pon=1...sob=6). Jakie jest prawdopodobieństwo, że NIE wypadnie środa (3)? Podaj ułamek.",
      fields: [{ label: "P", unit: "", value: 5/6, tol: 0.01 }],
      hint: hint(
        "Prawdopodobieństwo = liczba KORZYSTNYCH wyników podzielona przez liczbę WSZYSTKICH wyników. Kostka ma 6 ścian (1-6). Środa to 3 — jedna ściana. Wszystkie INNE = 5 ścian.",
        [
          "Wszystkie wyniki: 6 (ścianki kostki).",
          "Korzystne (nie środa): 5 (czyli 1, 2, 4, 5, 6).",
          "P = 5/6"
        ]
      ),
      solution: sol(
        "kostka, środa = 3",
        "P(nie środa)",
        [
          "Wszystkich wyników: 6",
          "Korzystnych (nie środa, czyli {1,2,4,5,6}): 5",
          "P = 5/6"
        ],
        "5/6 ≈ 0,833"
      )
    },
    {
      id: "pr2",
      prompt: "Rzucamy kostką do gry. Jakie jest prawdopodobieństwo wyrzucenia szóstki? Podaj ułamek.",
      fields: [{ label: "P", unit: "", value: 1/6, tol: 0.01 }],
      hint: hint(
        "Każda ścianka kostki jest równie prawdopodobna. Szóstka to 1 z 6 ścian.",
        [
          "Wszystkie wyniki: 6.",
          "Korzystne (tylko szóstka): 1.",
          "P = 1/6"
        ]
      ),
      solution: sol(
        "kostka 6 ścian",
        "P(6)",
        [
          "Wszystkich wyników: 6",
          "Korzystnych (tylko 6): 1",
          "P = 1/6"
        ],
        "1/6 ≈ 0,167"
      )
    },
    {
      id: "pr3",
      prompt: "Rzucamy kostką. Jakie jest prawdopodobieństwo, że wypadnie liczba NIE WIĘKSZA niż 5? Podaj ułamek.",
      fields: [{ label: "P", unit: "", value: 5/6, tol: 0.01 }],
      hint: hint(
        "'Nie większa niż 5' znaczy 1, 2, 3, 4 lub 5. To 5 liczb. Wszystkich liczb na kostce: 6.",
        [
          "Korzystne wyniki: 1, 2, 3, 4, 5 — czyli 5 wyników.",
          "Wszystkich wyników: 6.",
          "P = 5/6"
        ]
      ),
      solution: sol(
        "kostka; nie większa niż 5 = {1,2,3,4,5}",
        "P(≤5)",
        [
          "Korzystne: 5 wyników (1, 2, 3, 4, 5)",
          "Wszystkich: 6",
          "P = 5/6"
        ],
        "5/6 ≈ 0,833"
      )
    },
    {
      id: "pr4",
      prompt: "W pojemniku jest 1 biała kula, 2 czerwone i 6 czarnych. Jakie jest prawdopodobieństwo, że wylosowana kula NIE BĘDZIE CZERWONA?",
      fields: [{ label: "P", unit: "", value: 7/9, tol: 0.01 }],
      hint: hint(
        "Razem kul: 1 + 2 + 6 = 9. 'Nie czerwone' to białe + czarne = 1 + 6 = 7.",
        [
          "Razem kul: 1 + 2 + 6 = 9.",
          "'Nie czerwone (białe + czarne): 1 + 6 = 7.",
          "P = 7/9"
        ]
      ),
      solution: sol(
        "1 biała, 2 czerwone, 6 czarnych — razem 9 kul",
        "P(nie czerwona)",
        [
          "Razem: 1 + 2 + 6 = 9 kul",
          "'Nie czerwone: 1 + 6 = 7 kul",
          "P = 7/9"
        ],
        "7/9 ≈ 0,778"
      )
    },
    {
      id: "pr5",
      prompt: "Kasia rzuca kostką. A: wypadnie więcej niż 2 oczka. B: wypadnie mniej niż 5 oczek. Oblicz P(A) + P(B). Podaj ułamek.",
      fields: [{ label: "P(A)+P(B)", unit: "", value: 4/3, tol: 0.01 }],
      hint: hint(
        "Najpierw wymień co należy do A i B, potem policz prawdopodobieństwo każdego, na końcu dodaj.",
        [
          "A: więcej niż 2 = {3, 4, 5, 6} — 4 wyniki. P(A) = 4/6.",
          "B: mniej niż 5 = {1, 2, 3, 4} — 4 wyniki. P(B) = 4/6.",
          "Suma: 4/6 + 4/6 = 8/6 = 4/3."
        ]
      ),
      solution: sol(
        "kostka; A: >2 = {3,4,5,6}; B: <5 = {1,2,3,4}",
        "P(A) + P(B)",
        [
          "P(A) = 4/6 = 2/3",
          "P(B) = 4/6 = 2/3",
          "P(A) + P(B) = 2/3 + 2/3 = 4/3"
        ],
        "4/3 ≈ 1,33 (większe niż 1 — bo zdarzenia mają wspólne wyniki)"
      )
    },
    {
      id: "pr6",
      prompt: "W trzech klasach 8a, 8b, 8c jest łącznie 87 osób (8c ma 30 osób). Jakie jest prawdopodobieństwo wylosowania osoby z klasy 8c? Podaj ułamek.",
      fields: [{ label: "P", unit: "", value: 30/87, tol: 0.01 }],
      hint: hint(
        "Wszystkich osób: 87. Korzystne (z 8c): 30. Podziel i można skrócić ułamek.",
        [
          "Wszystkich: 87.",
          "Korzystne (8c): 30.",
          "P = 30/87 = 10/29 (po skróceniu przez 3)."
        ]
      ),
      solution: sol(
        "razem 87 osób; 8c = 30",
        "P(8c)",
        [
          "Wszystkich: 87, korzystnych (8c): 30",
          "P = 30/87",
          "Skracam (dzielę przez 3): P = 10/29"
        ],
        "30/87 = 10/29 ≈ 0,345"
      )
    },
    {
      id: "pr7",
      prompt: "Na festynie jest 120 pączków. W 3 ukryto czerwony guzik, w 5 niebieski (oba dają nagrodę). Jakie jest prawdopodobieństwo, że pierwszy kupiony pączek będzie miał JAKĄKOLWIEK nagrodę?",
      fields: [{ label: "P", unit: "", value: 8/120, tol: 0.005 }],
      hint: hint(
        "Pączków z nagrodą: 3 + 5 = 8. Razem pączków: 120.",
        [
          "Wszystkich pączków: 120.",
          "Korzystne (z nagrodą): 3 + 5 = 8.",
          "P = 8/120 = 1/15"
        ]
      ),
      solution: sol(
        "120 pączków; z nagrodą: 3 czerwone + 5 niebieskich = 8",
        "P(nagroda)",
        [
          "Wszystkich: 120, korzystnych: 8",
          "P = 8/120",
          "Skracam (przez 8): P = 1/15"
        ],
        "8/120 = 1/15 ≈ 0,067"
      )
    },
    {
      id: "pr8",
      prompt: "Z urny z 5 białymi, 3 czarnymi i 2 czerwonymi kulami losujemy jedną. Jakie jest prawdopodobieństwo wylosowania kuli NIE BIAŁEJ?",
      fields: [{ label: "P", unit: "", value: 5/10, tol: 0.01 }],
      hint: hint(
        "Razem kul: 5+3+2 = 10. Nie białe to czarne + czerwone = 3+2 = 5.",
        [
          "Razem: 5 + 3 + 2 = 10 kul.",
          "'Nie białe: 3 + 2 = 5.",
          "P = 5/10 = 1/2."
        ]
      ),
      solution: sol(
        "5 białych, 3 czarne, 2 czerwone — razem 10",
        "P(nie biała)",
        [
          "Razem: 10 kul",
          "'Nie białe: 3 + 2 = 5",
          "P = 5/10 = 1/2"
        ],
        "1/2 = 0,5"
      )
    }
  ];

  function probabilityGen() {
    const t = rand(1, 3);
    if (t === 1) {
      const dni = ["poniedziałek","wtorek","środę","czwartek","piątek","sobotę"];
      const idx = rand(0, 5);
      const kind = pick(["specific", "not"]);
      if (kind === "specific") {
        return {
          id: `prg1-spec-${idx}`,
          prompt: `Rzucamy kostką (dni: pon=1, wt=2, śr=3, czw=4, pt=5, sob=6). Jakie jest prawdopodobieństwo wylosowania ${dni[idx]} (${idx+1})?`,
          fields: [{ label: "P", unit: "", value: 1/6, tol: 0.01 }],
          hint: hint(
            "Każdy dzień ma takie samo prawdopodobieństwo — to 1 z 6 ścianek kostki.",
            ["Wszystkich wyników: 6.", "Korzystnych (szukany dzień): 1.", "P = 1/6"]
          ),
          solution: sol(`kostka; szukany dzień: ${dni[idx]} (${idx+1})`, "P", ["Wszystkich: 6, korzystnych: 1", "P = 1/6"], "1/6 ≈ 0,167")
        };
      }
      return {
        id: `prg1-not-${idx}`,
        prompt: `Rzucamy kostką. Jakie jest prawdopodobieństwo, że dniem NIE BĘDZIE ${dni[idx]} (${idx+1})?`,
        fields: [{ label: "P", unit: "", value: 5/6, tol: 0.01 }],
        hint: hint(
          "Wykluczamy 1 dzień z 6 — zostaje 5 wyników korzystnych.",
          ["Wszystkich wyników: 6.", "Korzystnych (nie ten dzień): 6 − 1 = 5.", "P = 5/6"]
        ),
        solution: sol(`kostka; wykluczamy ${dni[idx]}`, "P", ["Wszystkich: 6, korzystnych: 5", "P = 5/6"], "5/6 ≈ 0,833")
      };
    }
    if (t === 2) {
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
        hint: hint(
          `Wszystkich kul: ${a}+${b}+${c} = ${total}. Korzystne (${labels[wybor-1]} kule): ${fav}.`,
          [`Razem: ${a} + ${b} + ${c} = ${total}.`, `Korzystne: ${fav}.`, `P = ${fav}/${total}`]
        ),
        solution: sol(`${a} białych, ${b} czerwonych, ${c} zielonych; razem ${total}`, "P", [`Razem: ${total}, korzystnych: ${fav}`, `P = ${fav}/${total}`], `${fav}/${total} ≈ ${(fav/total).toFixed(3).replace(".",",")}`)
      };
    }
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
      hint: hint(
        `Razem: ${total} kul. 'Nie ${labels[wybor-1]}' to wszystkie KROTNE niż ten kolor = ${fav}.`,
        [`Razem: ${total}.`, `Nie ${labels[wybor-1]}: ${total} − ${counts[wybor-1]} = ${fav}.`, `P = ${fav}/${total}`]
      ),
      solution: sol(`${a} białych, ${b} czerwonych, ${c} zielonych; razem ${total}`, "P", [`Razem: ${total}`, `Nie ${labels[wybor-1]}: ${fav}`, `P = ${fav}/${total}`], `${fav}/${total} ≈ ${(fav/total).toFixed(3).replace(".",",")}`)
    };
  }

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
      throw new Error("Nieznana kategoria: " + category);
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
