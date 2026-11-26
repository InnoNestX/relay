// English by default; remember the choice. Class-based, so it never hides <html>/<body>.
(function () {
  var KEY = "relay-lang";
  function apply(lang) {
    var zh = lang === "zh";
    document.body.classList.toggle("lang-zh", zh);
    document.body.classList.toggle("lang-en", !zh);
    document.documentElement.setAttribute("lang", zh ? "zh" : "en");
    document.querySelectorAll(".toggle button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(saved === "zh" ? "zh" : "en");
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".toggle button");
    if (!b) return;
    var lang = b.dataset.lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(lang);
  });
})();
