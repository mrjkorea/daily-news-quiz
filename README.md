# Daily News Quiz

Static site for weekday news quizzes. Hosted on GitHub Pages at [https://mrjkorea.github.io/daily-news-quiz/](https://mrjkorea.github.io/daily-news-quiz/).

- **Index:** `index.html` loads `quizzes/index.json` (newest dates first).
- **Quiz:** `quiz.html?id=YYYY-MM-DD` loads `quizzes/YYYY-MM-DD.json`.
- **Scoring:** Client-side only; submit shows score, wrong answers, and Korean hints (`hintKo`).
- **Retakes:** “다시 풀기” clears the form and increments a per-date attempt counter in `localStorage` (no sign-in, no server).

## Add a new quiz date

1. **Create** `quizzes/YYYY-MM-DD.json` with this shape:

```json
{
  "id": "2026-09-19",
  "date": "2026-09-19",
  "title": "Daily News Quiz · 2026-09-19",
  "headline": "One-line summary of the news story",
  "questionCount": 6,
  "questions": [
    {
      "id": 1,
      "type": "MC",
      "prompt": "Question text?",
      "choices": ["A", "B", "C", "D"],
      "answerIndex": 0,
      "hintKo": "Short hint in Korean or English."
    }
  ]
}
```

- `answerIndex` is **0-based** (0 = first choice).
- Use about **6–8** multiple-choice questions per weekday.

2. **Update** `quizzes/index.json`: add a new object at the **top** of the array (newest first):

```json
{
  "id": "2026-09-19",
  "date": "2026-09-19",
  "title": "Headline shown on the index list",
  "questionCount": 6,
  "data": "quizzes/2026-09-19.json",
  "youtube_url": ""
}
```

3. **Commit and push** to `main`. GitHub Pages will redeploy automatically.

## Local preview

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080/](http://localhost:8080/).

## Files

| Path | Purpose |
|------|---------|
| `index.html` | Date catalog |
| `quiz.html` | Quiz shell |
| `js/quiz.js` | Load JSON, render MC, score, retake |
| `css/style.css` | Layout and mobile styles |
| `quizzes/*.json` | Quiz data |
| `.nojekyll` | Publish all paths on GitHub Pages |
