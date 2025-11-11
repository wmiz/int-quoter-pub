import { json } from "@remix-run/node";
import crypto from "crypto";
import prisma from "../db.server";

/**
 * Storefront API endpoint to check if quote button should be shown for a country
 * This endpoint is called from geo-quote.js on the storefront via app proxy
 *
 * GET /apps/geo-quote/settings?country_code=XX
 *
 * When accessed via app proxy, Shopify adds a signature parameter that must be verified
 */
export const headers = () => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
};

/**
 * Verifies that a request comes from Shopify by validating the signature
 * @param {URLSearchParams} searchParams - The query parameters from the request
 * @param {string} sharedSecret - The app's shared secret
 * @returns {boolean} - True if the request is verified, false otherwise
 */
function verifyShopifyRequest(searchParams, sharedSecret) {
  if (!sharedSecret) {
    console.warn(
      "SHOPIFY_API_SECRET not configured - skipping signature verification"
    );
    return false;
  }

  const signature = searchParams.get("signature");
  if (!signature) {
    console.log(`[VERIFY] No signature parameter found in request`);
    return false;
  }

  // Create a copy of searchParams without the signature
  const params = new URLSearchParams(searchParams);
  params.delete("signature");

  // Sort parameters alphabetically by key
  const sortedParams = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("");

  // Compute HMAC-SHA256 signature
  const computedSignature = crypto
    .createHmac("sha256", sharedSecret)
    .update(sortedParams)
    .digest("hex");

  const isValid = computedSignature === signature;

  console.log(`[VERIFY] Signature verification details:`, {
    receivedSignature: signature,
    computedSignature: computedSignature,
    sortedParams: sortedParams,
    isValid: isValid,
  });

  return isValid;
}

export const loader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Verify the request comes from Shopify
    const sharedSecret = process.env.SHOPIFY_API_SECRET;
    const isVerified = verifyShopifyRequest(searchParams, sharedSecret);

    console.log(`[VERIFY] Signature verification result:`, {
      verified: isVerified,
      shop: searchParams.get("shop"),
      hasSignature: !!searchParams.get("signature"),
      hasSecret: !!sharedSecret,
    });

    if (!isVerified) {
      return json(
        {
          error: "Unauthorized",
          message: "Request signature verification failed",
          shouldShowQuote: false,
        },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get shop domain from verified query parameters
    const shopDomain = searchParams.get("shop");

    // Get country_code from query parameters
    const countryCode =
      searchParams.get("country_code") || searchParams.get("country");

    // Validate inputs
    if (
      !countryCode ||
      typeof countryCode !== "string" ||
      countryCode.length !== 2
    ) {
      return json(
        { error: "Invalid country code", shouldShowQuote: false },
        { status: 400 }
      );
    }

    if (!shopDomain || typeof shopDomain !== "string") {
      return json(
        { error: "Shop domain is required", shouldShowQuote: false },
        { status: 400 }
      );
    }

    // Normalize country code to uppercase
    const normalizedCountryCode = countryCode.toUpperCase();

    // Normalize shop domain (ensure it ends with .myshopify.com if it's just the shop name)
    let normalizedShopDomain = shopDomain;
    if (!normalizedShopDomain.includes(".")) {
      normalizedShopDomain = `${normalizedShopDomain}.myshopify.com`;
    }

    // Get shop settings
    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: normalizedShopDomain },
      include: { settings: true },
    });

    if (!shopRecord || !shopRecord.settings) {
      // If shop not found, default to showing normal checkout
      return json({ shouldShowQuote: false });
    }

    const settings = shopRecord.settings;

    // Parse whitelist and blacklist
    let whitelistCountries = [];
    let blacklistCountries = [];

    try {
      if (settings.whitelistCountries) {
        whitelistCountries = JSON.parse(settings.whitelistCountries);
      }
    } catch (e) {
      console.error("Error parsing whitelistCountries:", e);
    }

    try {
      if (settings.blacklistCountries) {
        blacklistCountries = JSON.parse(settings.blacklistCountries);
      }
    } catch (e) {
      console.error("Error parsing blacklistCountries:", e);
    }

    // Check whitelist first - if country is in whitelist, always show checkout
    if (whitelistCountries.includes(normalizedCountryCode)) {
      return json({ shouldShowQuote: false });
    }

    // Check blacklist - if country is in blacklist, always show quote button
    if (blacklistCountries.includes(normalizedCountryCode)) {
      return json({ shouldShowQuote: true });
    }

    // TODO: Check if shipping method exists for this country
    // For now, default to showing normal checkout if not in whitelist/blacklist
    // This will be implemented in the next step
    return json({
      shouldShowQuote: false,
      countryCode: normalizedCountryCode,
      // Include this for debugging - will be used later for shipping check
      _debug: {
        shopDomain: normalizedShopDomain,
        countryCode: normalizedCountryCode,
        inWhitelist: whitelistCountries.includes(normalizedCountryCode),
        inBlacklist: blacklistCountries.includes(normalizedCountryCode),
      },
    });
  } catch (error) {
    console.error("Error in geo-quote settings endpoint:", error);
    // Fail gracefully - show normal checkout on error
    return json(
      { shouldShowQuote: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
