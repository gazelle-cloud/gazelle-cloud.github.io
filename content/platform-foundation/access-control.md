---
linkTitle: Access Control
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 20
toc: true
---

## Entra ID as Identity Provider

All authentication flows through Entra ID. Authorization is handled by Azure Role-Based Access Control (RBAC). That’s the only entry point into Azure — for both users and applications. Local authentication methods such as passwords, access keys, or connection strings are disabled by Azure Policy.

## Platform Identities

All platform capabilities and landing zones are provisioned using the `azure-platform` Entra ID app registration, which is created during the initial tenant setup and granted the Owner RBAC role. Authentication from GitHub uses federated credentials mapped to the organization, repository, and environment, eliminating the need for passwords. To minimize operational risk and prevent cross-environment interference, each environment — such as test and production — has its own dedicated app registration.  
Whenever a platform capability requires access to perform a task, regardless of its size or scope, it is assigned a user-assigned managed identity with only the permissions necessary for that task. All identities are provisioned alongside other resources within the GitHub Actions deployment flow, ensuring an end-to-end flow, and dependency-free provisioning process.

## Graph API Permissions

Azure platform identities are configured with Graph API permissions, allowing Entra ID roles to be assigned to both user and system-assigned managed identities. This is particularly useful when a managed identity needs access to Entra ID—for example, to read users and groups. Since there is a single Entra ID tenant, both test and production identities share these powerful Graph API permissions.

## Limited Human Access

Direct access to cloud resources is eliminated by default. Nobody edits infrastructure by hand. Manual changes drift, and the next deployment either overwrites them or leaves the environment inconsistent. Both break reproducibility. To avoid that, I restrict human access to the smallest set of operations that make sense — like restarting a service. Access is cut down to essentials.

## Access Based on Functional Roles

Azure provides many built-in roles, but these are resource-centric and often grant broader permissions than a specific job requires—for example, the `Storage Account Contributor` role aligns with a resource rather than a real-world function. In Gazelle, roles are defined by function, not resoruce, for example: 
- **Platform engineer** — can operate the platform services (read logs, remediate policies) but cannot modify Azure resources defined in code.

## How to

### Edit Role Assignments

Bicep templates streamline access management by abstracting Azure Role Definitions and Assignments. Membership is managed through Entra ID groups, while permissions are defined directly in the templates. All access configurations—role name, actions, scope, and Entra ID target—are centralized in a single parameter file that serves as the single source of truth: any role or permission removed from this file is automatically removed from Azure.


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

