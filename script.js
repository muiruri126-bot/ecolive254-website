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
