document.documentElement.classList.add("ready");
document.documentElement.classList.add("js");

(function () {
  var nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;
  function showAll() {
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("is-in");
  }
  try {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.01 });
    for (var j = 0; j < nodes.length; j++) io.observe(nodes[j]);
  } catch (err) {
    showAll();
  }
})();

(function () {
  var root = document.querySelector("[data-gallery]");
  var lb = document.getElementById("lightbox");
  if (!root || !lb) return;
  var links = root.querySelectorAll("a.shot");
  if (!links.length) return;
  var img = document.getElementById("lb-img");
  var cap = document.getElementById("lb-cap");
  var index = 0;
  var lastFocus = null;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function paint() {
    var link = links[index];
    img.src = link.getAttribute("href");
    img.alt = link.querySelector("img") ? link.querySelector("img").alt : "";
    cap.textContent = link.getAttribute("data-caption") || img.alt;
  }

  function show(next, fade) {
    index = (next + links.length) % links.length;
    if (!fade || reduce) {
      paint();
      return;
    }
    img.classList.add("is-out");
    window.setTimeout(function () {
      paint();
      img.classList.remove("is-out");
    }, 200);
  }

  function openAt(i) {
    lastFocus = document.activeElement;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    show(i, false);
    var closeBtn = lb.querySelector("[data-lb-close]");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  for (var i = 0; i < links.length; i++) {
    (function (n) {
      links[n].addEventListener("click", function (event) {
        event.preventDefault();
        openAt(n);
      });
    })(i);
  }

  lb.addEventListener("click", function (event) {
    if (event.target === lb) close();
  });
  lb.querySelector("[data-lb-close]").addEventListener("click", close);
  lb.querySelector("[data-lb-prev]").addEventListener("click", function () { show(index - 1, true); });
  lb.querySelector("[data-lb-next]").addEventListener("click", function () { show(index + 1, true); });

  document.addEventListener("keydown", function (event) {
    if (!lb.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowRight") show(index + 1, true);
    if (event.key === "ArrowLeft") show(index - 1, true);
  });
})();

(function () {
  var send = document.getElementById("demo-send");
  if (!send) return;
  send.addEventListener("click", function () {
    var box = document.getElementById("demo-result");
    if (box) box.hidden = false;
  });
})();
