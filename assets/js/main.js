const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Savings section: scroll-pinned stacking pills (all screen sizes)
(function initSavingsPillScroll() {
  const section = document.querySelector(".savings-section");
  if (!section) return;

  const pills = Array.from(section.querySelectorAll(".savings-pill"));
  if (!pills.length) return;

  const SCROLL_PER_PILL = 220; // px of scroll travel to bring each pill to rest

  // Make the section tall enough so all pills land before the user exits
  section.style.minHeight = `calc(100vh + ${pills.length * SCROLL_PER_PILL + 80}px)`;

  function update() {
    const rect    = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const scrolled   = Math.max(0, Math.min(scrollable, -rect.top));

    // Height of each pill's title strip (measure from first pill)
    const titleH = pills[0].querySelector(".savings-pill-header").offsetHeight;
    // Available vertical space inside the sticky content panel
    const stackH = section.querySelector(".savings-stack").offsetHeight;

    pills.forEach((pill, i) => {
      // Where the pill rests: stacked titles accumulate at the top
      const restY   = i * titleH;
      // Where it starts: just below the bottom of the stack container
      const startY  = stackH;

      const rangeStart = i * SCROLL_PER_PILL;
      const rangeEnd   = (i + 1) * SCROLL_PER_PILL;

      let y;
      if (scrolled <= rangeStart) {
        // Not yet rising — wait off-screen
        y = startY;
      } else if (scrolled >= rangeEnd) {
        // Fully rested
        y = restY;
      } else {
        // Ease-out cubic interpolation during travel
        const t     = (scrolled - rangeStart) / SCROLL_PER_PILL;
        const eased = 1 - Math.pow(1 - t, 3);
        y = startY + (restY - startY) * eased;
      }

      pill.style.transform = `translateY(${y}px)`;
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();

// Accordion
document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion-item");
    const isOpen = item.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
