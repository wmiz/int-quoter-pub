---
title: Checklist of requirements for apps in the Shopify App Store
description: >-
  Follow these requirements to make sure your app provides a high-quality
  experience to merchants. This is the same checklist that the Shopify App
  Review team uses to review apps.
source_url:
  html: "https://shopify.dev/docs/apps/launch/app-requirements-checklist"
  md: "https://shopify.dev/docs/apps/launch/app-requirements-checklist.md"
---

ExpandOn this page

- [General requirements for all apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#general-requirements-for-all-apps)
- [1.​Prohibited and restricted app configurations](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#1-prohibited-and-restricted-app-configurations)
- [2.​Installation and setup](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#2-installation-and-setup)
- [3.​Functionality and quality](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#3-functionality-and-quality)
- [4.​App performance](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#4-app-performance)
- [5.​App listing](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#5-app-listing)
- [6.​Security and merchant risk](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#6-security-and-merchant-risk)
- [7.​Data and user privacy](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#7-data-and-user-privacy)
- [8.​Support](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#8-support)
- [Specific requirements for certain app configurations](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#specific-requirements-for-certain-app-configurations)
- [9.​Online store](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#9-online-store)
- [10.​Embedded apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#10-embedded-apps)
- [11.​Product sourcing](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#11-product-sourcing)
- [12.​Mobile app builders](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#12-mobile-app-builders)
- [13.​Sales channels](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#13-sales-channels)
- [14.​Purchase option apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#14-purchase-option-apps)
- [15.​Donation distribution apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#15-donation-distribution-apps)
- [16.​Payments apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#16-payments-apps)
- [17.​Post Purchase apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#17-post-purchase-apps)
- [18.​Checkout apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#18-checkout-apps)
- [19.​Blockchain apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#19-blockchain-apps)
- [Next steps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#next-steps)

# Checklist of requirements for apps in the Shopify App Store

The following requirements are used at Shopify to review all apps [distributed through the Shopify App Store](https://shopify.dev/docs/apps/launch/distribution). These requirements are the same for both [full and limited visibility](https://shopify.dev/docs/apps/launch/distribution/visibility) apps. They're intended to provide the best experience across the entire app lifecycle, from branding, to installation, to onboarding, functionality, and quality. By following them, you can make sure that the review process is as quick as possible when you submit your own apps.

Some app types, such as sales channel or checkout apps, need to meet additional requirements based on how they're configured. Some requirements might also apply to custom apps. Check [the specific requirements for certain app configurations](#specific-requirements-for-certain-app-configurations) to make sure your app meets all requirements.

Caution

These requirements are subject to change, as we're continuously making improvements to the Shopify App Store and developer platform. The App Excellence Team conducts [quality checks](https://shopify.dev/docs/apps/launch/app-store-review/app-quality-checks) regularly. Your app is expected to meet any new requirements that are added here. The Shopify App Review team can reject an app at their discretion if it doesn't meet the set standards.

---

## General requirements for all apps

The requirements in this section apply to both full and limited visibility apps distributed through the Shopify App Store. Depending on how your app is configured, it might also need to meet the requirements in the [Specific requirements for certain app configurations](#specific-requirements-for-certain-app-configurations) section below.

---

## 1.​Prohibited and restricted app configurations

Some types of apps aren't permitted on the Shopify App Store and others must have their visibility set to limited visibility.

### Prohibited app types

The following app types aren't permitted on the Shopify App Store:

1. **Apps that are pieces of standalone software that need to be downloaded to a computer** - Your app must not require a desktop app to function.
2. **Apps that mostly rely on merchant or Partner interaction to operate** - Apps that rely on mainly person-to-person interactions should consider listing as a service in our [Partner Directory](https://help.shopify.com/partners/directory).
3. **Apps that make little or no use of Shopify's APIs** - Apps that don't make use of Shopify’s public app APIs are not permitted on the Shopify App Store. Merchants shouldn't be required to set up custom apps as part of the app functionality.
4. **Apps that falsify data to deceive merchants or buyers** - Apps must not violate our [Partner Program Agreement](https://www.shopify.ca/partners/terms) as well as our [Acceptable Use Policy](https://www.shopify.com/legal/aup). Your app should only use factual information in popups and notifications.
5. **Apps that process payments outside of Shopify's checkout** - Shopify can't guarantee the safety or security of an order that has been placed through an offsite or third party checkout. Apps that bypass checkout or payment processing, or register any transactions through the Shopify API in connection with such activity, are prohibited.
6. **Multiple apps with overlapping functionality created by the same Partner** - App must not be identical to other apps you've published to the Shopify App Store. Learn more about duplicate apps in our [Partner Program Agreement](https://www.shopify.com/ca/partners/terms).
7. **Apps that enable marketplace features** - Apps that allow merchants to turn their stores into marketplaces can't be distributed through the Shopify App Store.
8. **Apps that offer or promote capital funding** - Apps that provide capital funding (including but not limited to loans, cash advances, and purchase of receivables) cannot be distributed through the Shopify App Store. These types of services are difficult to monitor on an ongoing basis, and in a manner that makes sure merchants are protected from unsound lending practices.
9. **Apps with restricted beta API scopes enabled** - If your app has been granted access to beta testing API scopes, then you can't submit your app to the Shopify App Store. For announcements about when betas become publicly available, visit the [.dev Community forums](https://community.shopify.dev/).
10. **Apps that primarily function to share or provide merchant data to third parties** - Apps that primarily function to share or provide merchant data to one or more third parties must have prior written consent from Shopify and must comply with our [API Terms](https://www.shopify.com/legal/api-terms). Otherwise, they aren't eligible to be listed on the Shopify App Store. Each third party that receives merchant data using the app must agree to Shopify's API Terms.
11. **Apps that connect merchants to external developers** - Apps that connect merchants to agencies and freelancers cannot be distributed through the Shopify App Store.
12. **Apps that require a browser extension to function** - Browser extensions are only permitted as an optional feature.
13. **Apps that provide refunds** - Your app must not offer methods for processing refunds outside of the original payment processor, except when [issuing refunds for store credit](https://shopify.dev/docs/api/admin-graphql/unstable/input-objects/ReturnProcessRefundInput#fields-refundMethods.fields.storeCreditRefund).
14. **Apps that connect to an established payments gateway** - Apps that connect to established payments gateways to provide services that aren't related to processing payments aren't permitted on the Shopify App Store.
15. **Unauthorized payment apps** - Payment Gateway apps must be authorized through an [application process](https://shopify.dev/docs/apps/build/payments/payments-extension-review). They must be built using the [Payments Apps API](https://shopify.dev/docs/api/payments-apps). [Review the requirements](https://shopify.dev/docs/apps/launch/app-requirements-checklist#16-payments-apps) for more information.
16. **Apps that bypass Shopify's Theme Store** - Your app must not allow merchants to download themes. Themes can only be installed using the Shopify Theme Store.
17. **Apps that facilitate duplication of protected products** - Your app should only duplicate product information that the merchant has the proper permission to use: their own products, or officially licensed or dropshipped products. Marketing claims like “import from any store in the world” or “copy the product information from any website”, whether using your app or a Chrome extension, aren't acceptable.
18. **Apps that connect to a Third Party POS** - Shopify is not currently accepting apps that connect to a POS system outside of Shopify. This applies to all apps that connect to a POS system outside of Shopify.
19. **Apps that add optional charges to buyer carts or checkouts** — Apps can't automatically add or pre-select optional charges to a buyer's cart that increase the total checkout price. Apps can only add optional charges to carts or at checkout after displaying the additional cost in a manner that is clear to the buyer, and upon obtaining explicit buyer consent.
20. **Apps that increase default shipping prices** — Apps can't alter or re-order shipping options in a manner that increases the default shipping price. The cheapest shipping option must always be selected by default. This restriction doesn't apply to non-shipping delivery methods, such as in-store pickup, local delivery, and pickup points.

---

## 2.​Installation and setup

These requirements make sure that merchants can quickly set up and start using your app. The installation requirements describe the correct flows for authentication, app install charges, and any sign-up steps (if required). These requirements make sure that you provide merchants with the guidance they need when they start learning to use your app.

### A.​Authentication

1. Your app must immediately authorize using [OAuth](https://shopify.dev/docs/apps/build/authentication-authorization) before any other steps occur, even if the merchant has previously installed and then uninstalled your app.

2. Merchants shouldn't be able to interact with the user interface (UI) before OAuth.

   ![A diagram of the authentication flow. When the merchant clicks the 'Add app' button for an app, they are taken to the app's OAuth grant page in the Shopify admin.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/authentication-B-5t63Ui.png)

### B.​Permissions

[Permissions](https://shopify.dev/docs/api/usage/access-scopes) are the levels of access that your app has to a merchant's store through the API. The permissions that you request are shown to the merchant on the OAuth grant page, where the merchant can either grant or decline them.

![The list of permissions on an app's OAuth grant page.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/permissions-CrqaLqTb.png)

1. Your app must redirect merchants to the user interface (UI) after they accept permissions access on the OAuth grant page.
2. Your app will only be granted [permissions and access scopes](https://shopify.dev/docs/api/usage/access-scopes) that are necessary for it to function, or for approved use cases.

### C.​Setup and merchant workflows

1. Any connection that your app makes from its UI to either link to another shop or install other apps must go through the Shopify App Store listing first.

2. Apps must be installed and initiated only on Shopify services. Your app must not request the manual entry of a myshopify.com URL or a shop's domain during the installation or configuration flow.

3. For merchant security, your app must not use pop-up windows for essential app functionality, like running OAuth or approving app charges. Avoiding the use of pop-up windows also protects your app from being compromised by pop-up blockers.

4. If your app adds secondary payments to orders because of post-purchase upsells or other order edits, then you need to tell merchants that orders might have multiple payments associated with them. Include a note in your Shopify App Store listing and the app setup instructions to tell merchants that if they're capturing payments manually, then they might need to capture more than one payment for a single order.

---

## 3.​Functionality and quality

For your app to be successful, it should offer a consistent and positive experience for the merchants who use it. The following functionality and quality requirements apply to the core features of your app, such as its user interface, performance, and billing.

### A.​User interface

By offering a great user interface, you can make it easier for merchants to use your app to grow their businesses. Your app's user interface must meet the following requirements:

1. Your app in the Shopify App Store must be operational through a UI regardless of how it's launched. Web errors such as 404s, 500s, and 300s aren't acceptable.
2. Your app must explicitly inform merchants if it adds secondary payments to their customers' orders. Merchants must be aware that they may need to capture these secondary payments separately when using the manual payment capture method. It is essential to include this note in both your app's listing and within the app's user interface.
3. Your app doesn't use [admin UI blocks, admin actions](https://shopify.dev/docs/apps/design-guidelines/app-structure#admin-ui-extensions), or [admin links](https://shopify.dev/docs/apps/build/admin/admin-links) to promote your app, promote related apps, or request reviews.
4. [Admin UI blocks, admin actions](https://shopify.dev/docs/apps/design-guidelines/app-structure#admin-ui-extensions), and [admin links](https://shopify.dev/docs/apps/build/admin/admin-links) must be feature-complete, and provide novel functionality or content.

Tip

Need help designing and building your app's user interface? The resources at [Shopify Polaris](https://polaris.shopify.com/) are a great place to start.

### B.​Billing

Shopify offers managed pricing as well as an API-based billing system to support different types of app charges. It bills merchants through the same system that's used for their Shopify subscription, and makes it easier for them to keep track of their payments.

![An example of an app's billing page. It shows the name of the app, the amount of the charge, whether the charge is recurring, and how often the charge recurs.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/billing-screen-DUOwbiRN.png)

#### General Shopify billing requirements

1. Your app must use [managed pricing](https://shopify.dev/docs/apps/launch/billing/managed-pricing) or the [Billing API](https://shopify.dev/docs/apps/launch/billing) to charge merchants, unless you've received an exemption from Shopify.

#### Billing API requirements

1. Your app must allow merchants to upgrade and downgrade their pricing plan without having to contact your support team or having to reinstall the app.

   This includes ensuring that the charges are successfully processed in the application charge history page in the merchant admin.

2. Enterprise-level pricing plans must be referenced in the **Description of additional charges** section of the pricing section of the app's listing.

3. If your app has any charges, it must implement the [Billing API](https://shopify.dev/docs/apps/billing) so it can accept, decline, and [request approval for charges again on reinstall](https://shopify.dev/docs/apps/billing/subscriptions).

### C.​State of the app

Caution

Make sure your app is compliant with the latest [Google Chrome cookie behavior](https://www.chromium.org/updates/same-site) and [compatible with the SameSite cookie attribute](https://shopify.dev/docs/apps/build/authentication-authorization/session-tokens).

Merchants are busy, and every minute matters when running their businesses. By making sure that your app performs well, you can help merchants achieve their goals faster and spend more time on the problems that need their attention the most.

1. Your app must be complete and testable. That means there shouldn't be user interface bugs, display issues, or error pages that prevent our reviewers from testing the app.

   For example, an app might fail this requirement if buttons return errors when they're clicked, or the app returns a success state in the user interface when an action has failed.

2. Apps that no longer reflect the original core functionality submitted to the App Store will be re-evaluated and will need to be resubmitted for a full App review.

3. If your app synchronizes data between Shopify and an external platform, then it must ensure all synchronized data is consistent across the Shopify admin, your app, and any additional platforms your app depends on.

---

## 4.​App performance

For merchants to be successful, their online stores must have best-in-class speed and user experience. Apps can easily slow down performance, and we require apps to keep performance top-of-mind while helping merchants, to follow our performance requirements and best practices, and to test that their products continue to meet our minimum requirements for speed.

1. Apps that request access to `read_advanced_dom_pixel_events` must implement heatmap or session recording functionality on checkout pages according to the API's requirements.

Tip

For best practices and recommendations on app performance, refer to our [app performance recommendations](https://shopify.dev/docs/apps/build/performance).

### A.​Performance score

1. To be published in the Shopify App Store, your app must not reduce Lighthouse performance scores by more than 10 points. Submissions are evaluated based on this criteria, using the testing methodology outlined in the section below.
2. Test your app's impact on Lighthouse performance scores using the steps outlined in [Testing storefront performance](https://shopify.dev/docs/apps/best-practices/performance/storefront#testing-storefront-performance). The impact that you've calculated should be included in the **App testing information** section of your submission form. Please provide a screenshot of your results. This information must be provided to our App Review Specialist prior to the review process.

### B.​Testing methodology

For apps that affect storefronts directly, Shopify tests the app's effect on store performance by measuring the Lighthouse score before and after the app is installed. We calculate a weighted average of score from the following pages:

| Page            | Weight |
| --------------- | ------ |
| Home            | 17%    |
| Product details | 40%    |
| Collection      | 43%    |

The difference in the score before and after the app is installed and configured on the above pages indicates whether the app improves or worsens store performance. To meet Shopify App Store requirements, your app must consistently demonstrate low or no negative impact on the performance of real merchant stores over time.

Note

Note: Lighthouse scores can vary between runs. Consider running these tests frequently during your development, and averaging your scores across a few consecutive Lighthouse tests before submission.

---

## 5.​App listing

The app listing is your calling card - it helps merchants find your app and understand how it can help them run their businesses. Your listing explains the features, user interface, and functionality of your app. Your listing should clearly communicate functionality and pricing so that merchants can quickly understand the benefits of your app.

### Writing a Shopify App Store listing

The app listing is your first point of contact with a merchant, and it's where they'll go to determine whether your app is right for them. All approved public apps have a listing on the Shopify App Store, regardless of whether you choose to make it [full or limited visibility](https://shopify.dev/docs/apps/launch/distribution/visibility).

The listing is often your biggest marketing tool—an effective app listing encourages Shopify merchants to try your app for themselves. Make sure that your app listing is clear, and that it answers the questions that a potential user might have.

To create a Shopify App Store listing, you first need to [select Shopify App Store as the distribution method for your app](https://shopify.dev/docs/apps/launch/distribution/select-distribution-method).

The app listing submission form lets you do the following:

- highlight app features so merchants can easily see what your app can do for them
- provide clear pricing information
- specify which merchants can install your app

Follow these requirements and guidelines when you're filling out the app submission form to make sure that merchants can easily find your app, understand what they can use it for, and see how much it costs.

Note

Shopify trademarks must not be used as part of your app icon or to mislead merchants about affiliation or impersonation.

### Example app listing

The following image shows an example app listing, and shows where some of the fields in the app submission form are used in the app listing.

![An example app store listing.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/example-app-store-listing-Bc1MkRXj.png)

| 1.  | [Feature media](#1-feature-media)     |
| --- | ------------------------------------- |
| 2.  | [Demo store URL](#demo-store-url)     |
| 3.  | [Screenshots](#screenshots)           |
| 4.  | [App introduction](#app-introduction) |
| 5.  | [App details](#app-details)           |
| 6.  | [Feature list](#feature-list)         |

### Translate your app listing

Translated listings help your app to reach a wider audience, as they convert in non-English speaking markets up to 4x better than English-only listings. You can add and delete translated app listings for any of the supported languages in the Shopify App Store on the **App listings** page in the [Partner Dashboard](https://partners.shopify.com/organizations).

Certain listing details can be managed only on your primary listing. If you have created translated listings for your app, then you can choose which one to set as your primary listing.

Every English-language primary listing is automatically translated into the following languages:

- Brazilian Portuguese
- Danish
- Dutch
- French
- German
- Simplified Chinese
- Spanish
- Swedish

Automated listing translations get updated each time you publish an updated version of your app's primary listing. Automated translations are clearly labeled on the app listing page, and merchants can toggle those translations off to view the listing in its original language. The listing also indicates to merchants if the app isn't available in a given language.

Note

Automated listing translation covers the following fields: **App card subtitle**, **App introduction**, **App details**, **Features**, **Pricing details**, **Search terms**, and alt text for your images. To manage any other fields for a given language, you need to provide your own translated listing.

Adding your own translated listing for an automatically translated language overwrites and disables automatic translation for that language. Deleting your translated listing resumes automated translation for that language.

#### Add a translated listing

1. Log in to your [Partner Dashboard](https://partners.shopify.com/organizations).
2. Click **Apps**.
3. Click the name of your app.
4. Click **Distribution**.
5. Click **Create listing** or **Manage listing**.
6. Click **Add translated listing**.
7. Return to the **App listings** page and click **Update app**.

You can use this form to edit the translated listing for your app in the language you chose. To change which listing you're editing, go back to the **App listings** page and choose another listing.

Before you can submit your app for review, you need to make sure there are no issues with any translated listings you've added. When there are no issues, you can submit all your translated listings by clicking **Submit app**.

#### Delete a translated listing

1. Log in to your [Partner Dashboard](https://partners.shopify.com/organizations).
2. Click **Apps**.
3. Click the name of your app.
4. Click **Distribution**.
5. Click **Manage listing**.
6. Click the listing you want to delete.
7. In the **More actions** drop-down list, click **Delete listing**.

### A.​Basic app information

#### 1.​App name

Your app name is an important part of how you brand yourself to merchants, and how they refer to your app. Follow these requirements when deciding on an app name:

1. The app name can't include any Shopify trademarks, such as "Shopify", or confusingly similar variations or misspellings of any Shopify trademarks.
2. The app name must be 30 characters or fewer.
3. To foster an equitable ecosystem for all, no Partner can claim exclusive rights to generic app names, even with trademarks or domain ownership.
4. A generic descriptor can't be used at the start of your app name, even if that generic descriptor is the Partner name itself. Your app name must begin with a unique, non generic term or brand name.
5. Pay particular attention to order. The unique Partner name must be first, to sufficiently differentiate your app. For example, "Announcement Bar - QTeck" isn't acceptable, but "QTeck - Announcement Bar" is. Avoid simple adjectives to start and end, such as "Easy", "Simple", "Pro", "Plus", "Super", or "Best", as this doesn't sufficiently differentiate your app. Avoid generic partner names, where the name simply describes the product or service being offered. In addition, combining two or more generic terms into a single word isn't enough to differentiate. For example, "ProductBundler" wouldn't be accepted.
6. Your app name needs to match, or be similar, between your Developer Dashboard (edited through TOML file or when releasing a new version) and your App Submission form (which controls the App Store listing). "Similar" means that any variations of the name contain common words. For instance, "QTeck Popups" in your TOML configuration would align with "QTeck Popups & Forms" in the Submission form.

Note

When you create an app, you must enter an app name in your TOML configuration file. The app name is displayed in the Shopify admin. This name can be shorter than the name in the app listing so that it fits into the Shopify admin app nav. For more information, refer to the [App Design Guidelines](https://shopify.dev/docs/apps/design-guidelines/navigation#app-name-icon).

#### 2.​App icon

You can add and update your app icon from the app submission form. When making your app icon, follow these guidelines:

1. Use JPEG or PNG format for the image.
2. The app icon's dimensions should be 1200px by 1200px.
3. Don't include text in your app icon.
4. Don't include screenshots or photographs in your app icon.
5. Use padding around your app icon. Your logo shouldn't touch the edge of the image.
6. Keep the corners square. The image's corners are automatically rounded when it's displayed.
7. Use bold colors and recognizable patterns.
8. Make it simple and focus on one or two elements. Visual clutter can make an image less effective.
9. Don't include seasonal promotions in the app icon. For example, you shouldn't promote BFCM discounts in the app icon.
10. Ensure that Shopify trademarks aren't used as part of your app icon. This includes logos, names, and any other trademarks.
11. Avoid using any elements that could be mistaken for official Shopify branding.

[Download image templates](https://shopify.dev/zip/SubmissionTemplates.zip)

#### 3.​App categorization

When merchants visit the Shopify App Store, they can search for apps by using [categories, subcategories, and tags](https://shopify.dev/docs/apps/launch/app-store-review/app-listing-categories).

The tags impact your store's discoverability on the App Store. In this field, you must select a primary tag that best describes your apps' core functionality. You can add an additional secondary tag if your app has other core functionality that isn't described by the primary tag.

Changes to this field will trigger a review by the Shopify app review team.

If your app capabilities change and you want to change how your app is categorized, then you can submit an appeal to change the app categorization by using the link in the app submission form. After the Shopify app review team completes their review, they'll send a response, whether it's approved or rejected.

#### 4.​App category details

Each category requires additional structured features about your app. This makes it easier for merchants to identify and compare relevant app features by category.

You can select up to 25 structured features per category field in the app submission form and they will appear on the app listing. These details can be updated at any time and don't require an appeal for review. Your app store listing content should describe your app's features at a high level. When creating your app store listing content, don't reference your other apps and services in your app store listing content.

#### 5.​Languages

In the **Languages** section of your app listing, you need to enter all the languages in which merchants can use your app's UI within the Shopify admin. The Shopify admin itself can be used in any [supported languages](https://help.shopify.com/manual/your-account/languages). To learn more about translating your app, refer to [Internationalization](https://shopify.dev/docs/apps/build/localize-your-app).

If any languages listed under the **Languages** section of the app listing aren't available within your app, then you'll be asked to remove them from the list.

Note

If the content displayed by your app on a merchant's storefront is available in multiple languages, then you can list those languages in the app details field.

### B.​App store listing content

Your app store listing content should describe your app's features at a high level. When creating your app store listing content, don't reference your other apps and services in your app store listing content.

#### 1.​Feature media

You must add a feature image or video for the listing header. A feature image or video is a required part of the app listing. It shows merchants more about your app in a highly visible part of your listing.

A short video is the best way to showcase the impact of the app on the business and how customers experience the app. If you don't have a video, then you can use a static image instead.

When using Shopify trademarks:

Don't mislead merchants by impersonating or claiming affiliation with Shopify. Use the logos and trademarks as specified in Shopify's [brand guidelines](https://www.shopify.com/ca/brand-assets#TrademarkGuidelines). Never modify or alter Shopify trademarks in any way.

##### a) Feature video guidelines

A feature video should promote the core features and functionality of your app and how it interacts with Shopify. Merchants want to understand what to expect from your app and how it will help them run their businesses. An effective promotional video will encourage the merchant to take a deeper look through your app listing to learn more about the features that were introduced in the video.

Follow these guidelines when making your feature video:

- The video should be no longer than 2-3 minutes.
- Don't include long screencasts of someone using the application. Up to 25% of the video can use screencasts for demoing features, but the video should be promotional, not instructional.
- Be mindful of any third-party logos or elements that you include in the feature video to avoid potential trademark issues.
- Choose an eye-catching thumbnail that will make merchants want to watch the video to learn more.

##### b) Feature image guidelines

If you don't have a video, then use a static image to highlight your app. Your image should convey the benefit, functionality, or unique value of your app. For example, the image might show the customer experience on the storefront, or how the merchant's workflow or business results are impacted.

Follow these guidelines when you're preparing your feature image:

- Use JPEG or PNG format for the image.

- The image's dimensions must be 1600px by 900px (16:9).

- Leave a margin of 100px around the outside edges of the image.

- Provide alt text for your image. This text appears if your image fails to load and can help people who use assistive devices like screen readers. It also helps with search engine optimization.

- If you're using text in your image:
  - Localize and translate text for every language that your app listing is available in.
  - Keep the text short, simple, and scannable for both desktop and mobile devices.
  - Don't repeat your app card subtitle in the image.

- Don't use the Shopify logo in your image.

- Avoid using heavily patterned or textured background images. Instead, use one or two colors for the background.

- Ensure that there is enough contrast between the background and any text. A 4.5:1 contrast ratio is recommended.

- Make your image simple. An image should have a single point of focus, and use only a few elements. Visual clutter can make an image less effective.

- Avoid using screenshots of your application that contain many small elements or a lot of text. Crop or simplify screenshots where possible.

[Download image templates](https://shopify.dev/zip/SubmissionTemplates.zip)

Here are some examples of feature images:

#### Shopify Email

![The feature image for Shopify Email.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/shopify-email-feature-image-FuuYDvWl.png)

#### Shopify Inbox

![The feature image for Shopify Inbox.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/shopify-inbox-feature-image-8_JuypZk.png)

#### Shopify Local Delivery

![The feature image for Shopify Local Delivery.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/local-delivery-feature-image-CNZWbTaz.png)

#### 2.​Demo store URL

Provide a link to a demo store that showcases your app so merchants can see a live demonstration of how the app works. This lets the merchant get a sense of how your app can benefit them.

As a Shopify Partner, you can use a free [development store](https://shopify.dev/docs/api/development-stores) as your demo store. If you use a development store, then the store must be owned by the Partner account that you're submitting your app with.

Follow these guidelines when providing a demo URL:

- **Use a Shopify store**: Use a Shopify development store, or a live store that you own, rather than a marketing page or video. Merchants want to be able to explore how an app functions in a store.
- **Thoughtfully design your demo store**: If your demo store is poorly designed, then merchants might negatively associate the design of the store with the quality or aesthetics of your app.
- **Link to the relevant part of the store**: Consider linking to a page in your demo store that best demonstrates your app's functionality. For example, if your app impacts only the product page of a store, then link directly to a product page.
- **Provide contextual instructions**: Make it easy for merchants to know exactly what your app is impacting within the demo store. If your app is complex, then add text to the demo store to guide merchants through the experience.

Info

Development stores are password-protected. However, when merchants visit your demo store from the Shopify App Store, the development store password page won't appear.

#### 3.​Screenshots

In the **Screenshots** section, you must provide screenshots to show what your user interface looks like in action. Screenshots provide an opportunity to visually share what your app does in the storefront or the Shopify admin.

When using Shopify trademarks: Don't mislead merchants by impersonating or claiming affiliation with Shopify. Use the logos and trademarks as specified in Shopify's [brand guidelines](https://www.shopify.com/ca/brand-assets#TrademarkGuidelines). Never modify or alter Shopify trademarks in any way.

Follow these guidelines when you're preparing screenshots:

#### a) General screenshot guidelines

- Provide alt text for all images for accessibility and to improve SEO.
- Avoid using any personally identifiable information (PII) or anything that could be mistaken for PII in images without explicit consent. This includes items such as store names, phone numbers, and .myshopify.com URLs. If you need to provide examples, then ensure that you only use your publicly verifiable contact information.
- Ensure images are clear. Images shouldn't be blurry or cluttered. Crop out desktop backgrounds and browser windows so that screenshots are focused on your app's functionality.F
- Remove all claims about specific gains or guaranteed outcomes (for example, "increase sales by 300%" or "double your revenue") from your app's screenshots. You may include factual numeric information about your app's features and adoption (for example, "supports 100 different shipping services" or "trusted by 1000 restaurants across Europe".)
- Remove reviews and testimonials from your app's images. Keep reviews and testimonials in the merchant reviews section.
- Remove all links and URLs from images and move them to the appropriate fields.
- Remove pricing information from the images included in your app listing, including within the logo. Keep this information in pricing details.
- Add annotations or highlighting to draw attention to important elements, such as any links that your app inserts in the Shopify admin.
- If you add text annotations, then localize and translate the text for every language that your app listing is available in.

#### b) Desktop screenshot guidelines

- Each screenshot's dimensions should be 1600px by 900px (16:9) for desktop.
- Include between 3-6 screenshots of your app on desktop.
- Include at least one screenshot of your app's user interface.
- Provide alt text for all images for accessibility and to improve SEO.
- Don't include desktop backgrounds and browser windows in your screenshots. Crop them so your images aren't cluttered and don't distract merchants from your app.
- If your app is embedded, then don't include sensitive information such as the store name or any user information. You can include the left-hand navigation.

#### c) Mobile screenshot guidelines

- Each screenshot's dimensions should be 1600px by 900px (16:9).
- If your app is mobile responsive on the storefront, then include screenshots that show your app's mobile functionality. This helps merchants visualize how your app will look to a customer on their storefront.
- Your mobile screenshots shouldn't be duplicates of your desktop screenshots. This means they must display the responsiveness of your user interface when viewed on a mobile device.

#### d) Point of sale screenshot guidelines

- Each screenshot's dimensions should be 1600px by 900px (16:9).

- If your app is for Shopify Point of Sale or has features that work with it, then you must include a screenshot showing this. This helps merchants specifically looking for point of sale apps understand that yours integrates with it.

#### 4.​App introduction

The app introduction field gives you 100 characters to explain your app's purpose and main benefit to merchants. The app introduction appears as prominently displayed text on your app store listing.

Follow these guidelines when writing your app introduction:

- Clearly highlight the benefits that merchants can expect from your app. For example, "\[App Name] makes personalized advertising campaigns simple, and helps you find new customers."
- Don't add keywords to the app introduction with the intent of improving search performance.
- Don't use personal merchant information without consent from the merchant.
- Don't include data or statistics. You can feel free to share this information on your website and landing pages.

The following table shows some good examples and bad examples of app introductions:

| Examples | Reason |
| -------- | ------ |

| \* **Do**: We package and ship your orders. Fast, simple fulfillment can boost sales and delight customers.

- **Don't**: Get your products shipped fast. We'll take care of all the busy work for you. | Show specific benefits that drive value for merchants. Avoid generic marketing language. |
  | - **Do**: Create print-on-demand custom puzzles. More customization options can help increase product sales.

* **Don't**: Custom puzzles. A creative solution to your print-on-demand needs. | Tie your unique app offering to a measurable business outcome. |
  | \* **Do**: Easily create personalized email campaigns. Buyer targeting can increase customer lifetime value.

- **Don't**: App Name is a best in class customer platform. Email marketing, text automation, Facebook custom audiences. | Show a clear merchant benefit and value proposition. Avoid unsubstantiated claims, keyword stuffing, and incomplete sentences. |

#### 5.​App details

The app details field gives you 500 characters to expand on your app's main features. In this field, you should let the merchant know what makes your app unique. The app details should be concise, but informative.

Follow these guidelines when writing your app details:

- Focus on functional elements of your app in your app details, and avoid excessive marketing language.
- Don't add keywords to the app details with the intent of improving search performance.
- Don't only use a structured feature list in the app details. Use the **[Feature list](#feature-list)** field for listing features instead.
- Don't include support information such as emails and phone numbers in the app details. Use the [Support](#3-sales-and-support) fields to enter your support information instead.
- Don't include links and URLs in the app details. The submission form lets you provide links to your [website's homepage](#developer-website-url), your [FAQ page](#faq-url), and your [pricing information](#d-pricing), where you can host whatever additional information.
- Don't include testimonials in the app details.
- Don't include claims about specific gains or guaranteed outcomes (for example, “increase sales by 300%” or “double your revenue”) in your app listing. Don't promise results that individual users may not achieve. You may include factual numeric information about your app's features and adoption (for example, "supports 100 different shipping services" or "trusted by 1000 restaurants across Europe".)

#### 6.​Feature list

The feature list should include a list of the functional features of your app. The content for each listed feature should be short so that merchants can easily scan the list to understand what your app offers. You can use up to 80 characters per feature.

When writing your feature list, you should describe the functionality, not the mechanics behind each feature. The following table shows some good examples and bad examples for features:

| Examples | Reason |
| -------- | ------ |

| \* **Do**: Reports that show you sales data in real time.

- **Don't**: Reports that use the latest push technology to offer you sales data with only 250ms of latency. | Describe functionality that is meaningful to merchants. Avoid focusing on the technical aspects of a feature. |
  | - **Do**: Drag and drop page builder.

* **Don't**: Page builder built on the latest React Native technology to ensure the most efficient page building experience. | Be concise and informative. Avoid including feature mechanics that aren't relevant to merchants. |
  | \* **Do**: Customize details like shape and difficulty level in a full-screen experience.

- **Don't**: Print-on-demand, product customization, sales analytics, puzzles. | Describe a specific, unique feature. Avoid keyword stuffing and incomplete sentences. |

#### 7.​Integrations

The **Integrations** field lets you list a maximum of six integrations. If your app has more than six integrations, then list the ones that merchants will be most interested in.

Don't include the following in your list of supported integrations:

1. Shopify
2. other shopping carts, unless you provide synchronization or cross-platform compatibility
3. other apps in the Shopify App Store, unless your app directly integrates with them

### C.​Resources

#### Privacy policy URL (Required)

[Data and user privacy](https://shopify.dev/docs/apps/launch/protected-customer-data) are extremely important to merchants, and they value Partners who take security seriously. You need to include a privacy policy for your app.

#### Developer website URL (Optional)

Having a website that gives more information about your app can help merchants to decide if they want to install it. This URL needs to be set to the landing page of your developer website. If the URL goes to a special promotional page, then you'll be asked to change it.

#### FAQ URL (Optional)

This is a great opportunity to answer frequently asked questions in detail to merchants. This URL must redirect the merchant to a dedicated FAQ page on your website. If the URL redirects to a cloud document or PDF, then you'll be asked to change it.

#### Changelog URL (Optional)

A changelog is a great way to show merchants what's new with your app, and show that you're actively supporting and updating your app. The URL must redirect the merchant to a dedicated changelog page on your website.

#### Support portal URL (Optional)

You can provide a link directly to your support portal to give merchants a more complete view of the support services that you offer.

#### Tutorial URL (Optional)

In order to set merchants up for success, you can provide a link to a relevant tutorial or other onboarding guidance.

#### Additional app documentation (Optional)

In this field, you can provide a link to any other additional documentation that would be helpful and relevant to merchants using your app.

### D.​Pricing

The pricing section lets you clarify app pricing information for merchants. You're required to provide names for all plan names. Only include pricing information in the designated area of the listing.

#### 1.​Pricing details

Select your app's primary billing method. There are three primary billing methods that you can use for your app:

| Free to install  | Select this option if you won't charge the merchant anything for installing the app. Apps that are free to install can have additional usage charges or charges that are charged outside of the Shopify Billing API.If there are no additional charges, such as commissions or usage charges, then your app will appear as **Free** in the Shopify App Store. If you do specify additional charges, then your app will appear as **Free to install**. |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recurring charge | Select this option if you will charge the merchant each month (every 30 days) or each year that they have the app installed. If you select this option, then you'll be able to add information about the different monthly or yearly plans that you offer.                                                                                                                                                                                            |
| One-time payment | Select this option if you will charge the merchant a single fee for installing the app.                                                                                                                                                                                                                                                                                                                                                               |

Note

Any of the billing methods above can be combined with additional charges or external account charges. For example, if you charge a $10 one-time charge and $2 per 100 orders, then select **One-time charge** and provide details about the usage charges in the **Additional charges** section.

#### Apps with only a free plan

You can have a maximum of one free plan. If your app has only one plan for the entire app, and that plan is free, then that plan can't be listed as a recurring charge. For this type of a pricing model (with or without additional charges), select **Free to install** as your primary billing method.

#### Apps with free and paid plans

If you have more than one plan and one of them is free, select **Recurring charge** as your primary billing method, then specify one of your plans as **Free** in the **Plan pricing** section. When your app appears in search results, it will be flagged as **Free plan available**.

#### Set up an app subscription plan with recurring charges

To describe how merchants will be charged for using your app:

1. Enter the length of the free trial period for each of your pricing plans, after which you will begin to charge for the app. If the free trial length is 0 days, then charges begin immediately. When you choose the length of the free trial period for each of your pricing plans, make sure that it's enough time for the merchant to try your app. We recommend a period of 14 days. If you have a free plan, then there won't be any trial days associated with it.

2. Enter the details of your recurring plans. For each plan, specify whether it is free, billed monthly, or billed yearly:
   1. If your app charges the merchant monthly, then select **Monthly charge** and enter the amount that the merchant will be charged every 30-day billing cycle.

3. If you offer a monthly plan that also has a discount option for the merchant to make a one-time yearly payment, then select **Monthly charge** and enter both the regular monthly charge and the discounted yearly charge. For example, if you have a plan that is $150 per month and you offer a yearly discounted price of $1200 a year, then enter $150 for the amount billed every 30 days and $1200 for the amount billed as one charge per year:

![The plan pricing section, showing a monthly charge with yearly discounted price.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/monthly-charge-BE11AXLM.png)

1. If you offer a plan with a recurring charge that has only a yearly charge option, then select **Yearly charge** and enter the total charge per year. For example, if you have a yearly plan that is $1200, then enter $1200 for the amount billed as one charge per year.

2. Select whether your plan has additional charges, such as usage fees or commissions. Provide a detailed description of these fees so that the merchant can understand how the charges are calculated. Do not enter yearly plan information in this field. Instead, enter yearly plan information either as a yearly charge or a yearly discounted price.

3. Optional: In the **Plan details** section, enter a name for the plan and a list of features that it includes. Enter each feature on a separate line, without any bullet points or leading characters. Bullet points will be added when the feature list is rendered in the app listing.

4. If you want to add another plan, then click **Add another plan**.

Plans will be displayed from lowest price to highest price in your app listing, regardless of the order in which you specify the plans.

#### Charges outside the Shopify Billing API

All app charges must go through the Shopify Billing API unless you have prior approval from Shopify. If you've received approval from Shopify, then select **I have approval to charge merchants outside of the Shopify Billing API** and provide a link so that merchants can read about the external charges and sign up for any external services that are required.

#### Example pricing details

Here's an example of how the pricing details for your app might be presented in your app listing:

#### Desktop view

![A desktop view of pricing details in an app listing](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/desktop-pricing-view-RhEBVlYC.png)

#### Mobile view

![A mobile view of pricing details in an app listing](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/mobile-pricing-view-ToVKZWNU.png)

| 1.  | A link to a page that describes any charges that are billed outside of Shopify's Billing API. |
| --- | --------------------------------------------------------------------------------------------- |
| 2.  | The name of each pricing plan.                                                                |
| 3.  | A free monthly plan.                                                                          |
| 4.  | The paid monthly plan price.                                                                  |
| 5.  | The discounted yearly price for a monthly plan.                                               |
| 6.  | A description of any additional charges for this plan.                                        |
| 7.  | A list of features for this plan.                                                             |
| 8.  | A link to a page that describes the app's pricing in detail.                                  |

### E.​App discovery

App discovery refers to how merchants discover your app on the Shopify App Store and other Shopify surfaces. This section helps merchants to better understand the value of your app when compared to other apps.

#### 1.​App card subtitle

The app card subtitle should summarize your app in a concise phrase, and explain the value of your app. The subtitle should help merchants to quickly understand what your app does, and what sets it apart from others.

Follow these requirements when writing your app card subtitle:

- Don't add keywords to your subtitle with the intent of improving search performance.
- Don't use personal merchant information without consent from the merchant.
- Don't include claims about specific gains or guaranteed outcomes (for example, "increase sales by 300%" or "double your revenue") in your app listing. You may include factual numeric information about your app's features and adoption (for example, "supports 100 different shipping services" or "trusted by 1000 restaurants across Europe")

The following table shows some good examples and bad examples for app card subtitles:

| Examples | Reason |
| -------- | ------ |

| \* **Do**: Avoid lost sales by making pages load faster and improving SEO

- **Don't**: Boost Pagespeed in 1 click. Increase conversions, SEO & Sales. | Highlight the benefit to merchants instead of the function. Avoid incomplete sentences. |
  | - **Do**: Pick products to sell from vetted manufacturers and suppliers

* **Don't**: Dropship via Wholesale Distributors, Manufacturers & Suppliers | Highlight the benefit to merchants instead of the function. |
  | \* **Do**: Control which customers access different parts of your store

- **Don't**: Access control, for anything in your online store :) | Highlight the benefit to merchants instead of the name of the feature. |

#### 2.​Search terms

The **Search terms** field lets you enter a maximum of five search terms for your app. To help merchants discover your app, include only relevant terms that you want to rank higher when merchants search the Shopify App Store. You must enter at least one search term.

Note

Only [listed](https://shopify.dev/docs/apps/launch/distribution/visibility) apps appear in Shopify App Store search results. By default, apps are listed when they're approved.

Follow these guidelines when picking your search terms:

1. Use complete words. For example, use "dropshipping" instead of "dropshi" or another partial form of the word.
2. Include the single, complete form of a term instead of several versions of the same term. For example, if you include "dropshipping" as a search term, then you don't need to include other terms such as "dropship", "shipping," or "drop ship."
3. Don't include "Shopify" in any of your search terms.
4. Don't convey more than one idea in a single search term. For example, "email marketing" is appropriate, but "email marketing for leads" is not.

#### 3.​Web search content

In this section, you can input a title tag and meta description for your app store listing.

![The web search content input interface, showing the title tag and meta description fields.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/web-search-content-foFnpmn8.png)

The title tag is used by search engines such as Google as the main heading for a search result. The title tag provides important information about where the link will send the user who clicks on the link. It's often the primary piece of information that users read on your search results, so you should make sure to follow [best practices for writing influential title tags](https://developers.google.com/search/docs/advanced/appearance/title-link).

The meta description is a quick summary of the app store listing's content. Search engines show it in search results under the title tag. Along with the title tag, the meta description can influence whether users decide to click through to your app store listing. For tips on how to write an effective meta description, you can refer to [our blog post about writing an effective meta description](https://www.shopify.com/blog/how-to-write-meta-descriptions).

The following image is an example of how the title tag and meta description would appear in Google's search results for your app store listing.

![A screen capture of Google search results, showing the title tag with the meta description below it.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/search-engine-example-Cl8IC9BU.png)

### F.​Merchant install requirements

You can specify which merchants can install your app by setting the install requirements in the app submission form. By adding install requirements in the app submission form, you can reduce the number of uninstalls and negative reviews related to merchant eligibility for your app.

For example, when a merchant installs an app that they can't use, such as a free shipping app that doesn't work in their country, they will uninstall your app shortly after installing it. They may also be frustrated about the experience and leave a negative review. Both uninstalls and negative reviews affect your ranking in the Shopify App Store.

#### 1.​Sales channel requirements

If your app requires the Shopify [Online Store](https://shopify.dev/docs/apps/build/online-store) or [Shopify POS](https://shopify.dev/docs/apps/build/pos) sales channels in order to work, then you only want merchants who use either, or both, to install your app. For example, if a merchant doesn't have an online store, then you want to prevent them from installing your app.

If your app interacts with the merchant's online store, such as using [theme app extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions) or [editing theme assets](https://shopify.dev/docs/api/admin-graphql/latest/mutations/themeFilesUpsert), then select **Shopify Online Store**. If your app embeds features in Shopify Point of Sale, then select **Shopify POS**.

Shopify is responsible for the final determination about whether your app has specific sales channel requirements, and may update this setting before approving your app.

#### 2.​Geography requirements

Set the geography requirements to make your app available only to merchants who meet specific geographic criteria. For example, if your app is a tax app that helps merchants in Germany file their taxes, then you should specify that only merchants with a business address in Germany can install your app. You can restrict the installation of your app to merchants who:

- have a business address in a specific country or countries

- ship to a specific country or countries

- accept a specific currency or currencies.

  For each requirement, you can specify a list of countries or currencies that meet the requirement. For example, if your app works for stores who accept any of USD, CAD or GBP, then you can specify all three acceptable currencies.

  Note

  If you specify multiple geographic requirements, then only merchants who meet all of the requirements can install the app.

#### What if a merchant changes their store settings after installation?

Within your app, use endpoints and webhooks to check if a merchant changes their store settings after installation. If a merchant does change their settings, then you can notify them within the app or by email.

### G.​Tracking

You can [track your app listing traffic](https://shopify.dev/docs/apps/launch/marketing/track-listing-traffic) by entering a Google Analytics or Facebook pixel code for your app listing. You can also retarget merchants who view your app listing by adding a [Google remarketing code](https://support.google.com/google-ads/answer/2453998) or an [AdRoll retargeting code](https://www.adroll.com/learn-more/retargeting).

### H.​Contact information

Contact information is an important part of your app listing. The information that you enter here helps merchants learn more about your app and contact you with questions or issues. Shopify also uses this information to contact you about your app submission.

#### 1.​Review notification email

This email is used to notify you when a merchant has left a review on your app. The notification email includes the star rating that the merchant left, the comment that they left in their review, and the name of the merchant's store.

#### 2.​App submission contact email

This is the email we use to contact you about your app submission to the Shopify App Store. You should enter the email of the person that will be the primary point of contact for making any necessary changes to your app submission.

#### 3.​Sales and support

#### a.​Support for other languages (Required)

If you've added a [translated listing](#translate-your-app-listing) to your app listing, then you need to indicate whether you offer phone or email support in the language of the translated listing. You aren't required to offer support in the language of the translated listing, but you must indicate in the listing whether that support is available.

#### b.​Email (Required)

This is the email that merchants will use to contact you if they have support questions.

#### c.​Phone (Optional)

Having phone support can boost merchant confidence when selecting your app. If you want to offer phone support for your app, then you need to include a functioning phone number that a merchant can call to get phone support. We'll call this phone number during your app review to make sure it can be reached. If the number can't be reached, then you must remove or update the phone number.

### I.​App review instructions

In this section, you can provide instructions on how to test your app during your app review. You also need to include your app's _performance ratio_. To calculate your app's performance ratio, refer to [B. Testing methodology](https://shopify.dev/docs/apps/launch/app-requirements-checklist#b-testing-methodology) in section **4. App performance** of this document.

Including instructions on how your app should be used lets us give you valuable feedback if we encounter issues while testing.

Login credentials must be provided if your app integrates with third-party platforms. For example, if your app requires account access to a marketplace, then you must provide credentials for an active test account for that specific marketplace. Failure to provide a test account will result in the rejection of your app submission.

If your app requires login credentials, then the credentials you provide for review must be valid, and grant full access to the app's complete feature set. Double-check any credentials before submission to avoid issues during review.

Include a screencast when you submit your app for review. Follow these guidelines:

- **Create a complete demo**: Include the setup process and all functionality and features as detailed in the app's description.
- **Add step-by-step instructions**: Provide a walkthrough on how to configure and use the app. Demo the expected outcome for each test case.
- **Show external setup**: Add any additional steps for coding or external configurations.
- **Make it accessible**: Make the screencast in English or include English subtitles.

---

## 6.​Security and merchant risk

Security is a critical part of any web-based business because online apps can be exposed or compromised in many different ways. Before you submit your app, you need to make sure that it's secure so that the merchants who use it won't be at risk.

### A.​Security

Caution

By January 31, 2024, embedded apps need to load in the new admin.shopify.com domain. Refer to our [changelog](https://shopify.dev/changelog) for details. To resolve this issue, reference our [Setting up Iframe protection](https://shopify.dev/docs/apps/store/security/iframe-protection) document and ensure your app is using App bridge 2.0 or later (App bridge 3.0 is recommended).

1. Your app must not collect Shopify user credentials. As explained in [Shopify API Authentication](https://shopify.dev/docs/apps/build/authentication-authorization), public apps must use OAuth and public embedded apps must use session tokens and OAuth.

2. If your app stores its own credentials, then it must only store salted password hashes instead of actual passwords, as described on the [Open Web Application Security Project](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet) website.

3. Your app must be protected against [common web security vulnerabilities](https://shopify.dev/docs/apps/build/security/protect-against-common-vulnerabilities).

4. Your app must have a valid [TLS/SSL certificate](https://shopify.dev/docs/apps/store/security/tls-certificates) without any errors.

5. Your app must [protect iFrames](https://shopify.dev/docs/apps/build/security/set-up-iframe-protection) and prevent domains other than the shop domain from using the app in an iFrame.

6. Your app must not expose [network services](https://shopify.dev/docs/apps/build/security/secure-network-service-ports) unnecessarily.

7. Your app must subscribe to [mandatory webhooks](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance).

8. Your app must not expose its shared secret. If your secret is inadvertently exposed, then you must [rotate the secret](https://shopify.dev/docs/apps/build/authentication-authorization/client-secrets/rotate-revoke-client-credentials) immediately.

9. If your app uses offline tokens, then your app must not expose a shop's [offline access token](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/offline-access-tokens).

10. Your app must [generate secure tokens](https://shopify.dev/docs/apps/build/security/generate-secure-tokens), including expirations and search indexing protections, where applicable.

11. Your app must not process payments or orders outside of Shopify's checkout.

12. Your app must not alter or modify Shopify's checkout, except through the APIs and components that Shopify provides for that purpose.

13. Apps using the Admin APIs to capture payments must subscribe to the GraphQL [ORDERS_EDITED webhook topic](https://shopify.dev/docs/api/admin-graphql/latest/enums/webhooksubscriptiontopic), to be notified when an order is edited and a secondary payment needs to be captured.

14. If your app uses [app proxies](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data), then it must [verify the authenticity](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data#calculate-a-digital-signature) of requests.

---

## 7.​Data and user privacy

Make sure that your app meets all requirements and best practices for querying, storing, processing, and deleting Shopify data.

### A.​Data and user privacy

1. If your app gathers, stores, processes, or shares personal data, then it's your responsibility to make sure that it [complies with privacy laws](https://shopify.dev/docs/apps/launch/privacy-requirements).

2. You must include a link to a privacy policy in your app listing to communicate how your app uses data, and to provide transparency and build trust with merchants.

3. If your app handles a significant amount of customer data, then it should have a system in place to manage that data properly, including secure storage and the ability to erase data at the user's request where applicable, as per the [data rights of individuals](https://shopify.dev/docs/apps/launch/privacy-requirements).

4. If your app runs marketing or advertising campaigns that require personal data, then it must have a system for allowing users to provide [consent and/or opt-out for marketing promotions where applicable](https://shopify.dev/docs/apps/launch/privacy-requirements).

5. All public apps must subscribe to [mandatory webhooks](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#mandatory-compliance-webhooks) so that you can receive any data deletion requests that are issued by merchants.

6. Customer data collected by your app through a Shopify hosted service using the Online Store/Point of Sale channels must be synced to the Shopify admin and be made accessible to merchants. More information can be found in the [Shopify API License and Terms of Use](https://www.shopify.com/legal/api-terms) under section 2.3.17. See [Storing customer data](https://www.shopify.com/legal/api-terms) for information regarding which customer data must be sent back to the merchant.

7. If your app has an Export Control Classification Number (ECCN) other than `EAR99`, then you must [enter its ECCN number](https://shopify.dev/docs/apps/launch/distribution/export-control-classification-numbers) in the Configuration page.

8. If your app processes any [protected customer data](https://shopify.dev/docs/apps/launch/protected-customer-data#protected-customer-data-api-types-and-resources), you must implement and attest to all [protected customer data requirements](https://shopify.dev/docs/apps/launch/protected-customer-data), including:
   1. Declare the app's specific uses of [protected customer data](https://shopify.dev/docs/apps/launch/protected-customer-data#request-access-to-protected-customer-data). Declared uses and access to protected customer data are subject to review and approval, based on the intended app functionality, by Shopify before production data access is granted. Non-approved data will be forbidden/redacted from production API replies and webhooks.
   2. Submit data protection details about your compliance with the [protected customer data requirements](https://shopify.dev/docs/apps/launch/protected-customer-data#requirements).
   3. As required by Shopify, participate in [data protection reviews](https://shopify.dev/docs/apps/launch/protected-customer-data#data-protection-review) to verify your data protection details.

### B.​Deprecated API resources

Shopify periodically deprecates and removes API functionality in accordance with our [API versioning policies](https://shopify.dev/docs/api/usage/versioning).

1. Your app must use supported APIs. If your app queries APIs that will be deprecated within 90 days, then you can't submit it for review.

---

## 8.​Support

After you submit your app, you need to support the merchants who use it. There are different ways to do this, such as answering merchant inquiries promptly and publishing detailed help documentation, or providing instructive in-app context and support so that merchants can quickly get the help they need when they use your app.

### A.​Support

1. You must have an email address that merchants can use to contact you if they need help with setting up or using your app. Providing great customer support is an important part of Shopify's own business, and you're expected to provide prompt support to the merchants who use your app as well.

2. Your support contact information and content should be easy to find, and it should include clear instructions that are specific to how your app integrates with Shopify. To learn more about writing effective help documentation, refer to [Help documentation](https://polaris.shopify.com/content/help-documentation) in Shopify Polaris.

3. Your Partner Dashboard must have up to date [emergency developer contact information](https://shopify.dev/docs/api/usage/versioning/updates#update-your-developer-contact-details) in the case that you need to be contacted regarding your app.

---

## Specific requirements for certain app configurations

Apps are grouped into different categories depending on how they solve problems and meet merchant needs. If your app is in one of the following categories, then it needs to meet the requirements listed below. These requirements are in addition to the [General requirements for all apps](#general-requirements-for-all-apps) above.

In some cases, an app can have more than one type of configuration. For example, an app could be both a third-party integration and a dropshipping app.

---

## 9.​Online store

An online store app modifies a merchant's storefront and theme by using either Shopify's API or other technical resources.

### A.​Online store

1. If your app modifies the merchant's theme, you need to use [theme app extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions). Merchants should not need to make any manual code changes to their theme.

   To support vintage themes, consider alternative integration methods, such as sharing instructions with merchants that detail how to add and remove your app features in their theme.

2. If you want to forward requests made to a route on an online store's origin to an external origin to display data on a store page, then you need to use [app proxies](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data).

3. Your app widget must be displayed properly and without any errors in the Theme Editor and Online Store.

4. App Name Branding in storefront visual components is permitted only in the following cases:

   Your app may use App Name Branding in theme extensions only if one or both criteria are met:
   1. Customers directly interact with the custom branding elements as a key aspect of their buying experience, for example as part of a payment method or loyalty program.
   2. Removing the custom branding elements would cause confusion or harm to customers.

   If apps want to use App Name Branding but do not meet both criteria above, the app must use the standard app attribution pattern. Regardless, no app is permitted to do the following:
   - Requesting app reviews or ratings
   - Promoting other apps or services

   App Name Branding includes:
   1. Company or app logos, icons, branded watermarks, visual identifiers, or other branded imagery.
   2. Company or app name displayed as text in any form, including plain text, branded fonts, or stylized lettering.
   3. Custom design elements that contain the name or logo of the company or app.

   Standard app attribution: Limited to a 24x24 pixel width and height on any image or text.

5. If your app adds a visible element to a merchant's storefront, then you must allow the merchant to preview edits before saving and publishing changes to your app's visual storefront components.

6. If your app includes [app blocks](https://shopify.dev/docs/themes/architecture/blocks/app-blocks#support-app-blocks-in-the-section), then your app must allow merchants to add, reposition, or remove app blocks in the theme editor.

7. App blocks must be [responsive](https://shopify.dev/docs/apps/online-store/theme-app-extensions/extensions-framework#app-blocks) to the size of the section that they're added to.

8. If your app interacts with a merchant's theme, then you need to ensure that the app also works in the [theme editor](https://shopify.dev/docs/storefronts/themes/tools/online-editor) environment. If necessary, you can set your app to [detect the theme editor](https://shopify.dev/docs/storefronts/themes/tools/online-editor#detecting-the-theme-editor) so that you can adjust your app to work in that environment.

9. Your app must have [detailed setup instructions](https://shopify.dev/docs/apps/online-store/theme-app-extensions/ux-guidelines#onboarding-for-app-embed-blocks) on how to use your app embeds and app blocks. We strongly recommend providing a [deep link](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration#deep-linking) to help merchants install and preview your app in their theme.

![A button to enable a storefront element in an app's user interface.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/online-store-enable-element-BF7hRIyl.png)

---

## 10.​Embedded apps

An embedded app uses app extensions and embedded app libraries to let merchants access its features directly in the Shopify admin or the Shopify POS app.

### A.​Embedding into the Shopify admin

1. Your app must use [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge) to ensure OAuth redirect requests send the merchant to the embedded version of the app.

2. Your app must provide a consistent embedded experience by ensuring that any off-platform features are integrated directly within the Shopify admin.

3. The embedded app must have a navigation icon that meets the following requirements:
   1. The icon must include a 16px by 16px navigation icon in SVG format, uploaded through the [Partner Dashboard](https://partners.shopify.com/apps).

   2. The icon must be a single color with a transparent background.

   3. The icon's SVG file should be less than 2KB.

   4. The icon's SVG file can contain only the following permitted tags: `circle`, `ellipse`, `g`, `line`, `path`, `rect`, `svg`, `title`.

   5. The icon's SVG file can contain only the following permitted attributes: `cx`, `cy`, `d`, `height`, `opacity`, `pathLength`, `points`, `r`, `rx`, `ry`, `version`, `viewBox`, `width`, `x1`, `x2`, `xmlns`, `y1`, `y2`, `fill-rule`, `clip-rule`.

4. If your app uses bulk action links, then they must be complete, functional, and relevant to their locations in the Shopify admin. You must also make sure that for each bulk action link, the related action is applied to all items that have been selected.

5. Apps must use [the latest version of Shopify App Bridge](https://shopify.dev/docs/api/app-home#getting-started) by adding the `app-bridge.js` script tag before any other script tags. We recommend to add it to the `<head>` of each document of your app or as the first script element of the body.

6. If your app uses max modal, formerly known as full screen mode, then it must not launch without a merchant interaction. Max modal can't be launched from the app navigation menu.

7. Max modal, formerly known as full screen mode, is intended to be used for complex editors or other complex use cases. Max modal should be used to improve user experience when launched.

8. Your app must function in incognito mode in Chrome.

9. Use session tokens to authenticate requests between client and your app's backend.

10. Don't use 3rd party cookies or local storage, because your app might not work on certain browsers, such as Safari for iOS, or browsers that block third party cookies.

### B.​Embedding into POS

1. If your app embeds into the Shopify POS app, then any POS actions that it uses (such as cart actions or checkout actions) must be complete, fully functional, and relevant to the Shopify POS app's capabilities.

   ![An example of an embedded POS app. The app allows the merchant to book an appointment for a customer and add the appointment to the POS cart for purchase.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/POS-submission-guide-C2t9GOX_.png)

2. If your app embeds into the Shopify POS app, then your app's user interface must be functioning and accessible from the POS Apps Admin Dashboard.

   ![An app being accessed from the POS Apps Admin Dashboard.](https://shopify.dev/assets/assets/images/api/listing-in-the-app-store/POS-app-landing-CnGNgl_U.png)

---

## 11.​Product sourcing

A product sourcing app lets merchants find and sell a wide range of products by providing product discovery and sales features directly in the app.

### A.​Product sourcing

1. Product sourcing apps are exempt from using the [Billing API](https://shopify.dev/docs/apps/launch/billing) for the sale of goods to their merchants, and can instead use a PCI compliant gateway. However, any other costs associated with the app must be charged using the [Billing API](https://shopify.dev/docs/apps/launch/billing).

2. If your app fulfills product orders on behalf of a merchant, then it must not automatically fulfill orders that are in the **pending payment** state.

3. Your app must add the cost of goods to the **Cost** field on the product page of the merchant's Shopify admin.

4. Your app must not sell high-risk products. Products that violate Shopify's [Acceptable Use Policy](https://www.shopify.com/legal/aup) and the Terms of Service for Payment Providers are prohibited. Products like cannabis, alcohol, pharmaceutical drugs, weapons and items listed as [prohibited businesses](https://www.shopify.ca/legal/terms-payments-us) are included in this restriction.

5. Your app allows merchants to request fulfillment. Use the [`fulfillmentOrderSubmitFulfillmentRequest`](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentOrderSubmitFulfillmentRequest?example=Sends+a+fulfillment+request) mutation to allow merchants to request fulfillment from the dropshipping app when an order is created.

---

## 12.​Mobile app builders

A mobile app builder lets merchants create a mobile app based on their online store.

### A.​Mobile app builders

When reviewing your app, we test both the mobile app builder and the apps it makes to verify that all requirements are met.

1. The app builder must be converted into a Sales Channel from the App Settings area of the [Partner Dashboard](https://partners.shopify.com/current/apps). This lets mobile apps that it builds create a [checkout](https://shopify.dev/docs/api/admin-rest/latest/resources/checkout).

2. Your app must use [Shopify App Bridge version 2.0](https://shopify.dev/docs/api/app-home). If your app is currently using the [Embedded App SDK (EASDK)](https://shopify.dev/docs/api/app-bridge), then you need to migrate to use Shopify App Bridge.

3. The app builder must have either a customizable theme builder or include preset themes for merchants to choose from.

4. The app builder must provide detailed instructions on how to create a developer account for either the Apple App Store or the Google Play store.

5. The app builder must include information about the app marketplace submission process for either the Apple App Store or the Google Play store to inform the merchant of wait times and app requirements.

6. Apps made by the app builder must not make any requests to the authenticated [GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql). The app's client secret and API access token must be stored on a secure web server and not on the mobile device.

7. Apps made by the app builder must not include the OAuth access token. All calls to the Shopify Admin API must be made through a secure web server.

---

## 13.​Sales channels

A sales channel app lets merchants publish their products from their Shopify admin to your platform, whether they're selling online, on mobile apps, or through social media.

Caution

Ensure your app meets [Shopify's definition of a Sales Channel](https://shopify.dev/docs/apps/build/sales-channels). If it does, turn your app into a Sales Channel and ensure compliance with all Sales Channel requirements before you submit your app for review.

### Overview

For a diagram that shows the lifecycle of a sales channel from the merchant's perspective, refer to [Building Shopify channels](https://shopify.dev/docs/apps/build/sales-channels).

The key features of a sales channel app are as follows:

- **Building your sales channel:** Your sales channel app must use [Polaris components](https://polaris.shopify.com/getting-started) and style guide.
- **Onboarding and account connection:** Get permission from merchants to install your app, and then connect them to your channel.
- **Product publishing:** Import products into your channel, manage product errors, and stay in sync with merchants' product catalogs.
- **Payments and order management:** Generate orders for merchants by taking customers to Shopify's checkout with items pre-loaded in the cart using [cart permalinks](https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks).

### A.​Onboarding and account connection

#### Merchant onboarding

1. Merchants must install sales channel apps using [Shopify managed installation](https://shopify.dev/docs/apps/build/authentication-authorization/app-installation) or [during authorization code grant](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant), and sales channels must embed in the Shopify admin using [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge).

2. After the merchant installs the sales channel app via OAuth, they must be redirected to the account section's [account connection](https://polaris.shopify.com/components/actions/account-connection) component. Connecting to the sales channel account must be done in a modal window in the app's UI and occur outside of Shopify. This process returns the merchant to the channel upon completion.

3. If the sales channel has any qualifying steps, eligibility requirements, or additional onboarding requirements, then these must be included in the account connection form.

#### Account section

1. The sales channel must have an account section where the [account connection](https://polaris.shopify.com/components/actions/account-connection) component is always visible (labelled with your channel name, such as "Sample channel").

2. The account section for the sales channel must let merchants disconnect their account.

3. If there is an approval process for creating an account for the sales channel, then this must be communicated to merchants using the [banner](https://polaris.shopify.com/components/feedback-indicators/banner) component. The app must stay in the pending state while the merchant awaits approval from the channel.

   ![An example of a sales channel account review banner](https://shopify.dev/assets/assets/images/api/sales-channel-tutorials/connect-second-account-review-z7TdVHKM.png)

4. Approval or rejection for the sales channel must be communicated to merchants by using a success or warning [banner](https://polaris.shopify.com/components/feedback-indicators/banner) component.

5. The commission section for the sales channel must be created using the [card](https://polaris.shopify.com/components/layout-and-structure/card) component and the [annotated layout](https://polaris.shopify.com/components/layout-and-structure/layout). The commission section must state the commission rate. The commission section must state how and when merchants are charged.

6. The sales channel must include a terms and conditions section. Any [links](https://polaris.shopify.com/components/navigation/link) in that section must open in a new window.

7. The sales channel must have a [help footer](https://polaris.shopify.com/components/navigation/footer-help) that links to a support page in a new window. The support page must include links to documentation and support contact information. The help footer must be visible on every page of the sales channel within Shopify admin.

### B.​Product publishing

1. The sales channel's publishing section must be created by using a [card](https://polaris.shopify.com/components/layout-and-structure/card) component and the layout shown in the following publishing example:

   ![Sales channel status card](https://shopify.dev/assets/assets/images/api/sales-channel-tutorials/products-auto-syncing-CGkoyr-8.png)

2. The sales channel's publishing section must show the number of products currently published, and provide links to the Shopify bulk editor to view and manage those products.

3. The sales channel's publishing section must report any products with errors that prevent them from being published on the sales channel:

   ![Sales channel status card](https://shopify.dev/assets/assets/images/api/sales-channel-tutorials/product-errors-BsHHPQuk.png)

4. Product issues with the sales channel must be communicated to the merchant using a feedback message [banner](https://polaris.shopify.com/components/feedback-indicators/banner) component and the [ResourceFeedback](https://shopify.dev/docs/api/admin-rest/latest/resources/resourcefeedback) resource.

5. The sales channel must use the [ProductListing](https://shopify.dev/docs/api/admin-rest/latest/resources/productlisting) resource to retrieve products set for publication by the merchant.

### C.​Payments and order management

Note

Note: As of March 9th, 2020, all sales channels (with the exception of mobile app builders) must have the `read_only_own_orders` scope applied. The `read_only_own_orders` scope is added by the review team during the approval process and ensures that a channel can read only the orders it created. Make sure that your channel is requesting only orders it created for a faster review and approval.

Shopify supports a variety of ways of building sales channels. The way that you decide to build can determine who is responsible for payment processing, order fulfillment, and refunds.

#### Build a sales channel using cart permalinks

Build your sales channel with [cart permalinks](https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks). These links take customers who want to buy a product from the sales channel directly to a merchant's store checkout to complete the purchase.

1. Take customers to Shopify's checkout with items pre-loaded in the cart.

2. Use the [Billing API](https://shopify.dev/docs/apps/launch/billing/support-one-time-purchases). For [sales attribution](https://shopify.dev/docs/apps/checkout/cart-permalinks#step-3-optional-attribute-an-order-to-a-sales-channel), you can use a storefront access token.

### D.​Navigation icon

1. The sales channel must include a 16px by 16px navigation icon in SVG format, uploaded through the [Partner Dashboard](https://partners.shopify.com/apps).

2. The icon must be a single color with a transparent background.

3. The icon's SVG file should be less than 2KB.

4. The icon's SVG file can contain only the following permitted tags: `circle`, `ellipse`, `g`, `line`, `path`, `rect`, `svg`, `title`.

5. The icon's SVG file can contain only the following permitted attributes: `cx`, `cy`, `d`, `height`, `opacity`, `pathLength`, `points`, `r`, `rx`, `ry`, `version`, `viewBox`, `width`, `x1`, `x2`, `xmlns`, `y1`, `y2`, `fill-rule`, `clip-rule`.

---

## 14.​Purchase option apps

A purchase option app provides merchants and customers with various ways to sell and buy products, beyond the "buy now, pay now, and ship now" experience. For example, merchants can sell a product as a one-time purchase, a recurring subscription, or a pre-order.

### A.​Storefront requirements

#### General principles

1. The purchase option app's customer flow must properly display on both desktop and mobile devices.
2. The purchase option app must be compatible with [all supported browser versions specified for the Shopify Theme Store](https://shopify.dev/docs/storefronts/themes/store/requirements).
3. The purchase option app must support [multi-currency](https://shopify.dev/docs/api/admin-rest/latest/resources/transaction) so that pricing and discounts shown to customers reflect the correct [currency and price rounding rules](https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/subscription-ux-guidelines#considerations-for-currency-switching-and-price-rounding).
4. The purchase option app must automate theme modifications.
5. The purchase option app must assign the correct [purchase option category](https://shopify.dev/docs/apps/build/purchase-options#selling-plans-category) for each selling plan. If you want to offer a purchase option that doesn't match any of the supported use cases, then set the category field to `OTHER` and fill out our [request form](https://docs.google.com/forms/d/e/1FAIpQLSeU18Xmw0Q61V8wdH-dfGafFqIBfRchQKUO8WAF3yJTvgyyZQ/viewform), where we'll review your request for a new purchase option.
6. The purchase option app must use the correct API scopes to reflect functionality. For more information, refer to the [purchase option overview](https://shopify.dev/docs/apps/build/purchase-options).
7. Must not use selling plan and subscription contract APIs for prohibited actions
8. You must provide screenshots or screencasts of your purchase option app functioning on each of the [supported browsers](https://help.shopify.com/en/manual/shopify-admin/supported-browsers).
9. The purchase option app must include an in-product mechanism to allow a merchant's customers to cancel or discontinue their purchase option, for example, pre-order management portal or a cancel link in an email.
10. Apps that offer pre-orders must communicate to a merchant's customers when there's a delay in the stated shipment time.
11. Apps that offer pre-orders obtain customer consent to delays that exceed 30 days if no shipping time is stated and include a mechanism to return the funds in case customer consent is not obtained.
12. Must clearly show a merchant's customers the price of purchase option and when the customer will be charged.
13. Must be able to select a product at the variant level
14. Apps that offer pre-orders must communicate to a merchant's customers when there's a delay in the stated shipment time. Ensure your app emails a merchant's customers when the merchant updates the shipment date to a later date.

#### Product page

1. The purchase option app must clearly show a merchant's customers the price of the purchase option and when the customer will be charged. We recommend that this is done through a standalone widget, as described in the [subscription UX guidelines](https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/subscription-ux-guidelines#inline-pricing) and [deferred purchase option UX guidelines](https://shopify.dev/docs/storefronts/themes/pricing-payments/preorder-tbyb/preorder-tbyb-ux-guidelines#product-forms).

2. Apps that offer subscriptions must clearly disclose to a merchant's customers the amount charged, the length of the subscription term, the price per delivery, and the unit price for pre-paid items. We recommend that this is done through a standalone widget, as described in the [subscription UX guidelines](https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/subscription-ux-guidelines#price).

#### Cart page

The purchase option app must display the [selling plan name](https://shopify.dev/docs/api/liquid/objects/selling_plan#selling_plan-name) in the [cart page](https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/subscription-ux-guidelines#cart-page), if the store's codebase is not already doing so.

Tip

The Shopify Theme Store [requires](https://shopify.dev/docs/storefronts/themes/store/requirements#4-features) themes to [display the selling plan name in the cart](https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/add-subscriptions-to-your-theme#the-selling-plan-display-in-the-cart). Be sure to check whether the `selling_plan.name` is already present in the theme's `cart.liquid` file before attempting to insert it.

#### Post-purchase

Apps that offer subscriptions must include navigation to a customer portal, both on the [order status page](https://help.shopify.com/en/manual/orders/status-tracking) and through a post-purchase email to a merchant's customers so that they're able to manage their subscription.

#### Customer portal

1. The [customer portal](https://shopify.dev/docs/apps/build/purchase-options/customer-portal) must give each customer a single login to access subscriptions and their order history.
2. The customer portal must display to each customer all of their purchased subscriptions. Details must include the associated products, delivery frequency, price, and order schedule.
3. The customer portal must include an option for a merchant's customers to cancel their subscription. The subscription app must allow the merchant to clearly communicate conditions of purchase on their storefront's product page and customer portal.
4. The customer portal must provide a merchant's customers with the option to modify the [payment method](https://shopify.dev/docs/api/admin-graphql/latest/objects/customerpaymentmethod) associated with their subscriptions.

### B.​Shopify admin and in-app requirements

1. The purchase option app must use the [app extension](https://shopify.dev/docs/apps/build/purchase-options/product-subscription-app-extensions) on the product page. Changes that are made to purchase options from the Shopify admin must be reflected in the app.
2. Merchants need to be able to [create](https://help.shopify.com/manual/products/subscriptions/setup) and [manage](https://help.shopify.com/manual/products/subscriptions/manage-subscriptions) purchase options in the Shopify admin using the [app extension](https://shopify.dev/docs/apps/build/purchase-options/product-subscription-app-extensions). This includes letting merchants remove products from a selling plan.
3. Apps that offer subscriptions must include a direct link to [orders](https://shopify.dev/docs/apps/build/purchase-options/subscriptions/contracts/build-a-subscription-contract#order-page-in-the-shopify-admin) and [customers](https://shopify.dev/docs/apps/build/purchase-options/subscriptions/contracts/build-a-subscription-contract#customers-page-in-the-shopify-admin) in the Shopify admin from the purchase option.
4. Links to the subscription app from the [orders](https://shopify.dev/docs/apps/build/purchase-options/subscriptions/contracts/build-a-subscription-contract#order-page-in-the-shopify-admin) and [customers](https://shopify.dev/docs/apps/build/purchase-options/subscriptions/contracts/build-a-subscription-contract#customers-page-in-the-shopify-admin) pages in the Shopify admin must go to the correct subscription resource.

---

## 15.​Donation distribution apps

A donation distribution app collects and distributes funds to a charity on behalf of a merchant.

1. The donation distribution app must use the [Billing API](https://shopify.dev/docs/apps/launch/billing/support-one-time-purchases) or a PCI-compliant third-party gateway when collecting donation funds from merchants through the app's user interface.
2. If the donation distribution app allows merchants to collect charity donation funds from their customers, then you must provide proof of charitable status in the app's user interface.
3. The donation distribution app must provide proof to a merchant that the funds collected from a merchant's customers are donated to a registered charitable organization. You can't use a tax receipt as proof.
4. The donation distribution app must collect funds from a merchant's customers only through the Shopify checkout.
5. Add a widget to buy the donation product to the product page, cart page or checkout page. This can be implemented using [Theme App Extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions) or [Checkout UI Extensions](https://shopify.dev/docs/api/checkout-ui-extensions).
6. Your app must include [instructions on how to hide the add-to-cart button](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/hide-add-to-cart-buttons) for any donation product that is created.
7. The operating cost must be clearly indicated in both the UI and listing.

---

## 16.​Payments apps

A payments app integrates with the Shopify admin to provide payment processing services.

### A.​Requirements for third-party payments apps

Third-party payments apps must meet the [minimum product requirements](https://shopify.dev/docs/apps/build/payments/requirements) in addition to the following requirements:

1. **Revenue share agreement**: All Partners are required to have a signed [revenue share agreement](https://shopify.dev/docs/apps/build/payments/requirements#revenue-share) with Shopify. You must sign and submit the agreement before Shopify can approve a payments app to process payments.
2. **API Usage**: Your payment app must not use any Shopify APIs other than the [Payments Apps API](https://shopify.dev/docs/api/payments-apps).
3. **Payment app compatibility**: All Partners must submit screencasts of the app's payment flow for all [supported browsers](https://help.shopify.com/en/manual/shopify-admin/supported-browsers).
4. **Cancelling payments**: Your app must allow buyers to cancel or abandon the payment and be redirected back to Shopify's checkout.
5. **Buyer flow redirections (off-site payment apps)**: You must update your app's buyer flow on desktop and mobile devices to [redirect from Shopify's checkout to your app's payment flow](https://shopify.dev/docs/apps/build/payments/offsite/use-the-cli), and then back to Shopify's order confirmation page.
6. **Off-site payment information**: Your payment app must present identical payment information to what is displayed to the buyer at checkout.
7. **Off-site redirects**: Must not upsell any product or features in the payment flow
8. **Redirection after install**: Your payments app must redirect back to the Shopify admin (`https://{shop}.myshopify.com/services/payments_partners/gateways/${api_key}/settings`) after it's installed. After redirecting to that page, the merchant will then immediately be redirected to the payments app's corresponding page in the Shopify admin.
9. **Restricted payment methods**: Your payment app must not process payment methods that include, but aren't limited to, Apple Pay, Google Pay, Shop Pay, PayPal, and Alipay. Shopify has a direct connection with providers that improves performance and checkout conversion for merchants.
10. **No embedding**: Shopify prohibits the embedding of payment apps in the Shopify admin.
11. For a complete list of prohibited actions, refer to [Prohibited actions](https://shopify.dev/docs/apps/build/payments/requirements#prohibited-actions)

#### Requirements for payments extensions that include [checkout UI extensions](https://shopify.dev/docs/apps/build/payments/credit-card/with-extensibility)

1. **Must not use banners, logos, or graphics in the checkout interface**: Any checkout interface customization needs to support payment completion. Banners, logos, or graphics can't be used for error states or as decorative elements.
2. **Don't use scrollable areas within the payment surface**: Dropdown menus should display all options. Don't create any other scrollable areas once the payment option is selected.
3. **Use a single extension with permitted targets**: Your extension can only use the following targets:

- `Checkout::PaymentMethod::Render`
- `Purchase.checkout.payment-option-item.details.render`
- `Purchase.checkout.payment-option-item.hosted-fields.render-after`

### B.​Requirements for testing

When you submit your payments app to the [Shopify App Store](https://shopify.dev/docs/apps/launch/app-store-review) for review, you need to fill out **Part I. App review instructions** on the app listing with the following testing details:

1. A test store with the payments app installed
2. The required credentials to enable installing the payments app for testing (for example, activation codes and login credentials)
3. Instructions on how to process a test payment and refund
4. A description of specific testing scenarios including installments / deferred payments and 3D Secure authentication (if applicable)

### C.​Naming restrictions

To make choosing [additional payment methods](https://help.shopify.com/manual/payments/additional-payment-methods) as straightforward as possible for merchants, you should adhere to the following rules when naming your payments app:

1. **The name of the payments app can't contain marketing text**: For example, the name "World's Best Provider: Get 50 payment methods" isn't allowed. This is because merchants won't see the name of the payments app until they have chosen the payment method they wish to add to their store.

2. **The name of the payment app can't be used by partners to gain a higher listing**: There isn't a general alphabetized directory of payments apps for merchants to navigate. Instead merchants will discover payments apps using the payment methods they want to add.

   You should make sure that the payment methods and locations offered are accurate because this is the only information that's used to surface the app to merchants. If a name appears to have been created with the purpose of gaining a higher listing on an alphabetized list, then it will not be allowed.

Note

The name of the payments app has minimal impact on whether or not merchants add it to their store. How a merchant discovers a payments app is determined by the payment methods the app offers and the locations where these payment methods are offered.

### E.​Cryptocurrency payments apps

Cryptocurrency payments apps enable merchants to accept cryptocurrency as a form of payment. All cryptocurrency payments apps must be accepted into the blockchain app program. Reach out to [Partner Support](https://partners.shopify.com/current/support/) to begin the application process.

Given the evolving regulatory landscape in the crypto payment industry, partners are expected to stay up to date on the latest requirements for their payments app, in the markets where they operate. In order to operate a crypto payments gateway on Shopify, your app must have the following functionality:

1. Collect merchant information to meet up-to-date Know Your Customer (KYC) requirements in all applicable jurisdictions. Ensure that the app can be activated and begin to process payments only when KYC has been successful on a merchant. Your app must also refresh KYC on each merchant at regular intervals.
2. Enable transaction and wallet-monitoring programs that monitor for and identify potential illegal activity, including money laundering.
3. Conduct sanctions screenings on merchants and customers (including their wallet IDs) to ensure that such parties aren't sanctioned and aren't located or don't reside in comprehensively sanctioned jurisdictions under the sanctions laws of the United States, United Kingdom, Europe and other applicable jurisdictions.
4. Employ screening methods to prohibit transactions with wallets that are identified through analytics as higher risk, such as sanctions, known hacker groups, exploitation, malware, or other potential risks.
5. Use IP blocking and other reasonable methods to block functionality in jurisdictions as necessary. For example, jurisdictions in which the necessary crypto licenses haven't been obtained or jurisdictions in which crypto transactions are prohibited, and comprehensively sanctioned jurisdictions. This functionality must block both merchants and customers from being able to successfully process a payment or transfer funds from one party to another.
6. Not support payment in any tokens that constitute securities. Your app must monitor regulatory guidance and enforcement actions with respect to the crypto being supported.

Crypto payment apps are excluded from being required to use Shopify's automated refund functionality. If the refund session URL is blank in your payments app extension, then refunds are handled manually through the partner's software.

---

## 17.​Post Purchase apps

A Post Purchase app allows merchants to add a post-purchase page directly into the Shopify checkout in multiple ways. For example, merchants can create an upsell offer or text-based requests like surveys.

#### General requirements

1. The app must redirect customers back to the order confirmation page after accepting a post-purchase request.
2. Limit consecutive post purchase requests to a maximum of 3 that appear to buyers.
3. The app must have the ability for customers to accept or decline post purchase requests.
4. Displaying order tracking information or status functionality is not permitted.
5. The post purchase functionality cannot be used to display promotions or advertisements. An exception to this rule is promotions for the merchant's own store.

#### Upsell offers requirements

1. Upsell offers must be transparent to customers that they are making a purchase.
2. Customers must be able to select between variants of an upsell product.
3. Upsell offers must be transparent about all costs associated with a customer's purchase. The app must dynamically reflect any change in cost if the customer adjusts the product's quantity or variants.
4. Upsell product offers must display the same price as the product in the merchant's store.
5. The app must define the upsell offer text. The app can offer different options for the merchant to select ("Take the deal" / "No thanks", "Buy" / "Decline offer"), but the merchant can not modify this text.
6. Must use App Bridge [checkout calloutbanner](https://shopify.dev/api/checkout-extensions/components/calloutbanner) to inform buyers about the details of a limited time offer.

---

## 18.​Checkout apps

Checkout apps enable merchants to add custom UI or content to the checkout process. For example, merchants can add a custom field for order notes, or make product offers at checkout based on what's in the customer's cart.

Note

Checkout apps and extensions have [design requirements](https://shopify.dev/docs/apps/launch/app-requirements-checklist#design-requirements-for-checkout-apps) that apply to custom apps as well as public apps. Be sure that your app meets [all requirements](https://shopify.dev/docs/apps/launch/app-requirements-checklist) for its functionality and distribution type.

#### Checkout extension requirements

1. The extension must not request that customers input payment information using a checkout UI extension.

2. The extension can't be used to display promotions or advertisements, unless the merchant can fully configure, modify, test, and approve all extension elements, including content and links.

3. The extension can't automatically add or pre-select optional charges to a buyer's cart that increase the total checkout price. Apps can only add optional charges to carts or at checkout after displaying the additional cost in a manner that is clear to the buyer, and upon obtaining explicit buyer consent.

4. The extension can't alter or re-order shipping options in a manner that increases the default shipping price. The cheapest shipping option must always be selected by default. This restriction doesn't apply to non-shipping delivery methods, such as in-store pickup, local delivery, and pickup points.

5. Upsell product offers must display the same price as the product in the merchant's store.

6. Extensions must not add countdown timers to the checkout.

7. Extensions must not collect information, including personally identifiable information, that's already captured by a standard Shopify checkout form field.

8. Extensions must use only the [documented APIs](https://shopify.dev/docs/api/checkout-ui-extensions/latest/apis/extensiontargets) that Shopify provides for customizing checkout.

9. Extensions must either [request network access](https://shopify.dev/docs/api/checkout-ui-extensions/latest/configuration#network-access) or [use a metafield](https://shopify.dev/docs/api/checkout-ui-extensions/latest/configuration#network-access) if they need to get data into checkout that they can't currently get from Shopify.

10. Extensions using network access must not negatively affect the performance of checkout.

11. Extensions using network access must keep response time to under one second. If the extension requires a response from a network call to render its components, then it must render [skeleton components](https://shopify.dev/docs/api/checkout-ui-extensions/latest/components) initially, to avoid blocking checkout rendering.

12. Your app doesn't use extensions to promote your app, promote related apps, or request reviews.

13. Extensions must be feature-complete, and provide novel functionality or content.

14. Apps that implement Chat UI components on checkout pages must use them to provide customer service using real-time chat as their core feature.

### Design requirements for checkout apps

All apps that extend Shopify checkout—both public and custom—must follow these design guidelines. These requirements ensure buyers receive the lowest checkout total by default, that all additional charges are clearly disclosed, and buyers give explicit consent to any optional charges.

App developers have many options for customizing Shopify's UI. However, "dark patterns", like those described in subsequent sections, deceive buyers and damage trust in merchants, Shopify, and the entire commerce ecosystem.

The following examples aren't exhaustive, and Shopify will take action against any deceptive UI practices. These examples demonstrate key principles you can apply in your own designs.

#### Optional charges must be off by default

If your app adds optional charges to the storefront or checkout, those charges must be turned off by default. The following example shows an app extension that adds a premium shipping option at checkout.

This design is acceptable because buyers can clearly see the optional charge and actively choose to opt in by checking a box:

![Shopify Checkout extension with optional extra charge inactive by default](https://shopify.dev/assets/assets/apps/checkout/app-ui-requirements/checkout-extra-charge-acceptable-CN-0-nFN.png)

However, this design pattern is unacceptable because it automatically adds an optional item to the cart, tries to hide the charge by calling it a "gift," and forces buyers to opt out:

![Shopify Checkout extension with an optional extra charge disguised as an opt-out 'gift' included with purchase](https://shopify.dev/assets/assets/apps/checkout/app-ui-requirements/checkout-extra-charge-unacceptable-QQE1zFwC.png)

#### Optional charges must be clearly disclosed and itemized

If your app adds optional charges to the storefront or checkout, those charges must be itemized so buyers can clearly see them. Simply showing a higher total checkout price isn't enough disclosure. Make sure all optional charges are clearly itemized on the storefront, in the cart, and at checkout.

For example, this cart drawer shows two checkout buttons: one with an optional shipping protection fee and one without. This design is acceptable because the optional fee is clearly itemized and buyers can easily see the additional cost and choose whether to pay it:

![Cart with two clearly labeled checkout options, one disclosing an itemized extra charge](https://shopify.dev/assets/assets/apps/checkout/app-ui-requirements/cart-charge-acceptable-D72sasab.png)

However, the following example is unacceptable. While the optional charge is disclosed, it's unclear which checkout button adds the fee and whether the shipping protection fee is already included in the cart total or will be added later at checkout:

![Cart with a confusing disclosure about an optional extra charge](https://shopify.dev/assets/assets/apps/checkout/app-ui-requirements/cart-charge-unacceptable-tn2gsqtL.png)

This standard applies throughout the storefront, cart, and checkout. For example, this product page has two **Add to Cart** buttons—one clearly shows an optional extra charge. This pattern is acceptable:

![Product page with two clearly labeled Add to Cart buttons, one disclosing an itemized extra charge](https://shopify.dev/assets/assets/apps/checkout/app-ui-requirements/product-page-acceptable-BzUXdkXn.png)

This product page is unacceptable because the primary **Add to Cart** button hides an extra charge within the quoted total price and obscures the option to add the product at its actual display price:

![Product page with a misleadingly labeled Add to Cart button](https://shopify.dev/assets/assets/apps/checkout/app-ui-requirements/product-page-unacceptable-5am7gpeN.png)

#### Shipping must default to the lowest-priced option

When multiple shipping options are available at different prices, the cheapest option must be selected by default.

This example is unacceptable because it places the most expensive shipping option first and makes it the default:

![Checkout where shipping options have been manipulated to default to a higher-priced shipping option](https://shopify.dev/assets/assets/apps/checkout/app-ui-requirements/checkout-shipping-unacceptable-Cj8O4uKC.png)

---

## 19.​Blockchain apps

A blockchain app is defined as any application that exposes merchants to blockchain assets or functionality, including but not limited to cryptocurrency, NFT distribution, and tokengating.

### A.​Blockchain app requirements

1. Apps must ensure that no personal data is written or stored on-chain.

2. Apps can't sell, transfer, or modify fungible tokens unless they are a payments partner that's been approved by the Shopify Payments team.

3. Apps are presently only able to support the primary sales of NFTs on Shopify. All secondary sales must be completed on a 3rd party platform, and must not be represented by products or hosted in the Shopify Admin. A gallery display of NFTs on a Shopify store that links out to an external marketplace is supported.

4. Apps should in no event facilitate the sale or marketing of NFTs that could be classified as one or more of the following:
   - Securities or other regulated financial instruments
   - Activities related to securities or other regulated financial instruments
   - Having secondary-level or transferrable royalties.

   Caution

   Royalties should never be dispersed to buyers or recipients of NFTs.

### B.​NFT distribution apps requirements

[NFT distribution apps](https://shopify.dev/docs/apps/build/blockchain/nft-distribution) include the following types of apps:

- **NFT minting apps**: Enable merchants to create and sell NFTs on Shopify.
- **NFT gifting apps**: Enable merchants to distribute NFTs for free. For example, you might want to offer free NFTs with a purchase, list an NFT as a product at no cost, or retroactively airdrop to customers.

1. Blockchain apps must identify all NFT variants by automatically [populating product metafields](https://shopify.dev/docs/apps/build/blockchain/nft-distribution#nft-distribution-product-metafields-requirements).
2. For each fulfilled NFT, blockchain apps must write the blockchain transaction ID to the order's [Fulfillment tracking_number](https://shopify.dev/docs/api/admin-graphql/2022-10/objects/FulfillmentTrackingInfo#field-fulfillmenttrackinginfo-number) field, and a valid block scanner URL for the NFT fulfillment transaction to the order's [Fulfillment tracking_url](https://shopify.dev/docs/api/admin-graphql/2022-10/objects/FulfillmentTrackingInfo#field-fulfillmenttrackinginfo-url) field. Optionally, the name of the blockchain, fork, or network can also be written to the order's [Fulfillment tracking_company](https://shopify.dev/docs/api/admin-graphql/2022-10/objects/FulfillmentTrackingInfo#field-fulfillmenttrackinginfo-company) field, as necessary.
3. App partners must provide a way for customers to acquire a wallet, should they need one. Further, customers must be able to receive full self-custody of their NFTs without any post-purchase fees, unless the NFTs will be minted on a permissioned blockchain that prevents buyers from receiving full self-custody of their NFTs. In such a case, the inability to receive full self-custody must be clearly disclosed to customers before purchase and no post-purchase fees are permitted.
4. App partners must block stores from using any NFT distribution features while Shopify Payments is active, including but not limited to minting, gifting, creating or listing NFT products, until the shop is approved. To determine a shop's approval status, app partners must use the [NFT Sales Eligibility API](https://shopify.dev/docs/apps/build/blockchain/nft-distribution/check-nft-sales-eligibility). For more information, refer to [NFT distribution](https://shopify.dev/docs/apps/build/blockchain/nft-distribution).

### C.​Tokengating app requirements

[Tokengating apps](https://shopify.dev/docs/apps/build/blockchain/tokengating) on Shopify enable merchants to gate access to products, promotions, and content based on the contents of a customer's Web3 wallet.

1. Any orders that contain line items which are either added or discounted as a result of a buyer successfully passing a gate-check must be identified using [order metafields](https://shopify.dev/docs/apps/build/blockchain/tokengating#tokengating-order-metafields).
2. Any products that contain one or more gated variants must be identified using [product metafields](https://shopify.dev/docs/apps/build/blockchain/tokengating#tokengating-product-metafields).

---

## Next steps

- [**Prepare your app before submitting**](https://shopify.dev/docs/apps/launch/app-store-review/pass-app-review) - Learn our recommended best practices for preparing and testing your app before submitting it for review.

---

- [General requirements for all apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#general-requirements-for-all-apps)
- [1.​Prohibited and restricted app configurations](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#1-prohibited-and-restricted-app-configurations)
- [2.​Installation and setup](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#2-installation-and-setup)
- [3.​Functionality and quality](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#3-functionality-and-quality)
- [4.​App performance](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#4-app-performance)
- [5.​App listing](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#5-app-listing)
- [6.​Security and merchant risk](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#6-security-and-merchant-risk)
- [7.​Data and user privacy](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#7-data-and-user-privacy)
- [8.​Support](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#8-support)
- [Specific requirements for certain app configurations](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#specific-requirements-for-certain-app-configurations)
- [9.​Online store](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#9-online-store)
- [10.​Embedded apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#10-embedded-apps)
- [11.​Product sourcing](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#11-product-sourcing)
- [12.​Mobile app builders](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#12-mobile-app-builders)
- [13.​Sales channels](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#13-sales-channels)
- [14.​Purchase option apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#14-purchase-option-apps)
- [15.​Donation distribution apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#15-donation-distribution-apps)
- [16.​Payments apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#16-payments-apps)
- [17.​Post Purchase apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#17-post-purchase-apps)
- [18.​Checkout apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#18-checkout-apps)
- [19.​Blockchain apps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#19-blockchain-apps)
- [Next steps](https://shopify.dev/docs/apps/launch/app-requirements-checklist.md#next-steps)
