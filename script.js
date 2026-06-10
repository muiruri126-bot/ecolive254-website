// ECoLIve Kenya — interactions

// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
// Close menu when a link is clicked
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => nav.classList.remove("open"))
);

// ---- Tabbed page navigation (each nav item shows only its own content) ----
const pageEls = Array.from(document.querySelectorAll("[data-page]"));
const pageNames = [...new Set(pageEls.map((el) => el.dataset.page))];

function idToPage(id) {
  if (!id) return null;
  const el = document.getElementById(id);
  if (!el) return null;
  const holder = el.closest("[data-page]");
  return holder ? holder.dataset.page : null;
}

function setActiveNav(page) {
  document.querySelectorAll('#nav a[href^="#"]').forEach((a) => {
    a.classList.toggle("active", idToPage(a.getAttribute("href").slice(1)) === page);
  });
}

function jumpTop() {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.style.scrollBehavior = prev;
}

function showPage(page) {
  if (!pageNames.includes(page)) page = "home";
  pageEls.forEach((el) => {
    const on = el.dataset.page === page;
    el.classList.toggle("page-hidden", !on);
    if (on) el.querySelectorAll(".reveal").forEach((r) => r.classList.add("visible"));
  });
  setActiveNav(page);
  return page;
}

function goTo(id) {
  const page = idToPage(id) || (id === "home" ? "home" : null);
  if (!page) return false;
  showPage(page);
  const target = document.getElementById(id);
  const firstOfPage = pageEls.find((el) => el.dataset.page === page);
  if (target && target !== firstOfPage) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    jumpTop();
  }
  return true;
}

// Intercept in-page anchor links (nav, footer, hero buttons, inline links)
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href").slice(1);
  if (!id) return;
  if (goTo(id)) {
    e.preventDefault();
    nav.classList.remove("open");
    history.replaceState(null, "", "#" + id);
  }
});

// Open the correct tab on first load (also handles links from /post and /news)
showPage(idToPage(location.hash.slice(1)) || "home");
jumpTop();

// Respond to manual hash edits / back-forward navigation
window.addEventListener("hashchange", () => goTo(location.hash.slice(1)));

// Scroll reveal — tag the major blocks
const revealTargets = document.querySelectorAll(
  ".section-head, .vm-card, .value, .theme-card, .program-card, .s2s-step, .strategy-list li, .impact-card, .sdg, .logo-list li, .cta-form, .founder-quote"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach((el) => io.observe(el));

// Gallery lightbox
const galleryItems = Array.from(document.querySelectorAll(".g-item"));
const lightbox = document.getElementById("lightbox");
if (lightbox && galleryItems.length) {
  const lbImg = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCaption");
  const btnClose = lightbox.querySelector(".lb-close");
  const btnPrev = lightbox.querySelector(".lb-prev");
  const btnNext = lightbox.querySelector(".lb-next");
  let current = 0;

  function show(i) {
    current = (i + galleryItems.length) % galleryItems.length;
    const fig = galleryItems[current];
    const img = fig.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = fig.dataset.caption || img.alt;
  }
  function open(i) {
    show(i);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  galleryItems.forEach((fig, i) => fig.addEventListener("click", () => open(i)));
  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => show(current - 1));
  btnNext.addEventListener("click", () => show(current + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

// Contact form (front-end demo — wire to a backend / Formspree as needed)
function ecoliveSubmit(e) {
  e.preventDefault();
  const note = document.getElementById("formNote");
  note.hidden = false;
  e.target.reset();
  setTimeout(() => (note.hidden = true), 5000);
  return false;
}
