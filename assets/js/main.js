// ---------- Conversion tracking config ----------
// Leads are reported to GA4 (property G-794KX4S7Z5) as `generate_lead`, which is
// the event to import as a conversion in Google Ads (Admin -> Events -> mark as
// key event, then import it under the linked Ads account).
//
// GOOGLE_ADS_CONVERSION: optional. Set this to fire the Google Ads tag directly
// in addition to the GA4 import -- useful if you want Ads-side conversion
// modelling independent of the GA4 link. Format: "AW-123456789/AbC-dEfGhIj".
// Leave empty to rely on the GA4 import alone. Setting it also requires the
// AW- gtag snippet in each page's <head>.
var GOOGLE_ADS_CONVERSION = "";

// Estimated value of a lead, by loan product, for value-based bidding. While
// these are 0 the events carry no value and Ads optimises for lead COUNT.
// Set real numbers (your average revenue per funded loan x close rate) to let
// Smart Bidding chase higher-value products instead of cheaper leads.
var LEAD_VALUES = {
  fix_and_flip: 0,
  ground_up_construction: 0,
  dscr_rental: 0,
  partner: 0,
};

function trackEvent(name, params) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params || {});
}

function readFormName(form) {
  var el = form.querySelector('[name="form-name"]');
  return el ? el.value : "";
}

function readProduct(form) {
  var el = form.querySelector('[name="product"]');
  return el && el.value ? el.value : "";
}

document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute(
        "aria-expanded",
        nav.classList.contains("open") ? "true" : "false"
      );
    });
  }

  // Mobile dropdown (Loan Programs) toggle
  document.querySelectorAll(".main-nav .dropdown > a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 940) {
        e.preventDefault();
        link.parentElement.classList.toggle("open");
      }
    });
  });

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Phone number formatting: (XXX) XXX-XXXX, capped at 10 digits
  document.querySelectorAll("[data-phone-format]").forEach(function (input) {
    input.addEventListener("input", function () {
      var digits = input.value.replace(/\D/g, "").slice(0, 10);
      var formatted = digits;
      if (digits.length > 6) {
        formatted = "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
      } else if (digits.length > 3) {
        formatted = "(" + digits.slice(0, 3) + ") " + digits.slice(3);
      } else if (digits.length > 0) {
        formatted = "(" + digits;
      }
      input.value = formatted;
    });
  });

  // Pre-fill the "Get Funded" wizard from the homepage hero mini-form (?loan_type=...&state=...)
  var heroProductCards = document.querySelectorAll(".product-card");
  if (heroProductCards.length) {
    var heroParams = new URLSearchParams(window.location.search);
    var heroLoanType = heroParams.get("loan_type");
    var heroState = heroParams.get("state");
    if (heroLoanType) {
      var matchingCard = document.querySelector('.product-card[data-product="' + heroLoanType + '"]');
      if (matchingCard) matchingCard.click();
    }
    if (heroState) {
      document.querySelectorAll('input[name="property_address"]').forEach(function (input) {
        input.value = heroState;
      });
    }
  }

  // Lead form submission -> CRM public form API (replaces Netlify Forms)
  var CRM_FORM_ENDPOINTS = {
    "loan-inquiry": "https://crm.blinkcp.com/api/public/contact",
    "partner-application": "https://crm.blinkcp.com/api/public/partner",
  };

  var form = document.querySelector("#lead-form");
  if (form) {
    // Fire `form_start` once, on first real interaction. Paired with
    // generate_lead this gives a start -> finish completion rate, so a drop in
    // conversions can be read as "fewer people starting" vs "more abandoning".
    var formStarted = false;
    form.addEventListener(
      "input",
      function () {
        if (formStarted) return;
        formStarted = true;
        trackEvent("form_start", { form_type: readFormName(form) });
      },
      { once: false }
    );

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      var formName = form.querySelector('[name="form-name"]');
      var endpoint = CRM_FORM_ENDPOINTS[formName ? formName.value : ""];

      var params = new URLSearchParams();
      new FormData(form).forEach(function (value, key) {
        params.append(key, value);
      });

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      })
        .then(function (response) {
          if (response.ok) {
            // Read these before form.reset() wipes them.
            var leadFormType = readFormName(form);
            var leadProduct =
              readProduct(form) || (leadFormType === "partner-application" ? "partner" : "");
            var leadValue = LEAD_VALUES[leadProduct] || 0;

            var leadParams = { form_type: leadFormType, loan_product: leadProduct || "unspecified" };
            if (leadValue > 0) {
              leadParams.value = leadValue;
              leadParams.currency = "USD";
            }
            trackEvent("generate_lead", leadParams);

            if (GOOGLE_ADS_CONVERSION) {
              var adsParams = { send_to: GOOGLE_ADS_CONVERSION };
              if (leadValue > 0) {
                adsParams.value = leadValue;
                adsParams.currency = "USD";
              }
              trackEvent("conversion", adsParams);
            }

            status.textContent =
              "Thank you! Your submission has been received. Our team will follow up shortly.";
            status.className = "form-status success";
            form.reset();
          } else {
            status.textContent =
              "Something went wrong submitting your request. Please call us directly.";
            status.className = "form-status error";
          }
        })
        .catch(function () {
          status.textContent =
            "Something went wrong submitting your request. Please call us directly.";
          status.className = "form-status error";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
  }
});
