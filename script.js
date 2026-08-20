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

  // Section mood colors — a soft echo of each section's own accent. These
  // sit BETWEEN the two fixed bookends: white at the very top of the page,
  // black at the very bottom, no matter how many sections exist or how
  // long the page is — because the first and last stops below are computed
  // from actual scroll position (0 and max), not from section identity.
  var midColors = {
    about: "#f0e9dc",
    ambiance: "#f3e2d2",
    personality: "#e4e9ec",
    publications: "#ece7dc",
    cv: "#efebe2"
  };
  var WHITE = [255, 255, 255];
  var BLACK = [20, 16, 12]; // #14100c — near-black, warm to match the ink hue

  var INK = [33, 29, 25];        // --ink
  var INK_SOFT = [88, 82, 74];   // --ink-soft
  var OXIDE = [168, 67, 29];     // --oxide
  var LIGHT_TEXT = [251, 249, 245];   // --paper, used as light text on black
  var LIGHT_TEXT_SOFT = [201, 194, 181]; // muted light warm gray
  var LIGHT_LINK = [224, 145, 106];   // lightened oxide, readable on black

  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpRgb(c1, c2, t) {
    return "rgb(" + Math.round(lerp(c1[0], c2[0], t)) + "," +
                     Math.round(lerp(c1[1], c2[1], t)) + "," +
                     Math.round(lerp(c1[2], c2[2], t)) + ")";
  }

  var links = document.querySelectorAll("#sideNav a");
  var sections = document.querySelectorAll("section.block");
  var root = document.documentElement;

  var stops = []; // [{ pos: scrollY, color: [r,g,b] }, ...]

  function buildStops() {
    stops = [];
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var list = Array.prototype.slice.call(sections);
    list.forEach(function (s, i) {
      var pos;
      if (i === 0) pos = 0;
      else if (i === list.length - 1) pos = maxScroll;
      else pos = s.offsetTop;

      var color;
      if (i === 0) color = WHITE;
      else if (i === list.length - 1) color = BLACK;
      else color = hexToRgb(midColors[s.id] || "#eae4da");

      stops.push({ pos: pos, color: color });
    });
  }

  function updatePageColor() {
    if (!stops.length) return;
    var y = window.scrollY;
    var segIdx = 0;
    for (var i = 0; i < stops.length - 1; i++) {
      segIdx = i;
      if (y <= stops[i + 1].pos) break;
    }
    var a = stops[segIdx], b = stops[segIdx + 1] || a;
    var span = b.pos - a.pos;
    var t = span > 0 ? Math.min(1, Math.max(0, (y - a.pos) / span)) : 1;

    root.style.setProperty("--page-bg", lerpRgb(a.color, b.color, t));

    // Text only inverts within the FINAL segment (cv → black), since every
    // earlier stop is a light color where dark ink is always readable.
    var isFinalSegment = segIdx === stops.length - 2;
    var textT = isFinalSegment ? t : 0;
    root.style.setProperty("--text-primary", lerpRgb(INK, LIGHT_TEXT, textT));
    root.style.setProperty("--text-secondary", lerpRgb(INK_SOFT, LIGHT_TEXT_SOFT, textT));
    root.style.setProperty("--link-color", lerpRgb(OXIDE, LIGHT_LINK, textT));
  }

  if (links.length && sections.length) {
    var map = {};
    links.forEach(function (link) {
      map[link.getAttribute("href").slice(1)] = link;
    });

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

    sections.forEach(function (s) { navObserver.observe(s); });

    buildStops();
    updatePageColor();
  }

  // Scroll progress bar + page color, batched into one rAF-throttled handler
  var progressBar = document.getElementById("progressBar");
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (progressBar) {
          var scrollTop = window.scrollY;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          progressBar.style.width = pct + "%";
        }
        updatePageColor();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", function () {
    buildStops();
    onScroll();
  });
  onScroll();

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
