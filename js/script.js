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

const gallery = document.querySelector(".gallery");
if (gallery) {
  const dialog = document.createElement("dialog");
  dialog.className = "project-dialog";
  dialog.innerHTML = '<button class="dialog-close" type="button" aria-label="Close project details">×</button><img alt=""><div class="dialog-copy"><p></p><h2></h2><span></span></div>';
  document.body.append(dialog);
  const dialogImage = dialog.querySelector("img");
  const dialogType = dialog.querySelector("p");
  const dialogTitle = dialog.querySelector("h2");
  const dialogDescription = dialog.querySelector("span");
  const closeDialog = () => dialog.close();
  dialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  gallery.querySelectorAll(".gallery-item").forEach((item) => {
    const openProject = () => {
      dialogImage.src = item.querySelector("img").src;
      dialogImage.alt = item.querySelector("img").alt;
      dialogType.textContent = `${item.dataset.type} / ${item.dataset.service}`;
      dialogTitle.textContent = item.querySelector("h3").textContent;
      dialogDescription.textContent = item.dataset.description;
      dialog.showModal();
    };
    item.addEventListener("click", openProject);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProject();
      }
    });
  });
}

const quoteForm = document.getElementById("quoteForm");
if (quoteForm) {
  const originalForm = quoteForm.cloneNode(true);
  const initializeQuoteForm = (form) => {
    const deliveryDate = form.querySelector('input[name="date"]');
    deliveryDate.min = new Date().toISOString().split("T")[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf"];
    const maxFileSize = 5 * 1024 * 1024;
    const validateFile = (input) => {
      const file = input.files[0];
      if (!file) return true;
      if (!allowedTypes.includes(file.type) || file.size > maxFileSize) {
        input.setCustomValidity("Please upload a JPG, PNG, WEBP, SVG, or PDF file smaller than 5 MB.");
        return false;
      }
      input.setCustomValidity("");
      return true;
    };
    form.querySelectorAll('input[type="file"]').forEach((input) => input.addEventListener("change", () => validateFile(input)));
    form.addEventListener("submit", (event) => {
      const status = form.querySelector("#formStatus");
    event.preventDefault();
      form.querySelectorAll('input[type="file"]').forEach((input) => validateFile(input));
      if (!form.reportValidity()) return;
      form.innerHTML = '<div class="success-state"><span>01</span><h2>Request Received</h2><p>Thank you for contacting A&amp;E Garment. We have received your project request and our team will review your requirements.</p><button class="btn primary" type="button" id="anotherRequest">Send Another Request</button></div>';
      form.querySelector("#anotherRequest").addEventListener("click", () => {
        const restoredForm = originalForm.cloneNode(true);
        form.replaceWith(restoredForm);
        initializeQuoteForm(restoredForm);
      });
      status.textContent = "";
    });
  };
  initializeQuoteForm(quoteForm);
}

