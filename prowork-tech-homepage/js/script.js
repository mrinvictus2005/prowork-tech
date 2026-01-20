// ✅ YEAR AUTO UPDATE
document.getElementById("year").textContent = new Date().getFullYear();

// ✅ MOBILE NAV TOGGLE
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// ✅ CLOSE MENU ON LINK CLICK (MOBILE)
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// ✅ FAQ ACCORDION
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-q");
  btn.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

// ✅ REVEAL ON SCROLL
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.12 }
);

reveals.forEach((el) => observer.observe(el));

// ✅ ACTIVE NAV HIGHLIGHT ON SCROLL
const sections = document.querySelectorAll("section[id], footer[id]");
const navItems = document.querySelectorAll(".nav-link");

function setActiveNav() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 140) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveNav);
setActiveNav();

// ✅ CONTACT FORM REAL SUBMIT (Formspree)
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  formStatus.textContent = "Sending... Please wait.";

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      formStatus.textContent = "✅ Message sent successfully! We will contact you soon.";
      form.reset();
    } else {
      formStatus.textContent = "❌ Failed to send message. Please try again.";
    }
  } catch (error) {
    formStatus.textContent = "❌ Network error. Please check your connection.";
  }

  setTimeout(() => {
    formStatus.textContent = "";
  }, 5000);
});
