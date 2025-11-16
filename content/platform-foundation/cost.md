---
linkTitle: Cost management
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 70
toc: true
---
# Cost Management

Cost management in the Gazelle tenant follows the same principles as the rest of the platform — a “you build it, you run it” mindset, where each application team has full responsibility for its infrastructure and costs. Since there are no shared services, all supporting resources and expenses are allocated directly to the application.

By using Azure-native tools and isolating each environment within its own landing zone, the platform provides crystal-clear visibility into the actual cost of running each application in the cloud. It’s effortless to drill down into a specific environment or resource type to understand consumption patterns — all without relying on tags or any additional cost-allocation logic.

## Cost per Applicaiton

Every application in the Gazelle tenant has a dedicated Azure invoice section, which serves as its financial boundary. All landing zones required by the application are created under this same invoice section. This structure provides a complete view of the total cost of running the application — including compute, storage, networking, monitoring, and other supporting Azure resources.

To ensure visibility and transparency, an Entra ID group named `Azure-<application>-reader` is created for each application. This group includes Reader permissions across all related subscriptions, along with `Invoice section reader` at the invoice section level — giving teams a clear, consistent view of all costs for their application.

## Budget Alerts

If you reach 100% of your budget, it’s already too late to react — costs are incurred, and recovery options are limited. To prevent that, budget alerts are triggered early, at 80% of the allocated budget, giving engineers and application owners enough time to take action before overruns occur. Two levels of alerts are configured to match different areas of responsibility:

- **Landing Zone** - Designed for landing zone engineers, these alerts provide early signals for specific environments, helping teams quickly identify unexpected cost spikes or misconfigurations.
- **Invoice Section** - Aimed at application owners, these alerts offer a consolidated view of total spend across all landing zones under the same invoice section, ensuring holistic cost awareness.

## Invoice Section Creation

In the Gazelle tenant, an Azure invoice section is created as part of the “Register New Cloud App” GitHub workflow. Along with other technical setup tasks, this process provisions a new invoice section under the billing account and assigns the Invoice Section Reader role to the corresponding Entra ID group.

Technical details:

- The `Billing Account ID` is fetched from GitHub workflow variables.
- The `Invoice Section Name` matches the Cloud App name.
- The `Invoice section ID` is stored in the application’s repository (named the same as the Cloud App) and retrieved when creating new landing zones under that application.

Every invoice section is created through the same automated flow, ensuring consistency and cost transparency across all applications in the tenant.