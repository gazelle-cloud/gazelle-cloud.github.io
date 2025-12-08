---
linkTitle: Resource Organization
description: "Azure landing zones: exploring Azure resource organization"
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

These top-level management groups are created manually under the `Tenant Root Group` during initial platform setup. The Gazelle management group serves as the logical home for Azure Deployment Stacks that provision platform-wide services — for example, Access Control and Azure Policy.

- Gazelle-test — Used exclusively by platform engineers for development and learning; hidden from end users by default.
- Gazelle-prod — Hosts application workloads from early development through production. Landing zones here are stable, created using the same automated flows and Azure configuration blueprints to ensure consistency and reliability across environments.
- Subscription Bank — The default management group for newly created subscriptions. It contains empty subscriptions that can be converted into landing zones; to convert one, provide the subscription ID via the GitHub issue template. The Subscription Bank is also the destination for decommissioned landing zones: automated workflows reset those subscriptions by removing all resources and configurations. This approach is particularly useful under a Microsoft Customer Agreement, where the number of available subscriptions is limited. 

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
