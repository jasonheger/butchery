// Premium static interactions for The Steak Syndicate.

document.addEventListener("DOMContentLoaded", () => {
  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "absolute";
    helper.style.left = "-9999px";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    document.body.removeChild(helper);
  };

  const initTagline = () => {
    const taglines = [
      "Where prime steaks meet bourbon and fire.",
      "Built on prime cuts and Old Fashioneds.",
      "Prime steaks and Old Fashioneds, done right.",
      "Prime Cuts. Bourbon Pours. Syndicate Standards.",
      "Steak on the board. Bourbon in the glass."
    ];

    const taglineElement = document.getElementById("hero-tagline");

    if (!taglineElement) {
      return;
    }

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
  };

  const initReveal = () => {
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
  };

  const initShareBlocks = () => {
    const shareBlocks = document.querySelectorAll("[data-share-block]");

    if (shareBlocks.length === 0) {
      return;
    }

    const pageUrl = window.location.href;
    const shareMessage =
      "The Steak Syndicate is a Twin Cities hobby meat buy for friends. Review the cuts here:";
    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedSms = encodeURIComponent(`${shareMessage} ${pageUrl}`);
    const encodedEmailSubject = encodeURIComponent("The Steak Syndicate | Twin Cities meat buy");
    const encodedEmailBody = encodeURIComponent(`${shareMessage}\n\n${pageUrl}`);

    shareBlocks.forEach((block) => {
      const status = block.querySelector("[data-share-status]");
      const copyButton = block.querySelector('[data-share="copy"]');
      const smsLink = block.querySelector('[data-share="sms"]');
      const emailLink = block.querySelector('[data-share="email"]');
      const facebookLink = block.querySelector('[data-share="facebook"]');

      if (smsLink) {
        smsLink.href = `sms:?&body=${encodedSms}`;
      }

      if (emailLink) {
        emailLink.href = `mailto:?subject=${encodedEmailSubject}&body=${encodedEmailBody}`;
      }

      if (facebookLink) {
        facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      }

      if (!copyButton) {
        return;
      }

      copyButton.addEventListener("click", async () => {
        try {
          await copyText(pageUrl);

          if (status) {
            status.textContent = "Link copied.";
          }
        } catch (error) {
          if (status) {
            status.textContent = "Unable to copy automatically. Copy the page URL instead.";
          }
        }
      });
    });
  };

  const initRequestForm = () => {
    const requestForm = document.getElementById("request-form");
    const requestOutput = document.getElementById("request-output");
    const requestOutputText = document.getElementById("request-output-text");
    const copyRequestButton = document.getElementById("copy-request");

    if (!requestForm || !requestOutput || !requestOutputText || !copyRequestButton) {
      return;
    }

    let latestSummary = "";

    requestForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(requestForm);
      const name = String(formData.get("name") || "").trim();
      const contact = String(formData.get("contact") || "").trim();
      const cuts = String(formData.get("cuts") || "").trim();
      const notes = String(formData.get("notes") || "").trim() || "None provided.";

      latestSummary =
        `Steak Syndicate Request\n\n` +
        `Name: ${name}\n` +
        `Contact: ${contact}\n` +
        `Requested cuts: ${cuts}\n` +
        `Notes: ${notes}\n` +
        `Pickup: Minneapolis-St. Paul local pickup only\n` +
        `Acknowledgement: Request only, not a guaranteed order`;

      requestOutputText.textContent = latestSummary;
      requestOutput.hidden = false;
      copyRequestButton.disabled = false;
    });

    copyRequestButton.addEventListener("click", async () => {
      if (!latestSummary) {
        return;
      }

      const originalLabel = copyRequestButton.textContent;

      try {
        await copyText(latestSummary);
        copyRequestButton.textContent = "Summary Copied";
      } catch (error) {
        copyRequestButton.textContent = "Copy Failed";
      }

      window.setTimeout(() => {
        copyRequestButton.textContent = originalLabel;
      }, 1600);
    });
  };

  const initCatalog = () => {
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
  };

  initTagline();
  initReveal();
  initShareBlocks();
  initRequestForm();
  initCatalog();
});
