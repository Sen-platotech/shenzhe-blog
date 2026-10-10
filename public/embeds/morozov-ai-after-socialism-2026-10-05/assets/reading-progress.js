const bar = document.querySelector(".reading-progress");
    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (total > 0 ? Math.min(100, scrollY / total * 100) : 0) + "%";
    };
    updateProgress();
    addEventListener("scroll", updateProgress, { passive: true });
    addEventListener("resize", updateProgress);
