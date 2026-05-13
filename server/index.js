// server/index.js — Express + SQLite + auth
const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const DATA_DIR = process.env.DATA_DIR || "/data";
fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, "app.db");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// === Schema ===
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    login TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ts INTEGER NOT NULL,
    category TEXT NOT NULL,
    task_id TEXT NOT NULL,
    ok INTEGER NOT NULL,
    time_spent_ms INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_attempts_user_ts ON attempts(user_id, ts);
  CREATE TABLE IF NOT EXISTS heartbeats (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ts INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_heartbeats_user_ts ON heartbeats(user_id, ts);
  CREATE TABLE IF NOT EXISTS app_sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expires INTEGER NOT NULL
  );
`);

// === Seed użytkownicy z env ===
function ensureUser(login, password, role) {
  const existing = db.prepare("SELECT id, password_hash FROM users WHERE login = ?").get(login);
  const hash = bcrypt.hashSync(password, 10);
  if (existing) {
    // aktualizuj hasło jeśli się zmieniło w env
    if (!bcrypt.compareSync(password, existing.password_hash)) {
      db.prepare("UPDATE users SET password_hash = ?, role = ? WHERE id = ?").run(hash, role, existing.id);
      console.log(`[seed] zaktualizowano hasło dla ${login}`);
    }
  } else {
    db.prepare("INSERT INTO users (login, password_hash, role, created_at) VALUES (?, ?, ?, ?)")
      .run(login, hash, role, Date.now());
    console.log(`[seed] utworzono użytkownika ${login} (${role})`);
  }
}
// Studenci: STUDENT_LOGIN/STUDENT_PASSWORD (1) + STUDENT2..STUDENT10
ensureUser(process.env.STUDENT_LOGIN || "kuba", process.env.STUDENT_PASSWORD || "fizyka", "student");
for (let i = 2; i <= 10; i++) {
  const login = process.env[`STUDENT${i}_LOGIN`];
  const password = process.env[`STUDENT${i}_PASSWORD`];
  if (login && password) ensureUser(login, password, "student");
}
ensureUser(process.env.ADMIN_LOGIN || "rafal", process.env.ADMIN_PASSWORD || "admin2026", "admin");

// === Session store (SQLite) ===
class SqliteStore extends session.Store {
  constructor() {
    super();
    setInterval(() => {
      try { db.prepare("DELETE FROM app_sessions WHERE expires < ?").run(Date.now()); } catch (e) {}
    }, 60 * 60 * 1000);
  }
  get(sid, cb) {
    try {
      const row = db.prepare("SELECT sess, expires FROM app_sessions WHERE sid = ?").get(sid);
      if (!row) return cb(null, null);
      if (row.expires < Date.now()) {
        db.prepare("DELETE FROM app_sessions WHERE sid = ?").run(sid);
        return cb(null, null);
      }
      cb(null, JSON.parse(row.sess));
    } catch (e) { cb(e); }
  }
  set(sid, sess, cb) {
    try {
      const expires = sess.cookie && sess.cookie.expires
        ? new Date(sess.cookie.expires).getTime()
        : Date.now() + 30 * 24 * 60 * 60 * 1000;
      db.prepare("INSERT OR REPLACE INTO app_sessions (sid, sess, expires) VALUES (?, ?, ?)")
        .run(sid, JSON.stringify(sess), expires);
      cb && cb();
    } catch (e) { cb && cb(e); }
  }
  destroy(sid, cb) {
    try { db.prepare("DELETE FROM app_sessions WHERE sid = ?").run(sid); cb && cb(); }
    catch (e) { cb && cb(e); }
  }
  touch(sid, sess, cb) { this.set(sid, sess, cb); }
}

// === App ===
const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));

const SESSION_SECRET = process.env.SESSION_SECRET || "fizyka-trener-dev-secret-zmien-mnie";
app.use(session({
  store: new SqliteStore(),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dni
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  }
}));

// === Middleware ===
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: "Nie zalogowany" });
  next();
}
function requireAdmin(req, res, next) {
  if (!req.session.userId || req.session.role !== "admin") return res.status(403).json({ error: "Brak uprawnień" });
  next();
}

// === Auth API ===
app.post("/api/login", (req, res) => {
  const { login, password } = req.body || {};
  if (!login || !password) return res.status(400).json({ error: "Brakuje loginu lub hasła" });
  const user = db.prepare("SELECT * FROM users WHERE login = ?").get(String(login).trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    // celowe opóźnienie żeby utrudnić bruteforce
    setTimeout(() => res.status(401).json({ error: "Nieprawidłowy login lub hasło" }), 500);
    return;
  }
  req.session.userId = user.id;
  req.session.login = user.login;
  req.session.role = user.role;
  res.json({ login: user.login, role: user.role });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  res.json({ user: { login: req.session.login, role: req.session.role } });
});

// === Logowanie aktywności ===
const ATTEMPT_INSERT = db.prepare(
  "INSERT INTO attempts (user_id, ts, category, task_id, ok, time_spent_ms) VALUES (?, ?, ?, ?, ?, ?)"
);
const HEARTBEAT_INSERT = db.prepare("INSERT INTO heartbeats (user_id, ts) VALUES (?, ?)");

app.post("/api/attempt", requireAuth, (req, res) => {
  const { category, taskId, ok, timeSpentMs } = req.body || {};
  if (!category || !taskId || ok === undefined) return res.status(400).json({ error: "Brak danych" });
  const ALLOWED_CATS = ["basic", "rz", "mixed", "math-percent", "math-finance", "math-ratio", "math-probability"];
  if (!ALLOWED_CATS.includes(category)) return res.status(400).json({ error: "Zła kategoria" });
  ATTEMPT_INSERT.run(
    req.session.userId,
    Date.now(),
    category,
    String(taskId).slice(0, 200),
    ok ? 1 : 0,
    Math.min(parseInt(timeSpentMs) || 0, 600000)
  );
  res.json({ ok: true });
});

app.post("/api/heartbeat", requireAuth, (req, res) => {
  HEARTBEAT_INSERT.run(req.session.userId, Date.now());
  res.json({ ok: true });
});

// === Admin API ===
app.get("/api/admin/users", requireAdmin, (req, res) => {
  const users = db.prepare("SELECT id, login, role, created_at FROM users WHERE role != 'admin' ORDER BY login").all();
  res.json({ users });
});

app.get("/api/admin/stats/:userId", requireAdmin, (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!userId) return res.status(400).json({ error: "Zły userId" });
  const user = db.prepare("SELECT id, login, created_at FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: "Nie ma takiego użytkownika" });

  const totals = db.prepare(`
    SELECT category, COUNT(*) as total, SUM(ok) as correct
    FROM attempts WHERE user_id = ?
    GROUP BY category
  `).all(userId);

  const recent = db.prepare(`
    SELECT ts, category, task_id, ok, time_spent_ms
    FROM attempts WHERE user_id = ?
    ORDER BY ts DESC LIMIT 100
  `).all(userId);

  // Sumaryczny czas spędzony — z heartbeats, traktujemy gap < 90s jako kontynuację
  const heartbeats = db.prepare("SELECT ts FROM heartbeats WHERE user_id = ? ORDER BY ts ASC").all(userId).map(h => h.ts);
  let totalTimeMs = 0;
  let lastTs = null;
  let activeSessions = []; // {start, end}
  let curStart = null;
  for (const ts of heartbeats) {
    if (lastTs && (ts - lastTs) < 90000) {
      totalTimeMs += (ts - lastTs);
      // kontynuacja sesji
    } else {
      // koniec poprzedniej, początek nowej
      if (curStart !== null) activeSessions.push({ start: curStart, end: lastTs });
      curStart = ts;
    }
    lastTs = ts;
  }
  if (curStart !== null) activeSessions.push({ start: curStart, end: lastTs });

  // Per-day
  const daily = db.prepare(`
    SELECT date(ts/1000, 'unixepoch', 'localtime') as day,
           COUNT(*) as attempts, SUM(ok) as correct
    FROM attempts WHERE user_id = ?
    GROUP BY day ORDER BY day DESC LIMIT 30
  `).all(userId);

  // Najczęściej mylone zadania
  const missed = db.prepare(`
    SELECT category, task_id, COUNT(*) as wrong_count
    FROM attempts WHERE user_id = ? AND ok = 0
    GROUP BY category, task_id ORDER BY wrong_count DESC LIMIT 15
  `).all(userId);

  // Pierwsze logowanie / ostatnia aktywność
  const firstAttempt = db.prepare("SELECT MIN(ts) as ts FROM attempts WHERE user_id = ?").get(userId);
  const lastAttempt = db.prepare("SELECT MAX(ts) as ts FROM attempts WHERE user_id = ?").get(userId);
  const lastHeartbeat = db.prepare("SELECT MAX(ts) as ts FROM heartbeats WHERE user_id = ?").get(userId);

  res.json({
    user: { login: user.login, created_at: user.created_at },
    totals,
    recent,
    totalTimeMs,
    sessionCount: activeSessions.length,
    sessions: activeSessions.slice(-20).reverse(),
    daily,
    missed,
    firstAttempt: firstAttempt && firstAttempt.ts,
    lastAttempt: lastAttempt && lastAttempt.ts,
    lastHeartbeat: lastHeartbeat && lastHeartbeat.ts
  });
});

// === Health + statyczne ===
app.get("/health", (req, res) => res.send("OK"));

// Auth wall: chroń index.html (aplikacja) i admin.html
function authWall(req, res, next) {
  if (req.path === "/" || req.path === "/index.html") {
    if (!req.session.userId) return res.redirect("/login.html");
  }
  if (req.path === "/admin" || req.path === "/admin.html" || req.path === "/admin/") {
    if (!req.session.userId) return res.redirect("/login.html");
    if (req.session.role !== "admin") return res.redirect("/");
  }
  next();
}
app.use(authWall);
app.use(express.static(path.join(__dirname, "..", "public"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
    } else if (/\.(js|css)$/.test(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
    }
  }
}));

// === Start ===
const PORT = parseInt(process.env.PORT || "8080");
app.listen(PORT, () => {
  console.log(`Trener Fizyki słucha na :${PORT} (DB: ${DB_PATH})`);
});
