import { useState, useCallback, useEffect, useRef } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Select,
  TextField,
  Checkbox,
  InlineStack,
  Banner,
  Box,
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
  let popupFields = formData.get("popupFields");
  if (popupFields) {
    // Ensure name and email are always enabled and required
    const fields = JSON.parse(popupFields);
    fields.name = { enabled: true, required: true };
    fields.email = { enabled: true, required: true };
    popupFields = JSON.stringify(fields);
  }
  const draftOrderTags = formData.get("draftOrderTags") || null;
  const themeExtensionEnabled =
    formData.get("themeExtensionEnabled") === "true";

  // Update or create settings
  const settings = await prisma.settings.upsert({
    where: { shopId: shop.id },
    update: {
      regionMode,
      regions,
      popupFields,
      draftOrderTags,
      themeExtensionEnabled,
    },
    create: {
      shopId: shop.id,
      regionMode,
      regions,
      popupFields,
      draftOrderTags,
      themeExtensionEnabled,
    },
  });

  return json({ success: true, settings });
};

export default function Settings() {
  const { settings } = useLoaderData();
  const fetcher = useFetcher();
  const toastRef = useRef(null);

  const [regionMode, setRegionMode] = useState(settings?.regionMode || "allow");
  const [regions, setRegions] = useState(
    settings?.regions ? JSON.parse(settings.regions) : []
  );
  const [regionsText, setRegionsText] = useState(
    settings?.regions ? JSON.parse(settings.regions).join(", ") : ""
  );
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
  const [themeExtensionEnabled, setThemeExtensionEnabled] = useState(
    settings?.themeExtensionEnabled || false
  );

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

  const handleRegionModeChange = useCallback((value) => {
    setRegionMode(value);
  }, []);

  const handleRegionsTextChange = useCallback((value) => {
    setRegionsText(value);
    const parsedRegions = value
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
    setRegions(parsedRegions);
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
    formData.append("regionMode", regionMode);
    formData.append("regions", JSON.stringify(regions));
    formData.append("popupFields", JSON.stringify(fieldsToSave));
    formData.append("draftOrderTags", draftOrderTags);
    formData.append("themeExtensionEnabled", themeExtensionEnabled.toString());

    fetcher.submit(formData, { method: "POST" });
    shopify.toast.show("Settings saved successfully");
  }, [
    regionMode,
    regions,
    popupFields,
    draftOrderTags,
    themeExtensionEnabled,
    fetcher,
  ]);

  const regionModeOptions = [
    { label: "Block list (exclude these regions)", value: "block" },
    { label: "Allow list (only these regions)", value: "allow" },
  ];

  return (
    <s-page heading="Settings">
      <s-button slot="primary-action" onClick={handleSave}>
        Save Settings
      </s-button>
      <ui-toast ref={toastRef}></ui-toast>

      <Box paddingBlockStart="600" paddingBlockEnd="400">
        <BlockStack align="center" gap="400">
          <Box style={{ margin: "0 auto" }}>
            <BlockStack gap="500">
              <BlockStack gap="500">
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">
                      Regions & Routing
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Configure which countries should be redirected to the
                      quote flow. Uses ISO country codes consistent with Shopify
                      shipping settings.
                    </Text>
                    <Select
                      label="Region mode"
                      options={regionModeOptions}
                      value={regionMode}
                      onChange={handleRegionModeChange}
                    />
                    <TextField
                      label="ISO Country Codes"
                      value={regionsText}
                      onChange={handleRegionsTextChange}
                      placeholder="US, CA, GB, AU"
                      helpText="Enter comma-separated ISO country codes (e.g., US, CA, GB)"
                      multiline={2}
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

                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">
                      Theme Extension
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Track whether the theme app extension has been installed
                      and configured in your theme.
                    </Text>
                    <Checkbox
                      label="Theme extension enabled"
                      checked={themeExtensionEnabled}
                      onChange={setThemeExtensionEnabled}
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
