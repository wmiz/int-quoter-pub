import {
  useLoaderData,
  useSearchParams,
  useFetcher,
  useRevalidator,
} from "@remix-run/react";
import { useEffect } from "react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  List,
  Link,
  InlineStack,
  Badge,
  DataTable,
  EmptyState,
  Banner,
} from "@shopify/polaris";
import { CheckIcon } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const formData = await request.formData();
  const actionType = formData.get("action");

  // Get shop
  const shop = await prisma.shop.findUnique({
    where: { shopDomain },
    include: { settings: true },
  });

  if (!shop) {
    return json({ error: "Shop not found" }, { status: 404 });
  }

  if (actionType === "dismissBanner") {
    // Mark the success banner as dismissed
    await prisma.settings.upsert({
      where: { shopId: shop.id },
      update: { setupSuccessBannerDismissed: true },
      create: {
        shopId: shop.id,
        setupSuccessBannerDismissed: true,
      },
    });
    return json({ success: true });
  }

  if (actionType === "completeOnboarding") {
    // Mark onboarding as complete
    await prisma.settings.upsert({
      where: { shopId: shop.id },
      update: { onboardingComplete: true },
      create: {
        shopId: shop.id,
        onboardingComplete: true,
      },
    });
    return json({ success: true });
  }

  if (actionType === "resetOnboarding") {
    // Reset onboarding to show onboarding view again
    await prisma.settings.upsert({
      where: { shopId: shop.id },
      update: { onboardingComplete: false },
      create: {
        shopId: shop.id,
        onboardingComplete: false,
      },
    });
    return json({ success: true });
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  // Get time period from URL search params (default to "30" for last 30 days)
  const url = new URL(request.url);
  const timePeriod = url.searchParams.get("period") || "30";

  // Get shop settings to determine setup completion
  let shop = await prisma.shop.findUnique({
    where: { shopDomain },
    include: { settings: true },
  });

  let settings = null;
  if (shop?.settings) {
    settings = shop.settings;
  }

  // Determine if onboarding should be shown
  // Show onboarding if onboardingComplete is false
  const showOnboarding = !settings?.onboardingComplete;

  // Get the active theme ID for theme customizer redirect
  let activeThemeId = null;
  let appEmbedActive = false;
  try {
    const themeResponse = await admin.graphql(
      `#graphql
        query getActiveTheme {
          themes(first: 10) {
            edges {
              node {
                id
                role
              }
            }
          }
        }`
    );

    // Check if response is ok before parsing
    if (!themeResponse.ok) {
      console.error(
        "Theme query failed:",
        themeResponse.status,
        themeResponse.statusText
      );
    } else {
      const themeData = await themeResponse.json();

      // Check for GraphQL errors
      if (themeData.errors) {
        console.error("GraphQL errors:", themeData.errors);
      } else if (themeData.data?.themes?.edges?.length > 0) {
        // Find the main/active theme (role: MAIN)
        const activeTheme =
          themeData.data.themes.edges.find(
            (edge) => edge.node.role === "MAIN"
          ) || themeData.data.themes.edges[0];

        if (activeTheme) {
          // Extract numeric ID from GID (gid://shopify/Theme/123456789)
          const themeGid = activeTheme.node.id;
          activeThemeId = themeGid.replace(
            "gid://shopify/OnlineStoreTheme/",
            ""
          );

          // Fetch settings_data.json to check if app embed is active
          try {
            // Use REST API to fetch the asset file
            // API version 2025-01 matches the January25 GraphQL API version
            const response = await fetch(
              `https://${shopDomain}/admin/api/2025-01/themes/${activeThemeId}/assets.json?asset[key]=config/settings_data.json`,
              {
                headers: {
                  "X-Shopify-Access-Token": session.accessToken,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              const assetData = await response.json();
              if (assetData.asset && assetData.asset.value) {
                const settingsJson = JSON.parse(assetData.asset.value);

                // Check if app embed is active according to Shopify documentation:
                // App embed blocks appear in settings_data.json.current.blocks
                // Block type format: "shopify://apps/<app_name>/blocks/<block_name>/<unique_ID>"
                // A block is active if disabled !== true
                const current = settingsJson.current || {};
                const blocks = current.blocks || {};

                for (const [blockId, block] of Object.entries(blocks)) {
                  // Check if block type matches our app extension
                  // Format: shopify://apps/frontier-quote/blocks/<block_name>/<unique_ID>
                  if (
                    block.type &&
                    typeof block.type === "string" &&
                    block.type.includes("shopify://apps/") &&
                    block.type.includes("/blocks/") &&
                    block.type.includes("frontier-quote")
                  ) {
                    // Check if block is enabled (disabled !== true)
                    // Blocks remain in settings_data.json even when disabled,
                    // so we must check the disabled property
                    if (block.disabled !== true) {
                      appEmbedActive = true;
                      break;
                    }
                  }
                }
              }
            }
          } catch (settingsError) {
            console.error("Failed to fetch settings_data.json:", settingsError);
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch active theme:", error);
  }

  // Calculate date range based on selected time period
  const now = new Date();
  const startDate = new Date();

  if (timePeriod === "1") {
    // Today
    startDate.setHours(0, 0, 0, 0);
  } else if (timePeriod === "7") {
    // Last 7 days
    startDate.setDate(startDate.getDate() - 7);
  } else {
    // Last 30 days (default)
    startDate.setDate(startDate.getDate() - 30);
  }

  // Fetch actual quote requests from draft orders and regular orders tagged with "gq-quote"
  let quoteStats = {
    totalRequests: 0,
    totalRevenue: 0,
    averageQuoteValue: 0,
    conversionRate: 0,
    quotesByCountry: [],
    topProducts: [],
    averageTimeToResponse: null,
    timePeriod,
  };

  let recentQuotes = [];

  try {
    // Query draft orders with tag "gq-quote" - include line items and updatedAt
    const draftOrdersQuery = `
      query getDraftOrders($query: String!) {
        draftOrders(first: 50, query: $query) {
          edges {
            node {
              id
              name
              createdAt
              updatedAt
              email
              status
              totalPrice
              shippingAddress {
                country
              }
              customer {
                displayName
                email
              }
              tags
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      id
                      title
                      product {
                        id
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    // Query regular orders with tag "gq-quote" - include line items
    const ordersQuery = `
      query getOrders($query: String!) {
        orders(first: 50, query: $query) {
          edges {
            node {
              id
              name
              createdAt
              email
              displayFinancialStatus
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              shippingAddress {
                country
              }
              customer {
                displayName
                email
              }
              tags
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      id
                      title
                      product {
                        id
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    // Build query string for filtering by tag
    // Note: Date filtering will be done in JavaScript after fetching
    const queryString = `tag:gq-quote`;

    // Fetch draft orders
    const draftOrdersResponse = await admin.graphql(draftOrdersQuery, {
      variables: { query: queryString },
    });
    const draftOrdersData = await draftOrdersResponse.json();

    // Check for GraphQL errors in draft orders response
    if (draftOrdersData.errors) {
      console.error(
        "GraphQL errors fetching draft orders:",
        JSON.stringify(draftOrdersData.errors, null, 2)
      );
    }

    // Fetch regular orders
    const ordersResponse = await admin.graphql(ordersQuery, {
      variables: { query: queryString },
    });
    const ordersData = await ordersResponse.json();

    // Check for GraphQL errors in orders response
    if (ordersData.errors) {
      console.error(
        "GraphQL errors fetching orders:",
        JSON.stringify(ordersData.errors, null, 2)
      );
    }

    // Process draft orders and filter by date range
    // Only process if no errors occurred
    const draftOrders =
      (!draftOrdersData.errors &&
        draftOrdersData.data?.draftOrders?.edges
          ?.map((edge) => {
            // Draft orders return totalPrice as a decimal number in dollars (e.g., 10.25)
            // Convert to cents to match regular orders format
            const totalPriceInDollars = parseFloat(edge.node.totalPrice || 0);
            const totalPriceInCents = Math.round(totalPriceInDollars * 100);

            // Extract line items for product analytics
            const lineItems =
              edge.node.lineItems?.edges?.map((item) => ({
                title:
                  item.node.title ||
                  item.node.variant?.title ||
                  "Unknown Product",
                productTitle:
                  item.node.variant?.product?.title ||
                  item.node.title ||
                  "Unknown Product",
                quantity: item.node.quantity || 0,
              })) || [];

            return {
              id: edge.node.id,
              name: edge.node.name,
              createdAt: edge.node.createdAt,
              updatedAt: edge.node.updatedAt || edge.node.createdAt,
              email: edge.node.email || edge.node.customer?.email || "",
              customerName:
                edge.node.customer?.displayName ||
                edge.node.email ||
                "Unknown Customer",
              country: edge.node.shippingAddress?.country || "Unknown",
              status: edge.node.status === "COMPLETED" ? "Completed" : "Draft",
              totalPrice: totalPriceInCents,
              type: "draft",
              lineItems,
              isCompleted: edge.node.status === "COMPLETED",
            };
          })
          .filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startDate && orderDate <= now;
          })) ||
      [];

    // Process regular orders and filter by date range
    // Only process if no errors occurred
    const regularOrders =
      (!ordersData.errors &&
        ordersData.data?.orders?.edges
          ?.map((edge) => {
            // Regular orders return totalPriceSet.shopMoney.amount as a decimal string in dollars (e.g., "10.25")
            // Convert to cents to match draft orders format
            const totalPriceInDollars = parseFloat(
              edge.node.totalPriceSet?.shopMoney?.amount || 0
            );
            const totalPriceInCents = Math.round(totalPriceInDollars * 100);

            // Extract line items for product analytics
            const lineItems =
              edge.node.lineItems?.edges?.map((item) => ({
                title:
                  item.node.title ||
                  item.node.variant?.title ||
                  "Unknown Product",
                productTitle:
                  item.node.variant?.product?.title ||
                  item.node.title ||
                  "Unknown Product",
                quantity: item.node.quantity || 0,
              })) || [];

            const financialStatus =
              edge.node.displayFinancialStatus || "Unknown";
            const isPaid =
              financialStatus === "PAID" ||
              financialStatus === "PARTIALLY_PAID";

            return {
              id: edge.node.id,
              name: edge.node.name,
              createdAt: edge.node.createdAt,
              updatedAt: edge.node.createdAt, // Orders don't have updatedAt, use createdAt
              email: edge.node.email || edge.node.customer?.email || "",
              customerName:
                edge.node.customer?.displayName ||
                edge.node.email ||
                "Unknown Customer",
              country: edge.node.shippingAddress?.country || "Unknown",
              status: financialStatus,
              totalPrice: totalPriceInCents,
              type: "order",
              lineItems,
              isPaid,
            };
          })
          .filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startDate && orderDate <= now;
          })) ||
      [];

    // Combine and sort by date (most recent first)
    const allQuotes = [...draftOrders, ...regularOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Calculate basic stats
    // Note: Both draftOrders and regularOrders have totalPrice in cents
    quoteStats.totalRequests = allQuotes.length;
    quoteStats.totalRevenue = allQuotes.reduce(
      (sum, quote) => sum + quote.totalPrice,
      0
    );

    // Calculate average quote value
    quoteStats.averageQuoteValue =
      allQuotes.length > 0
        ? Math.round(quoteStats.totalRevenue / allQuotes.length)
        : 0;

    // Calculate conversion rate (quotes that became paid orders)
    // A quote converts if:
    // 1. It's a draft order that was completed (status === "COMPLETED")
    // 2. It's a regular order that is paid (financialStatus === "PAID" or "PARTIALLY_PAID")
    const convertedQuotes = allQuotes.filter(
      (quote) => quote.isCompleted || quote.isPaid
    );
    quoteStats.conversionRate =
      allQuotes.length > 0
        ? Math.round((convertedQuotes.length / allQuotes.length) * 100)
        : 0;

    // Calculate quotes by country
    const countryMap = new Map();
    allQuotes.forEach((quote) => {
      const country = quote.country || "Unknown";
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });
    quoteStats.quotesByCountry = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 countries

    // Calculate top products requested
    const productMap = new Map();
    allQuotes.forEach((quote) => {
      quote.lineItems.forEach((item) => {
        const productTitle =
          item.productTitle || item.title || "Unknown Product";
        const current = productMap.get(productTitle) || {
          count: 0,
          totalQuantity: 0,
        };
        productMap.set(productTitle, {
          count: current.count + 1,
          totalQuantity: current.totalQuantity + (item.quantity || 0),
        });
      });
    });
    quoteStats.topProducts = Array.from(productMap.entries())
      .map(([product, stats]) => ({
        product,
        requestCount: stats.count,
        totalQuantity: stats.totalQuantity,
      }))
      .sort((a, b) => b.requestCount - a.requestCount)
      .slice(0, 10); // Top 10 products

    // Calculate average time to first response
    // For draft orders, use updatedAt - createdAt (time until first update/completion)
    // For orders, we can't accurately measure response time without additional tracking
    // So we'll focus on completed draft orders
    const completedDraftOrders = draftOrders.filter(
      (order) => order.isCompleted
    );
    if (completedDraftOrders.length > 0) {
      const responseTimes = completedDraftOrders.map((order) => {
        const createdAt = new Date(order.createdAt);
        const updatedAt = new Date(order.updatedAt);
        return updatedAt - createdAt; // Time difference in milliseconds
      });
      const averageTimeMs =
        responseTimes.reduce((sum, time) => sum + time, 0) /
        responseTimes.length;
      quoteStats.averageTimeToResponse = Math.round(
        averageTimeMs / (1000 * 60 * 60)
      ); // Convert to hours
    }

    // Format recent quotes for DataTable (limit to 10 most recent)
    recentQuotes = allQuotes.slice(0, 10).map((quote) => {
      const date = new Date(quote.createdAt);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Extract order ID and create URL
      const orderId = quote.id.split("/").pop();
      const orderUrl =
        quote.type === "draft"
          ? `shopify:admin/draft_orders/${orderId}`
          : `shopify:admin/orders/${orderId}`;

      return {
        date: formattedDate,
        customer: quote.customerName,
        country: quote.country,
        status: quote.status,
        orderUrl, // Store URL for rendering Button in component
      };
    });
  } catch (error) {
    console.error("Error fetching quote requests:", error);
    // Keep default empty values on error
  }

  // Check if setup is complete (app embed active)
  const setupComplete = appEmbedActive;

  return json({
    showOnboarding,
    activeThemeId,
    settings,
    quoteStats,
    recentQuotes,
    appEmbedActive,
    setupSuccessBannerDismissed: settings?.setupSuccessBannerDismissed || false,
  });
};

export default function Index() {
  const {
    showOnboarding,
    activeThemeId,
    settings,
    quoteStats,
    recentQuotes,
    appEmbedActive,
    setupSuccessBannerDismissed,
  } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  // Revalidate when onboarding is marked complete
  useEffect(() => {
    if (fetcher.data?.success && fetcher.state === "idle") {
      revalidator.revalidate();
    }
  }, [fetcher.data, fetcher.state, revalidator]);

  // Get current time period from search params or default to "30"
  const currentPeriod = searchParams.get("period") || "30";

  // Handle time period change
  const handlePeriodChange = (period) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("period", period);
    setSearchParams(newSearchParams);
  };

  // Determine setup completion status
  const setupComplete = appEmbedActive;

  return (
    <Page>
      <TitleBar title={showOnboarding ? "Setup" : "Dashboard"}></TitleBar>
      {showOnboarding ? (
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Set up FrontierQuote
                </Text>
                <Text as="p" variant="bodyMd">
                  Follow these steps to configure the app based on your business
                  needs. You can return here anytime.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="h3" variant="headingMd">
                  1) Configure settings
                </Text>
                <List>
                  <List.Item>
                    Choose countries to divert to quotes (allow or block mode).
                  </List.Item>
                  <List.Item>
                    Configure which optional fields appear in the quote request
                    popup (phone, company, notes).
                  </List.Item>
                  <List.Item>
                    Set tags to apply to draft orders created from quote
                    requests.
                  </List.Item>
                </List>
                <InlineStack gap="300">
                  <Button url="/app/settings">Configure settings</Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h3" variant="headingMd">
                    2) Theme app extension
                  </Text>
                  {appEmbedActive !== undefined ? (
                    appEmbedActive ? (
                      <Badge status="success">Active in theme</Badge>
                    ) : (
                      <Badge status="attention">Not found in theme</Badge>
                    )
                  ) : (
                    <Badge status="attention">Status unknown</Badge>
                  )}
                </InlineStack>
                <List>
                  <List.Item>
                    Install and add the app block to your Online Store 2.0 theme
                    where you want the behavior enabled.
                  </List.Item>
                  <List.Item>
                    The script detects region and conditionally injects a "Get a
                    Quote" button with an accessible modal.
                  </List.Item>
                </List>
                <InlineStack gap="300" blockAlign="center">
                  {activeThemeId ? (
                    <Button
                      url={`shopify:admin/themes/${activeThemeId}/editor?context=apps`}
                      target="_blank"
                    >
                      Open theme customizer
                    </Button>
                  ) : (
                    <Button url="/admin/themes" target="_blank">
                      Open theme customizer
                    </Button>
                  )}
                  <Link
                    url="https://shopify.dev/docs/apps/online-store/theme-app-extensions"
                    target="_blank"
                    removeUnderline
                  >
                    Learn about theme app extensions
                  </Link>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="h3" variant="headingMd">
                  3) Notifications
                </Text>
                <List>
                  <List.Item>
                    Merchant notifications are recommended via Shopify Flow
                    templates triggered by Draft Order tags/notes.
                  </List.Item>
                  <List.Item>
                    Optionally enable a customer confirmation email using your
                    preferred provider.
                  </List.Item>
                </List>
                <InlineStack gap="300" blockAlign="center">
                  <Button>Download flow templates</Button>
                  <Link
                    url="https://shopify.dev/docs/apps/flow"
                    target="_blank"
                    removeUnderline
                  >
                    Shopify Flow overview
                  </Link>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="h3" variant="headingMd">
                  4) Test the storefront flow
                </Text>
                <List>
                  <List.Item>
                    Simulate countries and verify checkout button replacement
                    throughout the storefront.
                  </List.Item>
                  <List.Item>
                    Submit a quote request; a Draft Order should be created.
                    Confirm tags and notes appear as expected.
                  </List.Item>
                </List>
                <InlineStack gap="300">
                  <Button url="/app/testing">Testing flow</Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="300">
                  <Text as="h3" variant="headingMd">
                    Docs & references
                  </Text>
                  <List>
                    <List.Item>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        Admin API
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://shopify.dev/docs/apps/storefront/cart/ajax-api"
                        target="_blank"
                        removeUnderline
                      >
                        Storefront AJAX cart API
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link url="mailto:me@willmisback.com" removeUnderline>
                        Contact support
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="p" variant="bodyMd">
                  Once you've completed the setup steps above, you can mark the
                  onboarding as complete to access the dashboard view.
                </Text>
                <InlineStack gap="300">
                  <Button
                    variant="primary"
                    onClick={() => {
                      const formData = new FormData();
                      formData.append("action", "completeOnboarding");
                      fetcher.submit(formData, { method: "POST" });
                    }}
                    loading={fetcher.state === "submitting"}
                  >
                    Mark setup complete
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      ) : (
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              {/* Setup Status Banner */}
              {!setupComplete && (
                <Banner
                  status="warning"
                  title="Complete setup to activate FrontierQuote"
                  action={{
                    content: activeThemeId
                      ? "Open theme customizer"
                      : "Configure",
                    url: activeThemeId
                      ? `shopify:admin/themes/${activeThemeId}/editor?context=apps`
                      : "/admin/themes",
                    target: "_blank",
                  }}
                >
                  <BlockStack gap="200">
                    <Text as="p" variant="bodyMd">
                      {!appEmbedActive
                        ? "Add and enable the app embed block in your theme to activate FrontierQuote."
                        : ""}
                    </Text>
                  </BlockStack>
                </Banner>
              )}

              {setupComplete && !setupSuccessBannerDismissed && (
                <Banner
                  status="success"
                  onDismiss={() => {
                    const formData = new FormData();
                    formData.append("action", "dismissBanner");
                    fetcher.submit(formData, { method: "POST" });
                  }}
                >
                  <Text as="p" variant="bodyMd">
                    FrontierQuote is active and ready to receive quote requests.
                  </Text>
                </Banner>
              )}

              {/* Analytics Cards */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingMd">
                      Analytics
                    </Text>
                    <InlineStack gap="300">
                      <Button
                        size="slim"
                        variant={
                          currentPeriod === "1" ? "primary" : "secondary"
                        }
                        onClick={() => handlePeriodChange("1")}
                      >
                        Today
                      </Button>
                      <Button
                        size="slim"
                        variant={
                          currentPeriod === "7" ? "primary" : "secondary"
                        }
                        onClick={() => handlePeriodChange("7")}
                      >
                        Last 7 days
                      </Button>
                      <Button
                        size="slim"
                        variant={
                          currentPeriod === "30" ? "primary" : "secondary"
                        }
                        onClick={() => handlePeriodChange("30")}
                      >
                        Last 30 days
                      </Button>
                    </InlineStack>
                  </InlineStack>
                  <Layout>
                    <Layout.Section variant="oneThird">
                      <Card>
                        <BlockStack gap="300">
                          <Text as="h2" variant="headingMd">
                            Quote Requests
                          </Text>
                          <Text as="h1" variant="heading2xl">
                            {quoteStats.totalRequests}
                          </Text>
                          <Text as="p" variant="bodyMd" tone="subdued">
                            Total requests
                          </Text>
                        </BlockStack>
                      </Card>
                    </Layout.Section>
                    <Layout.Section variant="oneThird">
                      <Card>
                        <BlockStack gap="300">
                          <Text as="h2" variant="headingMd">
                            Total Revenue
                          </Text>
                          <Text as="h1" variant="heading2xl" tone="success">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(quoteStats.totalRevenue / 100)}
                          </Text>
                          <Text as="p" variant="bodyMd" tone="subdued">
                            From quote requests
                          </Text>
                        </BlockStack>
                      </Card>
                    </Layout.Section>
                    <Layout.Section variant="oneThird">
                      <Card>
                        <BlockStack gap="300">
                          <Text as="h2" variant="headingMd">
                            Average Quote Value
                          </Text>
                          <Text as="h1" variant="heading2xl">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(quoteStats.averageQuoteValue / 100)}
                          </Text>
                          <Text as="p" variant="bodyMd" tone="subdued">
                            Per quote request
                          </Text>
                        </BlockStack>
                      </Card>
                    </Layout.Section>
                  </Layout>
                  <Layout>
                    <Layout.Section variant="oneHalf">
                      <Card>
                        <BlockStack gap="300">
                          <Text as="h2" variant="headingMd">
                            Conversion Rate
                          </Text>
                          <Text as="h1" variant="heading2xl" tone="success">
                            {quoteStats.conversionRate}%
                          </Text>
                          <Text as="p" variant="bodyMd" tone="subdued">
                            Quote → Draft Order → Paid
                          </Text>
                        </BlockStack>
                      </Card>
                    </Layout.Section>
                    <Layout.Section variant="oneHalf">
                      <Card>
                        <BlockStack gap="300">
                          <Text as="h2" variant="headingMd">
                            Time to First Response
                          </Text>
                          <Text as="h1" variant="heading2xl">
                            {quoteStats.averageTimeToResponse !== null
                              ? `${quoteStats.averageTimeToResponse}h`
                              : "N/A"}
                          </Text>
                          <Text as="p" variant="bodyMd" tone="subdued">
                            Average response time
                          </Text>
                        </BlockStack>
                      </Card>
                    </Layout.Section>
                  </Layout>
                </BlockStack>
              </Card>

              {/* Recent Quote Requests */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      Recent Quote Requests
                    </Text>
                    <Button
                      url="shopify:admin/orders?tag=gq-quote"
                      variant="plain"
                    >
                      View processed requests
                    </Button>
                  </InlineStack>
                  {recentQuotes.length > 0 ? (
                    <DataTable
                      columnContentTypes={[
                        "text",
                        "text",
                        "text",
                        "text",
                        "text",
                      ]}
                      headings={[
                        "Date",
                        "Customer",
                        "Country",
                        "Status",
                        "Actions",
                      ]}
                      rows={recentQuotes.map((quote) => [
                        quote.date,
                        quote.customer,
                        quote.country,
                        quote.status,
                        <Button
                          key={quote.orderUrl}
                          url={quote.orderUrl}
                          variant="plain"
                          size="micro"
                        >
                          View
                        </Button>,
                      ])}
                    />
                  ) : (
                    <EmptyState
                      heading="No quote requests yet"
                      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                      action={{
                        content: "Test Store",
                        url: "/app/testing",
                      }}
                    >
                      <Text as="p" variant="bodyMd" tone="subdued">
                        Quote requests will appear here once customers start
                        submitting requests.
                      </Text>
                    </EmptyState>
                  )}
                </BlockStack>
              </Card>

              {/* Analytics Sections */}
              <Layout>
                <Layout.Section variant="oneHalf">
                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">
                        Quotes by Country
                      </Text>
                      {quoteStats.quotesByCountry.length > 0 ? (
                        <DataTable
                          columnContentTypes={["text", "numeric"]}
                          headings={["Country", "Quote Requests"]}
                          rows={quoteStats.quotesByCountry.map((item) => [
                            item.country,
                            item.count.toString(),
                          ])}
                        />
                      ) : (
                        <EmptyState
                          heading="No country data"
                          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                        >
                          <Text as="p" variant="bodyMd" tone="subdued">
                            Country breakdown will appear here once quote
                            requests are received.
                          </Text>
                        </EmptyState>
                      )}
                    </BlockStack>
                  </Card>
                </Layout.Section>
                <Layout.Section variant="oneHalf">
                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">
                        Top Products Requested
                      </Text>
                      {quoteStats.topProducts.length > 0 ? (
                        <DataTable
                          columnContentTypes={["text", "numeric", "numeric"]}
                          headings={["Product", "Requests", "Total Quantity"]}
                          rows={quoteStats.topProducts.map((item) => [
                            item.product,
                            item.requestCount.toString(),
                            item.totalQuantity.toString(),
                          ])}
                        />
                      ) : (
                        <EmptyState
                          heading="No product data"
                          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                        >
                          <Text as="p" variant="bodyMd" tone="subdued">
                            Top products will appear here once quote requests
                            include product information.
                          </Text>
                        </EmptyState>
                      )}
                    </BlockStack>
                  </Card>
                </Layout.Section>
              </Layout>

              {/* Documentation & Support */}
              <Layout>
                <Layout.Section variant="oneHalf">
                  <Card>
                    <BlockStack gap="300">
                      <Text as="h2" variant="headingMd">
                        Documentation
                      </Text>
                      <List>
                        <List.Item>
                          <Link
                            url="https://shopify.dev/docs/apps/online-store/theme-app-extensions"
                            target="_blank"
                            removeUnderline
                          >
                            Theme app extensions guide
                          </Link>
                        </List.Item>
                        <List.Item>
                          <Link
                            url="https://shopify.dev/docs/apps/flow"
                            target="_blank"
                            removeUnderline
                          >
                            Shopify Flow setup
                          </Link>
                        </List.Item>
                        <List.Item>
                          <Link
                            url="https://shopify.dev/docs/api/admin-graphql"
                            target="_blank"
                            removeUnderline
                          >
                            Admin API reference
                          </Link>
                        </List.Item>
                      </List>
                    </BlockStack>
                  </Card>
                </Layout.Section>
                <Layout.Section variant="oneHalf">
                  <Card>
                    <BlockStack gap="300">
                      <Text as="h2" variant="headingMd">
                        Support
                      </Text>
                      <List>
                        <List.Item>
                          <Link url="mailto:me@willmisback.com" removeUnderline>
                            Contact support
                          </Link>
                        </List.Item>
                        <List.Item>
                          <Link
                            onClick={(e) => {
                              e.preventDefault();
                              const formData = new FormData();
                              formData.append("action", "resetOnboarding");
                              fetcher.submit(formData, { method: "POST" });
                            }}
                            removeUnderline
                          >
                            Return to setup
                          </Link>
                        </List.Item>
                        <List.Item>
                          <Link
                            url="https://feedback.example.com"
                            target="_blank"
                            removeUnderline
                          >
                            Send feedback
                          </Link>
                        </List.Item>
                      </List>
                    </BlockStack>
                  </Card>
                </Layout.Section>
              </Layout>
            </BlockStack>
          </Layout.Section>
        </Layout>
      )}
    </Page>
  );
}
