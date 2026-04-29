# 🔋 Trener Fizyki — Prąd Elektryczny

Aplikacja webowa do nauki rozwiązywania zadań z prądu elektrycznego (klasa 8 / liceum).

**Trzy kategorie zadań:**
1. **Wzory podstawowe** — U=I·R, q=I·t, P=U·I, W=U·I·t (14 zadań z PDF + niegraniczona liczba wariantów)
2. **Opór zastępczy** — łączenie szeregowe i równoległe (zadania z PDF + generator)
3. **Układy mieszane** — obliczanie U i I dla każdego opornika (najtrudniejsze)

**Mechanizm nauki:**
- System mistrzostwa: 5 gwiazdek w każdej kategorii (= 20 poprawnych z rzędu)
- Po błędzie: pełne rozwiązanie krok po kroku
- Spaced repetition: błędne zadania wracają później do powtórki
- Postęp zapisywany lokalnie w przeglądarce (`localStorage`)

---

## 🚀 Uruchomienie lokalne (test przed deployem)

Najprostszy sposób — Python:
```bash
cd public
python3 -m http.server 8080
# otwórz http://localhost:8080
```

Albo Node:
```bash
npx serve public -p 8080
```

Albo Docker (tak samo jak na Fly):
```bash
docker build -t fizyka-trener .
docker run -p 8080:8080 fizyka-trener
# otwórz http://localhost:8080
```

---

## 📦 Wdrożenie: GitHub + Fly.io — krok po kroku

Założenia: masz konto na GitHub (https://github.com) i konto na Fly.io (https://fly.io/app/sign-up — darmowe).

### Krok 1. Utwórz repozytorium na GitHub

1. Wejdź na https://github.com/new
2. Nazwa: `fizyka-trener` (lub inna)
3. Public lub Private — bez różnicy
4. **Nie** twórz README/.gitignore — mamy już swoje
5. Kliknij **Create repository**

GitHub pokaże instrukcje. Skopiuj URL repo (np. `git@github.com:tojaisa/fizyka-trener.git`).

### Krok 2. Wgraj kod do repo

W terminalu na komputerze:
```bash
cd "ścieżka/do/folderu/fizyka-trener"
git init
git add .
git commit -m "Pierwsza wersja trenera fizyki"
git branch -M main
git remote add origin git@github.com:TWOJE-LOGIN/fizyka-trener.git
git push -u origin main
```

### Krok 3. Zainstaluj `flyctl`

**macOS:**
```bash
brew install flyctl
```

**Linux/Mac (uniwersalnie):**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### Krok 4. Zaloguj się i utwórz aplikację

```bash
fly auth login
# (otworzy się przeglądarka — zaloguj się / załóż konto)

cd "ścieżka/do/fizyka-trener"
fly launch --no-deploy
```

`fly launch` zapyta:
- **Choose an app name**: wpisz coś unikalnego, np. `fizyka-jaska` (subdomena będzie `fizyka-jaska.fly.dev`)
- **Choose a region**: wybierz `waw` (Warszawa) lub `fra` (Frankfurt) — najbliższy ping
- **Would you like to set up Postgres/Redis/Sentry?**: **Nie** dla każdego
- **Override 'fly.toml'**: **Nie** (mamy już skonfigurowane)

Edytuj plik `fly.toml` i zmień nazwę:
```toml
app = "fizyka-jaska"  # taka sama jaką podałeś w fly launch
```

### Krok 5. Pierwszy deploy

```bash
fly deploy
```

Po ~2 minutach dostaniesz URL typu:
```
https://fizyka-jaska.fly.dev
```

**Wyślij ten link synowi — może wchodzić z komputera/telefonu.** ✅

### Krok 6. (Opcjonalnie) Auto-deploy z GitHub

Mamy gotowy workflow w `.github/workflows/fly-deploy.yml`. Żeby zadziałał:

1. Wygeneruj token Fly:
   ```bash
   fly tokens create deploy -x 999999h
   ```
2. Skopiuj wynik (zaczyna się od `FlyV1 fm2_…`)
3. W GitHub: repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
4. Nazwa: `FLY_API_TOKEN`, wartość: wklej token
5. Od teraz każdy `git push` na branch `main` automatycznie wdraża nową wersję na Fly.

---

## 🛠️ Struktura projektu

```
fizyka-trener/
├── public/
│   ├── index.html          ← strona startowa
│   ├── css/style.css
│   └── js/
│       ├── engine.js       ← silnik obliczeń obwodów (Rz, U, I)
│       ├── circuit-svg.js  ← rysowanie schematów SVG
│       ├── problems.js     ← baza zadań + generatory
│       ├── srs.js          ← spaced repetition + zapis postępów
│       └── app.js          ← UI / kontroler
├── Dockerfile              ← obraz nginx-alpine
├── nginx.conf
├── fly.toml                ← konfiguracja Fly.io (region waw)
├── .github/workflows/      ← auto-deploy
└── README.md
```

---

## 💸 Koszty

Fly.io daje darmowy tier wystarczający dla takiej aplikacji:
- 3 maszyny `shared-cpu-1x` z 256 MB RAM (mamy ustawione na 256 MB)
- `auto_stop_machines = "stop"` — kontener zatrzymuje się gdy nikt nie używa, więc liczy się tylko ruch.

W praktyce: kilka osób używających → **0 zł / mc**.

---

## ❓ Co jeśli coś nie działa?

| Problem | Rozwiązanie |
|---|---|
| `fly launch` mówi że nazwa zajęta | Zmień nazwę w `fly.toml` na unikalną |
| 502 Bad Gateway na deployu | Sprawdź `fly logs` — najczęściej zła konfiguracja portu (musi być 8080) |
| GitHub Actions czerwony | Sprawdź czy `FLY_API_TOKEN` jest dodany jako secret |
| Lokalnie nie widzi plików JS | Otwórz `public/index.html` przez serwer (nie podwójne kliknięcie!) |
| Postęp znika po wyjściu | Przeglądarka kasuje `localStorage` w trybie incognito |

---

## 📚 Materiały źródłowe

Aplikacja jest oparta na trzech zestawach zadań z PDF (klasa 8 / podstawówka):
1. *Opór zastępczy* — 9 zadań z różnymi konfiguracjami oporników
2. *Prąd elektryczny — zadania* — 14 zadań na podstawowe wzory
3. *Układy mieszane* — 7 zadań z obliczaniem wszystkich U i I

Wszystkie odpowiedzi z PDF zostały zweryfikowane przez silnik obliczeniowy.

Powodzenia! 💪
