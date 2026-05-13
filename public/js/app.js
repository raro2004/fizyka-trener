// app.js — sklejka: UI, sesja, kontroler
(function () {
  "use strict";
  const E = window.CircuitEngine;
  const PhP = window.PhysicsProblems;
  const MaP = window.MathProblems;
  const SRS = window.SRS;
  const CSVG = window.CircuitSVG;

  let state = SRS.load();
  let currentSubject = null;   // "physics" | "math"
  let currentCategory = null;  // np. "basic" / "math-percent"
  let currentTask = null;
  let currentResult = null;
  let currentTaskShownAt = 0;
  let currentUser = null;

  // === Definicja przedmiotów i kategorii ===
  const SUBJECTS = {
    physics: {
      title: "Fizyka — Prąd elektryczny",
      icon: "⚡",
      desc: "Wzory, opór zastępczy, układy mieszane",
      categories: {
        basic: {
          title: "Wzory podstawowe",
          subtitle: "U = I·R, q = I·t, P = U·I, W = U·I·t",
          icon: "⚡",
          desc: "14 zadań tekstowych z prądu — natężenie, opór, moc, energia."
        },
        rz: {
          title: "Opór zastępczy",
          subtitle: "Szeregowo i równolegle",
          icon: "🔗",
          desc: "Obliczanie R_z dla różnych konfiguracji oporników."
        },
        mixed: {
          title: "Układy mieszane",
          subtitle: "U i I na każdym oporniku",
          icon: "🧩",
          desc: "Dla zadanego napięcia policz R_z, prąd całkowity oraz U i I na każdym oporniku."
        }
      }
    },
    math: {
      title: "Matematyka — Zastosowania",
      icon: "🔢",
      desc: "Procenty, finanse, stosunki, prawdopodobieństwo",
      categories: {
        "math-percent": {
          title: "Procenty",
          subtitle: "X% z liczby, większa/mniejsza, ile było",
          icon: "%",
          desc: "12 zadań + nieskończony generator: liczyć z procentu, znajdować całość, porównywać."
        },
        "math-finance": {
          title: "Finanse: VAT i lokaty",
          subtitle: "Cena netto/brutto, lokaty bankowe, podatki",
          icon: "💰",
          desc: "10 zadań + generator: VAT 23/8/5%, lokata 1-2 lata, przeceny, podatek."
        },
        "math-ratio": {
          title: "Stosunki i roztwory",
          subtitle: "Proporcje, dzielenie w stosunku, mieszaniny",
          icon: "⚖️",
          desc: "10 zadań + generator: dzielenie w stosunku, roztwory procentowe."
        },
        "math-probability": {
          title: "Prawdopodobieństwo",
          subtitle: "Kostka, urna, tabele",
          icon: "🎲",
          desc: "8 zadań + generator: P(zdarzenia), zdarzenia przeciwne i alternatywy."
        }
      }
    }
  };

  // === Backend ===
  async function api(path, opts) {
    opts = opts || {};
    opts.credentials = "same-origin";
    opts.headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    if (opts.body && typeof opts.body !== "string") opts.body = JSON.stringify(opts.body);
    const res = await fetch(path, opts);
    if (res.status === 401) { location.href = "/login.html"; return null; }
    return res;
  }
  async function checkAuth() {
    try {
      const r = await fetch("/api/me", { credentials: "same-origin" });
      const j = await r.json();
      if (!j.user) { location.href = "/login.html"; return null; }
      return j.user;
    } catch (e) { return null; }
  }
  async function recordAttempt(category, taskId, ok, timeSpentMs) {
    try {
      await api("/api/attempt", { method: "POST", body: { category, taskId, ok, timeSpentMs } });
    } catch (e) {}
  }
  function startHeartbeat() {
    fetch("/api/heartbeat", { method: "POST", credentials: "same-origin" }).catch(() => {});
    setInterval(() => {
      if (document.visibilityState === "visible") {
        fetch("/api/heartbeat", { method: "POST", credentials: "same-origin" }).catch(() => {});
      }
    }, 30000);
  }

  // === Statyka i generator zadań dla kategorii ===
  function getStaticTasks(category) {
    if (category === "basic") return PhP.basicStatic;
    if (category === "rz") return PhP.rzStatic.map(PhP.buildRzTask);
    if (category === "mixed") return PhP.mixedStatic.map(PhP.buildMixedTask);
    if (category.startsWith("math-")) return MaP.getAllStatic()[category] || [];
    return [];
  }
  function generateTask(category) {
    if (category === "basic" || category === "rz" || category === "mixed") return PhP.generate(category);
    if (category.startsWith("math-")) return MaP.generate(category);
    throw new Error("Nieznana kategoria: " + category);
  }
  function subjectOfCategory(cat) {
    return cat.startsWith("math-") ? "math" : "physics";
  }

  // === Renderowanie ekranów ===

  // 1. Wybór przedmiotu (Fizyka / Matematyka)
  function renderSubjectPicker() {
    currentSubject = null;
    currentCategory = null;
    const root = document.getElementById("app");
    const userName = currentUser ? currentUser.login : "";
    const cards = Object.keys(SUBJECTS).map(key => {
      const sub = SUBJECTS[key];
      // sumaryczny postęp przedmiotu
      const cats = Object.keys(sub.categories);
      let total = 0, correct = 0, bestStreakSum = 0;
      cats.forEach(c => {
        const s = state.categories[c];
        if (s) { total += s.total; correct += s.correct; bestStreakSum += s.bestStreak; }
      });
      const acc = total ? Math.round(100*correct/total) : 0;
      const avgLevel = Math.min(5, Math.round(bestStreakSum / cats.length / 5) + (bestStreakSum > 0 ? 1 : 0));
      const stars = "★".repeat(avgLevel) + "☆".repeat(5 - avgLevel);
      return `
        <div class="card subject-card" data-subject="${key}">
          <div class="cat-icon">${sub.icon}</div>
          <h3>${sub.title}</h3>
          <p class="cat-desc">${sub.desc}</p>
          <div class="cat-stats">
            <span class="level">${stars}</span>
            <span class="acc">${correct}/${total} (${acc}%)</span>
          </div>
          <button class="btn primary start-btn">Wybierz →</button>
        </div>
      `;
    }).join("");
    root.innerHTML = `
      <header>
        <h1>🔋 Trener — fizyka i matematyka</h1>
        <p class="hello">${userName ? `Cześć, ${userName}! ` : ""}Wybierz przedmiot.</p>
      </header>
      <main class="cards">${cards}</main>
      <footer>
        <button id="resetAll" class="btn ghost danger">Wyzeruj postęp</button>
        <button id="logoutBtn" class="btn ghost">Wyloguj</button>
        <p class="goal">Cel: 5 gwiazdek w każdej kategorii (20 poprawnych z rzędu).</p>
      </footer>
    `;
    document.querySelectorAll(".subject-card").forEach(el => {
      el.addEventListener("click", () => { currentSubject = el.dataset.subject; renderCategoryPicker(); });
    });
    document.getElementById("resetAll").addEventListener("click", () => {
      if (confirm("Na pewno wyzerować cały postęp?")) {
        SRS.reset(); state = SRS.load(); renderSubjectPicker();
      }
    });
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
      location.href = "/login.html";
    });
  }

  // 2. Wybór kategorii w obrębie przedmiotu
  function renderCategoryPicker() {
    const root = document.getElementById("app");
    const sub = SUBJECTS[currentSubject];
    const cards = Object.keys(sub.categories).map(key => {
      const meta = sub.categories[key];
      const cat = state.categories[key] || { streak: 0, bestStreak: 0, total: 0, correct: 0, level: 1, mastered: false };
      const acc = cat.total ? Math.round(100*cat.correct/cat.total) : 0;
      const stars = "★".repeat(cat.level) + "☆".repeat(5 - cat.level);
      return `
        <div class="card cat-card" data-cat="${key}">
          <div class="cat-icon">${meta.icon}</div>
          <h3>${meta.title}</h3>
          <p class="cat-subtitle">${meta.subtitle}</p>
          <p class="cat-desc">${meta.desc}</p>
          <div class="cat-stats">
            <span class="level">${stars}</span>
            <span class="streak">🔥 ${cat.streak} z rzędu (rekord: ${cat.bestStreak})</span>
            <span class="acc">${cat.correct}/${cat.total} (${acc}%)</span>
          </div>
          ${cat.mastered ? `<div class="mastered-badge">✓ OPANOWANE NA 5</div>` : ""}
          <button class="btn primary start-btn">Ćwicz →</button>
        </div>
      `;
    }).join("");
    root.innerHTML = `
      <header class="session-header">
        <button class="btn ghost back-btn">← Wybór przedmiotu</button>
        <h1 style="margin:0;font-size:20px">${sub.icon} ${sub.title}</h1>
        <button id="logoutBtn" class="btn ghost">Wyloguj</button>
      </header>
      <main class="cards">${cards}</main>
    `;
    document.querySelectorAll(".cat-card").forEach(el => {
      el.addEventListener("click", () => startSession(el.dataset.cat));
    });
    document.querySelector(".back-btn").addEventListener("click", () => renderSubjectPicker());
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
      location.href = "/login.html";
    });
  }

  function startSession(category) {
    currentCategory = category;
    currentSubject = subjectOfCategory(category);
    nextTask();
  }

  function nextTask() {
    const allStatic = getStaticTasks(currentCategory);
    const generator = () => generateTask(currentCategory);
    const picked = SRS.pickNext(currentCategory, allStatic, generator, state);
    currentTask = picked.task;
    currentResult = null;
    currentTaskShownAt = Date.now();
    renderTask(picked.source);
  }

  function renderTask(source) {
    const root = document.getElementById("app");
    const sub = SUBJECTS[currentSubject];
    const meta = sub.categories[currentCategory];
    const cat = state.categories[currentCategory] || { streak: 0, bestStreak: 0, total: 0, correct: 0 };
    const fields = currentTask.fields.map((f, i) => `
      <div class="answer-row">
        <label>${f.label} =
          <input type="text" inputmode="decimal" data-idx="${i}" autocomplete="off" />
          <span class="unit">${f.unit}</span>
        </label>
      </div>
    `).join("");

    let circuitHtml = "";
    if (currentTask.net) {
      try {
        circuitHtml = `<div class="circuit">${
          CSVG.drawCircuit(E.normalize(currentTask.net), {
            battery: currentCategory === "mixed",
            U: currentTask.U
          })
        }</div>`;
      } catch(e) {}
    }

    root.innerHTML = `
      <header class="session-header">
        <button class="btn ghost back-btn">← Powrót</button>
        <div class="session-info">
          <span class="badge">${meta.icon} ${meta.title}</span>
          <span class="streak">🔥 ${cat.streak} z rzędu</span>
          <span class="progress">${cat.correct}/${cat.total} • cel: 20 z rzędu</span>
        </div>
      </header>
      <main class="task-main">
        <div class="task-card">
          <div class="task-source">${source === "powtórka" ? "🔁 Powtórka po błędzie" : source === "nowe" ? "🆕 Nowe zadanie" : "🎲 Wygenerowane"}</div>
          <p class="task-prompt">${currentTask.prompt}</p>
          ${circuitHtml}
          <div class="answers">${fields}</div>
          <div class="task-actions">
            <button class="btn primary check-btn">Sprawdź odpowiedź</button>
            <button class="btn ghost hint-btn">💡 Podpowiedź (wzór)</button>
          </div>
          <div class="feedback" id="feedback"></div>
        </div>
      </main>
    `;
    document.querySelector(".back-btn").addEventListener("click", () => renderCategoryPicker());
    document.querySelector(".check-btn").addEventListener("click", checkAnswer);
    document.querySelector(".hint-btn").addEventListener("click", showHint);
    const firstInput = document.querySelector("input[data-idx='0']");
    if (firstInput) firstInput.focus();
    document.querySelectorAll("input").forEach((el, i, all) => {
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          if (i < all.length - 1) all[i+1].focus();
          else checkAnswer();
        }
      });
    });
  }

  function parseAnswer(text) {
    if (text === undefined || text === null) return NaN;
    text = String(text).trim().replace(",", ".").replace(/\s/g, "").replace(/zł|%|kg|m|h|s|A|V|Ω/gi, "");
    if (text === "") return NaN;
    if (text.includes("/")) {
      const [a, b] = text.split("/");
      const n = parseFloat(a), d = parseFloat(b);
      if (!isNaN(n) && !isNaN(d) && d !== 0) return n / d;
    }
    return parseFloat(text);
  }

  function checkAnswer() {
    const inputs = document.querySelectorAll("input");
    const userAnswers = [];
    let allCorrect = true;
    currentTask.fields.forEach((f, i) => {
      const v = parseAnswer(inputs[i].value);
      const ok = !isNaN(v) && Math.abs(v - f.value) <= (f.tol || 0.05) + Math.abs(f.value) * 0.005;
      userAnswers.push({ value: v, ok });
      if (!ok) allCorrect = false;
    });
    currentResult = { ok: allCorrect, userAnswers };
    SRS.record(currentCategory, currentTask, allCorrect, state);
    const timeSpentMs = Date.now() - currentTaskShownAt;
    recordAttempt(currentCategory, currentTask.id, allCorrect, timeSpentMs);

    const fb = document.getElementById("feedback");
    let html = "";
    if (allCorrect) {
      const c = state.categories[currentCategory];
      const remaining = Math.max(0, 20 - c.bestStreak);
      html = `
        <div class="feedback ok">
          <h3>✅ Brawo!</h3>
          <p>Wszystkie odpowiedzi prawidłowe.</p>
          <p>Streak: <b>${c.streak}</b> z rzędu. ${remaining > 0 ? `Do mistrzostwa zostało ${remaining}.` : "🏆 MISTRZOSTWO OSIĄGNIĘTE!"}</p>
          <button class="btn primary next-btn">Następne zadanie →</button>
        </div>
      `;
    } else {
      const list = currentTask.fields.map((f, i) => {
        const u = userAnswers[i];
        const got = isNaN(u.value) ? "(brak)" : E.fmt(u.value);
        const expected = E.fmtBoth(f.value);
        return `<li>${f.label} = <span class="${u.ok ? "ok" : "bad"}">${got} ${f.unit}</span> ${u.ok ? "✓" : `(prawidłowo: <b>${expected} ${f.unit}</b>)`}</li>`;
      }).join("");
      const steps = currentTask.solution.map(s => `<li>${s}</li>`).join("");
      html = `
        <div class="feedback bad">
          <h3>❌ Niestety błąd</h3>
          <ul class="answer-list">${list}</ul>
          <details open>
            <summary><b>📚 Rozwiązanie krok po kroku</b></summary>
            <ol class="solution-steps">${steps}</ol>
          </details>
          <p class="reset-note">Streak wyzerowany. Spróbuj ponownie z nowym zadaniem (to wróci później).</p>
          <button class="btn primary next-btn">Dalej →</button>
        </div>
      `;
    }
    fb.outerHTML = html;
    document.querySelector(".next-btn").addEventListener("click", nextTask);
  }

  function showHint() {
    const fb = document.getElementById("feedback");
    const lines = currentTask.hint && currentTask.hint.length
      ? currentTask.hint
      : (currentTask.solution.slice(0, 4) || ["Brak podpowiedzi"]);
    const items = lines.map(l => `<li>${l}</li>`).join("");
    fb.innerHTML = `
      <div class="feedback hint">
        <h3>💡 Podpowiedź — co za co podstawić</h3>
        <ol class="hint-steps">${items}</ol>
        <p class="hint-note">Podpowiedź pokazuje wzory i co przekształcić — ale liczby już sam wpisz!</p>
      </div>`;
  }

  // === Start ===
  document.addEventListener("DOMContentLoaded", async () => {
    state = SRS.load();
    currentUser = await checkAuth();
    if (!currentUser) return;
    if (currentUser.role === "admin") { location.href = "/admin.html"; return; }
    startHeartbeat();
    renderSubjectPicker();
  });
})();
