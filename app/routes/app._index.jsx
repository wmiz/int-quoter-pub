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
  // Show onboarding if regions aren't configured OR theme extension isn't enabled
  const hasConfiguredRegions =
    settings?.regions && JSON.parse(settings.regions || "[]").length > 0;
  const hasThemeExtension = settings?.themeExtensionEnabled || false;
  const showOnboarding =
    !settings || !hasConfiguredRegions || !hasThemeExtension;

  // Get the active theme ID for theme customizer redirect
  let activeThemeId = null;
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
  });
};

export default function Index() {
  const { showOnboarding, activeThemeId, settings, quoteStats, recentQuotes } =
    useLoaderData();
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
  const hasThemeExtension = settings?.themeExtensionEnabled || false;
  const hasDraftOrderTags = settings?.draftOrderTags?.trim().length > 0;

  const setupComplete = hasRegions && hasThemeExtension;

  const setupItems = [
    {
      label: "Configure regions & routing",
      completed: hasRegions,
      actionUrl: "/app/settings",
    },
    {
      label: "Enable theme app extension",
      completed: hasThemeExtension,
      actionUrl: activeThemeId
        ? `shopify:admin/themes/${activeThemeId}/editor?context=apps`
        : "/admin/themes",
    },
    {
      label: "Set draft order tags (optional)",
      completed: hasDraftOrderTags,
      actionUrl: "/app/settings",
    },
  ];

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
                  {settings?.themeExtensionEnabled ? (
                    <Badge status="success">Extension enabled</Badge>
                  ) : (
                    <Badge status="attention">Not enabled</Badge>
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
                        content: "Test the storefront",
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

              {/* Setup Completion */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      Setup Status
                    </Text>
                    {setupComplete && <Badge status="success">Complete</Badge>}
                    {!setupComplete && (
                      <Badge status="attention">Incomplete</Badge>
                    )}
                  </InlineStack>
                  <BlockStack gap="300">
                    {setupItems.map((item, index) => (
                      <InlineStack
                        key={index}
                        align="space-between"
                        blockAlign="center"
                      >
                        <InlineStack gap="300" blockAlign="center">
                          {item.completed ? (
                            <Icon source={CheckIcon} tone="success" />
                          ) : (
                            <Badge status="attention" />
                          )}
                          <Text
                            as="span"
                            variant="bodyMd"
                            tone={item.completed ? undefined : "subdued"}
                          >
                            {item.label}
                          </Text>
                        </InlineStack>
                        {!item.completed && (
                          <Button url={item.actionUrl} size="slim">
                            Configure
                          </Button>
                        )}
                      </InlineStack>
                    ))}
                  </BlockStack>
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
