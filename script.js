// Premium static interactions for The Steak Syndicate.

document.addEventListener("DOMContentLoaded", () => {
  // Random hero tagline on each page load.
  const taglines = [
    "Where prime steaks meet bourbon and fire.",
    "Built on prime cuts and Old Fashioneds.",
    "Prime steaks and Old Fashioneds, done right.",
    "Prime Cuts. Bourbon Pours. Syndicate Standards.",
    "Steak on the board. Bourbon in the glass."
  ];

  const taglineElement = document.getElementById("hero-tagline");

  if (taglineElement) {
    let randomIndex = Math.floor(Math.random() * taglines.length);

    try {
      const previousIndex = Number(window.localStorage.getItem("lastTaglineIndex"));

      if (taglines.length > 1 && Number.isInteger(previousIndex) && previousIndex === randomIndex) {
        randomIndex = (randomIndex + 1 + Math.floor(Math.random() * (taglines.length - 1))) % taglines.length;
      }

      window.localStorage.setItem("lastTaglineIndex", String(randomIndex));
    } catch (error) {
      // Ignore storage failures and keep the random tagline.
    }

    taglineElement.textContent = taglines[randomIndex];
    taglineElement.classList.add("is-ready");
  }

  // Lightweight reveal animation for major sections.
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Catalog filtering and sorting.
  const cutsGrid = document.getElementById("cuts-grid");
  const emptyState = document.getElementById("catalog-empty");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const sortSelect = document.getElementById("sort-cuts");
  const cutCards = Array.from(document.querySelectorAll(".cut-card"));

  if (!cutsGrid || !sortSelect || cutCards.length === 0) {
    return;
  }

  let activeFilter = "all";

  const getSortedCards = (cards, sortValue) => {
    const sortedCards = [...cards];

    sortedCards.sort((cardA, cardB) => {
      const priceA = Number(cardA.dataset.price);
      const priceB = Number(cardB.dataset.price);
      const weightA = Number(cardA.dataset.weight);
      const weightB = Number(cardB.dataset.weight);
      const featuredA = Number(cardA.dataset.featured);
      const featuredB = Number(cardB.dataset.featured);

      switch (sortValue) {
        case "price-high":
          return priceB - priceA;
        case "price-low":
          return priceA - priceB;
        case "weight-high":
          return weightB - weightA;
        case "weight-low":
          return weightA - weightB;
        case "featured":
        default:
          return featuredA - featuredB;
      }
    });

    return sortedCards;
  };

  const renderCatalog = () => {
    const filteredCards = cutCards.filter((card) => {
      return activeFilter === "all" || card.dataset.category === activeFilter;
    });

    const sortedCards = getSortedCards(filteredCards, sortSelect.value);

    cutCards.forEach((card) => {
      card.hidden = true;
    });

    sortedCards.forEach((card) => {
      card.hidden = false;
      cutsGrid.appendChild(card);
    });

    if (emptyState) {
      emptyState.hidden = sortedCards.length > 0;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((chip) => {
        const isActive = chip === button;
        chip.classList.toggle("is-active", isActive);
        chip.setAttribute("aria-pressed", String(isActive));
      });

      renderCatalog();
    });
  });

  sortSelect.addEventListener("change", renderCatalog);

  renderCatalog();
});
