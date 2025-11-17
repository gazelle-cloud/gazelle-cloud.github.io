---
linkTitle: Resource Organization
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 10
breadcrumbs: false
cascade:
  type: docs
toc: true
---
# Resource Organization

Resource organization defines how Azure resources are structured across the tenant. It’s a core design area in the Microsoft Cloud Adoption Framework. While it might seem straightforward, a well-designed hierarchy, regional organization and subscription isolation form the foundation for application development and operations across the tenant.

this section covers how Azure resources are organized from the tenant root level all the way to the platform managed resoruces in a landing zone. 

## Top Level Management Groups

The top-level management groups are created manually under the tenant-root management group, during initial platform setup:
 - Gazelle - test
 - Gazelle - prod
 - Subscription Bank  
  
The Gazelle-[env] group forms the foundation for each environment. The purpose:
- **Access Control** - Role assignments applied here cascade to all child management groups and subscriptions.
- **Custom Azure Policy Definitions** - Maintained here to maximize reusability across different child management groups.
- **Deployment Stacks** - Platform-wide services such as Access Management, Azure Policy, or Management Group hierarchy are managed here via Deployment Stacks. 

The `Subscription Bank` holds empty subscriptions ready to be converted into landing zones. The `platform-flow-subscription-bank` GitHub workflow ensures subscriptions are clean by deleting all resource groups, tags, role assignments and other subscription level configuration. This model is especially valuable under a Microsoft Customer Agreement, where subscription counts are limited.

## Child Management Groups

While top level management group is used for the high-level platform initial resources, child management groups serve for application workloads to ensure security baseline and operational consistency. The key purpose of child management groups include: 
- **Policy Assignments**: Guardrails applied here and tuned for the specific requirements — whether it’s `platform`, ``isolation``, or something new.
- **Access Control** — Role Based Access Control here covers every subscription under the child Management Group, making it easier to manage environment-specific roles.
- **Deployment Stacks** - The landing zone configuration is managed by the Azure Deployment Stack and it lives under the coreponsding child management group. Deployment Stacks configured to protected managed resources from unwanted changes.

## Landing Zone Resources

Each landing zone includes essential resources — such as a virtual network, managed identity, and Log Analytics workspace — provisioned through the create landing zone pipeline. All centrally managed resources is placed under the `Landing-zone-resource` resource group. Subsequent configuration (for example, subnet creation) is owned by the application team. Resource protection is enforced via Azure Deployment Stacks with deny actions, balancing operational flexibility with resilience against unintended changes.

## Landing Zone Isolation

Each landing zone is an isolated Azure subscription dedicated to a single application and environment. This one-to-one mapping (one environment, one app, one subscription) ensures clear operational boundaries, clean cost tracking, and reduces the risk of test deployments impacting production.

## Single Region Deployment

To streamline operational flow and prevent any unexpected budget pikes, all deployments occur within a single Azure region. The region is centrally defined as GitHub variable and automatically injected into every deployment pipeline. This eliminates regional configuration errors and keeps deployments consistent. Azure Policy enforces regional compliance to prevent misconfiguration. 