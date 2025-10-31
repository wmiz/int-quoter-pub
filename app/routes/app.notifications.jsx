import { useCallback, useState, useMemo } from "react";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  List,
  Link,
  Banner,
  Divider,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  // Get shop settings to show configured draft order tags
  let shop = await prisma.shop.findUnique({
    where: { shopDomain },
    include: { settings: true },
  });

  const draftOrderTags =
    shop?.settings?.draftOrderTags || "quote-request, custom-order";
  const tagsArray = draftOrderTags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return json({
    draftOrderTags: tagsArray,
  });
};

// Helper function to generate a UUID v4
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper function to generate a simple hash for the Flow file prefix
function generateHash() {
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
}

// Helper function to build condition JSON for tag checking
function buildTagCondition(tagValue) {
  const conditionUUID = generateUUID();
  const lhsUUID = generateUUID();
  const arrayPathUUID = generateUUID();
  const arrayItemKeyUUID = generateUUID();
  const operationUUID = generateUUID();
  const operationLhsUUID = generateUUID();
  const operationRhsUUID = generateUUID();
  const comparisonLhsUUID = generateUUID();

  return JSON.stringify({
    uuid: conditionUUID,
    lhs: {
      uuid: lhsUUID,
      parent_uuid: conditionUUID,
      array_path: {
        uuid: arrayPathUUID,
        parent_uuid: lhsUUID,
        value: "draftOrder.tags",
        comparison_value_type: "EnvironmentValue",
      },
      array_item_key: {
        uuid: arrayItemKeyUUID,
        parent_uuid: lhsUUID,
        value: "tags_item",
        comparison_value_type: "EnvironmentValue",
      },
      operation: {
        uuid: operationUUID,
        parent_uuid: lhsUUID,
        lhs: {
          uuid: operationLhsUUID,
          parent_uuid: operationUUID,
          lhs: {
            uuid: comparisonLhsUUID,
            parent_uuid: operationLhsUUID,
            value: "tags_item",
            comparison_value_type: "EnvironmentValue",
            full_environment_path: "tags_item",
          },
          rhs: {
            uuid: operationRhsUUID,
            parent_uuid: operationLhsUUID,
            value: tagValue,
            comparison_value_type: "LiteralValue",
          },
          value_type: "EnvironmentScalarDefinition:String",
          operator: "==",
          operation_type: "Comparison",
        },
        operator: "AND",
        operation_type: "LogicalExpression",
      },
      operator: "ANY",
      operation_type: "ArrayExpression",
    },
    operator: "AND",
    operation_type: "LogicalExpression",
  });
}

