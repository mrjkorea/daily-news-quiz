(() => {
  const I18n = window.NewsQuizI18n;
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || params.get("date") || "";
  const $ = (sel) => document.querySelector(sel);
  let data = null;
  let audio = null;
  let graded = false;
  let loadError = null;
  const LETTERS = "ABCDEFGHIJ";

  const key = () => `mrj-news-quiz-${id}`;
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const stopAudio = () => {
    if (audio) {
      audio.pause();
      audio = null;
    }
  };

  const speakFallback = (_text) => {
    // Never use the phone's built-in woman TTS. Quiz host = Fish mp3 only.
  };

  const playUrl = (url, fallbackText, el) => {
    stopAudio();
    document.querySelectorAll(".playing").forEach((n) => n.classList.remove("playing"));
    if (el) el.classList.add("playing");
    audio = new Audio(url);
    audio.onended = () => el && el.classList.remove("playing");
    audio.onerror = () => {
      speakFallback(fallbackText);
      el && el.classList.remove("playing");
    };
    audio.play().catch(() => speakFallback(fallbackText));
  };

  const playClip = (rel, fallbackText, el) => {
    playUrl(`audio/${rel}`, fallbackText, el);
  };

  const applyChrome = () => {
    if (!I18n) return;
    I18n.applyDom();
    const dateLine = $("#date-line");
    if (dateLine && id) dateLine.textContent = `${I18n.t("kicker")} · ${id}`;
    const n = data && data.questions ? data.questions.length : 0;
    if (data) {
      $("#sub").textContent = I18n.t("sub_loaded", { n });
      document.querySelectorAll(".qnum").forEach((el) => {
        const qi = Number(el.closest("article").dataset.q);
        el.textContent = I18n.t("question_n", { n: qi + 1, total: n });
      });
    } else {
      const titleEl = $("#title");
      if (titleEl) {
        if (loadError) titleEl.textContent = I18n.t(loadError);
        else if (id) titleEl.textContent = I18n.t("loading");
      }
    }
    if (graded) paintResults();
  };

  const bootLang = () => {
    if (!I18n) return;
    I18n.bootLocale();
    const sel = $("#lang-select");
    I18n.fillSelect(sel);
    if (sel) {
      sel.value = I18n.getLocale();
      sel.onchange = () => {
        I18n.setLocale(sel.value);
        applyChrome();
      };
    }
    applyChrome();
  };

  const render = () => {
    $("#title").textContent = data.headline || data.title || id;
    document.title = `${id} news quiz · MRJ English`;
    const n = data.questions.length;
    $("#progress").innerHTML = Array.from({ length: n }, (_, i) => `<i data-p="${i}"></i>`).join("");
    const form = $("#quiz");
    form.innerHTML = data.questions
      .map((q, qi) => {
        const choices = q.choices
          .map((c, ci) => {
            const letter = LETTERS[ci];
            return `<div class="choice" data-q="${qi}" data-c="${ci}" role="button" tabindex="0">
              <span class="letter">${letter}</span>
              <span class="txt">${esc(c)}</span>
            </div>`;
          })
          .join("");
        return `<article class="card qcard" data-q="${qi}">
          <p class="qnum"></p>
          <button type="button" class="prompt" data-q="${qi}"><span class="speaker">🔊</span>${esc(q.prompt)}</button>
          ${choices}
        </article>`;
      })
      .join("");
    $("#results").classList.add("hidden");
    graded = false;
    applyChrome();
  };

  const selected = (qi) => {
    const el = document.querySelector(`.choice.picked[data-q="${qi}"]`);
    return el ? Number(el.dataset.c) : null;
  };

  const markProgress = () => {
    data.questions.forEach((_, qi) => {
      const dot = document.querySelector(`i[data-p="${qi}"]`);
      if (dot) dot.classList.toggle("on", selected(qi) !== null);
    });
  };

  const paintResults = () => {
    let right = 0;
    const missed = [];
    data.questions.forEach((q, qi) => {
      const article = document.querySelector(`article[data-q="${qi}"]`);
      article.querySelectorAll(".choice").forEach((lab) => lab.classList.remove("good", "bad"));
      const pi = selected(qi);
      const ans = q.answerIndex;
      const goodEl = article.querySelector(`.choice[data-c="${ans}"]`);
      if (pi === ans) {
        right += 1;
        if (goodEl) goodEl.classList.add("good");
      } else {
        if (pi !== null) {
          const bad = article.querySelector(`.choice[data-c="${pi}"]`);
          if (bad) bad.classList.add("bad");
        }
        if (goodEl) goodEl.classList.add("good");
        missed.push(q);
      }
    });
    const rec = JSON.parse(localStorage.getItem(key()) || '{"attempts":0}');
    const box = $("#results");
    box.classList.remove("hidden");
    const perfect = right === data.questions.length;
    const why = I18n ? I18n.t("why") : "Why";
    const missHtml = missed
      .map((q) => {
        const hint = I18n ? I18n.hintFor(q) : q.hintKo || "";
        return `<p><strong>${esc(q.prompt)}</strong><br/><span class="why">${esc(why)}:</span> ${esc(hint)}</p>`;
      })
      .join("");
    const verdict = perfect ? I18n.t("perfect") : I18n.t("nice_try");
    box.innerHTML = `<p class="confetti">${perfect ? "🎉🎉🎉" : "⭐"}</p>
      <p class="score">${right} / ${data.questions.length}</p>
      <p>${verdict} · ${I18n.t("attempt", { n: rec.attempts })}</p>
      ${missHtml}`;
  };

  const grade = () => {
    const rec = JSON.parse(localStorage.getItem(key()) || '{"attempts":0}');
    rec.attempts += 1;
    let right = 0;
    data.questions.forEach((q, qi) => {
      if (selected(qi) === q.answerIndex) right += 1;
    });
    rec.last = right;
    localStorage.setItem(key(), JSON.stringify(rec));
    graded = true;
    paintResults();
    $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
    speakFallback(
      right === data.questions.length
        ? "Perfect score! You did it!"
        : `You scored ${right} out of ${data.questions.length}.`
    );
  };

  const reset = () => {
    stopAudio();
    graded = false;
    document.querySelectorAll(".choice").forEach((lab) => lab.classList.remove("good", "bad", "picked", "playing"));
    $("#results").classList.add("hidden");
    markProgress();
    window.scrollTo({ top: 0 });
  };

  const onChoice = (el) => {
    const qi = Number(el.dataset.q);
    const ci = Number(el.dataset.c);
    document.querySelectorAll(`.choice[data-q="${qi}"]`).forEach((n) => n.classList.remove("picked"));
    el.classList.add("picked");
    markProgress();
    const q = data.questions[qi];
    const text = `${LETTERS[ci]}. ${q.choices[ci]}`;
    playClip(`${id}/q${qi}c${ci}.mp3`, text, el);
  };

  const boot = async () => {
    bootLang();
    if (!id) {
      loadError = "missing_date";
      applyChrome();
      return;
    }
    applyChrome();
    const res = await fetch(`quizzes/${id}.json`);
    if (!res.ok) {
      loadError = "not_found";
      applyChrome();
      return;
    }
    data = await res.json();
    render();
    $("#quiz").addEventListener("click", (e) => {
      const prompt = e.target.closest(".prompt");
      if (prompt) {
        const qi = Number(prompt.dataset.q);
        playClip(`${id}/q${qi}.mp3`, data.questions[qi].prompt, prompt);
        return;
      }
      const choice = e.target.closest(".choice");
      if (choice) onChoice(choice);
    });
    $("#quiz").addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const choice = e.target.closest(".choice");
      if (choice) {
        e.preventDefault();
        onChoice(choice);
      }
    });
    $("#submit").onclick = grade;
    $("#reset").onclick = reset;
  };
  boot();
})();
