(function () {
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  var root = document.documentElement;
  var group = document.querySelector(".theme");
  var buttons = document.querySelectorAll(".theme button");
  var chosen = root.dataset.theme || null;

  function system() { return mq.matches ? "dark" : "light"; }

  function apply(t) {
    if (t) root.dataset.theme = t; else delete root.dataset.theme;
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.set === (chosen || system())); });
  }

  function choose(t) {
    chosen = t === system() ? null : t;
    try { chosen ? localStorage.setItem("theme", chosen) : localStorage.removeItem("theme"); } catch (e) {}
    apply(chosen);
  }

  buttons.forEach(function (b) {
    b.addEventListener("mouseenter", function () { apply(b.dataset.set); });
    b.addEventListener("click", function () { choose(b.dataset.set); });
  });
  group.addEventListener("mouseleave", function () { apply(chosen); });
  mq.addEventListener("change", function () {
    chosen = null;
    try { localStorage.removeItem("theme"); } catch (e) {}
    apply(null);
  });

  apply(chosen);
})();
