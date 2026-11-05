/**
 * ==========================================================================
 * ⚔️ MAKE WARRIOR - CLIENT CONTROLLER & CONFIGURATION ⚔️
 * ==========================================================================
 *
 * EDITABLE PLACEHOLDER TEXT IS STORED IN THE CONFIG OBJECT BELOW.
 * Update this section to personalize your portfolio name, taglines,
 * skills, and projects in seconds!
 */

/**
 * BACKEND API BASE URL:
 * - Leave as "" (empty string) when running locally or hosting both on the same server.
 * - When hosting frontend on Cloudflare Pages, set to your Render backend URL:
 *   e.g. const BACKEND_API_URL = "https://your-app-name.onrender.com";
 */
const BACKEND_API_URL = "";

/* ==========================================================================
   SECTION 1: EDITABLE PORTFOLIO CONTENT CONFIGURATION
   ========================================================================== */
const WARRIOR_CONFIG = {
  profile: {
    name: "MAKE WARRIOR",
    badge: "FORGED IN CODE // DISCIPLINE & RELENTLESS EXECUTION",
    tagline: "Building resilient systems with tactical precision, unyielding performance, and ironclad architecture. Code is not merely written; it is tempered.",
    rank: "VANGUARD ARCHITECT",
    specialization: "SPECIALIZATION: MISSION-CRITICAL SYSTEMS",
    aboutLead: "A relentless craftsman dedicated to high-performance engineering.",
    bioParagraph1: "Welcome to my stronghold. In a landscape crowded with fragile software and endless dependencies, I practice software engineering as a martial art: grounded in foundational knowledge, deliberate practice, and fierce attention to detail.",
    bioParagraph2: "Whether hardening backend APIs against high concurrency, optimizing the critical rendering path for speed, or crafting responsive interfaces with pinpoint precision, my focus remains unshakeable: deliver software that stands victorious against time and pressure.",
    stats: [
      { number: "50+", label: "Battles Won (Projects)", accent: "accent-gold" },
      { number: "99.9%", label: "Uptime Defense", accent: "accent-crimson" },
      { number: "100%", label: "Dedication", accent: "accent-gold" },
      { number: "∞", label: "Will to Learn", accent: "accent-crimson" }
    ]
  },

  // 3 Placeholder Projects shown in The Armory
  projects: [
    {
      badge: "DEFENSE SYSTEM",
      badgeClass: "",
      title: "Aegis Sentinel",
      description: "An automated real-time incident monitor and telemetry shield that detects traffic surges, blocks brute-force vectors, and triggers defensive rate limits.",
      techStack: ["Node.js", "Express", "SQLite", "WebSockets"],
      demoUrl: "#projects",
      repoUrl: "#projects"
    },
    {
      badge: "TACTICAL PLATFORM",
      badgeClass: "accent-gold-badge",
      title: "Vanguard Core",
      description: "A high-speed procedural workflow engine designed for elite developers. Minimalist memory footprint, zero framework bloat, and sub-10ms response times.",
      techStack: ["JavaScript", "CSS Grid", "REST API", "Workers"],
      demoUrl: "#projects",
      repoUrl: "#projects"
    },
    {
      badge: "ZERO-KNOWLEDGE STORAGE",
      badgeClass: "",
      title: "ShadowForge Vault",
      description: "An offline-first personal data sanctuary employing client-side encryption and SQLite synchronization for mission-critical notes and battle plans.",
      techStack: ["SQLite3", "WebCrypto", "HTML5", "Offline API"],
      demoUrl: "#projects",
      repoUrl: "#projects"
    }
  ]
};

/* ==========================================================================
   SECTION 2: CONTENT HYDRATION
   Applies WARRIOR_CONFIG to DOM elements on load
   ========================================================================== */
