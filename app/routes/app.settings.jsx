import { useState, useCallback, useEffect, useRef } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Card,
  BlockStack,
  Text,
  TextField,
  Checkbox,
  InlineStack,
  Banner,
  Box,
  Button,
} from "@shopify/polaris";
// App Bridge Web Components are loaded globally via script in root; use <ui-title-bar> and <ui-toast>
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  // Get or create shop
  let shop = await prisma.shop.findUnique({
    where: { shopDomain },
    include: { settings: true },
  });

  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        shopDomain,
        settings: {
          create: {},
        },
      },
      include: { settings: true },
    });
  }

  // Ensure settings exist
  if (!shop.settings) {
    const settings = await prisma.settings.create({
      data: { shopId: shop.id },
    });
    shop.settings = settings;
  }

  return json({
    settings: shop.settings,
  });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const formData = await request.formData();

  // Get shop
  const shop = await prisma.shop.findUnique({
    where: { shopDomain },
    include: { settings: true },
  });

  if (!shop) {
    return json({ error: "Shop not found" }, { status: 404 });
  }

  // Parse form data
  const regionMode = formData.get("regionMode") || "allow";
  const regions = formData.get("regions") || "[]";
  const whitelistCountries = formData.get("whitelistCountries") || "[]";
  const blacklistCountries = formData.get("blacklistCountries") || "[]";
  let popupFields = formData.get("popupFields");
  if (popupFields) {
    // Ensure name and email are always enabled and required
    const fields = JSON.parse(popupFields);
    fields.name = { enabled: true, required: true };
    fields.email = { enabled: true, required: true };
    popupFields = JSON.stringify(fields);
  }
  const draftOrderTags = formData.get("draftOrderTags") || null;
  const hidePrices = formData.get("hidePrices") === "true";

  // Update or create settings
  const settings = await prisma.settings.upsert({
    where: { shopId: shop.id },
    update: {
      regionMode,
      regions,
      whitelistCountries,
      blacklistCountries,
      popupFields,
      draftOrderTags,
      hidePrices,
    },
    create: {
      shopId: shop.id,
      regionMode,
      regions,
      whitelistCountries,
      blacklistCountries,
      popupFields,
      draftOrderTags,
      hidePrices,
    },
  });

  return json({ success: true, settings });
};

