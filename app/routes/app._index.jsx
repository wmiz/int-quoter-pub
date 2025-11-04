import { useLoaderData, useSearchParams } from "@remix-run/react";
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
  Icon,
  Box,
} from "@shopify/polaris";
import { CheckIcon } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import prisma from "../db.server";

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
  // Show onboarding if regions aren't configured
  const hasConfiguredRegions =
    settings?.regions && JSON.parse(settings.regions || "[]").length > 0;
  const showOnboarding = !settings || !hasConfiguredRegions;

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
                  // Format: shopify://apps/geo-quote/blocks/<block_name>/<unique_ID>
                  if (
                    block.type &&
                    typeof block.type === "string" &&
                    block.type.includes("shopify://apps/") &&
                    block.type.includes("/blocks/") &&
                    block.type.includes("geo-quote")
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

  // TODO: Fetch actual quote requests from draft orders
  // Filter by date range: created_at >= startDate AND created_at <= now
  // For now, using placeholder data
  const quoteStats = {
    totalRequests: 0, // Placeholder - total number of quote requests in selected period
    totalRevenue: 0, // Placeholder - total revenue from quote requests in selected period
    timePeriod, // Include selected period in response
  };

  const recentQuotes = []; // Placeholder - will be populated from draft orders

  return json({
    showOnboarding,
    activeThemeId,
    settings,
    quoteStats,
    recentQuotes,
    appEmbedActive,
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
  } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current time period from search params or default to "30"
  const currentPeriod = searchParams.get("period") || "30";

  // Handle time period change
  const handlePeriodChange = (period) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("period", period);
    setSearchParams(newSearchParams);
  };

  // Determine setup completion status
  const hasRegions =
    settings?.regions && JSON.parse(settings.regions || "[]").length > 0;

  const setupComplete = hasRegions && appEmbedActive;

  return (
    <Page>
      <TitleBar
        title={showOnboarding ? "GeoQuote Setup" : "Dashboard"}
      ></TitleBar>
      {showOnboarding ? (
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Set up GeoQuote
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
                      <Link url="mailto:support@example.com" removeUnderline>
                        Contact support
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      ) : (
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              {/* Setup Completion */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      App Embed Status
                    </Text>
                    {setupComplete && (
                      <Badge status="success">
                        <Box
                          as="span"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Box
                            as="span"
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "#008060",
                              display: "inline-block",
                            }}
                          />
                          <span>Active</span>
                        </Box>
                      </Badge>
                    )}
                    {!setupComplete && (
                      <Badge status="attention">
                        <Box
                          as="span"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Box
                            as="span"
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "#ffc453",
                              display: "inline-block",
                            }}
                          />
                          <span>Needs attention</span>
                        </Box>
                      </Badge>
                    )}
                  </InlineStack>
                  {!setupComplete && (
                    <>
                      <Text as="p" variant="bodyMd" tone="subdued">
                        Add and enable the app embed block in your theme to
                        activate GeoQuote.
                      </Text>
                      <InlineStack gap="300">
                        {activeThemeId ? (
                          <Button
                            url={`shopify:admin/themes/${activeThemeId}/editor?context=apps`}
                            target="_blank"
                          >
                            Configure
                          </Button>
                        ) : (
                          <Button url="/admin/themes" target="_blank">
                            Configure
                          </Button>
                        )}
                      </InlineStack>
                    </>
                  )}
                </BlockStack>
              </Card>

              {/* Statistics Cards */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingMd">
                      Statistics
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
                    <Layout.Section variant="oneHalf">
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
                    <Layout.Section variant="oneHalf">
                      <Card>
                        <BlockStack gap="300">
                          <Text as="h2" variant="headingMd">
                            Total Revenue
                          </Text>
                          <Text as="h1" variant="heading2xl">
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
                    <Button url="/app/quotes" variant="plain">
                      View all quote requests
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
                        quote.actions,
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
                          <Link
                            url="mailto:support@example.com"
                            removeUnderline
                          >
                            Contact support
                          </Link>
                        </List.Item>
                        <List.Item>
                          <Link
                            url="https://help.example.com"
                            target="_blank"
                            removeUnderline
                          >
                            Help center
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
