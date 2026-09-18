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
