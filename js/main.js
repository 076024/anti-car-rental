(function () {
  const nav = document.getElementById("site-nav");
  const navToggle = document.getElementById("nav-toggle");
  const toast = document.getElementById("toast");
  const grid = document.getElementById("car-grid");
  const cards = Array.from(grid.querySelectorAll(".car-card"));
  const filterNote = document.getElementById("filter-note");
  const emptyState = document.getElementById("empty-state");
  const viewAllBtn = document.getElementById("view-all-cars");
  const catButtons = Array.from(document.querySelectorAll(".cat-card"));
  const searchForm = document.getElementById("search-form");
  const searchError = document.getElementById("search-error");
  const bookDialog = document.getElementById("book-dialog");
  const bookForm = document.getElementById("book-form");
  const bookSuccess = document.getElementById("book-success");
  const bookError = document.getElementById("book-error");
  const videoDialog = document.getElementById("video-dialog");
  const infoDialog = document.getElementById("info-dialog");
  const faqDialog = document.getElementById("faq-dialog");

  let showAll = false;
  let filter = "all";
  let toastTimer = 0;

  const quotes = [
    {
      text: "Anti made our weekend getaway completely stress-free. The car was immaculate, pickup was on time, and booking took less than two minutes.",
      name: "James Carter",
      role: "Los Angeles, CA",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      text: "I book weekly for client visits. The fleet is spotless, the rates are honest, and the price match actually saved me money.",
      name: "Sophia Nguyen",
      role: "Chicago, IL",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      text: "Airport pickup at midnight was effortless. Support answered on the first ring when I needed a child seat added to the reservation.",
      name: "Daniel Brooks",
      role: "Miami, FL",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
    }
  ];

  const infoCopy = {
    careers: ["Careers", "We are always looking for people who care about keys, cars, and calm pickups. Send a note to hello@anticars.example."],
    press: ["Press", "For interviews, fleet photos, and brand facts, email press@anticars.example. This demo page does not send mail."],
    terms: ["Terms of Service", "Demo terms: reservations on this page are simulated. A real rental would require a valid license, a card hold, and acceptance of the mileage policy shown at checkout."],
    privacy: ["Privacy Policy", "This static demo stores nothing on a server. Details you type into the booking form stay in your browser until you close the dialog."],
    chauffeur: ["Chauffeur", "Need a driver as well as a car? Chauffeur service is listed here as a sample offering and is not booked from this demo."],
    lease: ["Long-Term Lease", "Monthly leases include maintenance and the option to swap vehicles. Use the search bar to start a sample request."]
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }

  function closeNav() {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  navToggle.addEventListener("click", function () {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (link.hasAttribute("data-faq")) return;
      closeNav();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  document.addEventListener("click", function (event) {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || navToggle.contains(event.target)) return;
    closeNav();
  });

  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const observed = navLinks
    .map(function (link) {
      return { link: link, section: document.querySelector(link.getAttribute("href")) };
    })
    .filter(function (item) { return item.section && item.section.id !== "help"; });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) { link.classList.remove("is-current"); });
        const match = observed.find(function (item) { return item.section === entry.target; });
        if (match) match.link.classList.add("is-current");
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 });
    observed.forEach(function (item) { observer.observe(item.section); });
  }

  function applyCars() {
    let visible = 0;
    cards.forEach(function (card) {
      const typeOk = filter === "all" || card.dataset.type === filter;
      const extra = card.classList.contains("is-extra");
      const show = typeOk && (showAll || !extra || filter !== "all");
      card.hidden = !show;
      if (show) visible += 1;
    });
    emptyState.hidden = visible !== 0;
    catButtons.forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.type === filter);
    });
    if (filter === "all" && !showAll) {
      viewAllBtn.textContent = "View All Vehicles";
    } else if (filter !== "all") {
      viewAllBtn.textContent = "View All Vehicles";
    } else {
      viewAllBtn.textContent = "Show Featured";
    }
  }

  function setFilter(next, note) {
    filter = next;
    if (next !== "all") showAll = false;
    applyCars();
    filterNote.textContent = note || "";
  }

  catButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const type = button.dataset.type;
      if (filter === type) {
        setFilter("all", "");
        return;
      }
      const label = button.querySelector(".cat-name").textContent;
      const count = cards.filter(function (card) { return card.dataset.type === type; }).length;
      setFilter(type, "Showing " + label + " · " + count + (count === 1 ? " vehicle" : " vehicles"));
      document.getElementById("vehicles").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.getElementById("view-all-cats").addEventListener("click", function () {
    showAll = true;
    setFilter("all", "Showing the full Anti fleet");
    document.getElementById("vehicles").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  viewAllBtn.addEventListener("click", function () {
    if (filter !== "all") {
      showAll = true;
      setFilter("all", "Showing the full Anti fleet");
      return;
    }
    showAll = !showAll;
    applyCars();
    filterNote.textContent = showAll ? "Showing the full Anti fleet" : "";
  });

  function readSearch() {
    return {
      location: document.getElementById("pickup-location").value,
      pickup: document.getElementById("pickup-date").value,
      dropoff: document.getElementById("return-date").value,
      type: document.getElementById("car-type").value
    };
  }

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = readSearch();
    if (!data.location || !data.pickup || !data.dropoff) {
      searchError.textContent = "Choose a pick-up location, pick-up date, and return date.";
      return;
    }
    if (data.dropoff < data.pickup) {
      searchError.textContent = "Return date must be on or after the pick-up date.";
      return;
    }
    searchError.textContent = "";
    const locLabel = document.getElementById("pickup-location").selectedOptions[0].textContent;
    const typeLabel = data.type
      ? document.getElementById("car-type").selectedOptions[0].textContent
      : "all cars";
    if (data.type) {
      showAll = false;
      setFilter(data.type, typeLabel + " in " + locLabel + " · " + data.pickup + " to " + data.dropoff);
    } else {
      showAll = true;
      setFilter("all", "All cars in " + locLabel + " · " + data.pickup + " to " + data.dropoff);
    }
    document.getElementById("vehicles").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function openBook(carName) {
    bookForm.hidden = false;
    bookSuccess.hidden = true;
    bookError.textContent = "";
    bookForm.reset();
    document.getElementById("book-car").value = carName;
    document.getElementById("book-title").textContent = "Book " + carName;
    const data = readSearch();
    if (data.location) document.getElementById("book-location").value = data.location;
    if (data.pickup) document.getElementById("book-pickup").value = data.pickup;
    if (data.dropoff) document.getElementById("book-return").value = data.dropoff;
    bookDialog.showModal();
  }

  document.querySelectorAll("[data-book]").forEach(function (button) {
    button.addEventListener("click", function () {
      openBook(button.getAttribute("data-book"));
    });
  });

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("book-name").value.trim();
    const email = document.getElementById("book-email").value.trim();
    const pickup = document.getElementById("book-pickup").value;
    const dropoff = document.getElementById("book-return").value;
    const location = document.getElementById("book-location").value;
    if (!name || !email || !pickup || !dropoff || !location) {
      bookError.textContent = "Add your name, email, location, and both dates.";
      return;
    }
    if (dropoff < pickup) {
      bookError.textContent = "Return date must be on or after the pick-up date.";
      return;
    }
    bookError.textContent = "";
    bookForm.hidden = true;
    bookSuccess.hidden = false;
    document.getElementById("success-copy").textContent =
      name.split(" ")[0] + ", your " + document.getElementById("book-car").value + " request is saved in this demo. Nothing was sent to a server.";
  });

  document.getElementById("book-again").addEventListener("click", function () {
    bookDialog.close();
  });

  function bindDialog(dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.querySelectorAll("[data-close]").forEach(function (button) {
      button.addEventListener("click", function () { dialog.close(); });
    });
  }

  [bookDialog, videoDialog, infoDialog, faqDialog].forEach(bindDialog);

  document.getElementById("watch-video").addEventListener("click", function () {
    videoDialog.showModal();
  });

  document.querySelectorAll("[data-faq]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      closeNav();
      faqDialog.showModal();
    });
  });

  document.querySelectorAll("[data-info]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const key = link.getAttribute("data-info");
      const copy = infoCopy[key];
      if (!copy) return;
      document.getElementById("info-title").textContent = copy[0];
      document.getElementById("info-body").textContent = copy[1];
      infoDialog.showModal();
    });
  });

  document.querySelectorAll("[data-store]").forEach(function (button) {
    button.addEventListener("click", function () {
      showToast(button.getAttribute("data-store") + " listing is a demo button.");
    });
  });

  document.querySelectorAll("[data-social]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      showToast(link.getAttribute("data-social") + " is a placeholder link.");
    });
  });

  document.getElementById("copy-code").addEventListener("click", function () {
    const code = document.getElementById("promo-code").textContent.trim();
    function done() { showToast("Code " + code + " copied"); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(done).catch(function () {
        fallbackCopy(code);
        done();
      });
    } else {
      fallbackCopy(code);
      done();
    }
  });

  function fallbackCopy(value) {
    const area = document.createElement("textarea");
    area.value = value;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }

  const quoteText = document.getElementById("quote-text");
  const quoteName = document.getElementById("quote-name");
  const quoteRole = document.getElementById("quote-role");
  const quoteAvatar = document.getElementById("quote-avatar");
  const quoteCard = document.querySelector(".quote-card");
  const dots = Array.from(document.querySelectorAll(".dot"));
  let quoteIndex = 0;
  let quoteTimer = 0;

  function renderQuote(index) {
    const item = quotes[index];
    quoteCard.classList.add("is-fading");
    window.setTimeout(function () {
      quoteText.textContent = item.text;
      quoteName.textContent = item.name;
      quoteRole.textContent = item.role;
      quoteAvatar.src = item.avatar;
      quoteAvatar.alt = "Portrait of " + item.name;
      dots.forEach(function (dot, dotIndex) {
        const active = dotIndex === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
      });
      quoteCard.classList.remove("is-fading");
    }, 180);
  }

  function startQuotes() {
    window.clearInterval(quoteTimer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    quoteTimer = window.setInterval(function () {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      renderQuote(quoteIndex);
    }, 7000);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      quoteIndex = index;
      renderQuote(index);
      startQuotes();
    });
  });

  quoteCard.addEventListener("mouseenter", function () { window.clearInterval(quoteTimer); });
  quoteCard.addEventListener("mouseleave", startQuotes);
  startQuotes();

  document.querySelectorAll("[data-article]").forEach(function (button) {
    button.addEventListener("click", function () {
      const card = button.closest(".blog-card");
      document.getElementById("info-title").textContent = card.querySelector("h3").textContent;
      document.getElementById("info-body").textContent = card.querySelector("p").textContent + " This is a sample article preview for the Anti journal.";
      infoDialog.showModal();
    });
  });

  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.classList.add("img-failed");
    });
  });

  const today = new Date();
  const iso = function (date) {
    const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return copy.toISOString().slice(0, 10);
  };
  const pickupInput = document.getElementById("pickup-date");
  const returnInput = document.getElementById("return-date");
  pickupInput.min = iso(today);
  const later = new Date(today);
  later.setDate(later.getDate() + 3);
  returnInput.min = iso(today);
  pickupInput.addEventListener("change", function () {
    returnInput.min = pickupInput.value || iso(today);
    if (returnInput.value && returnInput.value < returnInput.min) returnInput.value = "";
  });

  applyCars();
})();
