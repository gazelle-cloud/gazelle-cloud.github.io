---
title: Tenant Level
breadcrumbs: true
weight: 10
toc: true
sidebar:
  open: true
---

The Tenant Level deployment sets up the management group hierarchy and billing configuration across the Azure tenant—ensuring consistent governance from day one.

## Management Groups Hierarchy

Gazelle adopts a flat, one-level-deep management group hierarchy: a single top-level management group with child management groups directly beneath it. Each layer serves a specific purpose.

### Top-Level Management Group

- **Custom Policy Definitions**: Locally developed Azure Policies are deployed at this level, making them reusable in the same way as built-in Azure Policy definitions.
- **Essential Platform Services**: Azure Deployment Stacks for core platform capabilities are deployed at this level, keeping foundational functionality separate from feature-specific deployments.
- **Access Control**: Role assignments applied at this level grant permissions across all subscriptions—ideal for platform-wide operations.

### Child Management Groups

- **Policy Assignments**: Policies are assigned at the child management group level to enable compliance requirements specific to each group of landing zones.
- **Landing Zone Setup**: New landing zones are provisioned under child management groups. This structure allows centrally managed landing zone services to be protected from unintended changes—even when users have `Owner` access at the subscription level. Resource protection is enforced using [Deployment Stacks](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deployment-stacks?tabs=azure-powershell#protect-managed-resources).
- **Scoped RBAC**: Access control can be assigned at the child management group level, allowing teams to perform operational tasks scoped to specific landing zones.


### Default Settings

- **Default Management Group**: All new subscriptions are automatically placed under the `online-prod` management group to ensure consistent governance.
- **Restricted Management Group Creation**: Creating new management groups requires explicit RBAC permissions.
- **Network Watcher Disabled**: Network Watcher is disabled at the tenant level, as it's not required for Gazelle landing zones and introduces unnecessary overhead.

## Invoice Sections

Billing is configured under a single [Microsoft Customer Agreement](https://learn.microsoft.com/en-us/azure/cost-management-billing/understand/mca-overview), with all landing zones created under the same billing account and billing profile. To enable cost visibility and accountability at the application level, each application is assigned its own dedicated [invoice section](https://learn.microsoft.com/en-us/azure/cost-management-billing/understand/mca-overview#invoice-sections).

- **Application-Level Cost Tracking**: Each invoice section corresponds to a single application, allowing teams to consolidate billing across all environments (e.g., dev, test, prod).
- **Full Ownership**: Application owners are responsible for monitoring costs within their invoice section. This encourages financial accountability and enables proactive budget management.
- **Budget Alerts**: Notifications are sent to the application owner when consumption approaches 100% of the defined budget.
- **Production-Only Configuration**: Invoice sections are managed exclusively in the production environment. 
- **Classic Deployment**: Billing configuration uses classic deployment mode, as Deployment Stacks do not support removal of invoice sections.

