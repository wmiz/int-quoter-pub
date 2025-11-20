/**
 * Frontier Quote Theme App Extension
 * Replaces checkout buttons with "Get a Quote" flow for configured regions
 */

(function () {
  "use strict";

  // Log asset load for diagnostics
  console.info("Frontier Quote: asset loaded", {
    time: new Date().toISOString(),
    shop: window.Shopify?.shop || "",
  });

  // Configuration - will be fetched from app settings
  const FRONTIERQUOTE_CONFIG = {
    shopDomain: window.Shopify?.shop || "",
    enabled: true,
    popupFields: null, // Will be populated from settings API
  };

  // Get country from URL parameter (for testing)
  function getCountryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("fq_country") || null;
  }

  // Check if user's country matches configured regions
  async function shouldShowQuoteButton() {
    try {
      // Try to get country from URL parameter first (for testing),
      // then from Shopify's request object (if available via Liquid),
      // then from window variable, then detect via IP
      const userCountry =
        getCountryFromUrl() ||
        document.body.dataset.country ||
        window.frontierQuoteCountry ||
        (await detectCountryFromShopify()) ||
        (await detectCountry());

      if (!userCountry) {
        return false; // Fallback: show normal checkout
      }

      // Get shop domain from Shopify global or construct from current domain
      const shopDomain =
        window.Shopify?.shop ||
        (window.location.hostname.includes(".myshopify.com")
          ? window.location.hostname
          : null);

      if (!shopDomain) {
        console.warn("Frontier Quote: Could not determine shop domain");
        return false;
      }

      // Use relative path for app proxy
      // The app proxy is configured to route /apps/frontier-quote/* to our app server
      // This works on the storefront domain (e.g., shop.myshopify.com/apps/frontier-quote/settings)
      const apiUrl = "/apps/frontier-quote/settings";

      // Send country_code to API endpoint
      const response = await fetch(
        `${apiUrl}?country_code=${encodeURIComponent(userCountry)}&shop=${encodeURIComponent(shopDomain)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Frontier Quote: API request failed",
          response.status,
          response.statusText
        );
        return false;
      }

      const settings = await response.json();

      // Store popup fields configuration for later use
      if (settings.popupFields) {
        FRONTIERQUOTE_CONFIG.popupFields = settings.popupFields;
      }

      return settings.shouldShowQuote;
    } catch (error) {
      console.error("Frontier Quote: Error checking region:", error);
      return false; // Fail gracefully - show normal checkout
    }
  }

  // Detect user's country from Shopify storefront endpoint
  async function detectCountryFromShopify() {
    try {
      const response = await fetch("/browsing_context_suggestions.json", {
        credentials: "same-origin",
      });
      if (!response.ok) return null;

      const data = await response.json();
      const handle = data?.detected_values?.country?.handle;
      if (handle && typeof handle === "string") {
        return handle.toUpperCase();
      }
    } catch (error) {
      console.error("Frontier Quote: Shopify country detection failed:", error);
    }
    return null;
  }

  // Detect user's country via IP geolocation (fallback)
  async function detectCountry() {
    try {
      // Check localStorage cache first (24h TTL)
      const cached = localStorage.getItem("frontierquote_country");
      const cachedTime = localStorage.getItem("frontierquote_country_time");
      if (
        cached &&
        cachedTime &&
        Date.now() - parseInt(cachedTime) < 86400000
      ) {
        return cached;
      }

      // Use a free IP geolocation service as fallback
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) return null;

      const data = await response.json();
      const country = data.country_code;

      if (country) {
        localStorage.setItem("frontierquote_country", country);
        localStorage.setItem(
          "frontierquote_country_time",
          Date.now().toString()
        );
        return country;
      }
    } catch (error) {
      console.error("Frontier Quote: Country detection failed:", error);
    }
    return null;
  }

  // Get cart data from Shopify
  async function getCartData() {
    try {
      const response = await fetch("/cart.js");
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      return await response.json();
    } catch (error) {
      console.error("Frontier Quote: Error fetching cart:", error);
      return null;
    }
  }

  // Create and show quote modal
  async function showQuoteModal() {
    // Check if modal already exists
    let modal = document.getElementById("frontier-quote-modal");
    if (modal) {
      modal.classList.add("active");
      return;
    }

    // Get cart data first
    const cartData = await getCartData();
    if (!cartData) {
      alert("Unable to load cart. Please try again.");
      return;
    }

    // Get popup fields configuration
    const popupFields = FRONTIERQUOTE_CONFIG.popupFields || {
      name: { enabled: true, required: true },
      email: { enabled: true, required: true },
      phone: { enabled: false, required: false },
      company: { enabled: false, required: false },
      notes: { enabled: false, required: false },
    };

    // Create modal HTML
    modal = document.createElement("div");
    modal.id = "frontier-quote-modal";
    modal.className = "frontier-quote-modal";

    const modalContent = document.createElement("div");
    modalContent.className = "frontier-quote-modal-content";

    // Left Column - Form
    const formColumn = document.createElement("div");
    formColumn.className = "frontier-quote-form-column";

    // Header
    const header = document.createElement("div");
    header.className = "frontier-quote-header";

    const title = document.createElement("h1");
    title.textContent = "Request a Quote";

    const closeBtn = document.createElement("button");
    closeBtn.className = "frontier-quote-modal-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.onclick = () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    };

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Form
    const form = document.createElement("form");
    form.id = "frontier-quote-form";

    // Contact Section
    const contactSection = document.createElement("div");
    contactSection.className = "frontier-quote-section";

    const contactTitle = document.createElement("div");
    contactTitle.className = "frontier-quote-section-title";
    contactTitle.textContent = "Contact";

    contactSection.appendChild(contactTitle);

    // Email field (always enabled and required)
    if (popupFields.email?.enabled) {
      const emailGroup = createFormGroup(
        "email",
        "Email",
        "email",
        popupFields.email.required,
        "Email or mobile phone number"
      );
      contactSection.appendChild(emailGroup);
    }

    form.appendChild(contactSection);

    // Delivery/Shipping Section
    const deliverySection = document.createElement("div");
    deliverySection.className = "frontier-quote-section";

    const deliveryTitle = document.createElement("div");
    deliveryTitle.className = "frontier-quote-section-title";
    deliveryTitle.textContent = "Delivery";

    deliverySection.appendChild(deliveryTitle);

    // Country - Full width at the top
    const countryGroup = document.createElement("div");
    countryGroup.className = "frontier-quote-form-group required";

    const countrySelect = document.createElement("select");
    countrySelect.id = "frontier-quote-country";
    countrySelect.name = "country";
    countrySelect.required = true;

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Country/Region";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    countrySelect.appendChild(placeholderOption);

    // Add common countries (you can expand this list)
    const countries = [
      { code: "US", name: "United States" },
      { code: "CA", name: "Canada" },
      { code: "GB", name: "United Kingdom" },
      { code: "AU", name: "Australia" },
      { code: "DE", name: "Germany" },
      { code: "FR", name: "France" },
      { code: "IT", name: "Italy" },
      { code: "ES", name: "Spain" },
      { code: "NL", name: "Netherlands" },
      { code: "BE", name: "Belgium" },
      { code: "CH", name: "Switzerland" },
      { code: "AT", name: "Austria" },
      { code: "SE", name: "Sweden" },
      { code: "NO", name: "Norway" },
      { code: "DK", name: "Denmark" },
      { code: "FI", name: "Finland" },
      { code: "PL", name: "Poland" },
      { code: "CZ", name: "Czech Republic" },
      { code: "IE", name: "Ireland" },
      { code: "PT", name: "Portugal" },
      { code: "GR", name: "Greece" },
      { code: "JP", name: "Japan" },
      { code: "CN", name: "China" },
      { code: "IN", name: "India" },
      { code: "BR", name: "Brazil" },
      { code: "MX", name: "Mexico" },
      { code: "AR", name: "Argentina" },
      { code: "ZA", name: "South Africa" },
      { code: "NZ", name: "New Zealand" },
      { code: "SG", name: "Singapore" },
      { code: "HK", name: "Hong Kong" },
      { code: "AE", name: "United Arab Emirates" },
      { code: "SA", name: "Saudi Arabia" },
      { code: "IL", name: "Israel" },
      { code: "TR", name: "Turkey" },
      { code: "RU", name: "Russia" },
      { code: "KR", name: "South Korea" },
      { code: "TH", name: "Thailand" },
      { code: "MY", name: "Malaysia" },
      { code: "ID", name: "Indonesia" },
      { code: "PH", name: "Philippines" },
      { code: "VN", name: "Vietnam" },
    ];

    // Try to detect user's country and set as default
    const detectedCountry =
      getCountryFromUrl() ||
      document.body.dataset.country ||
      window.frontierQuoteCountry ||
      null;

    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.code;
      option.textContent = country.name;
      if (detectedCountry && country.code === detectedCountry.toUpperCase()) {
        option.selected = true;
        placeholderOption.selected = false;
      }
      countrySelect.appendChild(option);
    });

    countryGroup.appendChild(countrySelect);
    deliverySection.appendChild(countryGroup);

    // Name fields - split into first/last
    if (popupFields.name?.enabled) {
      const nameRow = document.createElement("div");
      nameRow.className = "frontier-quote-form-row";

      const firstNameGroup = createFormGroup(
        "first_name",
        "First name",
        "text",
        false, // Optional in Shopify checkout
        "First name (optional)"
      );
      const lastNameGroup = createFormGroup(
        "last_name",
        "Last name",
        "text",
        true,
        "Last name"
      );

      nameRow.appendChild(firstNameGroup);
      nameRow.appendChild(lastNameGroup);
      deliverySection.appendChild(nameRow);
    }

    // Company field (optional)
    if (popupFields.company?.enabled) {
      const companyGroup = createFormGroup(
        "company",
        "Company",
        "text",
        popupFields.company.required
      );
      deliverySection.appendChild(companyGroup);
    }

    // Address Line 1 (required)
    const address1Group = createFormGroup(
      "address1",
      "Address",
      "text",
      true,
      "Address"
    );
    deliverySection.appendChild(address1Group);

    // Address Line 2 (optional - apartment, suite, etc.)
    const address2Group = createFormGroup(
      "address2",
      "Apartment, suite, etc.",
      "text",
      false,
      "Apartment, suite, etc. (optional)"
    );
    deliverySection.appendChild(address2Group);

    // City, State/Province, ZIP row
    const cityStateZipRow = document.createElement("div");
    cityStateZipRow.className = "frontier-quote-form-row";

    // City
    const cityGroup = createFormGroup("city", "City", "text", true, "City");
    cityStateZipRow.appendChild(cityGroup);

    // State/Province
    const provinceGroup = createFormGroup(
      "province",
      "State",
      "text",
      true,
      "State"
    );
    cityStateZipRow.appendChild(provinceGroup);

    deliverySection.appendChild(cityStateZipRow);

    // ZIP/Postal Code - Full width
    const zipGroup = createFormGroup(
      "zip",
      "ZIP code",
      "text",
      true,
      "ZIP code"
    );
    deliverySection.appendChild(zipGroup);

    // Phone field (optional)
    if (popupFields.phone?.enabled) {
      const phoneGroup = createFormGroup(
        "phone",
        "Phone",
        "tel",
        popupFields.phone.required
      );
      deliverySection.appendChild(phoneGroup);
    }

    // Notes field (optional, textarea)
    if (popupFields.notes?.enabled) {
      const notesGroup = document.createElement("div");
      notesGroup.className = "frontier-quote-form-group";
      if (popupFields.notes.required) {
        notesGroup.classList.add("required");
      }

      const notesTextarea = document.createElement("textarea");
      notesTextarea.id = "frontier-quote-notes";
      notesTextarea.name = "notes";
      notesTextarea.placeholder = popupFields.notes.required
        ? "Additional notes *"
        : "Additional notes (optional)";
      if (popupFields.notes.required) {
        notesTextarea.required = true;
      }

      notesGroup.appendChild(notesTextarea);
      deliverySection.appendChild(notesGroup);
    }

    form.appendChild(deliverySection);

    // Error message container
    const errorMsg = document.createElement("div");
    errorMsg.id = "frontier-quote-error";
    errorMsg.className = "frontier-quote-message frontier-quote-error";
    errorMsg.style.display = "none";
    form.appendChild(errorMsg);

    // Success message container
    const successMsg = document.createElement("div");
    successMsg.id = "frontier-quote-success";
    successMsg.className = "frontier-quote-message frontier-quote-success";
    successMsg.style.display = "none";
    form.appendChild(successMsg);

    // Submit button
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "frontier-quote-button";
    submitBtn.textContent = "Request Quote";
    form.appendChild(submitBtn);

    // Form submission handler
    form.onsubmit = async (e) => {
      e.preventDefault();
      await handleQuoteSubmission(
        form,
        errorMsg,
        successMsg,
        submitBtn,
        cartData
      );
    };

    // Assemble left column
    formColumn.appendChild(header);
    formColumn.appendChild(form);

    // Right Column - Order Summary
    const summaryColumn = document.createElement("div");
    summaryColumn.className = "frontier-quote-summary-column";

    // Cart items
    const cartItemsContainer = document.createElement("div");
    cartData.items.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "frontier-quote-cart-item";

      // Image container with badge
      const imageContainer = document.createElement("div");
      imageContainer.className = "frontier-quote-cart-item-image-container";

      // Image
      const image = document.createElement("img");
      image.className = "frontier-quote-cart-item-image";
      // Shopify cart.js returns image URLs that need to be formatted
      if (item.image) {
        // Convert to proper image URL format (remove size parameters, use _small or _compact)
        const imageUrl =
          item.image.replace(/\?.*$/, "") + "?width=120&height=120&crop=center";
        image.src = imageUrl;
      }
      image.alt = item.product_title || item.title || "";
      image.onerror = () => {
        image.style.display = "none";
      };

      // Quantity badge
      const quantityBadge = document.createElement("div");
      quantityBadge.className = "frontier-quote-cart-item-badge";
      quantityBadge.textContent = item.quantity || 1;

      imageContainer.appendChild(image);
      imageContainer.appendChild(quantityBadge);

      // Details
      const details = document.createElement("div");
      details.className = "frontier-quote-cart-item-details";

      const name = document.createElement("div");
      name.className = "frontier-quote-cart-item-name";
      name.textContent = item.product_title || item.title;

      const variant = document.createElement("div");
      variant.className = "frontier-quote-cart-item-variant";
      if (item.variant_title && item.variant_title !== "Default Title") {
        variant.textContent = item.variant_title;
      }

      details.appendChild(name);
      if (item.variant_title && item.variant_title !== "Default Title") {
        details.appendChild(variant);
      }

      // Price
      const price = document.createElement("div");
      price.className = "frontier-quote-cart-item-price";
      const itemTotal = (item.line_price || item.price * item.quantity) / 100;
      price.textContent = formatMoney(itemTotal);

      cartItem.appendChild(imageContainer);
      cartItem.appendChild(details);
      cartItem.appendChild(price);
      cartItemsContainer.appendChild(cartItem);
    });

    summaryColumn.appendChild(cartItemsContainer);

    // Totals
    const totalsContainer = document.createElement("div");
    totalsContainer.className = "frontier-quote-summary-totals";

    const subtotalRow = document.createElement("div");
    subtotalRow.className = "frontier-quote-summary-row";
    const subtotalLabel = document.createElement("span");
    subtotalLabel.className = "frontier-quote-summary-row-label";
    subtotalLabel.textContent = "Subtotal";
    const subtotalValue = document.createElement("span");
    subtotalValue.className = "frontier-quote-summary-row-value";
    subtotalValue.textContent = formatMoney(cartData.total_price / 100);
    subtotalRow.appendChild(subtotalLabel);
    subtotalRow.appendChild(subtotalValue);
    totalsContainer.appendChild(subtotalRow);

    const shippingRow = document.createElement("div");
    shippingRow.className = "frontier-quote-summary-row";
    const shippingLabel = document.createElement("span");
    shippingLabel.className = "frontier-quote-summary-row-label";
    shippingLabel.textContent = "Shipping";
    const shippingValue = document.createElement("span");
    shippingValue.className = "frontier-quote-summary-row-value";
    shippingValue.textContent = "Calculated after quote";
    shippingRow.appendChild(shippingLabel);
    shippingRow.appendChild(shippingValue);
    totalsContainer.appendChild(shippingRow);

    const totalRow = document.createElement("div");
    totalRow.className = "frontier-quote-summary-row total";
    const totalLabel = document.createElement("span");
    totalLabel.className = "frontier-quote-summary-row-label";
    totalLabel.textContent = "Total";
    const totalValue = document.createElement("span");
    totalValue.className = "frontier-quote-summary-row-value";
    totalValue.textContent = formatMoney(cartData.total_price / 100);
    totalRow.appendChild(totalLabel);
    totalRow.appendChild(totalValue);
    totalsContainer.appendChild(totalRow);

    summaryColumn.appendChild(totalsContainer);

    // Assemble modal
    modalContent.appendChild(formColumn);
    modalContent.appendChild(summaryColumn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Show modal
    modal.classList.add("active");

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Close on backdrop click
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    };
  }

  // Helper function to format money
  function formatMoney(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  // Helper function to create form group
  function createFormGroup(name, label, type, required, placeholder = null) {
    const group = document.createElement("div");
    group.className = "frontier-quote-form-group";
    if (required) {
      group.classList.add("required");
    }

    const input = document.createElement("input");
    input.type = type;
    input.id = `frontier-quote-${name}`;
    input.name = name;
    input.required = required || false;

    // Set placeholder if provided
    if (placeholder) {
      input.placeholder = placeholder;
    }

    group.appendChild(input);

    return group;
  }

  // Handle quote form submission
  async function handleQuoteSubmission(
    form,
    errorMsg,
    successMsg,
    submitBtn,
    cartData
  ) {
    // Hide previous messages
    errorMsg.style.display = "none";
    successMsg.style.display = "none";

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      // Get form data
      const formData = new FormData(form);
      const formObject = {};
      for (const [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      // Combine first_name and last_name into name if both exist
      if (formObject.first_name || formObject.last_name) {
        formObject.name =
          `${formObject.first_name || ""} ${formObject.last_name || ""}`.trim();
      }

      // Map address fields to shipping_address format for draft order
      if (formObject.address1) {
        formObject.shipping_address1 = formObject.address1;
      }
      if (formObject.address2) {
        formObject.shipping_address2 = formObject.address2;
      }
      if (formObject.city) {
        formObject.shipping_city = formObject.city;
      }
      if (formObject.province) {
        formObject.shipping_province = formObject.province;
      }
      if (formObject.country) {
        formObject.shipping_country = formObject.country;
      }
      if (formObject.zip) {
        formObject.shipping_zip = formObject.zip;
      }

      // Get shop domain
      const shopDomain =
        window.Shopify?.shop ||
        (window.location.hostname.includes(".myshopify.com")
          ? window.location.hostname
          : null);

      if (!shopDomain) {
        throw new Error("Could not determine shop domain");
      }

      // Prepare payload
      const payload = {
        ...formObject,
        cart: JSON.stringify(cartData),
        cart_line_items: JSON.stringify(
          cartData.items.map((item) => ({
            variantId: item.variant_id
              ? `gid://shopify/ProductVariant/${item.variant_id}`
              : null,
            quantity: item.quantity,
            title: item.title,
            price: item.price,
          }))
        ),
        cart_total: cartData.total_price,
      };

      // Submit to quote endpoint
      const response = await fetch(
        `/apps/frontier-quote/quote?shop=${encodeURIComponent(shopDomain)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(
            Object.entries(payload).map(([key, value]) => [
              `quote[${key}]`,
              value,
            ])
          ),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed: ${response.statusText}`
        );
      }

      const result = await response.json();

      // Show success message
      successMsg.textContent =
        result.message ||
        "Thank you! Your quote request has been submitted. We'll be in touch soon.";
      successMsg.style.display = "block";

      // Reset form
      form.reset();

      // Close modal after 3 seconds
      setTimeout(() => {
        const modal = document.getElementById("frontier-quote-modal");
        if (modal) {
          modal.classList.remove("active");
          document.body.style.overflow = "";
        }
      }, 3000);
    } catch (error) {
      console.error("FrontierQuote: Error submitting quote:", error);
      errorMsg.textContent =
        error.message || "An error occurred. Please try again.";
      errorMsg.style.display = "block";
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = "Request Quote";
    }
  }

  // Flag to prevent re-entrant calls
  let isProcessing = false;

  // Replace checkout buttons
  async function replaceCheckoutButtons() {
    // Prevent re-entrant calls
    if (isProcessing) {
      return;
    }

    isProcessing = true;
    try {
      const shouldReplace = await shouldShowQuoteButton();
      if (!shouldReplace) {
        return; // Show normal checkout
      }

      // Find and replace checkout buttons
      const checkoutSelectors = [
        "[data-checkout]", // Checkout button
        ".cart-checkout", // Cart checkout
        "button[data-checkout-button]", // Checkout button data attribute
        "button[name='checkout']", // Checkout button name
      ];

      checkoutSelectors.forEach((selector) => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach((button) => {
          // Skip if already processed or if it's a quote button we created
          if (
            button.dataset.frontierquoteProcessed ||
            button.dataset.frontierquoteButton === "true"
          ) {
            return;
          }

          // Create replacement button
          const quoteButton = button.cloneNode(true);
          quoteButton.textContent = "Get a Quote";
          quoteButton.dataset.frontierquoteButton = "true"; // Mark as quote button
          quoteButton.onclick = (e) => {
            e.preventDefault();
            showQuoteModal();
          };

          // Remove attributes that might match selectors
          quoteButton.removeAttribute("data-checkout");
          quoteButton.removeAttribute("data-checkout-button");
          quoteButton.removeAttribute("name");

          // Hide original, show quote button
          button.style.display = "none";
          button.dataset.frontierquoteProcessed = "true";
          button.parentNode.insertBefore(quoteButton, button);
        });
      });
    } finally {
      isProcessing = false;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", replaceCheckoutButtons);
  } else {
    replaceCheckoutButtons();
  }

  // Debounce function to limit how often we process mutations
  let debounceTimer = null;
  function debouncedReplaceCheckoutButtons() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      replaceCheckoutButtons();
    }, 100); // Wait 100ms after last mutation before processing
  }

  // Watch for dynamic content changes (e.g., AJAX cart updates)
  const observer = new MutationObserver(debouncedReplaceCheckoutButtons);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
