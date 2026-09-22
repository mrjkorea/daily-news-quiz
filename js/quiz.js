(() => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || params.get("date") || "";
  const $ = (sel) => document.querySelector(sel);
  let data = null;
  let audio = null;
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
    if (window.speechSynthesis) speechSynthesis.cancel();
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

  const render = () => {
    $("#title").textContent = data.headline || data.title || id;
    document.title = `${id} news quiz · MRJ English`;
    $("#date-line").textContent = `Daily ESL News · ${id}`;
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
          <p class="qnum">QUESTION ${qi + 1} / ${n} · tap to hear</p>
          <button type="button" class="prompt" data-q="${qi}"><span class="speaker">🔊</span>${esc(q.prompt)}</button>
          ${choices}
        </article>`;
      })
      .join("");
    $("#results").classList.add("hidden");
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

  const grade = () => {
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
    rec.attempts += 1;
    rec.last = right;
    localStorage.setItem(key(), JSON.stringify(rec));
    const box = $("#results");
    box.classList.remove("hidden");
    const perfect = right === data.questions.length;
    const missHtml = missed
      .map((q) => `<p><strong>${esc(q.prompt)}</strong><br/>${esc(q.hintKo || "")}</p>`)
      .join("");
    box.innerHTML = `<p class="confetti">${perfect ? "🎉🎉🎉" : "⭐"}</p>
      <p class="score">${right} / ${data.questions.length}</p>
      <p>${perfect ? "Perfect round!" : "Nice try — tap Try again."} · Attempt ${rec.attempts}</p>
      ${missHtml}`;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
    speakFallback(
      perfect ? "Perfect score! You did it!" : `You scored ${right} out of ${data.questions.length}.`
    );
  };

  const reset = () => {
    stopAudio();
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
    if (!id) {
      $("#title").textContent = "Missing date";
      return;
    }
    const res = await fetch(`quizzes/${id}.json`);
    if (!res.ok) {
      $("#title").textContent = "Quiz not found";
      return;
    }
    data = await res.json();
    $("#sub").textContent = `${data.questions.length} questions · tap to hear the quiz host · free · no sign-in`;
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
