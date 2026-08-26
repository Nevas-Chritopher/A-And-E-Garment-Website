const loader = document.getElementById("loader");
const nav = document.getElementById("nav");
const menu = document.getElementById("menu");
const navLinks = document.getElementById("navLinks");

window.addEventListener("load", () => {
  window.setTimeout(() => loader.classList.add("hide"), 3000);
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

menu.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menu.textContent = isOpen ? "×" : "☰";
  menu.setAttribute("aria-expanded", String(isOpen));
  menu.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menu.textContent = "☰";
    menu.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const stats = document.querySelector(".stats");
if (stats) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    stats.querySelectorAll("[data-count]").forEach((counter) => {
      const target = Number(counter.dataset.count);
      const start = performance.now();
      const duration = 1300;
      const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        counter.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3))).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    });
    observer.unobserve(stats);
  }, { threshold: 0.45 });
  counterObserver.observe(stats);
}

const filters = document.querySelectorAll(".filter");
const galleryItems = document.querySelectorAll(".gallery-item");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === filter));
    galleryItems.forEach((item) => {
      item.classList.toggle("hide", category !== "all" && item.dataset.category !== category);
    });
  });
});

