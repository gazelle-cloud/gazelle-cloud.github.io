---
linkTitle: Resource Organization
description: "Azure landing zones: exploring resource organization in the Gazelle tenant"
weight: 10
breadcrumbs: false
cascade:
  type: docs
toc: true
---
# Resource Organization

Resource organization defines how Azure resources are structured across the tenant. It’s a core design area in the Microsoft Cloud Adoption Framework. While it might seem straightforward, a well-designed hierarchy, regional organization, and subscription isolation form the foundation for application development and operations across the tenant.

This section covers how Azure resources are organized from the tenant root level all the way to the platform-managed resources in a landing zone. 

## Top Level Management Groups

The top-level management groups are created manually under the tenant-root management group during initial platform setup:
- Gazelle - test  
- Gazelle - prod  
- Subscription Bank  

The purpose of top-level management group is:

- **Child management groups** - Host child management groups, like `platform` and `isolation`
- **Access Control** — Role assignments applied here cascade to all child management groups and subscriptions.
- **Custom Azure Policy Definitions** — Maintained here to maximize reusability across different child management groups.
- **Deployment Stacks** — Platform-wide services such as Access Management, Azure Policy, or management group hierarchy are managed here via Deployment Stacks.

The `Subscription Bank` contains empty subscriptions that can be converted into landing zones. It is configured as the default management group for all newly created subscriptions. It also serves as the destination for cleaned-up landing zones after decommissioning. Automated workflows reset subscriptions by removing all resources and configurations. This approach is particularly valuable under a Microsoft Customer Agreement, where the number of available subscriptions is limited.

## Child Management Groups

Child management groups serve application workloads to ensure a security baseline and operational consistency. Their key purposes include:

- **Policy Assignments** — Guardrails applied here are tuned for specific requirements — whether it’s `platform`, `isolation`, or something new.
- **Access Control** — Role-Based Access Control applied here covers every subscription under the child management group.
- **Deployment Stacks** — Landing zone configuration is managed by Azure Deployment Stacks under the corresponding child management group. Deployment Stacks are configured to protect managed resources from unwanted changes.

## Landing Zone Resources

Each landing zone includes essential resources — such as a virtual network, managed identity, and Log Analytics workspace — provisioned through the “create landing zone” pipeline. All centrally managed resources are placed under the `landing-zone-resource` resource group and managed by Azure Deployment Stack.

## Landing Zone Isolation

Each landing zone is an isolated Azure subscription dedicated to a single application and environment. This one-to-one mapping (one environment, one application, one subscription) ensures clear operational boundaries, clean cost tracking, and reduces the risk of test deployments impacting production.

## Single Region Deployment

To streamline operational flow and prevent unexpected budget spikes, all deployments occur within a single Azure region. The region is centrally defined as a GitHub variable and automatically injected into every deployment pipeline. This eliminates regional configuration errors and keeps deployments consistent. Azure Policy enforces regional compliance to prevent misconfigurations.
