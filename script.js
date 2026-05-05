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

    const taglineElements = document.querySelectorAll("[data-rotating-tagline]");

    if (taglineElements.length === 0) {
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

    taglineElements.forEach((taglineElement) => {
      taglineElement.textContent = taglines[randomIndex];
      taglineElement.classList.add("is-ready");
    });
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
    const endpointUrl =
      "https://script.google.com/macros/s/AKfycbxqBdeXH14152rDrPlg-V2mka1Ns0-OoR4ioZiCuFqfkCfTzYhRNHkIODdbTIUYQ9yt/exec";
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
    const submitRequestButton = document.getElementById("submit-request");
    const submissionFeedback = document.getElementById("submission-feedback");
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
      !submitRequestButton ||
      !submissionFeedback ||
      !builderStatus
    ) {
      return;
    }

    const cutCatalog = [
      {
        key: "prime-ribeye",
        name: "Ribeye Steaks",
        category: "Premium Steaks",
        weight: "18.1 lb avg",
        price: "$14.99/lb est",
        portions: "12 to 16 steaks",
        description: "Rich, generously marbled steaks with the kind of deep beef flavor people expect from a steakhouse order.",
        sourceNote: "Cut from prime boneless ribeye.",
        thicknessRelevant: true,
        units: ["steaks", "packs", "shared portion"],
        defaultUnit: "steaks"
      },
      {
        key: "prime-strip-loin",
        name: "New York Strip Steaks",
        category: "Premium Steaks",
        weight: "14.8 lb avg",
        price: "$13.99/lb est",
        portions: "14 to 18 steaks",
        description: "A steakhouse classic with a firm bite, bold beef flavor, and the clean edge people want from a strip steak.",
        sourceNote: "Cut from strip loin.",
        thicknessRelevant: true,
        units: ["steaks", "packs", "shared portion"],
        defaultUnit: "steaks"
      },
      {
        key: "wagyu-filet",
        name: "Filet Mignon",
        category: "Special Occasion",
        weight: "7.2 lb avg",
        price: "$24.19/lb est",
        portions: "14 to 18 filets",
        description: "Tender, smaller-format steaks for the people who want a softer bite and a more refined plate.",
        sourceNote: "Cut from American Wagyu tenderloin.",
        thicknessRelevant: true,
        units: ["filets", "packs", "shared portion"],
        defaultUnit: "filets"
      },
      {
        key: "prime-rib-roast",
        name: "Prime Rib Roast",
        category: "Signature Roast",
        weight: "18.1 lb avg",
        price: "$14.99/lb est",
        portions: "8 to 12 portions",
        description: "A classic center-of-the-table roast with rich marbling and enough presence for a serious dinner.",
        sourceNote: "Prepared from prime boneless ribeye.",
        thicknessRelevant: false,
        units: ["roasts", "shared portion"],
        defaultUnit: "roasts"
      },
      {
        key: "chuck-roll",
        name: "Chuck Roast",
        category: "Practical Roast",
        weight: "25.7 lb avg",
        price: "$6.99/lb est",
        portions: "6 to 8 roasts",
        description: "A dependable braise-and-slow-roast option that keeps the board grounded with something useful and comforting.",
        sourceNote: "Cut from chuck roll.",
        thicknessRelevant: false,
        units: ["roasts", "shared portion"],
        defaultUnit: "roasts"
      },
      {
        key: "pork-chops",
        name: "Pork Chops",
        category: "Pork Favorite",
        weight: "7.7 lb avg",
        price: "$1.99/lb est",
        portions: "12 to 16 chops",
        description: "Easy to portion, quick to cook, and a clean way to add a lighter-priced favorite to the request.",
        sourceNote: "Cut from boneless pork loin.",
        thicknessRelevant: true,
        units: ["chops", "packs", "shared portion"],
        defaultUnit: "chops"
      },
      {
        key: "pork-loin-roast",
        name: "Pork Loin Roast",
        category: "Pork Roast",
        weight: "7.7 lb avg",
        price: "$1.99/lb est",
        portions: "2 to 3 roasts",
        description: "A practical family-style roast that stays approachable on price while still feeling like a real dinner plan.",
        sourceNote: "Prepared from boneless pork loin.",
        thicknessRelevant: false,
        units: ["roasts", "shared portion"],
        defaultUnit: "roasts"
      }
    ];

    const quantityOptions = ["1", "2", "3", "4", "5", "6", "8", "10+"];
    const thicknessOptions = [
      "No preference",
      "Thin - 0.5 inch",
      "Standard - 1 inch",
      "Thick - 1.25 inch"
    ];
    const gradeOptions = ["No strong preference", "Prime", "Choice", "American Wagyu", "Best available fit"];
    const packagingOptions = ["Individually packed", "Packed in pairs", "Organizer discretion"];
    const substitutionOptions = [
      "No substitutions",
      "Same family only",
      "Best available fit",
      "Organizer discretion"
    ];

    const state = {
      currentStep: 1,
      items: [],
      isSubmitting: false
    };

    const setStatus = (message = "", type = "") => {
      builderStatus.textContent = message;
      builderStatus.className = type ? `builder-status is-${type}` : "builder-status";
    };

    const setSubmissionState = (type = "", message = "") => {
      if (!message) {
        submissionFeedback.hidden = true;
        submissionFeedback.className = "submission-feedback";
        submissionFeedback.textContent = "";
        return;
      }

      submissionFeedback.hidden = false;
      submissionFeedback.className = `submission-feedback is-${type}`;
      submissionFeedback.textContent = message;
    };

    const clearTransientFeedback = () => {
      setSubmissionState();
      setStatus("");
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
        quantity: "1",
        quantityUnit: cut.defaultUnit,
        thicknessPreference: cut.thicknessRelevant ? "No preference" : "",
        gradePreference: "No strong preference",
        packagingPreference: "Organizer discretion",
        substitutionFlexibility: "Best available fit",
        splitPrimalWillingness: false,
        itemNotes: ""
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
            item.substitutionFlexibility &&
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
                <span>${cut.portions}</span>
              </div>
              <p>${cut.description}</p>
              <p class="cut-source-note">${cut.sourceNote}</p>
              <button class="button button-secondary button-compact" type="button" data-cut-key="${cut.key}">
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
              <p class="cut-source-note">${cut?.sourceNote || ""}</p>
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
                <label class="form-field">
                  <span>Substitution flexibility</span>
                  <select data-item-id="${item.id}" data-field="substitutionFlexibility">
                    ${optionMarkup(substitutionOptions, item.substitutionFlexibility)}
                  </select>
                </label>
                <label class="checkbox-row checkbox-row-inline form-field-wide">
                  <input type="checkbox" data-item-id="${item.id}" data-field="splitPrimalWillingness" ${
                    item.splitPrimalWillingness ? "checked" : ""
                  } />
                  <span>I am willing to share the larger source cut with someone else if that helps the buy come together.</span>
                </label>
                <label class="form-field form-field-wide">
                  <span>Flexibility notes</span>
                  <textarea data-item-id="${item.id}" data-field="itemNotes" rows="3" placeholder="Examples: open to thicker cuts, prefer prime if possible, cleaner trim preferred">${item.itemNotes}</textarea>
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
                    <span>${item.substitutionFlexibility}</span>
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
      `;
    };

    const syncDerivedUi = () => {
      renderBoardSummary();
      renderSnapshot();
      continueToContactButton.disabled = !isReviewComplete();
      submitRequestButton.disabled = state.isSubmitting;
    };

    const syncUi = () => {
      renderBoardSummary();
      renderReview();
      renderSnapshot();
      continueToContactButton.disabled = !isReviewComplete();
      submitRequestButton.disabled = state.isSubmitting;
    };

    const setStep = (step) => {
      if (step === 2 && !hasBoardItems()) {
        setStatus("Add at least one cut to your board before moving to review.", "error");
        return;
      }

      if (step === 3 && !isReviewComplete()) {
        setStatus("Finish the line-item details in review before moving to contact and pickup.", "error");
        return;
      }

      state.currentStep = step;

      if (!builderStatus.classList.contains("is-success")) {
        setStatus("");
      }

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

      clearTransientFeedback();

      const existingItem = state.items.find((item) => item.cutKey === cutKey);

      if (existingItem) {
        const currentIndex = quantityOptions.indexOf(existingItem.quantity);
        const nextIndex = currentIndex >= 0 ? Math.min(currentIndex + 1, quantityOptions.length - 1) : 0;

        existingItem.quantity = quantityOptions[nextIndex] || existingItem.quantity;
        syncUi();
        setStatus(`${cut.name} is already on your board. Quantity increased to ${existingItem.quantity}.`);
        return;
      }

      state.items.push(createDefaultItem(cut));
      syncUi();
      setStatus(`${cut.name} added to your board.`);
    };

    const removeItem = (itemId) => {
      clearTransientFeedback();
      state.items = state.items.filter((item) => item.id !== itemId);
      syncUi();

      if (state.currentStep > 1 && !hasBoardItems()) {
        setStep(1);
      }
    };

    const buildPayload = () => {
      const formData = new FormData(requestForm);
      const submittedAt = new Date().toISOString();
      const timestamp = Date.now();

      return {
        request_id: `req_${timestamp}`,
        submitted_at: submittedAt,
        requester: {
          full_name: String(formData.get("fullName") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          pickup_area: "North Metro"
        },
        acknowledgments: {
          request_only: Boolean(formData.get("requestOnly")),
          no_payment_collected: Boolean(formData.get("noPayment")),
          local_pickup_only: Boolean(formData.get("pickupOnly")),
          group_demand_required: Boolean(formData.get("groupDemand"))
        },
        items: state.items.map((item) => {
          const cut = getCutByKey(item.cutKey);
          const parsedQuantity = Number.parseInt(item.quantity, 10);

          return {
            cut_type: item.cutName,
            quantity: Number.isNaN(parsedQuantity) ? 10 : parsedQuantity,
            quantity_unit: item.quantityUnit,
            thickness_preference: cut?.thicknessRelevant ? item.thicknessPreference : "",
            grade_preference: item.gradePreference,
            packaging_preference: item.packagingPreference,
            substitution_flexibility: item.substitutionFlexibility,
            split_primal_willingness: Boolean(item.splitPrimalWillingness),
            item_notes: item.itemNotes.trim()
          };
        }),
        general_notes: String(formData.get("generalNotes") || "").trim()
      };
    };

    const resetBuilder = () => {
      state.items = [];
      state.isSubmitting = false;
      requestForm.reset();
      syncUi();
      setStep(1);
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

    const syncReviewField = (target) => {
      const field = target.getAttribute("data-field");
      const itemId = target.getAttribute("data-item-id");

      if (!field || !itemId) {
        return;
      }

      const item = state.items.find((entry) => entry.id === itemId);

      if (!item) {
        return;
      }

      clearTransientFeedback();

      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        item[field] = target.checked;
      } else {
        item[field] = "value" in target ? target.value : "";
      }

      syncDerivedUi();
    };

    reviewList.addEventListener("change", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      syncReviewField(target);
    });

    reviewList.addEventListener("input", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLTextAreaElement)) {
        return;
      }

      syncReviewField(target);
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

      if (state.isSubmitting) {
        return;
      }

      if (!hasBoardItems()) {
        setStep(1);
        return;
      }

      if (!isReviewComplete()) {
        setStep(2);
        return;
      }

      if (!requestForm.reportValidity()) {
        return;
      }

      state.isSubmitting = true;
      submitRequestButton.textContent = "Submitting Request...";
      submitRequestButton.disabled = true;
      setSubmissionState("loading", "Submitting your request to the syndicate board...");
      setStatus("");

      const payload = buildPayload();
      console.info("[Steak Syndicate] Submitting request", {
        endpoint: endpointUrl,
        requestId: payload.request_id,
        itemCount: payload.items.length
      });

      fetch(endpointUrl, {
        method: "POST",
        body: JSON.stringify(payload)
      })
        .then(async (response) => {
          const text = await response.text();
          console.info("[Steak Syndicate] Request endpoint responded", {
            status: response.status,
            ok: response.ok,
            bodyPreview: text.slice(0, 240)
          });

          try {
            return JSON.parse(text);
          } catch {
            throw new Error(text || "Unexpected response from request endpoint.");
          }
        })
        .then((data) => {
          const explicitFailure =
            data?.ok === false ||
            data?.success === false ||
            data?.status === "error";

          if (explicitFailure) {
            throw new Error(data?.message || "The request endpoint returned an error.");
          }

          console.info("[Steak Syndicate] Request submitted successfully", data);
          resetBuilder();
          setSubmissionState(
            "success",
            "Request submitted. Your board has been cleared, and the request has been sent for review."
          );
          setStatus("Request submitted successfully. Your board is clear for a new request.", "success");
        })
        .catch((error) => {
          state.isSubmitting = false;
          submitRequestButton.textContent = "Submit Request";
          submitRequestButton.disabled = false;
          console.error("[Steak Syndicate] Request submission failed", {
            error,
            payload
          });
          setSubmissionState(
            "error",
            "Unable to send the request right now. Please try again in a moment."
          );
          setStatus("Submission failed. Your board is still here, so you can try again.", "error");
        })
        .finally(() => {
          state.isSubmitting = false;
          submitRequestButton.textContent = "Submit Request";
          submitRequestButton.disabled = false;
        });
    });

    requestForm.addEventListener("input", clearTransientFeedback);
    requestForm.addEventListener("change", clearTransientFeedback);

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