function hydrateWarriorContent() {
  const p = WARRIOR_CONFIG.profile;
  const heroNameEl = document.getElementById("heroName");
  const heroBadgeEl = document.getElementById("heroBadgeText");
  const heroTaglineEl = document.getElementById("heroTagline");
  const aboutHeadlineEl = document.getElementById("aboutHeadline");
  const aboutBio1El = document.getElementById("aboutBioPara1");
  const aboutBio2El = document.getElementById("aboutBioPara2");

  if (heroNameEl) heroNameEl.textContent = p.name;
  if (heroBadgeEl) heroBadgeEl.textContent = p.badge;
  if (heroTaglineEl) heroTaglineEl.textContent = p.tagline;
  if (aboutHeadlineEl) aboutHeadlineEl.textContent = p.aboutLead;
  if (aboutBio1El) aboutBio1El.textContent = p.bioParagraph1;
  if (aboutBio2El) aboutBio2El.textContent = p.bioParagraph2;

  // Set current year in footer
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ==========================================================================
   SECTION 3: NAVIGATION & INTERACTION
   Sticky nav, mobile toggle, and smooth link tracking
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  const links = document.querySelectorAll(".nav-link");

  // Sticky nav elevation on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      mobileToggle.classList.toggle("open", isOpen);
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile menu on link click
    links.forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        mobileToggle.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active section tracking with IntersectionObserver
  const sections = document.querySelectorAll("section[id]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        links.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   SECTION 4: FEEDBACK FORM CONTROLLER
   Validation, character counting, loading states, and API submission
   ========================================================================== */
function initFeedbackForm() {
  const form = document.getElementById("dispatchForm");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phoneNumber");
  const emailInput = document.getElementById("email");
  const noteInput = document.getElementById("note");
  const noteCharCounter = document.getElementById("noteCharCounter");

  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const emailError = document.getElementById("emailError");
  const noteError = document.getElementById("noteError");

  const submitBtn = document.getElementById("submitBtn");
  const btnSpinner = document.getElementById("btnSpinner");
  const btnIcon = document.getElementById("btnIcon");
  const btnText = document.getElementById("btnText");
  const statusAlert = document.getElementById("formStatusAlert");
  const alertIcon = document.getElementById("alertIcon");
  const alertMessage = document.getElementById("alertMessage");

  // Character counter for textarea
  if (noteInput && noteCharCounter) {
    noteInput.addEventListener("input", () => {
      const len = noteInput.value.length;
      noteCharCounter.textContent = `${len} / 1000`;
      if (len > 1000) {
        noteCharCounter.style.color = "var(--accent-crimson-bright)";
      } else {
        noteCharCounter.style.color = "var(--text-subtle)";
      }
    });
  }

  // Helper to clear error state for a field
  function clearFieldError(groupElement, errorElement) {
    if (groupElement) groupElement.classList.remove("has-error");
    if (errorElement) errorElement.textContent = "";
  }

  // Helper to set error state for a field
  function setFieldError(groupElement, errorElement, message) {
    if (groupElement) groupElement.classList.add("has-error");
    if (errorElement) errorElement.textContent = message;
  }

  // Live validation listeners to clear errors on user typing
  [
    { input: nameInput, group: document.getElementById("group-name"), error: nameError },
    { input: phoneInput, group: document.getElementById("group-phoneNumber"), error: phoneError },
    { input: emailInput, group: document.getElementById("group-email"), error: emailError },
    { input: noteInput, group: document.getElementById("group-note"), error: noteError }
  ].forEach(({ input, group, error }) => {
    if (input) {
      input.addEventListener("input", () => {
        clearFieldError(group, error);
      });
    }
  });

  // Client-side validation function
  function validateClientForm() {
    let isValid = true;

    // Reset all errors first
    clearFieldError(document.getElementById("group-name"), nameError);
    clearFieldError(document.getElementById("group-phoneNumber"), phoneError);
    clearFieldError(document.getElementById("group-email"), emailError);
    clearFieldError(document.getElementById("group-note"), noteError);

    // Validate Name: 2-60 chars
    const nameVal = nameInput.value.trim();
    if (!nameVal) {
      setFieldError(document.getElementById("group-name"), nameError, "Please enter your name or codename.");
      isValid = false;
    } else if (nameVal.length < 2 || nameVal.length > 60) {
      setFieldError(document.getElementById("group-name"), nameError, "Name must be between 2 and 60 characters.");
      isValid = false;
    }

    // Validate Phone Number: 7-15 digits, allowing +, spaces, and dashes
    const phoneVal = phoneInput.value.trim();
    const phoneCharRegex = /^\+?[\d\s-]+$/;
    const digitsOnly = phoneVal.replace(/\D/g, "");

    if (!phoneVal) {
      setFieldError(document.getElementById("group-phoneNumber"), phoneError, "Please enter your phone number.");
      isValid = false;
    } else if (!phoneCharRegex.test(phoneVal) || digitsOnly.length < 7 || digitsOnly.length > 15) {
      setFieldError(
        document.getElementById("group-phoneNumber"),
        phoneError,
        "Phone number must contain between 7 and 15 digits (spaces and + are permitted)."
      );
      isValid = false;
    }

    // Validate Email: valid format
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      setFieldError(document.getElementById("group-email"), emailError, "Please enter your email address.");
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      setFieldError(document.getElementById("group-email"), emailError, "Please enter a valid email address (e.g. warrior@domain.com).");
      isValid = false;
    }

    // Validate Note: 5-1000 chars
    const noteVal = noteInput.value.trim();
    if (!noteVal) {
      setFieldError(document.getElementById("group-note"), noteError, "Please enter your message or note.");
      isValid = false;
    } else if (noteVal.length < 5 || noteVal.length > 1000) {
      setFieldError(document.getElementById("group-note"), noteError, "Note must be between 5 and 1000 characters.");
      isValid = false;
    }

    return isValid;
  }

  // Display status banner helper
  function showStatusAlert(type, message) {
    statusAlert.className = `status-alert ${type}`;
    alertIcon.textContent = type === "success" ? "🛡️" : "⚠️";
    alertMessage.textContent = message;
    statusAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function hideStatusAlert() {
    statusAlert.className = "status-alert hidden";
    alertMessage.textContent = "";
  }

  // Form submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideStatusAlert();

    // 1. Client-side validation check
    const isValid = validateClientForm();
    if (!isValid) {
      showStatusAlert("error", "Submission halted: Please resolve the highlighted field errors.");
      return;
    }

    // 2. Set button loading state
    submitBtn.disabled = true;
    btnSpinner.classList.remove("hidden");
    btnIcon.classList.add("hidden");
    btnText.textContent = "TRANSMITTING DISPATCH...";

    const payload = {
      name: nameInput.value.trim(),
      phoneNumber: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      note: noteInput.value.trim()
    };

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        // Successful transmission
        showStatusAlert(
          "success",
          `⚔️ Dispatch recorded! Transmission #${result.id} successfully lodged at headquarters.`
        );
        // Clear form inputs
        form.reset();
        if (noteCharCounter) noteCharCounter.textContent = "0 / 1000";
      } else {
        // Server returned an error (e.g. 400 validation or 429 rate limit)
        if (result.errors) {
          // Highlight individual fields from server errors
          if (result.errors.name) {
            setFieldError(document.getElementById("group-name"), nameError, result.errors.name);
          }
          if (result.errors.phoneNumber) {
            setFieldError(document.getElementById("group-phoneNumber"), phoneError, result.errors.phoneNumber);
          }
          if (result.errors.email) {
            setFieldError(document.getElementById("group-email"), emailError, result.errors.email);
          }
          if (result.errors.note) {
            setFieldError(document.getElementById("group-note"), noteError, result.errors.note);
          }
          showStatusAlert("error", result.message || "Validation failed on the server. Please check your entries.");
        } else if (response.status === 429) {
          showStatusAlert("error", result.error || "Rate limit reached. Please wait a minute before submitting again.");
        } else {
          showStatusAlert("error", result.error || result.message || "An error occurred while transmitting your dispatch.");
        }
      }
    } catch (networkError) {
      console.error("Network dispatch error:", networkError);
      showStatusAlert(
        "error",
        "Communication failure: Unable to reach the server. Verify your connection and try again."
      );
    } finally {
      // Restore button state
      submitBtn.disabled = false;
      btnSpinner.classList.add("hidden");
      btnIcon.classList.remove("hidden");
      btnText.textContent = "TRANSMIT DISPATCH";
    }
  });
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  hydrateWarriorContent();
  initNavigation();
  initFeedbackForm();
});
