(() => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || params.get("date") || "";
  const $ = (sel) => document.querySelector(sel);
  let data = null;

  const key = () => `mrj-news-quiz-${id}`;

  const render = () => {
    $("#title").textContent = data.headline || data.title || id;
    document.title = `${id} news quiz · MRJ English`;
    const form = $("#quiz");
    form.innerHTML = data.questions
      .map((q, qi) => {
        const choices = q.choices
          .map(
            (c, ci) =>
              `<label class="choice"><input type="radio" name="q${qi}" value="${ci}"/> ${c}</label>`
          )
          .join("");
        return `<article class="card" data-q="${qi}"><p class="meta">Q${qi + 1}</p><h2>${q.prompt}</h2>${choices}</article>`;
      })
      .join("");
    $("#results").classList.add("hidden");
  };

  const grade = () => {
    let right = 0;
    const missed = [];
    data.questions.forEach((q, qi) => {
      const picked = document.querySelector(`input[name="q${qi}"]:checked`);
      const article = document.querySelector(`article[data-q="${qi}"]`);
      article.querySelectorAll("label.choice").forEach((lab) => lab.classList.remove("good", "bad"));
      const ans = q.answerIndex;
      if (picked) {
        const pi = Number(picked.value);
        if (pi === ans) {
          right += 1;
          picked.parentElement.classList.add("good");
        } else {
          picked.parentElement.classList.add("bad");
          article.querySelectorAll("input")[ans].parentElement.classList.add("good");
          missed.push({ q, pi });
        }
      } else {
        article.querySelectorAll("input")[ans].parentElement.classList.add("good");
        missed.push({ q, pi: null });
      }
    });
    const rec = JSON.parse(localStorage.getItem(key()) || '{"attempts":0}');
    rec.attempts += 1;
    rec.last = right;
    localStorage.setItem(key(), JSON.stringify(rec));
    const box = $("#results");
    box.classList.remove("hidden");
    const missHtml = missed
      .map(({ q }) => `<p><strong>${q.prompt}</strong><br/>${q.hintKo || ""}</p>`)
      .join("");
    box.innerHTML = `<p class="score">${right} / ${data.questions.length}</p><p>Attempt ${rec.attempts} on this phone.</p>${missHtml}`;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reset = () => {
    document.querySelectorAll("input[type=radio]").forEach((el) => {
      el.checked = false;
    });
    document.querySelectorAll("label.choice").forEach((lab) => lab.classList.remove("good", "bad"));
    $("#results").classList.add("hidden");
    window.scrollTo({ top: 0 });
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
    $("#sub").textContent = `${data.questionCount || (data.questions || []).length} questions · free · no sign-in`;
    render();
    $("#submit").onclick = grade;
    $("#reset").onclick = reset;
  };
  boot();
})();
