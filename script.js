document.addEventListener("DOMContentLoaded", function () {

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // Section mood colors — a soft echo of each section's own accent,
  // so the page background gently shifts as you scroll, like walking
  // through rooms with different light.
  var sectionBg = {
    home: "#eae4da",
    about: "#f0e9dc",
    ambiance: "#f3e2d2",
    personality: "#e4e9ec",
    publications: "#ece7dc",
    cv: "#efebe2",
    contact: "#e9e2d5"
  };

  var links = document.querySelectorAll("#sideNav a");
  var sections = document.querySelectorAll("section.block");

  if (links.length && sections.length) {
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

          var color = sectionBg[entry.target.id];
          if (color) document.documentElement.style.setProperty("--page-bg", color);
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // Scroll progress bar
  var progressBar = document.getElementById("progressBar");
  if (progressBar) {
    var updateProgress = function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    };
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });
    updateProgress();
  }

  // Interactive light-cycle — click or press Enter/Space to step through
  // morning / midday / dusk manually instead of the automatic loop.
  var cycle = document.getElementById("lightCycle");
  if (cycle) {
    var states = ["morning", "midday", "dusk"];
    var idx = -1;
    var tags = cycle.querySelectorAll(".tag");

    var stepCycle = function () {
      cycle.classList.add("manual");
      states.forEach(function (s) { cycle.classList.remove("state-" + s); });
      idx = (idx + 1) % states.length;
      cycle.classList.add("state-" + states[idx]);
      tags.forEach(function (t) { t.classList.remove("active-tag"); });
      if (tags[idx]) tags[idx].classList.add("active-tag");
    };

    cycle.addEventListener("click", stepCycle);
    cycle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        stepCycle();
      }
    });
  }

  // Gentle scroll-reveal — only runs if motion is allowed, and content is
  // fully visible without JS or with reduced motion, since the "pre-reveal"
  // class (the one that hides it) is added here, not baked into the HTML.
  if (!reduceMotion && sections.length) {
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

    // Staggered reveal for list-like groups (cards, photos, questions, pubs)
    var staggerGroup = function (parentSelector, itemSelector, stepSeconds) {
      document.querySelectorAll(parentSelector).forEach(function (group) {
        var items = group.querySelectorAll(itemSelector);
        if (!items.length) return;
        items.forEach(function (item, i) {
          item.classList.add("pre-reveal-item");
          item.style.transitionDelay = (i * stepSeconds) + "s";
        });
        var groupObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              items.forEach(function (item) { item.classList.add("revealed"); });
              groupObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        groupObserver.observe(group);
      });
    };

    staggerGroup(".cards", ".card", 0.08);
    staggerGroup(".photo-strip", "figure", 0.08);
    staggerGroup(".rq-list", "li", 0.06);
    staggerGroup("#publications", ".pub", 0.08);
  }
});
