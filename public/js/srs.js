// srs.js — system spaced repetition i śledzenia postępów
// Stan trzymany w localStorage pod kluczem "fizyka-trener-state"

(function (global) {
  "use strict";

  const STORAGE_KEY = "fizyka-trener-state-v1";

  const KNOWN_CATEGORIES = [
    "basic", "rz", "mixed",
    "math-percent", "math-finance", "math-ratio", "math-probability"
  ];

  // Domyślny stan użytkownika
  function defaultState() {
    const cats = {};
    KNOWN_CATEGORIES.forEach(c => cats[c] = catState());
    return {
      name: "",
      categories: cats,
      log: []  // {ts, cat, taskId, ok}
    };
  }
  function catState() {
    return {
      streak: 0,         // ile poprawnych z rzędu (resetuje się po błędzie)
      bestStreak: 0,
      total: 0,          // ile zadań rozwiązano
      correct: 0,        // ile poprawnie
      mastered: false,   // czy osiągnięto poziom 5
      seenStatic: {},    // taskId → liczba poprawnych wykonan
      queue: [],         // kolejka zadań do powtórki (taskId, dueAfterTotal)
      level: 1           // 1-5 (5 = mastery)
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const s = JSON.parse(raw);
      if (!s.categories) s.categories = {};
      // upewnij się że mamy wszystkie klucze
      KNOWN_CATEGORIES.forEach(k => {
        if (!s.categories[k]) s.categories[k] = catState();
        Object.keys(catState()).forEach(kk => {
          if (s.categories[k][kk] === undefined) s.categories[k][kk] = catState()[kk];
        });
      });
      return s;
    } catch(e) {
      return defaultState();
    }
  }

  // Lazy ensure - dodaj kategorię jeśli nie istnieje
  function ensureCategory(name, state) {
    if (!state.categories[name]) state.categories[name] = catState();
    return state.categories[name];
  }
  function save(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
  }
  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Wybierz następne zadanie dla kategorii
  // Strategia:
  //  - Najpierw zadania z kolejki powtórek (jeśli wymagają powtórzenia teraz)
  //  - Potem nieujęte statyczne zadania (po kolei)
  //  - Potem nowe wygenerowane
  function pickNext(category, allStatic, generator, state) {
    const cat = ensureCategory(category, state);
    const total = cat.total;

    // 1. Sprawdź kolejkę powtórek — czy któreś jest "gotowe" (dueAfterTotal <= total)
    if (cat.queue.length > 0) {
      const idx = cat.queue.findIndex(q => q.dueAfterTotal <= total);
      if (idx >= 0) {
        const q = cat.queue.splice(idx, 1)[0];
        const t = allStatic.find(x => x.id === q.taskId);
        if (t) return { task: t, source: "powtórka" };
        // jeśli zadania nie ma w statycznych (zostało wygenerowane), to po prostu generuj nowe
      }
    }

    // 2. Pierwsze zadanie statyczne, którego jeszcze nie zaliczył (lub zrobił < 1 raz)
    for (const t of allStatic) {
      if ((cat.seenStatic[t.id] || 0) < 1) {
        return { task: t, source: "nowe" };
      }
    }

    // 3. Wygeneruj nowe losowe
    const t = generator();
    return { task: t, source: "wygenerowane" };
  }

  // Zarejestruj wynik
  function record(category, task, ok, state) {
    const cat = ensureCategory(category, state);
    cat.total += 1;
    if (ok) {
      cat.correct += 1;
      cat.streak += 1;
      cat.bestStreak = Math.max(cat.bestStreak, cat.streak);
      cat.seenStatic[task.id] = (cat.seenStatic[task.id] || 0) + 1;
    } else {
      cat.streak = 0;
      // dodaj do kolejki powtórek - wróć za 3 zadania
      cat.queue.push({ taskId: task.id, dueAfterTotal: cat.total + 3 });
    }
    // poziom: 1 (do 4 streak), 2 (5-9), 3 (10-14), 4 (15-19), 5 (20+)
    cat.level = Math.min(5, 1 + Math.floor(cat.bestStreak / 5));
    if (cat.bestStreak >= 20 && Object.keys(cat.seenStatic).length >= 5) cat.mastered = true;
    state.log.push({ ts: Date.now(), cat: category, taskId: task.id, ok });
    save(state);
  }

  function setName(name, state) {
    state.name = name; save(state);
  }

  global.SRS = { load, save, reset, pickNext, record, setName, defaultState };
})(typeof window !== "undefined" ? window : globalThis);
