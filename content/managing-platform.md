---
title: Managing Platform
breadcrumbs: false
toc: true
weight: 30
---

Managing Azure landing zones is about achieving a reliable, consistent, and repeatable system. This means minimizing direct human interaction as much as possible. By using tools like Bicep, Deployment Stack, and GitHub Actions, you can automate provisioning, configuration, and the removal of resources that are no longer defined in templates. This approach makes templates the single source of truth and reduces the need for direct access to Azure.

## Modular Deployments
![Azure-platform-modular-Deployments](/Azure-platform-modular-Deployments.png)

Deployments are designed with modular components, grouping Azure services by their specific capabilities. Each module focuses on a distinct area—such as monitoring, identity, or policies—ensuring that all resources and configurations for that capability are deployed together. This clear separation avoids overlaps, defines boundaries, and allows engineers to work independently.

This method brings several advantages.
- **Parallel Development**: engineers can work on separate modules simultaneously without conflicts or overwriting changes.
- **Scalability**: adding new features or expanding existing ones becomes simple and efficient.
- **Simplified Maintenance**: updates and troubleshooting are more manageable since each module operates independently

Bicep templates are the backbone of this approach. Each deployment workflow uses task-specific Bicep templates that prioritize clarity and adaptability over reusability. This keeps them easy to read, adjust, and align with the lightweight, modular philosophy

## Azure Deployment Stack

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