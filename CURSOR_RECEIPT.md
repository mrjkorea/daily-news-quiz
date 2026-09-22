# CURSOR_RECEIPT

| Field | Value |
|-------|--------|
| **Command** | Build static GitHub Pages Daily News Quiz (`mrjkorea/daily-news-quiz`) |
| **Model** | Composer |
| **Date** | 2026-09-19 |

## Files created/updated

- `index.html` — catalog from `quizzes/index.json`
- `quiz.html` — quiz page shell
- `css/style.css` — shared styles (mobile-friendly)
- `js/quiz.js` — load quiz JSON, MC scoring, hints, retake + `localStorage` attempts
- `.nojekyll` — GitHub Pages root publish
- `README.md` — how to add a new date JSON
- `CURSOR_RECEIPT.md` — this file

## Test

```bash
cd /Users/andreclouthier/.hermes/projects/mrj-daily-news-quiz
python3 -m http.server 8765
# Open http://localhost:8765/ and http://localhost:8765/quiz.html?id=2026-09-18
curl -sI https://mrjkorea.github.io/daily-news-quiz/
# Deploy: HTTP/2 200 (after Pages build, ~30–45s post-enable)
```

- Index lists dates (newest first) with weekday label.
- Quiz loads `quizzes/YYYY-MM-DD.json`, submit shows `점수 n/m`, wrong items + `힌트`, `다시 풀기` increments `daily-news-quiz-attempts:{id}` in `localStorage`.

---

## English-only student UI (2026-09-22)

| Field | Value |
|-------|--------|
| **Command** | Jay HARD 22 Sep 2026: Daily ESL News QUIZ English-only — no Hangul on student quiz |
| **Model** | composer-2.5 |

### Files updated

- `quiz.html` — reset button `Try again`; drop Noto Sans KR font link (Nunito only)
- `js/quiz.js` — results copy `Nice try — tap Try again.`
- `css/app.css` — `font-family: Nunito, -apple-system, sans-serif`
- `README.md` — flow text uses Try again

### Hangul grep test (student-facing: html / js / css / quizzes/*.json)

```bash
cd /Users/andreclouthier/.hermes/projects/mrj-daily-news-quiz
rg -n '[\x{ac00}-\x{d7a3}]' quiz.html index.html js css quizzes/*.json
# (no output — exit 1 = zero matches)
```

---

## 15-language quiz chrome (2026-09-22)

| Field | Value |
|-------|--------|
| **Command** | Review 15-language quiz chrome (Jay 22 Sep 2026): Word Master locales, chrome i18n, hintI18n explanations, shared localStorage — do not modify `quizzes/*.json` |
| **Model** | composer-2.5 |

### Files updated

- `js/i18n.js` — sync `#lang-select` `aria-label` on locale change; `html[lang]` / RTL for Arabic unchanged
- `js/quiz.js` — locale change refreshes loading/error titles, date kicker + id before JSON load, and re-paints graded hints via `paintResults()`
- `js/catalog.js` — localized catalog `document.title` when language changes

### Node i18n key test

```bash
cd /Users/andreclouthier/.hermes/projects/mrj-daily-news-quiz
node -e "$(cat <<'SCRIPT'
const fs = require("fs");
const vm = require("vm");
const sandbox = {};
vm.runInNewContext(
  fs.readFileSync("js/i18n.js", "utf8").replace(
    /}\)\(typeof window !== \"undefined\" \? window : this\);$/,
    "})(sandbox);"
  ),
  sandbox
);
const I = sandbox.NewsQuizI18n;
const keys = [
  "language","all_quizzes","quiz_host","kicker","loading","sub","lock_in","try_again",
  "hint_foot","question_n","missing_date","not_found","sub_loaded","perfect","nice_try",
  "attempt","news_quiz","tap_a_day","why"
];
let bad = [];
for (const code of I.CODES) {
  I.setLocale(code);
  for (const k of keys) if (I.t(k) === k) bad.push(code + ":" + k);
}
if (bad.length) { console.error("FAIL", bad); process.exit(1); }
console.log("I18N_KEYS_OK", I.CODES.length, "locales", keys.length, "keys each");
SCRIPT
)"
# I18N_KEYS_OK 15 locales 19 keys each
```
