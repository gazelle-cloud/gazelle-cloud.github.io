---
title: "Azure Landing Zones - resource organization"
linkTitle: Resource Organization
description: "Organize Azure Landing Zone resources for workload isolation, streamlined single-region deployments, and team autonomy."
weight: 10
breadcrumbs: false
cascade:
  type: docs
toc: true
---
Resource organization defines how Azure resources are structured across the tenant. It’s a core design area in the Microsoft Cloud Adoption Framework. While it might seem straightforward, a well-designed hierarchy, regional organization, and subscription isolation form the foundation for application development and operations across the tenant.

This section covers how Azure resources are organized from the tenant root level all the way to the platform-managed resources in a landing zone. 

## Top Level Management Groups

These top-level management groups are created manually under the `Tenant Root Group` during initial platform setup. The Gazelle management group serves as the logical home for Azure Deployment Stacks that provision platform managed services — for example Azure Policy.

- Gazelle-test — Mirrors production but is used by platform engineers for development and learning purposes; hidden from end users by default.
- Gazelle-prod — Hosts application workloads across all lifecycle stages — from early development through production — under the same standardized management operations. Landing zones here are created using GitHub flows and Azure configuration blueprints.
- Subscription Bank — The default management group for newly created subscriptions. It contains empty subscriptions that can be converted into landing zones. The Subscription Bank is also the destination for decommissioned landing zones: automated workflows reset those subscriptions by removing all resources and configurations. This approach is particularly useful under a Microsoft Customer Agreement, where the number of available subscriptions is limited. 

The platform does not use a dedicated subscription. Instead, all platform-managed resources — are deployed at the management group scope or directly into each landing zone subscription.

## Child Management Groups

### App Isolation

The `app-isolation` is designed to host applications that require isolation and follow the you build it, you run it model. It provides landing zones with clearly defined boundaries and standardized templates that align with platform rules.

Each landing zone includes the required infrastructure built directly into it — networking, monitoring, identity and cost — without any direct dependency on the platform team.

At this scope, Azure Policies enforce platform-wide requirements, Role-Based Access Control provides centralized access management, and Azure Deployment Stacks handle the lifecycle of landing zone resources and their associated platform components.

## Landing Zone Resources

`landing-zone-resources` it's a resource group created during the initial landing zone setup and keeps all centrally managed resources in one place. Everything inside is maintained through Azure Deployment Stacks, so application teams can build on top of the existing setup without worrying about breaking what keeps the landing zone running — the stack is configured to protect managed resources.

- **Virtual Network** — A fully isolated network environment with no implicit connections to other landing zones or on-premises networks.  
- **Managed Identity** — A user-assigned identity with `Owner` permissions at the subscription scope, configured for GitHub federation. It also has Read access at Micrsoft Grap API.  
- **Log Analytics Workspace** — Collects landing zone specific diagnostic data.  
- **Alerts** — Notify platform engineers of health issues detected within the landing zone.  
- **Container App Jobs** — Run scheduled maintenance routines and small automation tasks.  

This resource group represents the operational core of each landing zone — self-contained, policy-enforced, and fully managed as code.

## Tags

Tags enable quick identification of resource criticality and associated contact information. Tag values are provided during the initial app registration process and are applied to each application landing zone via an Azure Policy with a modify effect. These tags are enforced throughout the resource lifecycle, ensuring that all resources always have the required metadata for operational efficiency.

**Subscription-Level**
 - `owner`: Contact information for the application owner, used for critical notifications and communications at the subscription scope. 
  
**Resource-Level**
 - `engineer`:  Contact details for ongoing maintenance.
 - `criticality`: indicates the importance of the application (low, medium, or high), supporting operational prioritization and incident response.

Beyond these mandatory tags, landing zone engineers have the flexibility to define additional tags that address unique application needs. Custom tags are configured by editing the landing zone parameter file. Platform automation ensures that all tags (including custom ones) are propagated to every resource within the landing zone.

## Landing Zone Isolation

Each landing zone is an isolated Azure subscription dedicated to a single application and environment. This one-to-one mapping — one environment, one application, one subscription — keeps operational boundaries clear, cost tracking simple, and removes dependencies on other teams.

## Single Region Deployment

To streamline operational flow and prevent unexpected budget spikes, all deployments occur within a single Azure region. The region is centrally defined as a GitHub variable and automatically injected into every deployment pipeline. This eliminates regional configuration errors and keeps deployments consistent. Azure Policy enforces regional compliance to prevent misconfigurations.