export default function Settings() {
  const { settings } = useLoaderData();
  const fetcher = useFetcher();
  const toastRef = useRef(null);

  const [whitelistCountries, setWhitelistCountries] = useState(() => {
    if (!settings?.whitelistCountries) return [];
    try {
      return JSON.parse(settings.whitelistCountries);
    } catch {
      return [];
    }
  });
  const [whitelistText, setWhitelistText] = useState(() => {
    if (!settings?.whitelistCountries) return "";
    try {
      const parsed = JSON.parse(settings.whitelistCountries);
      return Array.isArray(parsed) ? parsed.join(", ") : "";
    } catch {
      return "";
    }
  });
  const [blacklistCountries, setBlacklistCountries] = useState(() => {
    if (!settings?.blacklistCountries) return [];
    try {
      return JSON.parse(settings.blacklistCountries);
    } catch {
      return [];
    }
  });
  const [blacklistText, setBlacklistText] = useState(() => {
    if (!settings?.blacklistCountries) return "";
    try {
      const parsed = JSON.parse(settings.blacklistCountries);
      return Array.isArray(parsed) ? parsed.join(", ") : "";
    } catch {
      return "";
    }
  });
  const [popupFields, setPopupFields] = useState(() => {
    const defaultFields = {
      name: { enabled: true, required: true },
      email: { enabled: true, required: true },
      phone: { enabled: false, required: false },
      company: { enabled: false, required: false },
      notes: { enabled: false, required: false },
    };

    if (settings?.popupFields) {
      const savedFields = JSON.parse(settings.popupFields);
      return { ...defaultFields, ...savedFields };
    }

    return defaultFields;
  });
  const [draftOrderTags, setDraftOrderTags] = useState(
    settings?.draftOrderTags || ""
  );
  const [hidePrices, setHidePrices] = useState(settings?.hidePrices || false);

  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";

  useEffect(() => {
    if (fetcher.data?.success) {
      if (toastRef.current) {
        toastRef.current.setAttribute("content", "Settings saved successfully");
        if (typeof toastRef.current.show === "function") {
          toastRef.current.show();
        }
      }
    }
  }, [fetcher.data]);

  const handleWhitelistTextChange = useCallback((value) => {
    setWhitelistText(value);
    const parsedCountries = value
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length > 0);
    setWhitelistCountries(parsedCountries);
  }, []);

  const handleBlacklistTextChange = useCallback((value) => {
    setBlacklistText(value);
    const parsedCountries = value
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length > 0);
    setBlacklistCountries(parsedCountries);
  }, []);

  const handlePopupFieldChange = useCallback((field, enabled, required) => {
    setPopupFields((prev) => {
      // Name and email are always enabled
      const isAlwaysEnabled = field === "name" || field === "email";
      const currentState = prev[field] || { enabled: false, required: false };
      return {
        ...prev,
        [field]: {
          enabled:
            isAlwaysEnabled || enabled === undefined
              ? isAlwaysEnabled
                ? true
                : currentState.enabled
              : enabled,
          required: required === undefined ? currentState.required : required,
        },
      };
    });
  }, []);

  const handleSave = useCallback(() => {
    // Always ensure name and email are enabled and required
    const fieldsToSave = {
      ...popupFields,
      name: { enabled: true, required: true },
      email: { enabled: true, required: true },
    };

    const formData = new FormData();
    formData.append("regionMode", "allow"); // Keep for backwards compatibility
    formData.append("regions", "[]"); // Keep for backwards compatibility
    formData.append("whitelistCountries", JSON.stringify(whitelistCountries));
    formData.append("blacklistCountries", JSON.stringify(blacklistCountries));
    formData.append("popupFields", JSON.stringify(fieldsToSave));
    formData.append("draftOrderTags", draftOrderTags);
    formData.append("hidePrices", hidePrices.toString());

    fetcher.submit(formData, { method: "POST" });
    shopify.toast.show("Settings saved successfully");
  }, [
    whitelistCountries,
    blacklistCountries,
    popupFields,
    draftOrderTags,
    hidePrices,
    fetcher,
  ]);

  return (
    <s-page heading="Settings">
      <s-button slot="primary-action" onClick={handleSave}>
        Save Settings
      </s-button>
      <ui-toast ref={toastRef}></ui-toast>

      <Box paddingBlockStart="600" paddingBlockEnd="400">
        <BlockStack
          align="center"
          gap="400"
          style={{ maxWidth: "950px", margin: "0 auto" }}
        >
          <Box>
            <BlockStack gap="500">
              <BlockStack gap="500">
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">
                      Country Routing
                    </Text>
                    <Banner status="info" title="Automatic quote requests">
                      <BlockStack gap="300">
                        <Text as="p" variant="bodyMd">
                          Countries that don't have existing shipping profiles
                          in your Shopify store will automatically prompt
                          customers for a quote request instead of showing the
                          checkout button. This helps you handle international
                          shipping requests more efficiently.
                        </Text>
                        <InlineStack blockAlign="center">
                          <Button
                            url="shopify:admin/settings/shipping"
                            target="_blank"
                            variant="secondary"
                          >
                            View shipping profiles
                          </Button>
                        </InlineStack>
                      </BlockStack>
                    </Banner>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Use the whitelist and blacklist below to override the
                      automatic behavior for specific countries. Uses ISO
                      country codes consistent with Shopify shipping settings
                      (e.g., US, CA, GB).
                    </Text>
                    <TextField
                      label="Whitelist Countries"
                      value={whitelistText}
                      onChange={handleWhitelistTextChange}
                      placeholder="US, CA, GB"
                      helpText="Countries in this list will always show the checkout button, even if they don't have shipping profiles. Enter comma-separated ISO country codes."
                      multiline={2}
                    />
                    <TextField
                      label="Blacklist Countries"
                      value={blacklistText}
                      onChange={handleBlacklistTextChange}
                      placeholder="CN, RU, BR"
                      helpText="Countries in this list will always show the quote request button, even if they have shipping profiles. Enter comma-separated ISO country codes."
                      multiline={2}
                    />
                    <Checkbox
                      label="Hide prices for quote request countries"
                      checked={hidePrices}
                      onChange={setHidePrices}
                      helpText="When enabled, prices will be hidden for customers in countries that see quote request buttons instead of checkout. This is useful for B2B merchants who want to provide pricing only after receiving a quote request."
                    />
                  </BlockStack>
                </Card>

                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">
                      Form Fields
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Configure which optional fields appear in the quote
                      request popup. Name and email are always required.
                    </Text>
                    <BlockStack gap="300">
                      <InlineStack gap="400" align="space-between">
                        <BlockStack gap="300">
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            Phone
                          </Text>
                          <Text as="span" variant="bodyMd" tone="subdued">
                            Customer's phone number
                          </Text>
                        </BlockStack>
                        <InlineStack gap="300">
                          <Checkbox
                            label="Enabled"
                            checked={popupFields.phone?.enabled || false}
                            onChange={(value) =>
                              handlePopupFieldChange("phone", value, false)
                            }
                          />
                          <Checkbox
                            label="Required"
                            checked={popupFields.phone?.required || false}
                            onChange={(value) =>
                              handlePopupFieldChange("phone", undefined, value)
                            }
                            disabled={!popupFields.phone?.enabled}
                          />
                        </InlineStack>
                      </InlineStack>
                      <InlineStack gap="400" align="space-between">
                        <BlockStack gap="300">
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            Company
                          </Text>
                          <Text as="span" variant="bodyMd" tone="subdued">
                            Company name (optional)
                          </Text>
                        </BlockStack>
                        <InlineStack gap="300">
                          <Checkbox
                            label="Enabled"
                            checked={popupFields.company?.enabled || false}
                            onChange={(value) =>
                              handlePopupFieldChange("company", value, false)
                            }
                          />
                          <Checkbox
                            label="Required"
                            checked={popupFields.company?.required || false}
                            onChange={(value) =>
                              handlePopupFieldChange(
                                "company",
                                undefined,
                                value
                              )
                            }
                            disabled={!popupFields.company?.enabled}
                          />
                        </InlineStack>
                      </InlineStack>
                      <InlineStack gap="400" align="space-between">
                        <BlockStack gap="300">
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            Notes
                          </Text>
                          <Text as="span" variant="bodyMd" tone="subdued">
                            Additional message from customer
                          </Text>
                        </BlockStack>
                        <InlineStack gap="300">
                          <Checkbox
                            label="Enabled"
                            checked={popupFields.notes?.enabled || false}
                            onChange={(value) =>
                              handlePopupFieldChange("notes", value, false)
                            }
                          />
                        </InlineStack>
                      </InlineStack>
                    </BlockStack>
                  </BlockStack>
                </Card>

                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">
                      Draft Orders
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Tags to apply to draft orders created from quote requests.
                    </Text>
                    <TextField
                      label="Additional Tags"
                      value={draftOrderTags}
                      onChange={setDraftOrderTags}
                      placeholder="custom-order, international"
                      helpText="Enter comma-separated tags"
                    />
                  </BlockStack>
                </Card>

                {fetcher.data?.error && (
                  <Banner status="critical" onDismiss={() => {}}>
                    {fetcher.data.error}
                  </Banner>
                )}
              </BlockStack>
            </BlockStack>
          </Box>
        </BlockStack>
      </Box>
    </s-page>
  );
}
