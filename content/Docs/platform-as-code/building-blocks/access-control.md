---
linkTitle: Access Control
description: "Azure Landing Zones: Access Control — Custom roles to provide just enough access"
breadcrumbs: true
weight: 20
cascade:
  type: docs
toc: true
---
# Azure Landing Zone Access Control
Gazelle is built from modular blocks, each designed to be deployed and managed independently end-to-end. This page covers the access control, with focus on assigning access to humans at the platform level.

## Limited Human Access
Direct access to cloud resources is eliminated by default. Nobody edits infrastructure by hand. Manual changes drift, and the next deployment either overwrites them or leaves the environment inconsistent. Both break reproducibility. To avoid that, I restrict human access to the smallest set of operations that make sense — like restarting a service. Access is cut down to essentials.

## Roles by Function

Azure ships a wide catalog of built-in roles, but they are resource-centric and grant far more than any one job requires. `Storage Account Contributor` is the classic example: it fits a resource, not a role.

In Gazelle, roles are defined by function, not resource. Every role starts at Reader. From there, I add only the actions tied to a specific function.
- **Platform engineer** — can operate the platform services (read logs, remediate policies) but cannot modify Azure resources defined in code.
- **Cost reader** — can view consumption and billing data, and nothing else.

This way, people get exactly what they need — safer to run, easier to reason about.

## Assignments

Role assignments are always at the management group scope and linked only to Entra ID groups, never to individuals. Membership stays owned in Entra ID, while permissions are defined in templates. From there, each custom role and its assignment move together as one unit — created, updated, and deleted in sync. Delete the block, and both vanish from Azure. This lifecycle is managed by an Azure Deployment Stack and a Bicep module purpose-built for access control, driven by a simple parameter file.

## How To

Access control is fully parameterized. Edit:
`building-blocks/access-control/parameters/accessControl.bicepparam`

- Update a role → adjust its actions.
- Create a role → add a block with roleName, actions, principalId, and scope.
- Remove a role → delete the block.

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
  {
    roleName: 'Platform Owner' 
    actions: [
      '*'
    ]
    principalId: azurePlatformOwnerGroupId
    scope: topLevelManagementGroupName
  }
]
```
> The Platform Owner role exists only as an emergency account. It is not intended for daily operations and should remain unused under normal circumstances.



