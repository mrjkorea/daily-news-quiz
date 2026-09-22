(function (root) {
  "use strict";

  var LANGS = [
    { code: "en", name: "English" },
    { code: "ko", name: "한국어" },
    { code: "zh-Hans", name: "简体中文" },
    { code: "ja", name: "日本語" },
    { code: "es", name: "Español" },
    { code: "hi", name: "हिन्दी" },
    { code: "de", name: "Deutsch" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "pt-BR", name: "Português (BR)" },
    { code: "id", name: "Bahasa Indonesia" },
    { code: "fr", name: "Français" },
    { code: "ar", name: "العربية" },
    { code: "tr", name: "Türkçe" },
    { code: "it", name: "Italiano" },
    { code: "pl", name: "Polski" },
  ];

  var LS_SHARED = "mrj.word_factory.state";
  var LS_LOCALE = "mrj-ui-locale";
  var STR = {};

  STR.en = {
    language: "Language",
    all_quizzes: "← All quizzes",
    quiz_host: "🎙️ Quiz host",
    kicker: "Daily ESL News",
    loading: "Loading…",
    sub: "Tap the question or A · B · C · D to hear the host. Then submit for your score.",
    lock_in: "Lock in answers ★",
    try_again: "Try again",
    hint_foot: "Tap any sentence to hear it. Same quiz-show host every day.",
    question_n: "QUESTION {n} / {total} · tap to hear",
    missing_date: "Missing date",
    not_found: "Quiz not found",
    sub_loaded: "{n} questions · tap to hear the quiz host · free · no sign-in",
    perfect: "Perfect round!",
    nice_try: "Nice try — tap Try again.",
    attempt: "Attempt {n}",
    news_quiz: "News Quiz",
    tap_a_day: "Tap a day",
    why: "Why",
  };

  STR.ko = {
    language: "언어",
    all_quizzes: "← 모든 퀴즈",
    quiz_host: "🎙️ 퀴즈 진행자",
    kicker: "Daily ESL News",
    loading: "불러오는 중…",
    sub: "질문이나 A · B · C · D를 눌러 진행자를 들으세요. 그런 다음 제출해서 점수를 보세요.",
    lock_in: "답안 확정 ★",
    try_again: "다시 풀기",
    hint_foot: "문장을 누르면 들을 수 있습니다. 매일 같은 퀴즈 진행자입니다.",
    question_n: "문제 {n} / {total} · 눌러서 듣기",
    missing_date: "날짜 없음",
    not_found: "퀴즈를 찾을 수 없음",
    sub_loaded: "문제 {n}개 · 눌러서 진행자 듣기 · 무료 · 로그인 없음",
    perfect: "만점입니다!",
    nice_try: "아쉽네요 — 다시 풀기를 누르세요.",
    attempt: "{n}번째 시도",
    news_quiz: "뉴스 퀴즈",
    tap_a_day: "날짜를 누르세요",
    why: "이유",
  };

  STR["zh-Hans"] = {
    language: "语言",
    all_quizzes: "← 全部测验",
    quiz_host: "🎙️ 测验主持",
    kicker: "Daily ESL News",
    loading: "加载中…",
    sub: "点问题或 A · B · C · D 听主持。然后提交查看分数。",
    lock_in: "锁定答案 ★",
    try_again: "再试一次",
    hint_foot: "点任何句子就能听。每天都是同一位测验主持。",
    question_n: "第 {n} / {total} 题 · 点按收听",
    missing_date: "缺少日期",
    not_found: "找不到测验",
    sub_loaded: "{n} 道题 · 点按收听主持 · 免费 · 无需登录",
    perfect: "全对！",
    nice_try: "不错 — 点再试一次。",
    attempt: "第 {n} 次",
    news_quiz: "新闻测验",
    tap_a_day: "点选一天",
    why: "原因",
  };

  STR.ja = {
    language: "言語",
    all_quizzes: "← すべてのクイズ",
    quiz_host: "🎙️ クイズ司会",
    kicker: "Daily ESL News",
    loading: "読み込み中…",
    sub: "問題または A · B · C · D をタップして司会を聞いてください。それから送信して点数を見ます。",
    lock_in: "答えを確定 ★",
    try_again: "もう一度",
    hint_foot: "文をタップすると聞けます。毎日同じクイズ司会です。",
    question_n: "問題 {n} / {total} · タップして聞く",
    missing_date: "日付がありません",
    not_found: "クイズが見つかりません",
    sub_loaded: "問題 {n} 問 · タップして司会を聞く · 無料 · ログイン不要",
    perfect: "全問正解！",
    nice_try: "おしい — もう一度をタップ。",
    attempt: "{n} 回目",
    news_quiz: "ニュースクイズ",
    tap_a_day: "日付をタップ",
    why: "理由",
  };

  STR.es = {
    language: "Idioma",
    all_quizzes: "← Todos los cuestionarios",
    quiz_host: "🎙️ Presentador",
    kicker: "Daily ESL News",
    loading: "Cargando…",
    sub: "Toca la pregunta o A · B · C · D para oír al presentador. Luego envía para ver tu puntuación.",
    lock_in: "Confirmar respuestas ★",
    try_again: "Intentar de nuevo",
    hint_foot: "Toca cualquier frase para oírla. El mismo presentador cada día.",
    question_n: "PREGUNTA {n} / {total} · toca para oír",
    missing_date: "Falta la fecha",
    not_found: "Cuestionario no encontrado",
    sub_loaded: "{n} preguntas · toca para oír al presentador · gratis · sin registro",
    perfect: "¡Ronda perfecta!",
    nice_try: "Bien — toca Intentar de nuevo.",
    attempt: "Intento {n}",
    news_quiz: "Cuestionario de noticias",
    tap_a_day: "Toca un día",
    why: "Por qué",
  };

  STR.hi = {
    language: "भाषा",
    all_quizzes: "← सभी क्विज़",
    quiz_host: "🎙️ क्विज़ होस्ट",
    kicker: "Daily ESL News",
    loading: "लोड हो रहा है…",
    sub: "सवाल या A · B · C · D पर टैप करके होस्ट सुनें। फिर स्कोर के लिए जमा करें।",
    lock_in: "जवाब लॉक करें ★",
    try_again: "फिर कोशिश करें",
    hint_foot: "किसी भी वाक्य पर टैप करके सुनें। हर दिन वही होस्ट।",
    question_n: "सवाल {n} / {total} · सुनने के लिए टैप",
    missing_date: "तारीख नहीं है",
    not_found: "क्विज़ नहीं मिली",
    sub_loaded: "{n} सवाल · होस्ट सुनने के लिए टैप · मुफ़्त · लॉगिन नहीं",
    perfect: "सब सही!",
    nice_try: "अच्छा प्रयास — फिर कोशिश करें पर टैप करें।",
    attempt: "कोशिश {n}",
    news_quiz: "समाचार क्विज़",
    tap_a_day: "एक दिन चुनें",
    why: "कारण",
  };

  STR.de = {
    language: "Sprache",
    all_quizzes: "← Alle Quizze",
    quiz_host: "🎙️ Quizmoderator",
    kicker: "Daily ESL News",
    loading: "Laden…",
    sub: "Tippe die Frage oder A · B · C · D, um den Moderator zu hören. Dann absenden für deine Punktzahl.",
    lock_in: "Antworten festlegen ★",
    try_again: "Nochmal versuchen",
    hint_foot: "Tippe einen Satz, um ihn zu hören. Jeden Tag derselbe Moderator.",
    question_n: "FRAGE {n} / {total} · tippen zum Hören",
    missing_date: "Datum fehlt",
    not_found: "Quiz nicht gefunden",
    sub_loaded: "{n} Fragen · tippen zum Hören · kostenlos · ohne Anmeldung",
    perfect: "Perfekte Runde!",
    nice_try: "Schön versucht — tippe Nochmal versuchen.",
    attempt: "Versuch {n}",
    news_quiz: "Nachrichten-Quiz",
    tap_a_day: "Tippe einen Tag",
    why: "Warum",
  };

  STR.vi = {
    language: "Ngôn ngữ",
    all_quizzes: "← Tất cả bài quiz",
    quiz_host: "🎙️ Người dẫn quiz",
    kicker: "Daily ESL News",
    loading: "Đang tải…",
    sub: "Chạm câu hỏi hoặc A · B · C · D để nghe người dẫn. Rồi nộp để xem điểm.",
    lock_in: "Khóa đáp án ★",
    try_again: "Làm lại",
    hint_foot: "Chạm bất kỳ câu nào để nghe. Cùng một người dẫn mỗi ngày.",
    question_n: "CÂU {n} / {total} · chạm để nghe",
    missing_date: "Thiếu ngày",
    not_found: "Không tìm thấy quiz",
    sub_loaded: "{n} câu · chạm để nghe người dẫn · miễn phí · không đăng nhập",
    perfect: "Trọn điểm!",
    nice_try: "Cố lên — chạm Làm lại.",
    attempt: "Lần {n}",
    news_quiz: "Quiz tin tức",
    tap_a_day: "Chọn một ngày",
    why: "Lý do",
  };

  STR["pt-BR"] = {
    language: "Idioma",
    all_quizzes: "← Todos os quizzes",
    quiz_host: "🎙️ Apresentador",
    kicker: "Daily ESL News",
    loading: "Carregando…",
    sub: "Toque a pergunta ou A · B · C · D para ouvir o apresentador. Depois envie para ver a pontuação.",
    lock_in: "Confirmar respostas ★",
    try_again: "Tentar de novo",
    hint_foot: "Toque qualquer frase para ouvir. O mesmo apresentador todos os dias.",
    question_n: "PERGUNTA {n} / {total} · toque para ouvir",
    missing_date: "Data ausente",
    not_found: "Quiz não encontrado",
    sub_loaded: "{n} perguntas · toque para ouvir · grátis · sem login",
    perfect: "Rodada perfeita!",
    nice_try: "Quase — toque Tentar de novo.",
    attempt: "Tentativa {n}",
    news_quiz: "Quiz de notícias",
    tap_a_day: "Toque um dia",
    why: "Por quê",
  };

  STR.id = {
    language: "Bahasa",
    all_quizzes: "← Semua kuis",
    quiz_host: "🎙️ Pembawa kuis",
    kicker: "Daily ESL News",
    loading: "Memuat…",
    sub: "Ketuk pertanyaan atau A · B · C · D untuk mendengar pembawa. Lalu kirim untuk skor.",
    lock_in: "Kunci jawaban ★",
    try_again: "Coba lagi",
    hint_foot: "Ketuk kalimat apa pun untuk mendengar. Pembawa kuis yang sama setiap hari.",
    question_n: "SOAL {n} / {total} · ketuk untuk mendengar",
    missing_date: "Tanggal hilang",
    not_found: "Kuis tidak ditemukan",
    sub_loaded: "{n} soal · ketuk untuk mendengar · gratis · tanpa masuk",
    perfect: "Sempurna!",
    nice_try: "Bagus — ketuk Coba lagi.",
    attempt: "Percobaan {n}",
    news_quiz: "Kuis berita",
    tap_a_day: "Pilih hari",
    why: "Alasan",
  };

  STR.fr = {
    language: "Langue",
    all_quizzes: "← Tous les quiz",
    quiz_host: "🎙️ Animateur",
    kicker: "Daily ESL News",
    loading: "Chargement…",
    sub: "Touchez la question ou A · B · C · D pour entendre l’animateur. Puis envoyez pour votre score.",
    lock_in: "Valider les réponses ★",
    try_again: "Réessayer",
    hint_foot: "Touchez une phrase pour l’entendre. Le même animateur chaque jour.",
    question_n: "QUESTION {n} / {total} · toucher pour écouter",
    missing_date: "Date manquante",
    not_found: "Quiz introuvable",
    sub_loaded: "{n} questions · toucher pour écouter · gratuit · sans compte",
    perfect: "Sans faute !",
    nice_try: "Pas mal — touchez Réessayer.",
    attempt: "Essai {n}",
    news_quiz: "Quiz d’actu",
    tap_a_day: "Touchez un jour",
    why: "Pourquoi",
  };

  STR.ar = {
    language: "اللغة",
    all_quizzes: "كل الاختبارات →",
    quiz_host: "🎙️ مقدّم الاختبار",
    kicker: "Daily ESL News",
    loading: "جارٍ التحميل…",
    sub: "اضغط السؤال أو A · B · C · D لسماع المقدّم. ثم أرسل لرؤية درجتك.",
    lock_in: "تثبيت الإجابات ★",
    try_again: "حاول مرة أخرى",
    hint_foot: "اضغط أي جملة لسماعها. نفس المقدّم كل يوم.",
    question_n: "سؤال {n} / {total} · اضغط للسماع",
    missing_date: "التاريخ ناقص",
    not_found: "الاختبار غير موجود",
    sub_loaded: "{n} أسئلة · اضغط لسماع المقدّم · مجاني · بدون تسجيل",
    perfect: "درجة كاملة!",
    nice_try: "محاولة جيدة — اضغط حاول مرة أخرى.",
    attempt: "المحاولة {n}",
    news_quiz: "اختبار الأخبار",
    tap_a_day: "اختر يوماً",
    why: "السبب",
  };

  STR.tr = {
    language: "Dil",
    all_quizzes: "← Tüm quizler",
    quiz_host: "🎙️ Quiz sunucusu",
    kicker: "Daily ESL News",
    loading: "Yükleniyor…",
    sub: "Soruya veya A · B · C · D’ye dokunup sunucuyu dinleyin. Sonra gönderip puanınıza bakın.",
    lock_in: "Cevapları kilitle ★",
    try_again: "Yeniden dene",
    hint_foot: "Duymak için herhangi bir cümleye dokunun. Her gün aynı sunucu.",
    question_n: "SORU {n} / {total} · dinlemek için dokun",
    missing_date: "Tarih yok",
    not_found: "Quiz bulunamadı",
    sub_loaded: "{n} soru · dinlemek için dokun · ücretsiz · giriş yok",
    perfect: "Tam puan!",
    nice_try: "Güzel deneme — Yeniden dene’ye dokun.",
    attempt: "Deneme {n}",
    news_quiz: "Haber quizi",
    tap_a_day: "Bir gün seç",
    why: "Neden",
  };

  STR.it = {
    language: "Lingua",
    all_quizzes: "← Tutti i quiz",
    quiz_host: "🎙️ Conduttore",
    kicker: "Daily ESL News",
    loading: "Caricamento…",
    sub: "Tocca la domanda o A · B · C · D per sentire il conduttore. Poi invia per il punteggio.",
    lock_in: "Conferma risposte ★",
    try_again: "Riprova",
    hint_foot: "Tocca una frase per sentirla. Lo stesso conduttore ogni giorno.",
    question_n: "DOMANDA {n} / {total} · tocca per ascoltare",
    missing_date: "Data mancante",
    not_found: "Quiz non trovato",
    sub_loaded: "{n} domande · tocca per ascoltare · gratis · senza accesso",
    perfect: "Tutto giusto!",
    nice_try: "Ci sei quasi — tocca Riprova.",
    attempt: "Tentativo {n}",
    news_quiz: "Quiz di notizie",
    tap_a_day: "Tocca un giorno",
    why: "Perché",
  };

  STR.pl = {
    language: "Język",
    all_quizzes: "← Wszystkie quizy",
    quiz_host: "🎙️ Prowadzący",
    kicker: "Daily ESL News",
    loading: "Ładowanie…",
    sub: "Dotknij pytania albo A · B · C · D, żeby usłyszeć prowadzącego. Potem wyślij, by zobaczyć wynik.",
    lock_in: "Zatwierdź odpowiedzi ★",
    try_again: "Spróbuj ponownie",
    hint_foot: "Dotknij zdania, żeby je usłyszeć. Ten sam prowadzący codziennie.",
    question_n: "PYTANIE {n} / {total} · dotknij, by usłyszeć",
    missing_date: "Brak daty",
    not_found: "Nie znaleziono quizu",
    sub_loaded: "{n} pytań · dotknij, by usłyszeć · za darmo · bez logowania",
    perfect: "Perfekcyjnie!",
    nice_try: "Dobrze — dotknij Spróbuj ponownie.",
    attempt: "Próba {n}",
    news_quiz: "Quiz wiadomości",
    tap_a_day: "Wybierz dzień",
    why: "Dlaczego",
  };

  function codes() {
    return LANGS.map(function (l) { return l.code; });
  }

  function normCode(code) {
    if (!code) return "en";
    if (STR[code]) return code;
    if (code === "zh" || code === "zh-CN" || code === "zh-cn") return "zh-Hans";
    if (code === "pt" || code === "pt-br") return "pt-BR";
    var short = String(code).split("-")[0];
    return STR[short] ? short : "en";
  }

  function has(code) {
    return !!STR[normCode(code)] && normCode(code) === code || !!STR[code];
  }

  var current = "en";

  function readShared() {
    try {
      var st = JSON.parse(localStorage.getItem(LS_SHARED) || "{}");
      if (st && st.locale) return st.locale;
    } catch (e) {}
    try {
      return localStorage.getItem(LS_LOCALE) || "en";
    } catch (e2) {
      return "en";
    }
  }

  function writeShared(code) {
    try {
      localStorage.setItem(LS_LOCALE, code);
    } catch (e) {}
    try {
      var st = {};
      try {
        st = JSON.parse(localStorage.getItem(LS_SHARED) || "{}") || {};
      } catch (e2) {
        st = {};
      }
      st.locale = code;
      localStorage.setItem(LS_SHARED, JSON.stringify(st));
    } catch (e3) {}
  }

  function setLocale(code) {
    current = STR[normCode(code)] ? normCode(code) : "en";
    writeShared(current);
    return current;
  }

  function bootLocale() {
    current = normCode(readShared());
    if (!STR[current]) current = "en";
    return current;
  }

  function getLocale() {
    return current;
  }

  function t(key, vars) {
    var table = STR[current] || STR.en;
    var s = table[key] || STR.en[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return s;
  }

  function fillSelect(sel) {
    if (!sel) return;
    sel.innerHTML = "";
    LANGS.forEach(function (lang) {
      var opt = document.createElement("option");
      opt.value = lang.code;
      opt.textContent = lang.name;
      sel.appendChild(opt);
    });
    sel.value = current;
  }

  function applyDom(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-i18n]");
    Array.prototype.forEach.call(nodes, function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    var langSel = document.getElementById("lang-select");
    if (langSel) langSel.setAttribute("aria-label", t("language"));
    var html = document.documentElement;
    html.lang = current === "zh-Hans" ? "zh-CN" : current === "pt-BR" ? "pt-BR" : current;
    html.dir = current === "ar" ? "rtl" : "ltr";
  }

  function hintFor(q) {
    if (!q) return "";
    var map = q.hintI18n && typeof q.hintI18n === "object" ? q.hintI18n : {};
    return (
      (map[current] || "").trim() ||
      (map.en || "").trim() ||
      (q.hintKo || "").trim() ||
      ""
    );
  }

  root.NewsQuizI18n = {
    LANGS: LANGS,
    CODES: codes(),
    t: t,
    setLocale: setLocale,
    getLocale: getLocale,
    bootLocale: bootLocale,
    fillSelect: fillSelect,
    applyDom: applyDom,
    hintFor: hintFor,
    has: has,
  };
})(typeof window !== "undefined" ? window : this);
