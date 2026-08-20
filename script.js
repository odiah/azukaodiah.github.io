document.addEventListener("DOMContentLoaded", function () {

  // Mobile sidebar toggle
  var toggle = document.getElementById("navToggle");
  var sidebar = document.getElementById("sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
    sidebar.addEventListener("click", function (e) {
      if (e.target.tagName === "A") sidebar.classList.remove("open");
    });
  }

  // Scroll-spy: highlight the sidebar link for the section in view
  var links = document.querySelectorAll("#sideNav a");
  var sections = document.querySelectorAll("section.block");
  if (!links.length || !sections.length) return;

  var map = {};
  links.forEach(function (link) {
    map[link.getAttribute("href").slice(1)] = link;
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = map[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(function (l) { l.classList.remove("active"); });
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

  sections.forEach(function (s) { observer.observe(s); });

  // Gentle scroll-reveal — only runs if motion is allowed, and content is
  // fully visible without JS or with reduced motion, since the "pre-reveal"
  // class (the one that hides it) is added here, not baked into the HTML.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    sections.forEach(function (s) {
      s.classList.add("pre-reveal");
      revealObserver.observe(s);
    });
  }
});
