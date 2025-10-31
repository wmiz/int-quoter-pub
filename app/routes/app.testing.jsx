import { useState, useCallback } from "react";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Select,
  Button,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  // Construct storefront URL
  // For myshopify.com domains, the storefront is https://[shop]
  // For custom domains, we'd need to query the shop, but for now we'll use the shop domain
  const storefrontUrl = `https://${shopDomain}`;

  return json({
    shopDomain,
    storefrontUrl,
  });
};

// Common countries list (ISO country codes)
const COUNTRIES = [
  { label: "Select a country...", value: "" },
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "United Kingdom", value: "GB" },
  { label: "Australia", value: "AU" },
  { label: "Germany", value: "DE" },
  { label: "France", value: "FR" },
  { label: "Italy", value: "IT" },
  { label: "Spain", value: "ES" },
  { label: "Netherlands", value: "NL" },
  { label: "Belgium", value: "BE" },
  { label: "Switzerland", value: "CH" },
  { label: "Austria", value: "AT" },
  { label: "Sweden", value: "SE" },
  { label: "Norway", value: "NO" },
  { label: "Denmark", value: "DK" },
  { label: "Finland", value: "FI" },
  { label: "Poland", value: "PL" },
  { label: "Portugal", value: "PT" },
  { label: "Ireland", value: "IE" },
  { label: "Japan", value: "JP" },
  { label: "South Korea", value: "KR" },
  { label: "China", value: "CN" },
  { label: "India", value: "IN" },
  { label: "Brazil", value: "BR" },
  { label: "Mexico", value: "MX" },
  { label: "Argentina", value: "AR" },
  { label: "New Zealand", value: "NZ" },
  { label: "Singapore", value: "SG" },
  { label: "Hong Kong", value: "HK" },
];

export default function TestQuoteFlow() {
  const { shopDomain, storefrontUrl } = useLoaderData();
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleCountryChange = useCallback((value) => {
    setSelectedCountry(value);
  }, []);

  const handleOpenStorefront = useCallback(() => {
    if (!selectedCountry) {
      return;
    }

    // Construct URL with country parameter
    const url = new URL(storefrontUrl);
    url.searchParams.set("country", selectedCountry);

    // Open in new window
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }, [selectedCountry, storefrontUrl]);

  return (
    <Page>
      <TitleBar title="Testing" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Testing by Country
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Select a country to simulate viewing your storefront from that
                location. The storefront will open in a new window with the
                country parameter set.
              </Text>
              <BlockStack gap="300">
                <Select
                  label="Country"
                  options={COUNTRIES}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                />
                <InlineStack gap="300">
                  <Button
                    primary
                    onClick={handleOpenStorefront}
                    disabled={!selectedCountry}
                  >
                    Open Storefront
                  </Button>
                  <Text as="span" variant="bodyMd" tone="subdued">
                    {selectedCountry
                      ? `Will open: ${storefrontUrl}?country=${selectedCountry}`
                      : "Select a country to continue"}
                  </Text>
                </InlineStack>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
