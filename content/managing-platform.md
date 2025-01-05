---
title: Managing Platform
breadcrumbs: false
toc: true
weight: 30
---

This page highlights Gazelle's approach to managing platform operations, focusing on automation, modularity, and governance. From deploying in a test environment to cleaning up production, discover how the platform ensures consistency and efficiency at every stage.

## Modular Deployments
![Azure-platform-modular-Deployments](/Azure-platform-modular-Deployments.png)

Deployments are designed with modular components, grouping Azure services by their specific capabilities. Each module focuses on a distinct area—such as monitoring, identity, or policies—ensuring that all resources and configurations for that capability are deployed together. This clear separation avoids overlaps, defines boundaries, and allows engineers to work independently.

This method brings several advantages.
- **Parallel Development**: engineers can work on separate modules simultaneously without conflicts or overwriting changes.
- **Scalability**: adding new features or expanding existing ones becomes simple and efficient.
- **Simplified Maintenance**: updates and troubleshooting are more manageable since each module operates independently

Bicep templates are the backbone of this approach. Each deployment workflow uses task-specific Bicep templates that prioritize clarity and adaptability over reusability. This keeps them easy to read, adjust, and align with the lightweight, modular philosophy

## Azure Deployment Stack
The Deployment Stack in Gazelle provides management of the Azure resource lifecycle, from deployment to deletion. Resources defined in Bicep templates are  provisioned in Azure, and any resources no longer defined in the templates are seamlessly removed. This approach ensures that templates remain the single source of truth, reducing the need for manual clean-up tasks.

The Deployment Stack adds an extra layer of control with 'deny settings', which prevent write or delete actions on managed resources—even if a service principal has the necessary RBAC permissions. This safeguard ensures critical resources remain secure from accidental modifications or deletions.

This feature is particularly useful for platform-managed resources within application landing zones. It lets application teams perform predefined tasks while keeping these resources protected from unauthorized changes. The result is a balance that empowers teams to work efficiently while maintaining the stability of the landing zones

## Test Environment

All platform changes are first deployed to a fully isolated test environment, designed as a complete replica of production. This environment includes its own identity, management group hierarchy, policy assignments, and all other Azure components, ensuring thorough testing without risking live systems. Isolation is achieved through practices such as:

- Main Branch Protection
- GitHub Environments
- Automated Workflows
- Eliminating direct human access

This approach ensures every change is tested before being promoted to production, keeping the platform stable and predictable.

## Custom Role Definitions

To maintain the principles of Infrastructure-as-Code and ensure smooth operations, custom RBAC roles are used for platform management. These roles are designed to provide just enough access to handle tasks that require manual intervention without allowing changes that could violate Infrastructure-as-Code principles. This approach provides the flexibility to perform essential tasks while maintaining control and consistency across the platform.

## Singular Region Deployments

To minimize cost and complexity, single-region deployments are implemented. This approach focuses on deploying Azure resources to a specific region, defined as a GitHub variable. During deployment pipelines, the region value is dynamically fetched and applied, streamlining the deployment process. To ensure all resources are deployed exclusively within the designated region, Azure policies are enforced, maintaining compliance and consistency.