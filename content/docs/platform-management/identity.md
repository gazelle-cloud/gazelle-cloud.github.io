---
title: Identity
breadcrumbs: true
weight: 30
toc: true
sidebar:
  open: true
---
Access to platform services is managed at the management group level using **custom roles** and **role assignments**, following Infrastructure-as-Code principles. This ensures repeatable access control across environments.

## Access Control as Code

Like all other platform resources, access control is managed through the Azure Deployment Stack. Each custom role, along with its corresponding role assignment, is packaged and deployed as a single unit. This design allows teams to create, update, or remove access by editing a user friendly parameter file.

To align with Infrastructure-as-Code principles, users are not granted direct access to platform services. However, certain tasks—such as starting a service or viewing cost data—still require permissions. Instead of using broad built-in roles, which can grant excessive privileges, custom roles are defined based on each team’s operational responsibilities. For example:
- **Landing Zone Engineer**: Can operate and manage platform infrastructure.
- **Billing Teams**: Can view cost and usage data.

All custom roles are defined in a `customRoles.json` file. Each environment (e.g., test, production) has its own parameter file where both the custom role and the group assignment are specified. This approach ensures consistent access control across environments, while allowing environment-specific flexibility.

### Test Access Control

To minimize risk, platform engineers are granted full control in test but have limited access in production. This introduces a challenge: testing `Landing Zone Engineer` role changes before deploying them to production. To solve this, a dedicated Entra ID group is created for validating role changes in the test environment before rollout to production. 

### How to modify access
