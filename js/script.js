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

const pageView = document.createElement("div");
pageView.className = "page-view";
pageView.innerHTML = '<div class="page-view-header"><img class="page-view-logo" src="images/A&E logo.png" alt="A&E Garment and Advertising"><button class="page-home" type="button"><span class="back-switch" aria-hidden="true"><span class="back-switch-knob">←</span></span><span>Back</span></button></div><div class="page-dialog-content"></div><div class="page-view-footer"><span>A&amp;E Garment and Advertising and Technology P.L.C.</span><span>© 2026 All rights reserved.</span></div>';
document.body.append(pageView);
const pageViewContent = pageView.querySelector(".page-dialog-content");
const closePageView = () => {
  pageView.classList.remove("active");
  document.body.classList.remove("page-open");
  history.pushState(null, "", "#home");
};
pageView.querySelector(".page-home").addEventListener("click", closePageView);

const employeePhotos = [1, 2, 3, 4].map((number) => `images/Our Employees (${number}).png`);
const startEmployeeSlideshow = (root) => {
  root.querySelectorAll(".employee-image").forEach((image) => {
    if (image.dataset.slideshowStarted) return;
    image.dataset.slideshowStarted = "true";
    let currentPhoto = 0;
    window.setInterval(() => {
      image.classList.add("photo-changing");
      window.setTimeout(() => {
        currentPhoto = (currentPhoto + 1) % employeePhotos.length;
        image.src = employeePhotos[currentPhoto];
        image.classList.remove("photo-changing");
      }, 280);
    }, 3200);
  });
};
startEmployeeSlideshow(document);

document.querySelectorAll("[data-page]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const pageSections = {
      services: ["services", "process", "quality"],
      work: ["capabilities", "work"],
      contact: ["contact"],
      quote: ["quote"]
    };
    const sections = (pageSections[link.dataset.page] || []).map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    pageView.className = `page-view page-${link.dataset.page}`;
    pageViewContent.innerHTML = sections.map((section) => `<section class="page-section page-${section.id} ${section.className}">${section.innerHTML}</section>`).join("");
    startEmployeeSlideshow(pageViewContent);
    document.body.classList.add("page-open");
    pageView.classList.remove("active");
    requestAnimationFrame(() => pageView.classList.add("active"));
    history.pushState(null, "", `#${link.dataset.page}`);
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

const zipperStage = document.querySelector(".zipper-open");
if (zipperStage) {
  const zipperObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    zipperStage.classList.add("is-open");
    observer.unobserve(zipperStage);
  }, { threshold: 0.35 });
  zipperObserver.observe(zipperStage);
}

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

document.querySelectorAll(".quote-form input, .quote-form select, .quote-form textarea").forEach((field) => {
  const frame = document.createElement("span");
  frame.className = "bcc-field";
  field.parentNode.insertBefore(frame, field);
  frame.appendChild(field);
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === filter));
    galleryItems.forEach((item) => {
      item.classList.toggle("hide", category !== "all" && item.dataset.category !== category);
    });
  });
});

const showWorkDetail = (item) => {
  const gallery = item.closest(".gallery");
  const detail = gallery?.parentElement.querySelector(".work-detail");
  if (!detail) return;
  detail.querySelector("img").src = item.querySelector("img").src;
  detail.querySelector("img").alt = item.querySelector("img").alt;
  detail.querySelector("small").textContent = `${item.dataset.type} / ${item.dataset.service}`;
  detail.querySelector("h3").textContent = item.querySelector("h3").textContent;
  detail.querySelector("p").textContent = item.dataset.description;
  detail.hidden = false;
  gallery.querySelectorAll(".gallery-item").forEach((galleryItem) => galleryItem.classList.toggle("selected", galleryItem === item));
  detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

document.addEventListener("click", (event) => {
  const item = event.target.closest?.(".gallery-item");
  if (item) showWorkDetail(item);
});

document.addEventListener("keydown", (event) => {
  const item = event.target.closest?.(".gallery-item");
  if (item && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    showWorkDetail(item);
  }
});

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

