const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

// Mobile navigation
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Automatically update copyright year
document.getElementById("year").textContent = new Date().getFullYear();

const messageField = document.getElementById("message");
document.querySelectorAll(".service-discuss").forEach(link => {
  link.addEventListener("click", () => {
    const service = link.dataset.service;
    if (messageField && service) {
      messageField.value = `I'm interested in discussing ${service}. `;
    }
  });
});

const aboutMotionGraphic = document.getElementById("aboutMotionGraphic");
const motionPauseButton = document.getElementById("motionPause");
const motionPlayButton = document.getElementById("motionPlay");

if (aboutMotionGraphic && motionPauseButton && motionPlayButton) {
  motionPauseButton.addEventListener("click", () => {
    aboutMotionGraphic.classList.add("is-paused");
    motionPauseButton.disabled = true;
    motionPlayButton.disabled = false;
  });

  motionPlayButton.addEventListener("click", () => {
    aboutMotionGraphic.classList.remove("is-paused");
    motionPauseButton.disabled = false;
    motionPlayButton.disabled = true;
  });
}

// Subtle reveal animation
const revealElements = document.querySelectorAll(
  ".hero-copy, .hero-visual, .section-heading, .trust-strip-inner > div, .timeline-item, " +
  ".service-card, .value-card, .project-card, .team-card, .mission-card, .programme-card, " +
  ".journey-grid > article, .framework-list > div, .philosophy-grid > div, .why-grid > article, " +
  ".stats-grid > div, .newsletter-copy, .newsletter-form, .resource-items > article, .faq-list > details, " +
  ".contact-block, .contact-form"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

const statsGrid = document.querySelector(".stats-grid");
const statValues = statsGrid ? Array.from(statsGrid.querySelectorAll("strong")) : [];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function countUpStats() {
  if (prefersReducedMotion) return;

  statValues.forEach(stat => {
    const match = stat.textContent.trim().match(/^(\D*)([\d,]+)(.*)$/);
    if (!match) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ""));
    const duration = 1400;
    const startTime = performance.now();

    function updateCount(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * easedProgress);
      stat.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    }

    requestAnimationFrame(updateCount);
  });
}

if (statsGrid && statValues.length) {
  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        countUpStats();
        statsObserver.disconnect();
      }
    }, { threshold: 0.35 });
    statsObserver.observe(statsGrid);
  } else {
    countUpStats();
  }
}
