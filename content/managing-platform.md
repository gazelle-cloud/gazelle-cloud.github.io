---
title: Managing Platform
breadcrumbs: false
toc: true
weight: 30
---
Managing Azure landing zones is about achieving a reliable, consistent, and repeatable system. This means minimizing direct human interaction as much as possible. By using Bicep, Deployment Stack, and GitHub Actions, you can automate provisioning, configuration, and the removal of resources that are no longer defined in templates. This approach makes templates the single source of truth and reduces the need for direct access to Azure.

## Modular Deployments

Deployments are structured into modular components, where Azure services are grouped by their specific capabilities. Each module is focused on a functional area, such as monitor, identity, or policies, ensuring all resources and configurations for that capability are deployed together. This approach creates clear boundaries and responsibilities, avoids overlaps, and promotes autonomy for engineers working on different areas.

This method brings several advantages.
- Engineers can work on different modules at the same time without worrying about overwriting changes.
- The modular design makes it easier to scale the platform by adding new features or expanding existing ones.
- Updates and troubleshooting become more manageable since each module operates independently.

Bicep templates are essential for this modular approach. Each deployment pipeline uses templates designed for specific tasks, making them easy to read, understand, and adjust. These templates focus on clarity and adaptability rather than reusability, ensuring they remain practical and straightforward.

## Azure Deployment Stack

The Deployment Stack enhances control by allowing the configuration of 'deny settings'. These settings block 'write' or 'delete' actions on managed resources, even when a service principal has the required RBAC permissions. This ensures that critical resources cannot be accidentally modified or deleted.

This feature is especially valuable for platform-managed resources in application landing zones. It enables application teams to perform predefined tasks on these resources while keeping them protected from unauthorized changes. This balance allows teams to work effectively without compromising landing zone stability.

## Test Environment

All platform changes are first delivered to a dedicated test environment, which is a complete replica of production. This environment includes its own identity, management group hierarchy, policy assignments, and other Azure components. It is fully isolated from the production environment, ensuring that any changes can be tested without jeopardizing live systems. The isolation is maintained through practices such as:
- main branch protection
- GitHub environments
- fully automated deployment workflows
- eliminating direct human access 

## Custom Role Definitions

To maintain the principles of Infrastructure-as-Code and ensure smooth operations, custom RBAC roles are used for platform management. These roles are designed to provide just enough access to handle tasks that require manual intervention without allowing changes that could violate Infrastructure-as-Code principles. This approach provides the flexibility to perform essential tasks while maintaining control and consistency across the platform.