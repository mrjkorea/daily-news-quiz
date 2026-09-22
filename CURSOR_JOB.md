Build a static GitHub Pages Daily News comprehension quiz. This folder IS the product.

LIVE URL: https://mrjkorea.github.io/daily-news-quiz/
REPO: mrjkorea/daily-news-quiz (create/push with gh as mrjkorea if needed)
GitHub Pages: main branch, / root. Include .nojekyll.

DATA (already here — do not invent questions):
- quizzes/index.json = date catalog
- quizzes/YYYY-MM-DD.json = questions
Schema: id, date, title, headline, questionCount, youtube_url,
questions: [{id, type:"MC", prompt, choices:[], answerIndex (0-based), hintKo (English fallback), hintI18n: {en, ko, zh-Hans, ja, es, hi, de, vi, pt-BR, id, fr, ar, tr, it, pl}}]
Prompt + choices stay English. hintI18n holds wrong-answer explanations in 15 languages.

UX (mirror Baekbal mrjkorea/baekbal-x10-practice-tests):
- index.html date list newest first. Tap a day.
- quiz.html?id=YYYY-MM-DD (or ?date=) loads JSON, grades 100% client-side.
- Answer all → Submit → score + missed items + hintI18n in the chosen language.
- Try again resets answers, increments attempt count in localStorage.
- No sign-in. Mobile-first. Questions stay English. Language picker (15 Word Master locales) translates chrome + explanations only.
- Optional YouTube watch link if youtube_url is non-empty.

REFERENCE live pattern: https://github.com/mrjkorea/baekbal-x10-practice-tests (quiz.html?id=)

GEO/AEO on index.html (JSON-LD only — keep the visible page sparse):
- Brand: Mr. Jay / MRJ English
- JSON-LD EducationalOrganization name "MRJ English", areaServed "Tongyeong, South Korea"
- EN entity sentence verbatim in JSON-LD: "Private English tutor with 25+ years of ESL experience specializing in structured reading programs and systematic grammar building."
- url: https://mrjkorea.github.io/daily-news-quiz/  (NEVER LearnWorlds)
- Visible page: title + “Tap a day” + big date taps. No bio essay. No extra links.

README.md: how to add a new date JSON + index row.

Then: git add/commit/push origin main, enable Pages, write CURSOR_RECEIPT.md with command, model composer-2.5, files, and `curl -sI https://mrjkorea.github.io/daily-news-quiz/` result.

Do not put GitHub tokens in files. Never link or mention LearnWorlds.
