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

  // Pre-fill contact form from the homepage hero mini-form (?loan_type=...&state=...)
  var contactLoanType = document.getElementById("loan_type");
  var contactPropertyAddress = document.getElementById("property_address");
  if (contactLoanType || contactPropertyAddress) {
    var heroParams = new URLSearchParams(window.location.search);
    var heroLoanType = heroParams.get("loan_type");
    var heroState = heroParams.get("state");
    if (contactLoanType && heroLoanType) {
      Array.prototype.forEach.call(contactLoanType.options, function (opt) {
        if (opt.value === heroLoanType) {
          contactLoanType.value = opt.value;
        }
      });
    }
    if (contactPropertyAddress && heroState) {
      contactPropertyAddress.value = heroState;
    }
  }

  // Lead form submission -> CRM public form API (replaces Netlify Forms)
  var CRM_FORM_ENDPOINTS = {
    "loan-inquiry": "https://crm.blinkcp.com/api/public/contact",
    "partner-application": "https://crm.blinkcp.com/api/public/partner",
  };

  var form = document.querySelector("#lead-form");
  if (form) {
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
