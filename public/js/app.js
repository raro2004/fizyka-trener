// app.js — sklejka: UI, sesja, kontroler
(function () {
  "use strict";
  const E = window.CircuitEngine;
  const P = window.PhysicsProblems;
  const SRS = window.SRS;
  const CSVG = window.CircuitSVG;

  let state = SRS.load();
  let currentCategory = null;
  let currentTask = null;
  let currentResult = null; // {ok, userAnswers}
  let currentTaskShownAt = 0; // timestamp pokazania zadania
  let currentUser = null;     // {login, role}

  // === Komunikacja z backendem ===
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
    } catch (e) {
      // jeżeli backend jest offline — pozwól mimo wszystko działać lokalnie
      return null;
    }
  }

  async function recordAttempt(category, taskId, ok, timeSpentMs) {
    try {
      await api("/api/attempt", { method: "POST", body: { category, taskId, ok, timeSpentMs } });
    } catch (e) {/* offline OK */}
  }

  function startHeartbeat() {
    fetch("/api/heartbeat", { method: "POST", credentials: "same-origin" }).catch(() => {});
    setInterval(() => {
      if (document.visibilityState === "visible") {
        fetch("/api/heartbeat", { method: "POST", credentials: "same-origin" }).catch(() => {});
      }
    }, 30000);
  }

  const CATEGORIES = {
    basic: {
      title: "Wzory podstawowe",
      subtitle: "U = I·R, q = I·t, P = U·I, W = U·I·t",
      icon: "⚡",
      desc: "14 zadań tekstowych z prądu elektrycznego — natężenie, opór, moc, energia. Wpisujesz sam wynik."
    },
    rz: {
      title: "Opór zastępczy",
      subtitle: "Łączenie szeregowe i równoległe oporników",
      icon: "🔗",
      desc: "Obliczanie R_z dla różnych konfiguracji. Trzeba widzieć, gdzie jest szereg, a gdzie równoległe."
    },
    mixed: {
      title: "Układy mieszane",
      subtitle: "U i I na każdym oporniku",
      icon: "🧩",
      desc: "Najtrudniejsze. Dla zadanego napięcia trzeba policzyć R_z, prąd całkowity i wszystkie U, I."
    }
  };

  // === Render ekranów ===

  function renderHome() {
    const root = document.getElementById("app");
    const userName = currentUser ? currentUser.login : (state.name || "");
    const greeting = userName ? `Cześć, ${userName}!` : "Cześć!";
    const cards = Object.keys(CATEGORIES).map(key => {
      const cat = state.categories[key];
      const meta = CATEGORIES[key];
      const acc = cat.total ? Math.round(100 * cat.correct / cat.total) : 0;
      const stars = "★".repeat(cat.level) + "☆".repeat(5 - cat.level);
      return `
        <div class="card cat-card" data-cat="${key}">
          <div class="cat-icon">${meta.icon}</div>
          <h3>${meta.title}</h3>
          <p class="cat-subtitle">${meta.subtitle}</p>
          <p class="cat-desc">${meta.desc}</p>
          <div class="cat-stats">
            <span class="level" title="Poziom mistrzostwa">${stars}</span>
            <span class="streak">🔥 ${cat.streak} z rzędu (rekord: ${cat.bestStreak})</span>
            <span class="acc">${cat.correct}/${cat.total} (${acc}%)</span>
          </div>
          ${cat.mastered ? `<div class="mastered-badge">✓ OPANOWANE NA 5</div>` : ""}
          <button class="btn primary start-btn">Ćwicz →</button>
        </div>
      `;
    }).join("");
    root.innerHTML = `
      <header>
        <h1>🔋 Trener Fizyki — Prąd Elektryczny</h1>
        <p class="hello">${greeting} Wybierz kategorię ćwiczeń.</p>
      </header>
      <main class="cards">${cards}</main>
      <footer>
        <button id="resetAll" class="btn ghost danger">Wyzeruj postęp</button>
        <button id="logoutBtn" class="btn ghost">Wyloguj</button>
        <p class="goal">Cel: 5 gwiazdek w każdej kategorii (20 poprawnych odpowiedzi z rzędu).</p>
      </footer>
    `;
    document.querySelectorAll(".cat-card").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.closest("button") && !e.target.classList.contains("start-btn")) return;
        startSession(el.dataset.cat);
      });
    });
    document.getElementById("resetAll").addEventListener("click", () => {
      if (confirm("Na pewno wyzerować cały postęp?")) {
        SRS.reset(); state = SRS.load(); renderHome();
      }
    });
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
      location.href = "/login.html";
    });
  }

  function askName() {
    const n = prompt("Jak masz na imię?", state.name || "");
    if (n && n.trim()) {
      SRS.setName(n.trim(), state);
      state = SRS.load();
      renderHome();
    }
  }

  function startSession(category) {
    currentCategory = category;
    nextTask();
  }

  function nextTask() {
    const allStatic = (currentCategory === "basic")
      ? P.basicStatic
      : (currentCategory === "rz" ? P.rzStatic.map(P.buildRzTask) : P.mixedStatic.map(P.buildMixedTask));
    const generator = () => {
      const t = P.generate(currentCategory);
      return t;
    };
    const picked = SRS.pickNext(currentCategory, allStatic, generator, state);
    currentTask = picked.task;
    currentResult = null;
    currentTaskShownAt = Date.now();
    renderTask(picked.source);
  }

  function renderTask(source) {
    const root = document.getElementById("app");
    const meta = CATEGORIES[currentCategory];
    const cat = state.categories[currentCategory];
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
      } catch(e) { /* ignore drawing errors */ }
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
    document.querySelector(".back-btn").addEventListener("click", () => renderHome());
    document.querySelector(".check-btn").addEventListener("click", checkAnswer);
    document.querySelector(".hint-btn").addEventListener("click", showHint);
    const firstInput = document.querySelector("input[data-idx='0']");
    if (firstInput) firstInput.focus();
    // Enter w ostatnim polu = sprawdź; w pośrednim = przejdź dalej
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
    text = String(text).trim().replace(",", ".").replace(/\s/g, "");
    if (text === "") return NaN;
    // ułamki typu 12/11
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
    // Zapisz na serwerze
    const timeSpentMs = Date.now() - currentTaskShownAt;
    recordAttempt(currentCategory, currentTask.id, allCorrect, timeSpentMs);

    const fb = document.getElementById("feedback");
    let html = "";
    if (allCorrect) {
      const cat = state.categories[currentCategory];
      const remaining = Math.max(0, 20 - cat.bestStreak);
      html = `
        <div class="feedback ok">
          <h3>✅ Brawo!</h3>
          <p>Wszystkie odpowiedzi prawidłowe.</p>
          <p>Streak: <b>${cat.streak}</b> z rzędu. ${remaining > 0 ? `Do mistrzostwa zostało ${remaining}.` : "🏆 MISTRZOSTWO OSIĄGNIĘTE!"}</p>
          <button class="btn primary next-btn">Następne zadanie →</button>
        </div>
      `;
    } else {
      // pokaż które pola źle (pokaż oba: ułamek + dziesiętne)
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
    if (!currentUser) return;  // przekierowano na /login.html
    if (currentUser.role === "admin") {
      // Admin trafia od razu do dashboardu
      location.href = "/admin.html"; return;
    }
    startHeartbeat();
    renderHome();
  });
})();
