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

  // Hero background video crossfade (suburban overview <-> subdivision construction)
  var heroVideos = document.querySelectorAll("[data-hero-video]");
  if (heroVideos.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var heroIndex = 0;
    var playHeroVideo = function (i) {
      heroVideos.forEach(function (v, vi) {
        v.classList.toggle("is-active", vi === i);
      });
      var current = heroVideos[i];
      current.currentTime = 0;
      current.play();
    };
    heroVideos.forEach(function (v, i) {
      v.addEventListener("ended", function () {
        heroIndex = (heroIndex + 1) % heroVideos.length;
        playHeroVideo(heroIndex);
      });
    });
  }

  // Lead form submission (Netlify Forms AJAX pattern)
  var form = document.querySelector("#lead-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      var params = new URLSearchParams();
      new FormData(form).forEach(function (value, key) {
        params.append(key, value);
      });

      fetch("/", {
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
