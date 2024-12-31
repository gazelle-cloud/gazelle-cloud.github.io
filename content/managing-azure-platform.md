---
title: Managing Azure Platform
breadcrumbs: false
toc: true
weight: 30
---

Achieving a reliable, consistent, and repeatable approach to management landing zones means eliminating direct human interaction. By leveraging Bicep, Deployment Stack, and GitHub Actions, it’s possible to automate provisioning, configuration, and the removal of resources no longer defined in templates. This makes templates the single source of truth and is a big step towards minimizing direct human access to Azure.

## Service-Oriented deployments

Platform deployments are structured around grouping Azure services by their platform capabilities. Each service group corresponds to a specific functional area—like monitoring, identity, or policies—ensuring that all necessary resources and configurations for a capability are deployed together. Services are designed with clear boundaries and responsibilities, avoiding overlap, which promotes autonomy.

![task-oriented-GitHub-workflows](/task-oriented-GitHub-workflows.png)

This approach offers several advantages:
- **Parallel Development**: Multiple engineers can work concurrently without the risk of overwriting changes. This is particularly useful when Deployment Stack is configured to remove resources that are no longer defined in templates.
- **Scalability**: The modular nature supports growth in the breadth and the depth of platform capabilities.
- **Maintainability**: Task-specific workflows make updates and troubleshooting more manageable.
- **Deployment Speed**: By deploying only the resources associated with a specific service, delivery time is reduced to a few minutes.

Bicep templates are key to achieving this modularity and efficiency. Each pipeline is driven by task-specific Bicep templates focused on one job, prioritizing readability and flexibility over reusability. This focused approach ensures templates are easy to understand, maintain, and adapt to changes, while also documenting themselves.

## Azure Deployment Stack

Another feature of the Deployment Stack used in deployment pipelines is the 'deny' settings, which can be configured to prevent write and delete actions on managed resources. This provides fine-grained control over what actions are allowed. With this setting, even if a service principal has RBAC permissions, it cannot delete or modify certain resources. This feature is particularly useful for platform managed resources in application landing zones, as it allows application teams to perform predefined actions on platform managed resources while ensuring resources remain protected.

## Test environment

The deployment workflow is designed to ensure that all platform changes are first delivered to the test environment, which is an exact replica of production. This test environment has its own identity, management group hierarchy, policy assignments, and all other Azure components, completely isolated from production. Isolation is maintain through mechanisms like:
 - Main branch protection
 - Eliminate human access from platform
 - GitHub environments
 - Fully automated deployment workflow
This approach allows for the validation of changes to the Azure platform in a production-like environment, ensuring they work as expected without risking the stability of live systems.