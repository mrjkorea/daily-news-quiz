# Daily ESL News — Comprehension test

Live: https://mrjkorea.github.io/daily-news-quiz/

Static GitHub Pages. No sign-in. Date index → multiple choice → score → Try again.

Questions and answer choices stay **English**. Buttons, labels, and wrong-answer explanations follow the student’s language (same 15 as Word Master).

## Add a weekday

1. Convert that day’s `news_quiz_*.xlsx` Questions tab into `quizzes/YYYY-MM-DD.json`.
2. `answerIndex` is **0-based** (xlsx CorAns is 1-based — subtract one).
3. English explanation goes in `hintKo` **and** `hintI18n.en` (keep `hintKo` as the English fallback).
4. Fill the other 14 locales: `python3 scripts/fill_hint_i18n.py`
5. Gate: `python3 scripts/verify_quiz_i18n.py` must print `QUIZ_I18N_OK`
6. Append a row to `quizzes/index.json`.
7. Rebuild `index.html`: `python3 scripts/build_index.py`
8. Host audio: `python3 scripts/bake_quiz_audio.py YYYY-MM-DD` then `verify_quiz_host.py`
9. Commit and push `main`.

Deep link: `https://mrjkorea.github.io/daily-news-quiz/quiz.html?id=YYYY-MM-DD`
