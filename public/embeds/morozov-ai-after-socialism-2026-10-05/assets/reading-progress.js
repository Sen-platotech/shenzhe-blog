"use strict";
(() => {
  const bar = document.getElementById("reading-progress");
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.value = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();
