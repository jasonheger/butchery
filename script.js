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

  const initRequestBuilder = () => {
    const builderShell = document.getElementById("request-builder-shell");
    const boardCatalog = document.getElementById("board-catalog");
    const boardSummaryList = document.getElementById("board-summary-list");
    const boardEmpty = document.getElementById("board-empty");
    const reviewList = document.getElementById("review-list");
    const reviewEmpty = document.getElementById("review-empty");
    const reviewSnapshot = document.getElementById("review-snapshot");
    const continueToReviewButton = document.getElementById("continue-to-review");
    const continueToContactButton = document.getElementById("continue-to-contact");
    const backToBoardButton = document.getElementById("back-to-board");
    const backToReviewButton = document.getElementById("back-to-review");
    const requestForm = document.getElementById("request-form");
    const requestOutput = document.getElementById("request-output");
    const requestOutputText = document.getElementById("request-output-text");
    const copyRequestButton = document.getElementById("copy-request");
    const builderStatus = document.getElementById("builder-status");

    if (
      !builderShell ||
      !boardCatalog ||
      !boardSummaryList ||
      !boardEmpty ||
      !reviewList ||
      !reviewEmpty ||
      !reviewSnapshot ||
      !continueToReviewButton ||
      !continueToContactButton ||
      !backToBoardButton ||
      !backToReviewButton ||
      !requestForm ||
      !requestOutput ||
      !requestOutputText ||
      !copyRequestButton ||
      !builderStatus
    ) {
      return;
    }

    const cutCatalog = [
      {
        key: "prime-ribeye",
        name: "Prime Ribeye",
        category: "Steakhouse Favorite",
        weight: "18.1 lb avg",
        price: "$14.99/lb est",
        description: "Rich, heavily marbled ribeye built for cast iron, open fire, and serious steak nights.",
        thicknessRelevant: true,
        units: ["steaks", "shared portion", "whole piece"],
        defaultUnit: "steaks"
      },
      {
        key: "prime-strip-loin",
        name: "Prime Strip Loin",
        category: "Steakhouse Favorite",
        weight: "14.8 lb avg",
        price: "$13.99/lb est",
        description: "Prime strip loin for thick New York strips with clean steakhouse structure and great crust.",
        thicknessRelevant: true,
        units: ["steaks", "shared portion", "whole piece"],
        defaultUnit: "steaks"
      },
      {
        key: "choice-strip-loin",
        name: "Choice Strip Loin",
        category: "Steakhouse Value",
        weight: "18.3 lb avg",
        price: "$11.99/lb est",
        description: "A more budget-friendly strip loin option when the group wants volume without losing the format.",
        thicknessRelevant: true,
        units: ["steaks", "shared portion", "whole piece"],
        defaultUnit: "steaks"
      },
      {
        key: "wagyu-tenderloin",
        name: "Whole American Wagyu Tenderloin",
        category: "Luxury Pour",
        weight: "7.2 lb avg",
        price: "$24.19/lb est",
        description: "A premium centerpiece cut for filet-heavy requests and smaller luxury group buys.",
        thicknessRelevant: true,
        units: ["steaks", "whole piece", "shared portion"],
        defaultUnit: "steaks"
      },
      {
        key: "whole-prime-brisket",
        name: "Whole Prime Brisket",
        category: "Low and Slow",
        weight: "23.4 lb avg",
        price: "$5.99/lb est",
        description: "Prime brisket for smoking or braising when the request is built around a long cook.",
        thicknessRelevant: false,
        units: ["whole piece", "shared portion"],
        defaultUnit: "whole piece"
      },
      {
        key: "whole-choice-brisket",
        name: "Whole Choice Brisket",
        category: "Barbecue Staple",
        weight: "14.3 lb avg",
        price: "$5.89/lb est",
        description: "A value-minded brisket request that still makes sense for serious barbecue plans.",
        thicknessRelevant: false,
        units: ["whole piece", "shared portion"],
        defaultUnit: "whole piece"
      },
      {
        key: "chuck-roll",
        name: "Chuck Roll",
        category: "Versatile Workhorse",
        weight: "25.7 lb avg",
        price: "$6.99/lb est",
        description: "A flexible cut for roast-heavy or steak-heavy breakdowns depending on how the group wants it portioned.",
        thicknessRelevant: false,
        units: ["roasts", "shared portion", "whole piece"],
        defaultUnit: "roasts"
      },
      {
        key: "pork-belly",
        name: "Pork Belly",
        category: "Smokehouse Favorite",
        weight: "11.8 lb avg",
        price: "$3.99/lb est",
        description: "Built for bacon, slabs, braises, and richer smokehouse projects.",
        thicknessRelevant: false,
        units: ["slabs", "shared portion", "whole piece"],
        defaultUnit: "slabs"
      },
      {
        key: "pork-chops",
        name: "Pork Chops",
        category: "Weeknight Utility",
        weight: "7.7 lb avg",
        price: "$1.99/lb est",
        description: "A chop-forward pork request when the group wants an easy, flexible add-on to the board.",
        thicknessRelevant: true,
        units: ["chops", "packs", "shared portion"],
        defaultUnit: "chops"
      }
    ];

    const quantityOptions = ["1", "2", "3", "4", "5", "6", "8", "10+"];
    const thicknessOptions = ["No preference", "1 inch", "1.25 inches", "1.5 inches", "1.75 inches", "2 inches"];
    const gradeOptions = ["No strong preference", "Prime", "Choice", "American Wagyu", "Best available fit"];
    const packagingOptions = ["Individually packed", "Packed in pairs", "Keep whole if possible", "Organizer discretion"];

    const state = {
      currentStep: 1,
      items: [],
      preparedPayload: null
    };

    const resetPreparedPayload = () => {
      state.preparedPayload = null;
      requestOutput.hidden = true;
      copyRequestButton.disabled = true;
    };

    const setStatus = (message = "") => {
      builderStatus.textContent = message;
    };

    const makeId = () => `item-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

    const getCutByKey = (key) => {
      return cutCatalog.find((cut) => cut.key === key);
    };

    const createDefaultItem = (cut) => {
      return {
        id: makeId(),
        cutKey: cut.key,
        cutName: cut.name,
        quantity: "2",
        quantityUnit: cut.defaultUnit,
        thicknessPreference: cut.thicknessRelevant ? "No preference" : "",
        gradePreference: "No strong preference",
        packagingPreference: "Organizer discretion",
        flexibilityNotes: ""
      };
    };

    const hasBoardItems = () => state.items.length > 0;

    const isReviewComplete = () => {
      return (
        hasBoardItems() &&
        state.items.every((item) => {
          const cut = getCutByKey(item.cutKey);

          return (
            item.cutKey &&
            item.quantity &&
            item.quantityUnit &&
            item.gradePreference &&
            item.packagingPreference &&
            (!cut?.thicknessRelevant || item.thicknessPreference)
          );
        })
      );
    };

    const optionMarkup = (options, selectedValue) => {
      return options
        .map((option) => {
          const selected = option === selectedValue ? " selected" : "";
          return `<option value="${option}"${selected}>${option}</option>`;
        })
        .join("");
    };

    const renderCatalog = () => {
      boardCatalog.innerHTML = cutCatalog
        .map((cut) => {
          return `
            <article class="board-card">
              <p class="cut-type">${cut.category}</p>
              <h3>${cut.name}</h3>
              <div class="board-card-meta">
                <span>${cut.weight}</span>
                <span>${cut.price}</span>
              </div>
              <p>${cut.description}</p>
              <button class="button button-secondary button-compact add-to-request" type="button" data-cut-key="${cut.key}">
                Add to Request
              </button>
            </article>
          `;
        })
        .join("");
    };

    const renderBoardSummary = () => {
      boardSummaryList.innerHTML = state.items
        .map((item) => {
          return `
            <article class="board-summary-item">
              <div>
                <strong>${item.cutName}</strong>
                <span>${item.quantity} ${item.quantityUnit}</span>
              </div>
              <button class="board-summary-remove" type="button" data-remove-id="${item.id}">Remove</button>
            </article>
          `;
        })
        .join("");

      boardEmpty.hidden = hasBoardItems();
      continueToReviewButton.disabled = !hasBoardItems();
    };

    const renderReview = () => {
      if (!hasBoardItems()) {
        reviewList.innerHTML = "";
        reviewEmpty.hidden = false;
        return;
      }

      reviewEmpty.hidden = true;

      reviewList.innerHTML = state.items
        .map((item, index) => {
          const cut = getCutByKey(item.cutKey);
          const thicknessField = cut?.thicknessRelevant
            ? `
              <label class="form-field">
                <span>Thickness preference</span>
                <select data-item-id="${item.id}" data-field="thicknessPreference">
                  ${optionMarkup(thicknessOptions, item.thicknessPreference || "No preference")}
                </select>
              </label>
            `
            : "";

          return `
            <article class="review-card">
              <div class="review-card-topline">
                <div>
                  <p class="request-output-label">Line Item ${index + 1}</p>
                  <h3>${item.cutName}</h3>
                </div>
                <button class="cut-request-remove" type="button" data-remove-id="${item.id}">Remove</button>
              </div>
              <p class="review-card-copy">${cut?.description || ""}</p>
              <div class="form-grid review-card-grid">
                <label class="form-field">
                  <span>Quantity</span>
                  <select data-item-id="${item.id}" data-field="quantity">
                    ${optionMarkup(quantityOptions, item.quantity)}
                  </select>
                </label>
                <label class="form-field">
                  <span>Quantity unit</span>
                  <select data-item-id="${item.id}" data-field="quantityUnit">
                    ${optionMarkup(cut?.units || ["shared portion"], item.quantityUnit)}
                  </select>
                </label>
                ${thicknessField}
                <label class="form-field">
                  <span>Grade preference</span>
                  <select data-item-id="${item.id}" data-field="gradePreference">
                    ${optionMarkup(gradeOptions, item.gradePreference)}
                  </select>
                </label>
                <label class="form-field">
                  <span>Packaging preference</span>
                  <select data-item-id="${item.id}" data-field="packagingPreference">
                    ${optionMarkup(packagingOptions, item.packagingPreference)}
                  </select>
                </label>
                <label class="form-field form-field-wide">
                  <span>Flexibility or substitution notes</span>
                  <textarea data-item-id="${item.id}" data-field="flexibilityNotes" rows="3" placeholder="Examples: fine with choice instead of prime, open to thicker cuts, would split with someone else">${item.flexibilityNotes}</textarea>
                </label>
              </div>
            </article>
          `;
        })
        .join("");
    };

    const renderSnapshot = () => {
      reviewSnapshot.innerHTML = `
        <p class="request-output-label">Review Snapshot</p>
        <div class="board-summary-list">
          ${state.items
            .map((item) => {
              const cut = getCutByKey(item.cutKey);
              const thicknessLine = cut?.thicknessRelevant ? `<span>${item.thicknessPreference || "No preference"}</span>` : "";

              return `
                <article class="board-summary-item is-static">
                  <div>
                    <strong>${item.cutName}</strong>
                    <span>${item.quantity} ${item.quantityUnit}</span>
                    ${thicknessLine}
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
      `;
    };

    const syncUi = () => {
      resetPreparedPayload();
      renderBoardSummary();
      renderReview();
      renderSnapshot();
      continueToContactButton.disabled = !isReviewComplete();
    };

    const setStep = (step) => {
      if (step === 2 && !hasBoardItems()) {
        setStatus("Add at least one cut to your board before moving to review.");
        return;
      }

      if (step === 3 && !isReviewComplete()) {
        setStatus("Finish the line-item details in review before moving to contact and pickup.");
        return;
      }

      state.currentStep = step;
      setStatus("");

      const panels = builderShell.querySelectorAll("[data-step-panel]");
      const steps = builderShell.querySelectorAll("[data-step-nav]");

      panels.forEach((panel) => {
        const isActive = Number(panel.dataset.stepPanel) === step;
        panel.hidden = !isActive;
        panel.classList.toggle("is-active", isActive);
      });

      steps.forEach((button) => {
        const buttonStep = Number(button.dataset.stepNav);
        button.classList.toggle("is-active", buttonStep === step);
        button.classList.toggle("is-complete", buttonStep < step);
      });
    };

    const addToRequest = (cutKey) => {
      const cut = getCutByKey(cutKey);

      if (!cut) {
        return;
      }

      state.items.push(createDefaultItem(cut));
      syncUi();
      setStatus(`${cut.name} added to your board.`);
    };

    const removeItem = (itemId) => {
      state.items = state.items.filter((item) => item.id !== itemId);
      syncUi();

      if (state.currentStep > 1 && !hasBoardItems()) {
        setStep(1);
      }
    };

    const buildPayload = () => {
      const formData = new FormData(requestForm);

      return {
        requestType: "local_hobby_group_buy_request",
        market: "Twin Cities",
        noPaymentCollectedOnSite: true,
        submittedAt: new Date().toISOString(),
        contact: {
          fullName: String(formData.get("fullName") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          pickupArea: String(formData.get("pickupArea") || "").trim()
        },
        acknowledgements: {
          requestOnly: Boolean(formData.get("requestOnly")),
          pickupOnly: Boolean(formData.get("pickupOnly")),
          noPaymentCollected: Boolean(formData.get("noPayment"))
        },
        items: state.items.map((item) => {
          const cut = getCutByKey(item.cutKey);

          return {
            cutKey: item.cutKey,
            cutType: item.cutName,
            quantity: item.quantity,
            quantityUnit: item.quantityUnit,
            thicknessPreference: cut?.thicknessRelevant ? item.thicknessPreference : null,
            gradePreference: item.gradePreference,
            packagingPreference: item.packagingPreference,
            flexibilityNotes: item.flexibilityNotes.trim(),
            thicknessRelevant: Boolean(cut?.thicknessRelevant)
          };
        })
      };
    };

    boardCatalog.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const addButton = target.closest("[data-cut-key]");

      if (!addButton) {
        return;
      }

      addToRequest(addButton.getAttribute("data-cut-key") || "");
    });

    boardSummaryList.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const removeButton = target.closest("[data-remove-id]");

      if (!removeButton) {
        return;
      }

      removeItem(removeButton.getAttribute("data-remove-id") || "");
    });

    reviewList.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const removeButton = target.closest("[data-remove-id]");

      if (!removeButton) {
        return;
      }

      removeItem(removeButton.getAttribute("data-remove-id") || "");
    });

    reviewList.addEventListener("input", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const field = target.getAttribute("data-field");
      const itemId = target.getAttribute("data-item-id");

      if (!field || !itemId) {
        return;
      }

      const item = state.items.find((entry) => entry.id === itemId);

      if (!item) {
        return;
      }

      item[field] = "value" in target ? target.value : "";
      syncUi();
    });

    builderShell.querySelectorAll("[data-step-nav]").forEach((button) => {
      button.addEventListener("click", () => {
        setStep(Number(button.getAttribute("data-step-nav")));
      });
    });

    continueToReviewButton.addEventListener("click", () => setStep(2));
    continueToContactButton.addEventListener("click", () => setStep(3));
    backToBoardButton.addEventListener("click", () => setStep(1));
    backToReviewButton.addEventListener("click", () => setStep(2));

    requestForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!isReviewComplete()) {
        setStep(2);
        return;
      }

      const payload = buildPayload();
      state.preparedPayload = payload;
      window.requestPayloadPreview = payload;

      requestOutputText.textContent = JSON.stringify(payload, null, 2);
      requestOutput.hidden = false;
      copyRequestButton.disabled = false;
      setStatus("Structured request payload prepared.");
    });

    requestForm.addEventListener("input", () => {
      resetPreparedPayload();
    });

    copyRequestButton.addEventListener("click", async () => {
      if (!state.preparedPayload) {
        return;
      }

      const originalLabel = copyRequestButton.textContent;

      try {
        await copyText(JSON.stringify(state.preparedPayload, null, 2));
        copyRequestButton.textContent = "Request Copied";
      } catch (error) {
        copyRequestButton.textContent = "Copy Failed";
      }

      window.setTimeout(() => {
        copyRequestButton.textContent = originalLabel;
      }, 1600);
    });

    renderCatalog();
    syncUi();
    setStep(1);
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
  initRequestBuilder();
  initCatalog();
});
