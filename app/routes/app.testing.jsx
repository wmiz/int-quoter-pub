import { useState, useCallback } from "react";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Card,
  BlockStack,
  Text,
  Select,
  Button,
  InlineStack,
  Box,
} from "@shopify/polaris";
// Using App Bridge Web Components for TitleBar
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

// Helper function to convert ISO country code to emoji flag
const getCountryFlag = (countryCode) => {
  if (!countryCode) return "";
  // Convert country code to regional indicator symbols
  // Regional Indicator Symbol Letter A starts at 0x1F1E6
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 0x1f1e6 + (char.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
};

// Common countries list (ISO country codes)
const COUNTRIES = [
  { label: "Select a country...", value: "" },
  { label: `${getCountryFlag("US")} United States`, value: "US" },
  { label: `${getCountryFlag("CA")} Canada`, value: "CA" },
  { label: `${getCountryFlag("GB")} United Kingdom`, value: "GB" },
  { label: `${getCountryFlag("AU")} Australia`, value: "AU" },
  { label: `${getCountryFlag("DE")} Germany`, value: "DE" },
  { label: `${getCountryFlag("FR")} France`, value: "FR" },
  { label: `${getCountryFlag("IT")} Italy`, value: "IT" },
  { label: `${getCountryFlag("ES")} Spain`, value: "ES" },
  { label: `${getCountryFlag("NL")} Netherlands`, value: "NL" },
  { label: `${getCountryFlag("BE")} Belgium`, value: "BE" },
  { label: `${getCountryFlag("CH")} Switzerland`, value: "CH" },
  { label: `${getCountryFlag("AT")} Austria`, value: "AT" },
  { label: `${getCountryFlag("SE")} Sweden`, value: "SE" },
  { label: `${getCountryFlag("NO")} Norway`, value: "NO" },
  { label: `${getCountryFlag("DK")} Denmark`, value: "DK" },
  { label: `${getCountryFlag("FI")} Finland`, value: "FI" },
  { label: `${getCountryFlag("PL")} Poland`, value: "PL" },
  { label: `${getCountryFlag("PT")} Portugal`, value: "PT" },
  { label: `${getCountryFlag("IE")} Ireland`, value: "IE" },
  { label: `${getCountryFlag("JP")} Japan`, value: "JP" },
  { label: `${getCountryFlag("KR")} South Korea`, value: "KR" },
  { label: `${getCountryFlag("CN")} China`, value: "CN" },
  { label: `${getCountryFlag("IN")} India`, value: "IN" },
  { label: `${getCountryFlag("BR")} Brazil`, value: "BR" },
  { label: `${getCountryFlag("MX")} Mexico`, value: "MX" },
  { label: `${getCountryFlag("AR")} Argentina`, value: "AR" },
  { label: `${getCountryFlag("NZ")} New Zealand`, value: "NZ" },
  { label: `${getCountryFlag("SG")} Singapore`, value: "SG" },
  { label: `${getCountryFlag("HK")} Hong Kong`, value: "HK" },
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
    url.searchParams.set("gq_country", selectedCountry);

    // Open in new window
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }, [selectedCountry, storefrontUrl]);

  return (
    <Page>
      <ui-title-bar title="Testing"></ui-title-bar>
      <Box>
        <BlockStack align="center" gap="400">
          <Box width="100%">
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
                  <InlineStack gap="300" blockAlign="center">
                    <Button
                      variant="primary"
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
          </Box>
        </BlockStack>
      </Box>
    </Page>
  );
}
