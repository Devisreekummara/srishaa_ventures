/**
 * SRISHAA VENTURES — MODERN INTERACTIVE SCRIPT
 * Build • Renovate • Design — Spaces for a Better Tomorrow
 */

document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Sticky Header Elevation
  const header = document.getElementById("siteHeader");
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // 3. Mobile Navigation Drawer
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");

  function setMenuState(isOpen) {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenuState(false);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuState(false);
        menuToggle.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!header.contains(e.target) && siteNav.classList.contains("is-open")) {
        setMenuState(false);
      }
    });

    const desktopQuery = window.matchMedia("(min-width: 1101px)");
    desktopQuery.addEventListener("change", (e) => {
      if (e.matches) setMenuState(false);
    });
  }

  // 4. Smooth Section Reveal on Scroll
  const revealElements = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  // 5. Interactive Before & After Transformation Slider
  const compContainer = document.getElementById("comparisonSlider");
  const beforeClip = document.getElementById("beforeClip");
  const afterClip = document.getElementById("afterClip");
  const sliderHandle = document.getElementById("sliderHandle");
  const tagBefore = document.querySelector(".tag-before");
  const tagAfter = document.querySelector(".tag-after");

  if (compContainer && beforeClip && sliderHandle) {
    let isDragging = false;

    function updateSlider(clientX) {
      const rect = compContainer.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      let pct = (offsetX / rect.width) * 100;
      pct = Math.max(3, Math.min(97, pct)); // clamp between 3% and 97%

      beforeClip.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
      if (afterClip) {
        afterClip.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
      }
      sliderHandle.style.left = `${pct}%`;

      // Hide AFTER tag when looking at BEFORE, and hide BEFORE tag when looking at AFTER
      if (tagBefore) {
        tagBefore.style.opacity = pct < 18 ? "0" : "1";
      }
      if (tagAfter) {
        tagAfter.style.opacity = pct > 82 ? "0" : "1";
      }
    }

    // Mouse & Pointer Events
    compContainer.addEventListener("pointerdown", (e) => {
      isDragging = true;
      compContainer.setPointerCapture(e.pointerId);
      updateSlider(e.clientX);
    });

    compContainer.addEventListener("pointermove", (e) => {
      if (isDragging) {
        updateSlider(e.clientX);
      }
    });

    function stopDrag(e) {
      if (isDragging) {
        isDragging = false;
        try {
          compContainer.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    }

    compContainer.addEventListener("pointerup", stopDrag);
    compContainer.addEventListener("pointercancel", stopDrag);
  }

  // 6. Interactive Project Estimator
  const scopeBtns = document.querySelectorAll("#scopeSelector .scope-btn");
  const areaRange = document.getElementById("areaRange");
  const areaDisplay = document.getElementById("areaDisplay");
  const tierCards = document.querySelectorAll("#tierSelector .tier-card");

  const calcPrice = document.getElementById("calcPrice");
  const calcTimeline = document.getElementById("calcTimeline");
  const calcScopeName = document.getElementById("calcScopeName");
  const calcAreaDisplay = document.getElementById("calcAreaDisplay");
  const applyEstimateBtn = document.getElementById("applyEstimateBtn");

  let currentRate = 4200;
  let currentScope = "Build";
  let currentScopeLabel = "Turnkey Architectural Build";
  let baseTime = "8-12 Months";
  let currentMultiplier = 1.0;
  let currentTierName = "Luxury";

  function formatIndianCurrency(amount) {
    if (amount >= 10000000) {
      const cr = (amount / 10000000).toFixed(2);
      return `₹ ${cr} Cr`;
    } else if (amount >= 100000) {
      const lakhs = (amount / 100000).toFixed(1);
      return `₹ ${lakhs} L`;
    }
    return `₹ ${amount.toLocaleString("en-IN")}`;
  }

  function recalculateEstimate() {
    const area = parseInt(areaRange.value, 10);
    areaDisplay.textContent = `${area.toLocaleString()} sq.ft`;
    if (calcAreaDisplay) calcAreaDisplay.textContent = `${area.toLocaleString()} sq.ft`;

    const baseCost = area * currentRate * currentMultiplier;
    const lowerCost = baseCost * 0.92;
    const upperCost = baseCost * 1.12;

    if (calcPrice) {
      calcPrice.textContent = `${formatIndianCurrency(lowerCost)} – ${formatIndianCurrency(upperCost)}`;
    }

    // Adjust timeline based on area
    let adjustedTime = baseTime;
    if (area > 5000) {
      if (currentScope === "Build") adjustedTime = "14-18 Months";
      else if (currentScope === "Renovate") adjustedTime = "6-8 Months";
      else adjustedTime = "3-5 Months";
    }

    if (calcTimeline) calcTimeline.textContent = adjustedTime;
    if (calcScopeName) calcScopeName.textContent = currentScopeLabel;
  }

  if (scopeBtns.length && areaRange) {
    scopeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        scopeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentRate = parseFloat(btn.dataset.rate);
        currentScope = btn.dataset.name;
        baseTime = btn.dataset.time;

        if (currentScope === "Build") currentScopeLabel = "Turnkey Architectural Build";
        else if (currentScope === "Renovate") currentScopeLabel = "Full-Scale Space Renovation";
        else currentScopeLabel = "Bespoke Interior Architecture";

        recalculateEstimate();
      });
    });

    areaRange.addEventListener("input", recalculateEstimate);

    tierCards.forEach((card) => {
      card.addEventListener("click", () => {
        tierCards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        currentMultiplier = parseFloat(card.dataset.multiplier);
        currentTierName = card.querySelector("h4")?.textContent.trim() || "Luxury";
        recalculateEstimate();
      });
    });

    recalculateEstimate();
  }

  // Apply Estimate to Form
  if (applyEstimateBtn) {
    applyEstimateBtn.addEventListener("click", () => {
      const contactSection = document.getElementById("contact");
      const serviceSelect = document.getElementById("service");
      const messageField = document.getElementById("message");

      if (serviceSelect) {
        serviceSelect.value = currentScope;
      }

      if (messageField) {
        const area = areaRange ? areaRange.value : "2400";
        messageField.value = `I am interested in a ${currentScopeLabel} for an area of approx ${area} sq.ft (${currentTierName} tier). Please share detailed consultation availability.`;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // 7. Portfolio Filter Tabs
  const filterBtns = document.querySelectorAll("#portfolioFilter .filter-btn");
  const galleryItems = document.querySelectorAll("#galleryGrid .gallery-item");

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const target = btn.dataset.filter;
        galleryItems.forEach((item) => {
          if (target === "all" || item.dataset.category === target) {
            item.classList.remove("hidden");
            item.style.opacity = "0";
            item.style.transform = "scale(0.96)";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            }, 30);
          } else {
            item.classList.add("hidden");
          }
        });
      });
    });
  }

  // 8. Service Links Pre-selection
  const serviceSelect = document.getElementById("service");
  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      if (serviceSelect) {
        serviceSelect.value = link.dataset.service;
      }
    });
  });

  // 9. Consultation Enquiry Form Handling
  const enquiryForm = document.getElementById("enquiryForm");
  const formStatus = document.getElementById("formStatus");
  const enquiryPreview = document.getElementById("enquiryPreview");
  const previewText = document.getElementById("previewText");
  const previewCloseBtn = document.getElementById("previewCloseBtn");

  if (previewCloseBtn && enquiryPreview) {
    previewCloseBtn.addEventListener("click", () => {
      enquiryPreview.hidden = true;
    });
  }

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("fullName");
      const emailInput = document.getElementById("email");
      const phoneInput = document.getElementById("phone");
      const messageInput = document.getElementById("message");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const service = serviceSelect ? serviceSelect.value : "";
      const budget = document.getElementById("budget")?.value || "Not specified";
      const location = document.getElementById("location")?.value || "Not specified";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !phone || !service || !message) {
        if (formStatus) {
          formStatus.textContent = "Please fill in all required fields marked with *.";
          formStatus.style.color = "#dc2626";
        }
        return;
      }

      if (formStatus) {
        formStatus.textContent = "✓ Thank you! Your project inquiry preview has been generated below.";
        formStatus.style.color = "#16a34a";
      }

      if (previewText) {
        previewText.textContent = [
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `SRISHAA VENTURES — CONSULTATION INQUIRY`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `Client Name  : ${name}`,
          `Email Address: ${email}`,
          `Phone Number : ${phone}`,
          `Service Scope: ${service}`,
          `Location     : ${location}`,
          `Target Budget: ${budget}`,
          `Date / Time  : ${new Date().toLocaleString()}`,
          `─────────────────────────────────────────`,
          `Project Details:`,
          message,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        ].join("\n");
      }

      if (enquiryPreview) {
        enquiryPreview.hidden = false;
        enquiryPreview.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }
});
