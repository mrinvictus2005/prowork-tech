/* ============================================================
   Prowork Tech — script.js  (Improved)
   ============================================================ */

/* ----------------------------------------------------------
   1. YEAR AUTO-UPDATE
---------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();


/* ----------------------------------------------------------
   2. MOBILE NAV TOGGLE
      - Animates hamburger → ✕
      - Closes on outside click
      - Closes on nav-link click
---------------------------------------------------------- */
const menuBtn  = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function openMenu() {
  navLinks.classList.add("active");
  menuBtn.classList.add("open");
  menuBtn.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  navLinks.classList.remove("active");
  menuBtn.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  navLinks.classList.contains("active") ? closeMenu() : openMenu();
});

// Close on any nav-link click
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Close when clicking anywhere outside the navbar
document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
    closeMenu();
  }
});


/* ----------------------------------------------------------
   3. SMOOTH SCROLL — offset for sticky header
---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    const headerH = document.querySelector(".header")?.offsetHeight ?? 70;
    const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 10;

    window.scrollTo({ top, behavior: "smooth" });
  });
});


/* ----------------------------------------------------------
   4. REVEAL ON SCROLL (IntersectionObserver)
---------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target); // fire once only
      }
    });
  },
  { threshold: 0.10 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));


/* ----------------------------------------------------------
   5. ACTIVE NAV HIGHLIGHT ON SCROLL (debounced)
---------------------------------------------------------- */
const sections = document.querySelectorAll("section[id], footer[id]");
const navItems = document.querySelectorAll(".nav-link");

function setActiveNav() {
  const headerH = document.querySelector(".header")?.offsetHeight ?? 70;
  let current = "";

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - headerH - 30) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

// Debounce to avoid firing on every pixel
let scrollTimer;
window.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(setActiveNav, 60);
});
setActiveNav(); // run once on load


/* ----------------------------------------------------------
   6. FAQ ACCORDION
      - Only one item open at a time
      - Icon toggles +  →  ×
---------------------------------------------------------- */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const btn  = item.querySelector(".faq-q");
  const icon = btn.querySelector(".icon");

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    // Close all first
    faqItems.forEach((other) => {
      other.classList.remove("active");
      const otherIcon = other.querySelector(".icon");
      if (otherIcon) otherIcon.textContent = "+";
    });

    // Toggle clicked item
    if (!isOpen) {
      item.classList.add("active");
      if (icon) icon.textContent = "×";
    }
  });
});


/* ----------------------------------------------------------
   7. CONTACT FORM — Formspree async submit
      - Clears any previous timeout on re-submit
      - Adds success / error CSS classes for styling
---------------------------------------------------------- */
const form       = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
let statusTimer  = null;

function setStatus(msg, type) {
  // type: "success" | "error" | "loading"
  formStatus.textContent = msg;
  formStatus.className   = `form-status form-status--${type}`;

  clearTimeout(statusTimer);
  if (type !== "loading") {
    statusTimer = setTimeout(() => {
      formStatus.textContent = "";
      formStatus.className   = "form-status";
    }, 5000);
  }
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    setStatus("Sending… please wait.", "loading");

    try {
      const response = await fetch(form.action, {
        method:  form.method,
        body:    new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("✅ Message sent! We'll get back to you within 24 hrs.", "success");
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        const msg  = data?.errors?.[0]?.message ?? "Submission failed. Please try again.";
        setStatus(`❌ ${msg}`, "error");
      }
    } catch {
      setStatus("❌ Network error — check your connection and retry.", "error");
    } finally {
      submitBtn.disabled = false;
    }
  });
}


/* ----------------------------------------------------------
   8. HAMBURGER CSS-CLASS ANIMATION SUPPORT
      Add these rules to style.css if not already present:

      .menu-btn.open span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }
      .menu-btn.open span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }
      .menu-btn.open span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }
      .menu-btn span { transition: transform 0.25s ease, opacity 0.2s ease; }

      .form-status--success { color: #22c55e; }
      .form-status--error   { color: #f87171; }
      .form-status--loading { color: rgba(236,242,255,0.65); }
---------------------------------------------------------- */
