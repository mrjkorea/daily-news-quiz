(function () {
  const STORAGE_PREFIX = 'daily-news-quiz-attempts:';

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const form = document.getElementById('quiz');
  const results = document.getElementById('results');
  const attemptsEl = document.getElementById('attempts');
  let quiz = null;

  if (!id || !/^\d{4}-\d{2}-\d{2}$/.test(id)) {
    location.href = 'index.html';
    return;
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getAttempts(dateId) {
    const raw = localStorage.getItem(STORAGE_PREFIX + dateId);
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }

  function setAttempts(dateId, n) {
    localStorage.setItem(STORAGE_PREFIX + dateId, String(n));
  }

  function showAttempts() {
    const n = getAttempts(id);
    if (n > 0) {
      attemptsEl.textContent = `이 날짜 퀴즈 시도 횟수: ${n}회`;
      attemptsEl.classList.remove('hidden');
    } else {
      attemptsEl.classList.add('hidden');
    }
  }

  function choiceLabel(index) {
    return String.fromCharCode(65 + index);
  }

  function renderQuestions(questions) {
    form.innerHTML = '';
    questions.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'q';
      div.dataset.idx = i;
      let body = `<div><span class="q-num">${i + 1}.</span></div>`;
      body += `<div class="q-stem">${esc(q.prompt)}</div>`;
      body += '<div class="choices">';
      (q.choices || []).forEach((choice, j) => {
        body +=
          `<label data-choice="${j}">` +
          `<input type="radio" name="q${i}" value="${j}" /> ` +
          `${choiceLabel(j)}. ${esc(choice)}</label>`;
      });
      body += '</div>';
      body += `<div class="hint-slot" id="hint-${i}"></div>`;
      div.innerHTML = body;
      form.appendChild(div);
    });
    results.classList.add('hidden');
    results.innerHTML = '';
    form.querySelectorAll('input').forEach((el) => {
      el.disabled = false;
    });
  }

  fetch(`quizzes/${id}.json`)
    .then((r) => {
      if (!r.ok) throw new Error('not found');
      return r.json();
    })
    .then((data) => {
      quiz = data;
      document.title = data.title || 'Daily News Quiz';
      document.getElementById('title').textContent = data.title || `Daily News Quiz · ${id}`;
      const count = data.questionCount || (data.questions && data.questions.length) || 0;
      document.getElementById('sub').textContent = `${count}문항 · 제출 후 채점`;
      if (data.headline) {
        const box = document.getElementById('headline');
        box.innerHTML = `<p class="headline-text">${esc(data.headline)}</p>`;
        box.classList.remove('hidden');
      }
      showAttempts();
      renderQuestions(data.questions || []);
    })
    .catch(() => {
      document.getElementById('title').textContent = '퀴즈를 찾을 수 없습니다';
      document.getElementById('sub').textContent = '목록에서 다른 날짜를 선택하세요.';
      document.getElementById('actions').classList.add('hidden');
    });

  function readChoiceIndex(i) {
    const el = form.querySelector(`input[name="q${i}"]:checked`);
    if (!el) return null;
    const v = parseInt(el.value, 10);
    return Number.isFinite(v) ? v : null;
  }

  document.getElementById('submit').addEventListener('click', () => {
    if (!quiz || !quiz.questions) return;

    const questions = quiz.questions;
    let correct = 0;
    const mistakes = [];
    const rows = [];

    questions.forEach((q, i) => {
      const userIdx = readChoiceIndex(i);
      const answerIdx = q.answerIndex;
      const ok = userIdx === answerIdx;
      if (ok) correct += 1;

      const qEl = form.querySelector(`.q[data-idx="${i}"]`);
      qEl.classList.remove('correct', 'wrong');
      if (userIdx !== null) {
        qEl.classList.add(ok ? 'correct' : 'wrong');
        if (!ok) {
          const correctLabel = qEl.querySelector(`label[data-choice="${answerIdx}"]`);
          if (correctLabel) correctLabel.classList.add('correct-choice');
        }
      }

      const slot = document.getElementById(`hint-${i}`);
      const userText =
        userIdx === null ? '(선택 없음)' : `${choiceLabel(userIdx)}. ${q.choices[userIdx] || ''}`;
      const correctText = `${choiceLabel(answerIdx)}. ${q.choices[answerIdx] || ''}`;

      if (!ok) {
        slot.innerHTML =
          `<div class="mistake">` +
          `<div class="bad">오답</div>` +
          `<div>내 답: ${esc(userText)}</div>` +
          `<div>정답: ${esc(correctText)}</div>` +
          `<p class="hint"><span class="hint-label">힌트:</span> ${esc(q.hintKo)}</p>` +
          `</div>`;
        mistakes.push({ i, q, userText, correctText });
      } else {
        slot.innerHTML = `<p class="hint ok">정답</p>`;
      }

      rows.push({ i, ok });
    });

    form.querySelectorAll('input').forEach((el) => {
      el.disabled = true;
    });

    const total = questions.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;

    results.classList.remove('hidden');
    results.innerHTML = `
      <div class="score-banner">
        <div class="big">점수 ${correct} / ${total}</div>
        <div class="sub">${pct}% · ${mistakes.length}문항 오답</div>
      </div>
      <div class="card">
        <h2>문항별 결과</h2>
        <table class="breakdown">
          <thead><tr><th>#</th><th>결과</th></tr></thead>
          <tbody>
            ${rows
              .map(
                (r) =>
                  `<tr><td>${r.i + 1}</td><td class="${r.ok ? 'ok' : 'bad'}">${r.ok ? '정답' : '오답'}</td></tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
      <div class="card">
        <h2>오답 · 힌트</h2>
        ${
          mistakes.length
            ? mistakes
                .map(
                  (m) => `
          <div class="mistake">
            <strong>${m.i + 1}번</strong>
            <div>내 답: ${esc(m.userText)}</div>
            <div>정답: ${esc(m.correctText)}</div>
            <p class="hint"><span class="hint-label">힌트:</span> ${esc(m.q.hintKo)}</p>
          </div>`
                )
                .join('')
            : '<p class="ok">오답이 없습니다. 잘했어요!</p>'
        }
      </div>`;
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('reset').addEventListener('click', () => {
    if (!quiz) return;
    const next = getAttempts(id) + 1;
    setAttempts(id, next);
    showAttempts();
    renderQuestions(quiz.questions || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
