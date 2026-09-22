(() => {
  const I18n = window.NewsQuizI18n;
  if (!I18n) return;
  I18n.bootLocale();
  const sel = document.querySelector("#lang-select");
  I18n.fillSelect(sel);
  I18n.applyDom();
  if (sel) {
    sel.value = I18n.getLocale();
    sel.addEventListener("change", () => {
      I18n.setLocale(sel.value);
      I18n.applyDom();
      document.title = `${I18n.t("news_quiz")} · Daily ESL News · MRJ English`;
    });
  }
  document.title = `${I18n.t("news_quiz")} · Daily ESL News · MRJ English`;
})();
