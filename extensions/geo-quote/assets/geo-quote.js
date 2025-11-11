/**
 * GeoQuote Theme App Extension
 * Replaces checkout buttons with "Get a Quote" flow for configured regions
 */

(function () {
  "use strict";

  // Log asset load for diagnostics
  console.info("GeoQuote: asset loaded", {
    time: new Date().toISOString(),
    shop: window.Shopify?.shop || "",
  });

  // Configuration - will be fetched from app settings
  const GEOQUOTE_CONFIG = {
    shopDomain: window.Shopify?.shop || "",
    enabled: true,
    // Will be populated from settings API
  };

  // Get country from URL parameter (for testing)
  function getCountryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("gq_country") || null;
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
        window.geoQuoteCountry ||
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
        console.warn("GeoQuote: Could not determine shop domain");
        return false;
      }

      // Use relative path for app proxy
      // The app proxy is configured to route /apps/geo-quote/* to our app server
      // This works on the storefront domain (e.g., shop.myshopify.com/apps/geo-quote/settings)
      const apiUrl = "/apps/geo-quote/settings";

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
          "GeoQuote: API request failed",
          response.status,
          response.statusText
        );
        return false;
      }

      const settings = await response.json();
      return settings.shouldShowQuote;
    } catch (error) {
      console.error("GeoQuote: Error checking region:", error);
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
      console.error("GeoQuote: Shopify country detection failed:", error);
    }
    return null;
  }

  // Detect user's country via IP geolocation (fallback)
  async function detectCountry() {
    try {
      // Check localStorage cache first (24h TTL)
      const cached = localStorage.getItem("geoquote_country");
      const cachedTime = localStorage.getItem("geoquote_country_time");
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
        localStorage.setItem("geoquote_country", country);
        localStorage.setItem("geoquote_country_time", Date.now().toString());
        return country;
      }
    } catch (error) {
      console.error("GeoQuote: Country detection failed:", error);
    }
    return null;
  }

  // Show quote modal
  function showQuoteModal() {
    // Modal implementation will go here
    console.log("GeoQuote: Show quote modal");
    // TODO: Implement modal UI
  }

  // Replace checkout buttons
  async function replaceCheckoutButtons() {
    const shouldReplace = await shouldShowQuoteButton();
    console.log("GeoQuote: Should replace:", shouldReplace);
    if (!shouldReplace) {
      return; // Show normal checkout
    }

    // Find and replace checkout buttons
    const checkoutSelectors = [
      'button[name="add"]', // Add to cart on PDP
      'button[type="submit"][name="add"]', // Add to cart variants
      'input[type="submit"][name="add"]', // Add to cart input
      "[data-checkout]", // Checkout button
      ".cart-checkout", // Cart checkout
      "button[data-checkout-button]", // Checkout button data attribute
    ];

    checkoutSelectors.forEach((selector) => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach((button) => {
        if (!button.dataset.geoquoteProcessed) {
          // Create replacement button
          const quoteButton = button.cloneNode(true);
          quoteButton.textContent = "Get a Quote";
          quoteButton.onclick = (e) => {
            e.preventDefault();
            showQuoteModal();
          };

          // Hide original, show quote button
          button.style.display = "none";
          button.dataset.geoquoteProcessed = "true";
          button.parentNode.insertBefore(quoteButton, button);
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", replaceCheckoutButtons);
  } else {
    replaceCheckoutButtons();
  }

  // Watch for dynamic content changes (e.g., AJAX cart updates)
  const observer = new MutationObserver(() => {
    replaceCheckoutButtons();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
