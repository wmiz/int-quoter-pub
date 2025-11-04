import { useCallback } from "react";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Card,
  BlockStack,
  Text,
  Button,
  List,
  Link,
} from "@shopify/polaris";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  // Extract shop name from domain (e.g., "willmisback" from "willmisback.myshopify.com")
  const shopName = shopDomain.replace(".myshopify.com", "");
  const flowUrl = `https://admin.shopify.com/store/${shopName}/apps/flow`;

  return json({ flowUrl });
};

export default function Notifications() {
  const { flowUrl } = useLoaderData();

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = "/geo-quote-notifications.flow";
    link.download = "geo-quote-notifications.flow";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <Page>
      <ui-title-bar title="Notifications"></ui-title-bar>
      <BlockStack gap="500">
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Shopify Flow Integration
            </Text>
            <Text as="p" variant="bodyMd" tone="subdued">
              Download the GeoQuote workflow file and import it into Shopify
              Flow to receive email notifications when customers submit quote
              requests.
            </Text>
            <Button variant="primary" size="large" onClick={handleDownload}>
              Download Flow File
            </Button>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              How to Set Up Notifications
            </Text>
            <BlockStack gap="400">
              <BlockStack gap="300">
                <Text as="span" variant="headingSm" fontWeight="semibold">
                  1. Download the workflow file
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Click the "Download Flow File" button above to download the
                  workflow file to your computer.
                </Text>
              </BlockStack>
              <BlockStack gap="300">
                <Text as="span" variant="headingSm" fontWeight="semibold">
                  2. Import into Shopify Flow
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  In your Shopify admin, navigate to{" "}
                  <Link url={flowUrl} target="_blank" removeUnderline>
                    <Text as="strong">Apps → Flow</Text>
                  </Link>
                  . Click "Import" and select the downloaded .flow file.
                </Text>
              </BlockStack>
              <BlockStack gap="300">
                <Text as="span" variant="headingSm" fontWeight="semibold">
                  3. Modify the email address
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  After importing, click on the "Send internal email" action
                  step in the workflow editor and update the email address from{" "}
                  <Text as="code">test@example.com</Text> to your desired email
                  address.
                </Text>
              </BlockStack>
              <BlockStack gap="300">
                <Text as="span" variant="headingSm" fontWeight="semibold">
                  4. Activate the workflow
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Once you've updated the email address, save and activate the
                  workflow. You'll now receive email notifications whenever a
                  customer submits a quote request.
                </Text>
              </BlockStack>
            </BlockStack>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              What This Workflow Does
            </Text>
            <Text as="p" variant="bodyMd" tone="subdued">
              The downloaded workflow automates email notifications for quote
              requests:
            </Text>
            <List>
              <List.Item>
                <Text as="strong">Trigger:</Text> Activates when a draft order
                is created in your store
              </List.Item>
              <List.Item>
                <Text as="strong">Condition:</Text> Checks if the draft order
                has the tag <Text as="code">gq_request</Text>
              </List.Item>
              <List.Item>
                <Text as="strong">Action:</Text> Sends an email notification to
                the configured address with details about the quote request,
                including customer information and a link to view the draft
                order
              </List.Item>
            </List>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
