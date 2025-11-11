import { json } from "@remix-run/node";
import crypto from "crypto";
import { unauthenticated } from "../shopify.server";
import prisma from "../db.server";

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

/**
 * Creates a draft order using the Shopify GraphQL API
 * @param {Object} admin - The Shopify admin GraphQL client
 * @param {Object} orderData - The parsed order data from the payload
 * @param {Array} tags - Tags to apply to the draft order
 * @returns {Promise<Object>} - The draft order creation result
 */
async function createDraftOrder(admin, orderData, tags = []) {
  const DRAFT_ORDER_MUTATION = `
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
          invoiceUrl
          status
          name
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  id
                  price
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Build shipping address object
  const shippingAddress = {};
  if (orderData.shipping_address1) {
    shippingAddress.address1 = orderData.shipping_address1;
  }
  if (orderData.shipping_address2) {
    shippingAddress.address2 = orderData.shipping_address2;
  }
  if (orderData.shipping_city) {
    shippingAddress.city = orderData.shipping_city;
  }
  if (orderData.shipping_province) {
    shippingAddress.province = orderData.shipping_province;
  }
  if (orderData.shipping_country) {
    shippingAddress.country = orderData.shipping_country;
  }
  if (orderData.shipping_zip) {
    shippingAddress.zip = orderData.shipping_zip;
  }
  if (orderData.name) {
    const nameParts = orderData.name.split(" ");
    shippingAddress.firstName = nameParts[0] || "";
    shippingAddress.lastName = nameParts.slice(1).join(" ") || "";
  }

  const variables = {
    input: {
      email: orderData.email,
      ...(Object.keys(shippingAddress).length > 0 && {
        shippingAddress: shippingAddress,
      }),
      lineItems: orderData.lineItems,
      ...(tags.length > 0 && { tags: tags }),
      note: orderData.notes || "",
    },
  };

  try {
    const response = await admin.graphql(DRAFT_ORDER_MUTATION, { variables });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[DRAFT_ORDER] Error creating draft order:", error);
    throw error;
  }
}

/**
 * Parse order data from the payload
 * @param {Object} payload - The request payload
 * @returns {Object} - Parsed order data
 */
function parseOrderData(payload) {
  // Extract customer information - handle quote[] prefix
  const orderData = {
    email: payload["quote[email]"] || payload.email,
    name: payload["quote[name]"] || payload.name,
    first_name: payload["quote[first_name]"] || payload.first_name,
    last_name: payload["quote[last_name]"] || payload.last_name,
    phone: payload["quote[phone]"] || payload.phone,
    company: payload["quote[company]"] || payload.company,
    notes: payload["quote[notes]"] || payload.notes,
    shipping_address1:
      payload["quote[shipping_address1]"] ||
      payload.shipping_address1 ||
      payload["quote[address1]"] ||
      payload.address1,
    shipping_address2:
      payload["quote[shipping_address2]"] ||
      payload.shipping_address2 ||
      payload["quote[address2]"] ||
      payload.address2,
    shipping_city:
      payload["quote[shipping_city]"] ||
      payload.shipping_city ||
      payload["quote[city]"] ||
      payload.city,
    shipping_province:
      payload["quote[shipping_province]"] ||
      payload.shipping_province ||
      payload["quote[province]"] ||
      payload.province,
    shipping_country:
      payload["quote[shipping_country]"] ||
      payload.shipping_country ||
      payload["quote[country]"] ||
      payload.country,
    shipping_zip:
      payload["quote[shipping_zip]"] ||
      payload.shipping_zip ||
      payload["quote[zip]"] ||
      payload.zip,
    cart: payload["quote[cart]"] || payload.cart,
    cart_line_items:
      payload["quote[cart_line_items]"] || payload.cart_line_items,
    cart_total: payload["quote[cart_total]"] || payload.cart_total,
  };

  // Combine first_name and last_name into name if name is not provided
  if (!orderData.name && (orderData.first_name || orderData.last_name)) {
    orderData.name =
      `${orderData.first_name || ""} ${orderData.last_name || ""}`.trim();
  }

  // Parse cart line items from JSON if available
  if (orderData.cart_line_items) {
    try {
      const lineItems = JSON.parse(orderData.cart_line_items);
      orderData.lineItems = lineItems
        .filter((item) => item.variantId && item.quantity)
        .map((item) => ({
          variantId: item.variantId,
          quantity: parseInt(item.quantity) || 1,
        }));
    } catch (error) {
      console.warn("[ORDERS] Failed to parse cart_line_items JSON:", error);
      orderData.lineItems = [];
    }
  } else {
    orderData.lineItems = [];
  }

  return orderData;
}

export const action = async ({ request }) => {
  const url = new URL(request.url);
  console.log(`[QUOTE] POST request received at:`, new Date().toISOString());

  // Get query parameters for signature verification
  const searchParams = url.searchParams;
  const shopDomain = searchParams.get("shop");

  console.log(`[QUOTE] Request details:`, {
    shop: shopDomain,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get("user-agent"),
  });

  // Verify the request comes from Shopify
  const sharedSecret = process.env.SHOPIFY_API_SECRET;
  const isVerified = verifyShopifyRequest(searchParams, sharedSecret);

  console.log(`[QUOTE] Signature verification result:`, {
    verified: isVerified,
    shop: shopDomain,
    hasSignature: !!searchParams.get("signature"),
    hasSecret: !!sharedSecret,
  });

  if (!isVerified) {
    return json(
      {
        error: "Unauthorized",
        message: "Request signature verification failed",
      },
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (!shopDomain) {
    return json(
      {
        error: "Bad Request",
        message: "Shop parameter is required",
      },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Get the request body
    const contentType = request.headers.get("content-type");
    let payload;

    if (contentType?.includes("application/json")) {
      payload = await request.json();
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      payload = Object.fromEntries(formData);
    } else {
      return json(
        {
          error: "Bad Request",
          message: "Unsupported content type",
        },
        {
          status: 400,
        }
      );
    }

    // Log the payload (sanitized)
    console.log(`[QUOTE] Payload received:`, {
      contentType,
      hasEmail: !!payload["quote[email]"],
      hasCartItems: !!payload["quote[cart_line_items]"],
      timestamp: new Date().toISOString(),
    });

    // Parse order data from payload
    const orderData = parseOrderData(payload);
    console.log(`[QUOTE] Parsed order data:`, {
      email: orderData.email,
      hasShippingAddress: !!(
        orderData.shipping_address1 && orderData.shipping_city
      ),
      lineItemsCount: orderData.lineItems?.length || 0,
    });

    // Validate required fields
    if (!orderData.email) {
      return json(
        {
          error: "Bad Request",
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!orderData.lineItems || orderData.lineItems.length === 0) {
      return json(
        {
          error: "Bad Request",
          message: "Cart line items are required",
        },
        {
          status: 400,
        }
      );
    }

    // Get shop settings to retrieve draft order tags
    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shopDomain },
      include: { settings: true },
    });

    let tags = ["International-Quote"];
    if (shopRecord?.settings?.draftOrderTags) {
      try {
        // draftOrderTags is stored as a comma-separated string or JSON array string
        const tagsValue = shopRecord.settings.draftOrderTags.trim();
        if (tagsValue.startsWith("[")) {
          // JSON array format
          const parsedTags = JSON.parse(tagsValue);
          if (Array.isArray(parsedTags) && parsedTags.length > 0) {
            tags = parsedTags;
          }
        } else if (tagsValue.includes(",")) {
          // Comma-separated format
          tags = tagsValue
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        } else if (tagsValue) {
          // Single tag
          tags = [tagsValue];
        }
      } catch (e) {
        console.error("Error parsing draftOrderTags:", e);
      }
    }

    // Create draft order
    let draftOrderResult = null;

    try {
      console.log(`[QUOTE] Creating draft order for shop: ${shopDomain}`);

      // Get admin GraphQL client for the shop
      // Use unauthenticated method for app proxy requests
      const { admin } = await unauthenticated.admin(shopDomain);

      // Create the draft order
      const draftOrderResponse = await createDraftOrder(admin, orderData, tags);

      draftOrderResult = draftOrderResponse;

      console.log(`[QUOTE] Draft order created successfully:`, {
        draftOrderId: draftOrderResponse.data?.draftOrderCreate?.draftOrder?.id,
        status: draftOrderResponse.data?.draftOrderCreate?.draftOrder?.status,
        invoiceUrl:
          draftOrderResponse.data?.draftOrderCreate?.draftOrder?.invoiceUrl,
        name: draftOrderResponse.data?.draftOrderCreate?.draftOrder?.name,
        userErrors: draftOrderResponse.data?.draftOrderCreate?.userErrors,
      });

      // Check for user errors
      if (draftOrderResponse.data?.draftOrderCreate?.userErrors?.length > 0) {
        console.error(
          `[QUOTE] Draft order creation had user errors:`,
          draftOrderResponse.data.draftOrderCreate.userErrors
        );
        return json(
          {
            success: false,
            error: "Failed to create draft order",
            message: draftOrderResponse.data.draftOrderCreate.userErrors
              .map((e) => e.message)
              .join(", "),
            userErrors: draftOrderResponse.data.draftOrderCreate.userErrors,
          },
          {
            status: 400,
          }
        );
      }
    } catch (error) {
      console.error(`[QUOTE] Failed to create draft order:`, error);
      return json(
        {
          success: false,
          error: "Failed to create draft order",
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    // Return success response
    return json(
      {
        success: true,
        message: "Quote request submitted successfully",
        timestamp: new Date().toISOString(),
        draftOrder: {
          id: draftOrderResult.data?.draftOrderCreate?.draftOrder?.id,
          name: draftOrderResult.data?.draftOrderCreate?.draftOrder?.name,
          invoiceUrl:
            draftOrderResult.data?.draftOrderCreate?.draftOrder?.invoiceUrl,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(`[QUOTE] Error processing request:`, error);
    return json(
      {
        success: false,
        error: "Failed to process quote request",
        message: error.message,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// Handle OPTIONS requests for CORS
export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  return json(
    {
      message: "Quote endpoint - use POST to submit quote requests",
      method: "POST",
    },
    {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
