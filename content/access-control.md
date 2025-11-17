---
linkTitle: Access Control
description: "A step-by-step guide to implementing Azure Landing Zones in your tenant — free and open source"
weight: 20
breadcrumbs: false
cascade:
  type: docs
toc: true
---


## Entra ID as Identity Provider

All authentication flows through Entra ID and authorization is handled by Azure Role-Based Access Control. That’s the only entry point into Azure — for both users and applications. Local authentication methods such as passwords, access keys, or connection strings are disabled by Azure Policy.

## Platform Identities

All platform capabilities among Azure subscriptions are provisioned using the `azure-gazelle-landingzones` Entra ID application, which is created during the initial tenant setup and granted the Owner RBAC role. Authentication from GitHub uses federated credentials mapped to the organization, repository, and environment, eliminating the need for passwords. To minimize operational risk and prevent cross-environment interference, each environment — such as test and production — has its own dedicated app registration.  
  
Whenever a platform capability requires access to perform a task, regardless of its size or scope, it is assigned a user-assigned managed identity with only the permissions necessary for that task. All identities are provisioned alongside other resources within the GitHub Actions deployment flow, ensuring an end-to-end flow in a single GitHub Action.

## Graph API Permissions

Azure platform identities are configured with Graph API permissions, allowing Entra ID roles to be assigned to Azure managed identities. This is particularly useful when a managed identity needs access to Entra ID—for example, to read users and groups. Since there is a single Entra ID tenant, both test and prod identities share the smae Graph API permissions.

## Limited Human Access

Direct human access to cloud services is eliminated by default. Nobody edits infrastructure by hand. Manual changes drift, and the next deployment either overwrites them or leaves the environment inconsistent. Both break reproducibility. To avoid that, human access restricted to the smallest set of operations that make sense — like restarting a start a service. Access is cut down to essentials.

## Access Based on Functional Roles

Azure provides many built-in roles, but these are resource-centric and often grant broader permissions than a specific job requires—for example, the `Storage Account Contributor` role aligns with a resource rather than a real-world function. In Gazelle, roles are defined by function, not resoruce, for example: 
- **Platform engineer** — can operate the platform services (read logs, remediate policies) but cannot modify Azure resources defined in code.

## Role Assignments

From the deployment perspective, custom Azure Role Definitions and Role Assignments has the same lifecycle. They created together, assigned together, and burn-down together. This streamlines a full lifecycle of function-based Access Control, proividing a user-friendly experience to modify access control, by editing only few values, like role name, Entra ID group, assignment scope and the allowed actions. 

```bicep
param accessControl = [
  {
    roleName: 'Platform Engineer'
    actions: [
      '*/read'
      'Microsoft.App/jobs/*/action'
      'Microsoft.Insights/actiongroups/*/action'
      'microsoft.policyinsights/remediations/write'
      'Microsoft.Insights/alertRules/*'
      'Microsoft.Resources/deployments/*'
      'Microsoft.Resources/deploymentStacks/*'
    ]
    principalId: azurePlatformEngineerGroupId
    scope: topLevelManagementGroupName
  } 
]
```