export default function Notifications() {
  const { draftOrderTags } = useLoaderData();
  const [copied, setCopied] = useState(false);

  const flowTemplate = useMemo(() => {
    const tagValue = draftOrderTags[0] || "quote-request";
    const triggerStepId = generateUUID();
    const conditionStepId = generateUUID();
    const actionStepId = generateUUID();

    const flowData = {
      __metadata: { version: 0.1 },
      root: {
        steps: [
          {
            step_id: triggerStepId,
            step_position: [0, 0],
            config_field_values: [],
            task_id: "shopify::admin::draft_order_created",
            task_version: "0.1",
            task_type: "TRIGGER",
            description: null,
            note: null,
            name: null,
          },
          {
            step_id: conditionStepId,
            step_position: [360, 0],
            config_field_values: [
              {
                config_field_id: "condition",
                value: buildTagCondition(tagValue),
              },
            ],
            task_id: "shopify::flow::condition",
            task_version: "0.1",
            task_type: "CONDITION",
            description: null,
            note: null,
            name: null,
          },
          {
            step_id: actionStepId,
            step_position: [720, 0],
            config_field_values: [
              {
                config_field_id: "address",
                value: "{{ shop.email }}",
              },
              {
                config_field_id: "subject",
                value:
                  "[{{ shop.name }}] New Quote Request: {{ draftOrder.name }}",
              },
              {
                config_field_id: "message",
                value: `A new quote request has been submitted.

Customer: {{ draftOrder.customer.firstName }} {{ draftOrder.customer.lastName }}
Email: {{ draftOrder.customer.email }}
{% if draftOrder.customer.phone %}
Phone: {{ draftOrder.customer.phone }}
{% endif %}

View draft order: {{ shop.url }}/admin/draft_orders/{{ draftOrder.id | split: "/" | last }}`,
              },
            ],
            task_id: "shopify::flow::send_email",
            task_version: "0.1",
            task_type: "ACTION",
            description: null,
            note: null,
            name: null,
          },
        ],
        links: [
          {
            from_step_id: triggerStepId,
            from_port_id: "output",
            to_step_id: conditionStepId,
            to_port_id: "input",
          },
          {
            from_step_id: conditionStepId,
            from_port_id: "true",
            to_step_id: actionStepId,
            to_port_id: "input",
          },
        ],
        patched_fields: [],
        variables: [],
        note: null,
        vertical_layout_enabled: false,
        workflow_name: "GeoQuote - New Quote Request",
      },
    };

    // Shopify Flow files are prefixed with a hash
    const hash = generateHash();
    return `${hash}:${JSON.stringify(flowData)}`;
  }, [draftOrderTags]);

  const handleCopyTemplate = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(flowTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [flowTemplate]);

  const handleDownloadTemplate = useCallback(() => {
    const dataBlob = new Blob([flowTemplate], { type: "text/plain" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "geo-quote-flow-template.flow";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [flowTemplate]);

  return (
    <Page>
      <TitleBar title="Notifications" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Shopify Flow Integration
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Set up automated notifications when customers submit quote
                  requests. GeoQuote creates draft orders with tags that can
                  trigger Shopify Flow automations.
                </Text>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  How It Works
                </Text>
                <List>
                  <List.Item>
                    When a customer submits a quote request, GeoQuote creates a
                    draft order in your Shopify admin.
                  </List.Item>
                  <List.Item>
                    The draft order is tagged with your configured tags (see
                    Settings page).
                  </List.Item>
                  <List.Item>
                    Shopify Flow can trigger on draft order creation and check
                    for these tags.
                  </List.Item>
                  <List.Item>
                    Flow actions can send emails, Slack messages, or trigger
                    other automations.
                  </List.Item>
                </List>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Configured Draft Order Tags
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Your current draft order tags (configured in Settings):
                </Text>
                <BlockStack gap="200">
                  {draftOrderTags.length > 0 ? (
                    draftOrderTags.map((tag, index) => (
                      <Text key={index} as="code" variant="bodyMd">
                        {tag}
                      </Text>
                    ))
                  ) : (
                    <Banner status="warning">
                      No draft order tags configured. Please set up tags in{" "}
                      <Link url="/app/settings">Settings</Link> to use Flow
                      templates.
                    </Banner>
                  )}
                </BlockStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Flow Template Options
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  There are two ways to set up the Flow template for your
                  merchants:
                </Text>

                <BlockStack gap="500">
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingSm">
                      Option 1: Flow Template Extension (Recommended)
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Create a Flow template extension to make the template
                      available in Shopify's Flow template library. This allows
                      merchants to easily discover and install your template
                      directly from Flow.
                    </Text>
                    <Banner status="info">
                      <Text as="p" variant="bodyMd">
                        <strong>Benefits:</strong> Templates appear in Flow's
                        template library, making them discoverable by all
                        merchants. No manual import required.
                      </Text>
                    </Banner>
                    <BlockStack gap="200">
                      <Text as="h4" variant="headingSm">
                        Steps to Create Extension:
                      </Text>
                      <List type="number">
                        <List.Item>
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            1. Export the workflow:
                          </Text>
                          <BlockStack gap="200">
                            <Text as="p" variant="bodyMd" tone="subdued">
                              Download the template below, then in your dev
                              store navigate to Apps → Flow → Create workflow →
                              Import workflow. Import the downloaded .flow file
                              to test and verify it works correctly.
                            </Text>
                          </BlockStack>
                        </List.Item>
                        <List.Item>
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            2. Generate the extension:
                          </Text>
                          <BlockStack gap="200">
                            <Text as="p" variant="bodyMd" tone="subdued">
                              Run the following command in your app directory:
                            </Text>
                            <Text as="code" variant="bodyMd">
                              shopify app generate extension
                            </Text>
                            <Text as="p" variant="bodyMd" tone="subdued">
                              Select "Flow Template" as the extension type and
                              provide a meaningful name (e.g.,
                              "geo-quote-notifications").
                            </Text>
                          </BlockStack>
                        </List.Item>
                        <List.Item>
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            3. Configure the extension:
                          </Text>
                          <BlockStack gap="200">
                            <Text as="p" variant="bodyMd" tone="subdued">
                              Replace the generated template.flow file with the
                              downloaded template. Update shopify.extension.toml
                              to include template description and metadata.
                            </Text>
                          </BlockStack>
                        </List.Item>
                        <List.Item>
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            4. Preview and deploy:
                          </Text>
                          <BlockStack gap="200">
                            <Text as="p" variant="bodyMd" tone="subdued">
                              Run <Text as="code">shopify app dev</Text> to
                              preview at /flow/editor/templates/dev. Deploy with{" "}
                              <Text as="code">shopify app deploy</Text> when
                              ready.
                            </Text>
                          </BlockStack>
                        </List.Item>
                      </List>
                      <Link
                        url="https://shopify.dev/docs/apps/flow/templates/create"
                        target="_blank"
                        removeUnderline
                      >
                        Learn more about Flow template extensions →
                      </Link>
                    </BlockStack>
                  </BlockStack>

                  <Divider />

                  <BlockStack gap="300">
                    <Text as="h3" variant="headingSm">
                      Option 2: Manual Import
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Download or copy the template file and manually import it
                      into Flow. This is useful for quick testing or if you
                      prefer to distribute templates separately.
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      This template includes:
                    </Text>
                    <List>
                      <List.Item>Trigger: Draft order created event</List.Item>
                      <List.Item>
                        Condition: Checks for your configured draft order tags
                      </List.Item>
                      <List.Item>
                        Action: Sends email notification with customer details
                      </List.Item>
                    </List>
                    <BlockStack gap="300">
                      <InlineStack gap="300">
                        <Button primary onClick={handleDownloadTemplate}>
                          Download Template
                        </Button>
                        <Button onClick={handleCopyTemplate}>
                          {copied ? "Copied!" : "Copy Template"}
                        </Button>
                      </InlineStack>
                    </BlockStack>
                  </BlockStack>
                </BlockStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Template Setup & Customization
                </Text>
                <BlockStack gap="300">
                  <Text as="h3" variant="headingSm">
                    For Merchants: Installing the Template
                  </Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    If you've created a Flow template extension, merchants will
                    find it in Flow's template library. Otherwise, they can
                    manually import the template:
                  </Text>
                  <List type="number">
                    <List.Item>
                      Ensure Shopify Flow is enabled (available on Shopify Plus
                      or through the Flow app)
                    </List.Item>
                    <List.Item>
                      Navigate to Apps → Flow → Create workflow
                    </List.Item>
                    <List.Item>
                      Click "Import workflow" and upload the .flow file
                    </List.Item>
                    <List.Item>
                      Review and customize the email recipient, subject, and
                      message as needed
                    </List.Item>
                    <List.Item>
                      Update the tag condition to match your configured draft
                      order tags if necessary
                    </List.Item>
                  </List>

                  <Text as="h3" variant="headingSm">
                    Customization Options
                  </Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    The template can be customized after import:
                  </Text>
                  <List>
                    <List.Item>
                      Change the email recipient address (defaults to shop
                      email)
                    </List.Item>
                    <List.Item>
                      Modify the email subject and message body using Liquid
                      templating
                    </List.Item>
                    <List.Item>
                      Add additional actions like Slack notifications, SMS, or
                      webhooks
                    </List.Item>
                    <List.Item>
                      Adjust conditions to check for multiple tags or add
                      additional filters
                    </List.Item>
                    <List.Item>
                      Customize which draft order fields are included in the
                      notification
                    </List.Item>
                  </List>

                  <Text as="h3" variant="headingSm">
                    Testing the Flow
                  </Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    After setting up your Flow automation, use the{" "}
                    <Link url="/app/testing" removeUnderline>
                      Testing page
                    </Link>{" "}
                    to submit a test quote request. Verify that:
                  </Text>
                  <List>
                    <List.Item>
                      A draft order is created with the correct tags
                    </List.Item>
                    <List.Item>
                      The Flow automation triggers correctly
                    </List.Item>
                    <List.Item>
                      The email notification is sent with accurate information
                    </List.Item>
                  </List>
                </BlockStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Draft Order Data Structure
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  GeoQuote includes the following information in draft orders
                  for use in Flow templates:
                </Text>
                <BlockStack gap="300">
                  <Text as="h3" variant="headingSm">
                    Tags
                  </Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    The draft order will have tags matching your configured
                    settings (e.g., "quote-request", "custom-order"). Use these
                    in Flow conditions.
                  </Text>

                  <Text as="h3" variant="headingSm">
                    Note Attributes (Custom Fields)
                  </Text>
                  <List>
                    <List.Item>
                      <Text as="code" variant="bodyMd">
                        Country
                      </Text>{" "}
                      - ISO country code of the customer
                    </List.Item>
                    <List.Item>
                      <Text as="code" variant="bodyMd">
                        Company
                      </Text>{" "}
                      - Company name (if provided)
                    </List.Item>
                    <List.Item>
                      <Text as="code" variant="bodyMd">
                        Notes
                      </Text>{" "}
                      - Additional customer message (if provided)
                    </List.Item>
                  </List>

                  <Text as="h3" variant="headingSm">
                    Customer Information
                  </Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Customer details are linked to the draft order:
                  </Text>
                  <List>
                    <List.Item>
                      <Text as="code" variant="bodyMd">
                        customer.email
                      </Text>{" "}
                      - Customer email address (required)
                    </List.Item>
                    <List.Item>
                      <Text as="code" variant="bodyMd">
                        customer.first_name
                      </Text>{" "}
                      - Customer first name (required)
                    </List.Item>
                    <List.Item>
                      <Text as="code" variant="bodyMd">
                        customer.last_name
                      </Text>{" "}
                      - Customer last name (required)
                    </List.Item>
                    <List.Item>
                      <Text as="code" variant="bodyMd">
                        customer.phone
                      </Text>{" "}
                      - Phone number (if provided)
                    </List.Item>
                  </List>

                  <Text as="h3" variant="headingSm">
                    Line Items
                  </Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    The draft order includes all cart items with quantities,
                    variants, and pricing information.
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Additional Resources
                </Text>
                <List>
                  <List.Item>
                    <Link
                      url="https://shopify.dev/docs/apps/flow/templates/create"
                      target="_blank"
                      removeUnderline
                    >
                      Creating Flow Template Extensions
                    </Link>
                  </List.Item>
                  <List.Item>
                    <Link
                      url="https://help.shopify.com/en/manual/flow"
                      target="_blank"
                      removeUnderline
                    >
                      Shopify Flow Help Center
                    </Link>
                  </List.Item>
                  <List.Item>
                    <Link
                      url="https://shopify.dev/docs/apps/flow"
                      target="_blank"
                      removeUnderline
                    >
                      Shopify Flow Developer Documentation
                    </Link>
                  </List.Item>
                  <List.Item>
                    <Link
                      url="https://help.shopify.com/en/manual/orders/draft-orders"
                      target="_blank"
                      removeUnderline
                    >
                      Understanding Draft Orders
                    </Link>
                  </List.Item>
                </List>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
