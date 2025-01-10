---
title: Cost
breadcrumbs: false
toc: true
weight: 30
---

### Cost per application

When onboarding a new application to Gazelle's Azure tenant, an [invoice section]() is created specifically for that application. Gazelle uses the Microsoft Customer Agreement model for subscription creation. This setup designates the application owner as an owner at the invoice section level, enabling them to manage invoices, billing information, and other related tasks. All subscriptions for the application are created under this invoice section, consolidating the costs incurred during the month into a single invoice.

Cost alerts can be configured at the application level, which is particularly beneficial when an application has multiple subscriptions. This approach allows for centralized cost tracking and monitoring at the application level, rather than dealing with individual subscriptions. Additionally, each landing zone comes with predefined alerts to ensure financial oversight across environments.

Centralized finance team has comprehensive visibility into the costs associated with all applications and their resources across all environments.

### Consumption-Based Billing 

Effectively managing platform costs begins with prioritizing consumption-based services over fixed-cost alternatives. Platform resources are designed to leverage Azure services that charge based on actual usage, ensuring costs remain aligned with operational demand and maximizing efficiency. By emphasizing pay-as-you-go models over predefined pricing structures, the platform maintains a cost-effective and scalable approach.

However, as a trade-off, some Azure resources, like Virtual WAN, don’t fit these criteria. As a result, network connectivity patterns that rely on Virtual WAN are excluded when considering connectivity options.