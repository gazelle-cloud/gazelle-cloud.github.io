---
linkTitle: Cost Management
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 70
breadcrumbs: false
cascade:
  type: docs
toc: true
---
# Cost Management

Cost management in the Gazelle follows the same principles as the rest of the platform — a “you build it, you run it” mindset, where each application team has full responsibility for its infrastructure and costs. Since there are no shared services, all supporting resources and expenses are allocated directly to the application.

By using Azure-native tools and isolating each environment within its own landing zone, the platform provides crystal-clear visibility into the actual cost of running each application in the cloud. It’s effortless to drill down into a specific environment or resource type to understand consumption patterns — all without relying on tags or any additional cost-allocation logic.

## Cost per Applicaiton

Each application has a dedicated Azure invoice section, which serves as its financial boundary. All landing zones required by the application are created under this same invoice section. This structure provides a complete view of the total cost of running the application — including application infrastructure and other supporting Azure services.

To ensure visibility and transparency, an Entra ID group named `Azure-applicationName-reader` is created for each application. This group includes `Reader` permissions across all related subscriptions, along with `Invoice Section reader`  — giving a clear view of total costs for the application.

## Budget Alerts

If you reach 100% of your budget, it’s already too late to react — costs are incurred, and recovery options are limited. To prevent that, budget alerts are triggered early, at 80% of the allocated budget, giving engineers and application owners enough time to take action before overruns occur. Two levels of alerts are configured to match different areas of responsibility:

- **Landing Zone** - Designed for landing zone engineers, these alerts provide early signals for specific environments, helping teams quickly identify unexpected cost spikes or misconfigurations.
- **Invoice Section** - Aimed at application owners, these alerts offer a consolidated view of total spend across all landing zones under the same invoice section, ensuring holistic cost awareness.

## Invoice Section Creation

Azure invoice section is created as part of the “Register New Cloud App” GitHub workflow. Along with other technical setup tasks, this process provisions a new invoice section under the billing account and assigns the `Invoice Section Reader` role to the corresponding Entra ID group. Invoice Section id is stored as the GitHub Variable in application repostiroy, so `crealte-landing zone` workflows can fetch the ID and create Azure subscriptions assocated with the application, while tenant specific values like Billing Account stored in a platform repository. 