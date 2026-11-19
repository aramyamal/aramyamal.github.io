(function () {
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  var root = document.documentElement;
  var group = document.querySelector(".theme");
  var buttons = document.querySelectorAll(".theme button");
  var chosen = root.dataset.theme || null;
  var themeColors = { light: "#FAFAFA", dark: "#0c0d0c" };
  var themeMetas = document.querySelectorAll('meta[name="theme-color"]');

  function system() { return mq.matches ? "dark" : "light"; }

  function apply(t) {
    if (t) root.dataset.theme = t; else delete root.dataset.theme;
    // The browser bar follows the visible theme, not just the OS setting.
    var color = themeColors[t || system()];
    themeMetas.forEach(function (m) { m.setAttribute("content", color); });
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

  // Fetch the other theme's background only once the page has finished loading,
  // so switching themes cross-fades without delaying the first paint.
  function loadAllBackgrounds() { root.classList.add("bg-all"); }
  if (document.readyState === "complete") loadAllBackgrounds();
  else window.addEventListener("load", loadAllBackgrounds);
})();
