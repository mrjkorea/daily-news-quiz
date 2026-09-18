# Daily ESL News — Comprehension test

Live: https://mrjkorea.github.io/daily-news-quiz/

Static GitHub Pages. No sign-in. Date index → multiple choice → score → 다시 풀기.

## Add a weekday

1. Convert that day’s `news_quiz_*.xlsx` Questions tab into `quizzes/YYYY-MM-DD.json`.
2. `answerIndex` is **0-based** (xlsx CorAns is 1-based — subtract one).
3. Append a row to `quizzes/index.json`.
4. Rebuild `index.html`.
5. Commit and push `main`.

Deep link: `https://mrjkorea.github.io/daily-news-quiz/quiz.html?id=YYYY-MM-DD`
